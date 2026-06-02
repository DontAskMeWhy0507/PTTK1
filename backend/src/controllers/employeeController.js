const { Appointment, Commission, ContractDocument, DepositContract, Interaction, Property, RentalContract, User } = require('../models');

const ensureEmployee = (req, res) => {
  if (req.user.role !== 'employee') {
    res.status(403).json({ success: false, message: 'Chỉ nhân viên mới được phép truy cập' });
    return false;
  }

  return true;
};

exports.getAppointments = async (req, res) => {
  if (!ensureEmployee(req, res)) return;

  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, attributes: ['id', 'full_name', 'email', 'phone_number'] },
        { model: Property },
        { model: User, as: 'Employee', attributes: ['id', 'full_name'] }
      ],
      order: [['ngay_gio', 'ASC']]
    });

    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  if (!ensureEmployee(req, res)) return;

  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Không thấy lịch hẹn' });
    }

    await appointment.update({
      trang_thai: req.body.trang_thai,
      nhan_vien_id: appointment.nhan_vien_id || req.user.id
    });

    res.json({ success: true, message: 'Cập nhật lịch hẹn thành công', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCommissions = async (req, res) => {
  if (!ensureEmployee(req, res)) return;

  try {
    const commissions = await Commission.findAll({
      where: { nhan_vien_id: req.user.id },
      order: [['created_at', 'DESC']]
    });

    const total = commissions.reduce((sum, item) => {
      const amount = Number(item.so_tien || 0);
      return item.loai === 'deduction' ? sum - amount : sum + amount;
    }, 0);

    res.json({ success: true, data: commissions, total_earned: total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClosedRentalContracts = async (req, res) => {
  if (!ensureEmployee(req, res)) return;

  try {
    const contracts = await RentalContract.findAll({
      where: { nhan_vien_id: req.user.id },
      include: [
        { model: Property },
        { model: User, as: 'Customer', attributes: ['id', 'full_name', 'phone_number', 'email'] },
        { model: Commission },
        {
          model: ContractDocument,
          required: false,
          where: { loai_hop_dong: 'rental' },
          attributes: ['id', 'ten_file', 'mime_type', 'kich_thuoc', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRentalContract = async (req, res) => {
  if (!ensureEmployee(req, res)) return;

  try {
    const {
      khach_hang_id,
      nha_cho_thue_id,
      gia_tri_hop_dong,
      phan_tram_hoa_hong,
      ngay_bat_dau,
      ngay_ket_thuc
    } = req.body;
    const appointmentId = req.body.appointment_id;

    const contract = await RentalContract.create({
      khach_hang_id,
      nha_cho_thue_id,
      nhan_vien_id: req.user.id,
      gia_tri_hop_dong,
      phan_tram_hoa_hong: phan_tram_hoa_hong || 3,
      ngay_ky: new Date().toISOString().split('T')[0],
      ngay_bat_dau,
      ngay_ket_thuc,
      trang_thai: 'active'
    });

    const depositContract = await DepositContract.findOne({
      where: {
        nha_cho_thue_id,
        trang_thai: 'active'
      }
    });
    const depositDeduction = depositContract ? Number(depositContract.tien_dam_bao || 0) : 0;

    await Commission.create({
      nhan_vien_id: req.user.id,
      hop_dong_thue_id: contract.id,
      so_tien: contract.tien_hoa_hong,
      loai: 'commission',
      trang_thai: 'earned'
    });

    if (depositDeduction > 0) {
      await Commission.create({
        nhan_vien_id: req.user.id,
        hop_dong_thue_id: contract.id,
        so_tien: depositDeduction,
        loai: 'deduction',
        trang_thai: 'earned'
      });

      await depositContract.update({
        trang_thai: 'terminated',
        ghi_chu: 'Tien dam bao da duoc khau tru vao hoa hong sau khi nha duoc thue'
      });
    }

    if (appointmentId) {
      await Appointment.update(
        { trang_thai: 'completed', nhan_vien_id: req.user.id },
        { where: { id: appointmentId } }
      );
    }

    await Property.update(
      { hien_thi_chi_tiet: false },
      { where: { id: nha_cho_thue_id } }
    );

    res.status(201).json({ success: true, message: 'Tạo hợp đồng thuê thành công', data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInteractions = async (req, res) => {
  if (!ensureEmployee(req, res)) return;

  try {
    const interactions = await Interaction.findAll({
      where: { nhan_vien_id: req.user.id },
      include: [
        { model: User, as: 'Customer', attributes: ['id', 'full_name', 'phone_number'] },
        { model: Property }
      ],
      order: [['ngay_gio', 'DESC']]
    });

    res.json({ success: true, data: interactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logInteraction = async (req, res) => {
  if (!ensureEmployee(req, res)) return;

  try {
    const interaction = await Interaction.create({
      ...req.body,
      nhan_vien_id: req.user.id
    });

    res.status(201).json({ success: true, message: 'Đã lưu lịch sử làm việc', data: interaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePropertyReview = async (req, res) => {
  if (!ensureEmployee(req, res)) return;

  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Khong thay nha' });

    await property.update({
      hien_trang: req.body.hien_trang ?? property.hien_trang,
      hien_thi_chi_tiet: req.body.hien_thi_chi_tiet ?? property.hien_thi_chi_tiet
    });

    const depositContract = await DepositContract.findOne({ where: { nha_cho_thue_id: property.id } });
    if (depositContract && req.body.trang_thai_hop_dong) {
      await depositContract.update({
        trang_thai: req.body.trang_thai_hop_dong,
        nhan_vien_id: depositContract.nhan_vien_id || req.user.id,
        ghi_chu: req.body.ghi_chu ?? depositContract.ghi_chu
      });
    }

    res.json({ success: true, message: 'Da cap nhat danh gia nha', data: { property, depositContract } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
