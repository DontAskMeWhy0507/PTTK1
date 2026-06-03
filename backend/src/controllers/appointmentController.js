const { Appointment, Property, User } = require('../models');

exports.createAppointment = async (req, res) => {
  try {
    if (req.user.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Chi Khach hang (Thanh vien) moi duoc phep dat lich xem nha' });
    }

    const { nha_cho_thue_id, ngay_gio, ghi_chu } = req.body;
    const khach_hang_id = req.user.id;

    const property = await Property.findByPk(nha_cho_thue_id);
    if (!property) return res.status(404).json({ success: false, message: 'Khong thay nha' });

    if (property.chu_nha_id === khach_hang_id) {
      return res.status(400).json({ success: false, message: 'Ban khong the dat lich xem chinh nha minh dang' });
    }

    const existingAppt = await Appointment.findOne({
      where: {
        khach_hang_id,
        nha_cho_thue_id,
        trang_thai: ['pending', 'proposed', 'confirmed']
      }
    });

    if (existingAppt) {
      return res.status(400).json({ success: false, message: 'Ban da co lich hen dang cho xu ly cho nha nay' });
    }

    const customer = await User.findByPk(khach_hang_id);

    // Tim moi gioi co it viec nhat
    let targetBrokerId = null;
    if (property.broker_id) {
      targetBrokerId = property.broker_id;
    } else if (customer.managed_by_broker_id) {
      targetBrokerId = customer.managed_by_broker_id;
    } else {
      const brokers = await User.findAll({ where: { role: 'broker', status: 'active' } });
      if (brokers.length > 0) {
        let leastLoadedBroker = null;
        let minWorkload = Infinity;

        for (const broker of brokers) {
          const propCount = await Property.count({ where: { broker_id: broker.id } });
          const apptCount = await Appointment.count({ where: { nhan_vien_id: broker.id, trang_thai: ['pending', 'proposed', 'confirmed'] } });
          const customerCount = await User.count({ where: { managed_by_broker_id: broker.id } });
          
          const workload = propCount + apptCount + customerCount;
          if (workload < minWorkload) {
            minWorkload = workload;
            leastLoadedBroker = broker;
          }
        }
        
        if (leastLoadedBroker) {
          targetBrokerId = leastLoadedBroker.id;
        }
      }
    }

    // Gan moi gioi cho nha va khach hang (neu ho chua co)
    if (targetBrokerId) {
      if (!property.broker_id) await property.update({ broker_id: targetBrokerId });
      if (!customer.managed_by_broker_id) await customer.update({ managed_by_broker_id: targetBrokerId });
    }

    const appointment = await Appointment.create({
      khach_hang_id,
      nha_cho_thue_id,
      nhan_vien_id: targetBrokerId,
      ngay_gio: ngay_gio || null,
      ghi_chu,
      last_message: ghi_chu || 'Tôi muốn xem bất động sản này',
      last_message_by: 'customer',
      trang_thai: 'pending'
    });

    res.status(201).json({ success: true, message: 'Gui yeu cau xem nha thanh cong. Moi gioi se lien he lai de gui lich hen cho ban.', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let where = {};

    if (role === 'customer') where = { khach_hang_id: userId };
    else if (role === 'broker') where = { nhan_vien_id: userId };
    else if (role === 'staff' || role === 'admin') where = {}; // Staff/Admin xem het

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Property },
        { model: User, attributes: ['full_name', 'phone_number'] }, // Khach hang info
        { model: User, as: 'Broker', attributes: ['full_name', 'phone_number'] } // Moi gioi info
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{ model: Property }]
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Khong tim thay lich hen' });
    }

    const role = req.user.role;
    const isCustomer = (role === 'customer' && appointment.khach_hang_id === req.user.id);
    const isBroker = (['broker', 'staff', 'admin'].includes(role) && (appointment.nhan_vien_id === req.user.id || role === 'admin' || role === 'staff'));

    if (!isCustomer && !isBroker) {
      return res.status(403).json({ success: false, message: 'Ban khong duoc phep cap nhat lich hen nay' });
    }

    const patch = {};
    if (req.body.ngay_gio) {
      patch.ngay_gio = req.body.ngay_gio;
      // Neu moi gioi cap nhat ngay gio, chuyen thanh proposed
      if (isBroker && !req.body.trang_thai) patch.trang_thai = 'proposed';
    }

    if (req.body.trang_thai) {
       // Validate status transition if needed
       patch.trang_thai = req.body.trang_thai;
    }

    if (req.body.message) {
      patch.last_message = req.body.message;
      patch.last_message_by = (role === 'admin' || role === 'staff') ? 'staff' : role;
    }

    await appointment.update(patch);
    res.json({ success: true, message: 'Cap nhat lich hen thanh cong', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
