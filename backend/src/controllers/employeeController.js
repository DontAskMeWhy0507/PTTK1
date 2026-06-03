const { Appointment, Commission, ContractDocument, DepositContract, Interaction, Property, RentalContract, User } = require('../models');
const { logTransaction } = require('../utils/transactionLog');

const ensureStaffOrBroker = (req, res) => {
  if (!['staff', 'broker', 'admin'].includes(req.user.role)) {
    res.status(403).json({ success: false, message: 'Chỉ nhân viên mới được phép truy cập' });
    return false;
  }

  return true;
};

exports.getAppointments = async (req, res) => {
  if (!ensureStaffOrBroker(req, res)) return;

  try {
    let where = {};
    if (req.user.role === 'broker') {
      where = { nhan_vien_id: req.user.id };
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: User, attributes: ['id', 'full_name', 'email', 'phone_number'] },
        { model: Property },
        { model: User, as: 'Broker', attributes: ['id', 'full_name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  if (!ensureStaffOrBroker(req, res)) return;

  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Không thấy lịch hẹn' });
    }

    const patch = {
      trang_thai: req.body.trang_thai || appointment.trang_thai,
      nhan_vien_id: appointment.nhan_vien_id || req.user.id
    };

    if (req.body.ngay_gio) patch.ngay_gio = req.body.ngay_gio;
    if (req.body.message) {
      patch.last_message = req.body.message;
      patch.last_message_by = req.user.role === 'admin' ? 'staff' : req.user.role;
    }

    await appointment.update(patch);

    res.json({ success: true, message: 'Cập nhật lịch hẹn thành công', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCommissions = async (req, res) => {
  if (!ensureStaffOrBroker(req, res)) return;

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
  if (!ensureStaffOrBroker(req, res)) return;

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
  if (!ensureStaffOrBroker(req, res)) return;

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

    const customer = await User.findByPk(khach_hang_id);
    if (!customer || customer.role !== 'customer') {
      return res.status(400).json({ success: false, message: 'Khach thue khong hop le' });
    }

    const property = await Property.findByPk(nha_cho_thue_id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Khong thay nha cho thue' });
    }

    if (property.chu_nha_id === khach_hang_id) {
      return res.status(400).json({ success: false, message: 'Khach thue khong the la chu nha cua bat dong san nay' });
    }

    const contract = await RentalContract.create({
      khach_hang_id,
      nha_cho_thue_id,
      nhan_vien_id: req.user.id,
      gia_tri_hop_dong,
      phan_tram_hoa_hong: phan_tram_hoa_hong || 3,
      ngay_ky: new Date().toISOString().split('T')[0],
      ngay_bat_dau,
      ngay_ket_thuc,
      trang_thai: 'pending_payment' // Moi gioi lap xong thi cho khach thanh toan
    });

    const depositContract = await DepositContract.findOne({
      where: { nha_cho_thue_id, trang_thai: 'active' }
    });
    const depositDeduction = depositContract ? Number(depositContract.tien_dam_bao || 0) : 0;
    const commissionAmount = Number(contract.tien_hoa_hong || 0);

    await Commission.create({
      nhan_vien_id: req.user.id,
      hop_dong_thue_id: contract.id,
      so_tien: commissionAmount,
      loai: 'commission',
      trang_thai: 'pending'
    });

    await logTransaction({
      user_id: khach_hang_id,
      actor_id: req.user.id,
      loai_giao_dich: 'rental_contract_created',
      so_tien: gia_tri_hop_dong,
      doi_tuong: 'rental_contract',
      doi_tuong_id: contract.id,
      mo_ta: 'Moi gioi tao hop dong thue, cho khach thue thanh toan'
    });

    await logTransaction({
      user_id: req.user.id,
      actor_id: req.user.id,
      loai_giao_dich: 'commission_pending',
      so_tien: commissionAmount,
      doi_tuong: 'rental_contract',
      doi_tuong_id: contract.id,
      mo_ta: 'Hoa hong moi gioi dang cho khach thue thanh toan'
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

      await logTransaction({
        user_id: property.chu_nha_id,
        actor_id: req.user.id,
        loai_giao_dich: 'deposit_deduction',
        so_tien: depositDeduction,
        doi_tuong: 'deposit_contract',
        doi_tuong_id: depositContract.id,
        mo_ta: 'Khau tru tien dam bao cua chu nha sau khi nha duoc chot thue'
      });
    }

    if (appointmentId) {
      await Appointment.update(
        { trang_thai: 'completed', nhan_vien_id: req.user.id },
        { where: { id: appointmentId } }
      );
    }

    await Property.update(
      { hien_thi_chi_tiet: false, broker_id: req.user.id },
      { where: { id: nha_cho_thue_id } }
    );

    res.status(201).json({ success: true, message: 'Lap hop dong thanh cong. Dang cho khach hang thanh toan.', data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.payRent = async (req, res) => {
  try {
    const contract = await RentalContract.findByPk(req.params.id);
    if (!contract) return res.status(404).json({ success: false, message: 'Khong thay hop dong' });
    
    if (contract.khach_hang_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Ban khong co quyen thanh toan hop dong nay' });
    }

    await contract.update({ trang_thai: 'paid' });
    
    // Cap nhat hoa hong thanh earned
    await Commission.update({ trang_thai: 'earned' }, { where: { hop_dong_thue_id: contract.id, loai: 'commission' } });

    await logTransaction({
      user_id: req.user.id,
      actor_id: req.user.id,
      loai_giao_dich: 'rent_payment',
      so_tien: contract.gia_tri_hop_dong,
      doi_tuong: 'rental_contract',
      doi_tuong_id: contract.id,
      mo_ta: 'Khach thue thanh toan hop dong thue nha'
    });

    await logTransaction({
      user_id: contract.nhan_vien_id,
      actor_id: req.user.id,
      loai_giao_dich: 'commission_earned',
      so_tien: contract.tien_hoa_hong,
      doi_tuong: 'rental_contract',
      doi_tuong_id: contract.id,
      mo_ta: 'Hoa hong moi gioi duoc ghi nhan sau khi khach thanh toan'
    });

    res.json({ success: true, message: 'Thanh toan tien thue nha thanh cong!', data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getInteractions = async (req, res) => {
  if (!ensureStaffOrBroker(req, res)) return;

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
  if (!ensureStaffOrBroker(req, res)) return;

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
  if (!ensureStaffOrBroker(req, res)) return;

  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Khong thay nha' });

    await property.update({
      hien_trang: req.body.hien_trang ?? property.hien_trang,
      hien_thi_chi_tiet: req.body.hien_thi_chi_tiet ?? property.hien_thi_chi_tiet
    });

    const depositContract = await DepositContract.findOne({ where: { nha_cho_thue_id: property.id } });
    if (depositContract) {
      const contractPatch = {
        nhan_vien_id: depositContract.nhan_vien_id || req.user.id,
        ghi_chu: req.body.ghi_chu ?? depositContract.ghi_chu
      };
      if (req.body.trang_thai_hop_dong) contractPatch.trang_thai = req.body.trang_thai_hop_dong;
      if (req.body.lich_khao_sat !== undefined) contractPatch.lich_khao_sat = req.body.lich_khao_sat || null;
      if (req.body.trang_thai_phap_ly) contractPatch.trang_thai_phap_ly = req.body.trang_thai_phap_ly;
      if (req.body.ghi_chu_phap_ly !== undefined) contractPatch.ghi_chu_phap_ly = req.body.ghi_chu_phap_ly;
      await depositContract.update(contractPatch);
    }

    res.json({ success: true, message: 'Da cap nhat danh gia nha', data: { property, depositContract } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
