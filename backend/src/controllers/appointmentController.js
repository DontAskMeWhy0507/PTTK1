const { Appointment, Property, User } = require('../models');

exports.createAppointment = async (req, res) => {
  try {
    const { nha_cho_thue_id, ngay_gio, ghi_chu } = req.body;
    const khach_hang_id = req.user.id;
    const employee = await User.findOne({
      where: { role: 'employee', status: 'active' },
      order: [['created_at', 'ASC']]
    });

    const appointment = await Appointment.create({
      khach_hang_id,
      nha_cho_thue_id,
      nhan_vien_id: employee?.id || null,
      ngay_gio,
      ghi_chu,
      trang_thai: 'pending'
    });

    res.status(201).json({ success: true, message: 'Dat lich hen thanh cong', data: appointment });
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
    else if (role === 'employee') where = { nhan_vien_id: userId };

    const appointments = await Appointment.findAll({
      where,
      include: [{ model: Property }]
    });

    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMyAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [{ model: Property }]
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Khong tim thay lich hen' });
    }

    if (req.user.role !== 'customer' || appointment.khach_hang_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Ban khong duoc phep cap nhat lich hen nay' });
    }

    if (!['pending', 'confirmed'].includes(appointment.trang_thai)) {
      return res.status(400).json({ success: false, message: 'Lich hen nay khong con cho phep doi hoac huy' });
    }

    const patch = {};
    if (req.body.ngay_gio) patch.ngay_gio = req.body.ngay_gio;
    if (req.body.ghi_chu !== undefined) patch.ghi_chu = req.body.ghi_chu;
    if (req.body.trang_thai) patch.trang_thai = req.body.trang_thai;

    await appointment.update(patch);
    res.json({ success: true, message: 'Cap nhat lich hen thanh cong', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
