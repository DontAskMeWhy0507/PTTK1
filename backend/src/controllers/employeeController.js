const { Appointment, Commission, ContractDocument, DepositContract, Interaction, Property, RentalContract, User, sequelize } = require('../models');
const { Op } = require('sequelize');
const { logTransaction } = require('../utils/transactionLog');

const ensureStaffOrBroker = (req, res) => {
  if (!['staff', 'broker', 'admin'].includes(req.user.role)) {
    res.status(403).json({ success: false, message: 'Chỉ nhân viên mới được phép truy cập' });
    return false;
  }

  return true;
};

const hasBankAccount = (user) => Boolean(user?.bank_name && user?.bank_account_number && user?.bank_account_holder);
const roundMoney = (value) => Math.round(Number(value || 0));

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
        { model: Property, include: [{ model: User, as: 'Landlord', attributes: ['id', 'full_name', 'email', 'phone_number'] }] },
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

    if (['confirmed', 'completed', 'cancelled', 'no_show'].includes(appointment.trang_thai)) {
      return res.status(400).json({ success: false, message: 'Lich hen da dong, khong the tiep tuc tuong tac' });
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
      where: { nhan_vien_id: req.user.id, loai: 'commission' },
      order: [['created_at', 'DESC']]
    });

    const total = commissions.reduce((sum, item) => {
      const amount = Number(item.so_tien || 0);
      return item.loai === 'commission' && ['earned', 'paid'].includes(item.trang_thai) ? sum + amount : sum;
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
  if (!['broker', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Chi moi gioi moi duoc lap hop dong thue' });
  }

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

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Can chon lich xem nha da chot truoc khi lap hop dong thue' });
    }

    if (!gia_tri_hop_dong || Number(gia_tri_hop_dong) <= 0 || !ngay_bat_dau || !ngay_ket_thuc) {
      return res.status(400).json({ success: false, message: 'Can nhap day du gia tri hop dong va thoi han thue' });
    }

    if (new Date(ngay_ket_thuc) <= new Date(ngay_bat_dau)) {
      return res.status(400).json({ success: false, message: 'Ngay ket thuc phai sau ngay bat dau' });
    }

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

    if (!property.hien_thi_chi_tiet) {
      return res.status(400).json({ success: false, message: 'Nha nay khong con san sang cho thue' });
    }

    if (req.user.role === 'broker' && property.broker_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Chi moi gioi duoc phan cong moi duoc chot hop dong nha nay' });
    }

    const appointment = await Appointment.findByPk(appointmentId);
    if (
      !appointment ||
      appointment.khach_hang_id !== khach_hang_id ||
      appointment.nha_cho_thue_id !== nha_cho_thue_id ||
      appointment.loai_lich_hen !== 'property_viewing' ||
      !['confirmed', 'completed'].includes(appointment.trang_thai)
    ) {
      return res.status(400).json({ success: false, message: 'Can co lich xem nha da chot/da xem truoc khi lap hop dong thue' });
    }

    if (req.user.role === 'broker' && appointment.nhan_vien_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Ban khong phu trach lich xem nha nay' });
    }

    const interaction = await Interaction.findOne({
      where: {
        khach_hang_id,
        nha_cho_thue_id,
        nhan_vien_id: req.user.role === 'admin' ? appointment.nhan_vien_id : req.user.id
      }
    });

    if (!interaction) {
      return res.status(400).json({ success: false, message: 'Can luu lich su lam viec voi khach hang truoc khi chot hop dong' });
    }

    const existingContract = await RentalContract.findOne({
      where: {
        nha_cho_thue_id,
        trang_thai: { [Op.in]: ['pending_sign', 'pending_payment', 'paid', 'active', 'completed'] }
      }
    });

    if (existingContract) {
      return res.status(400).json({ success: false, message: 'Nha nay da co hop dong thue dang xu ly hoac da chot' });
    }

    const brokerId = req.user.role === 'admin' ? appointment.nhan_vien_id : req.user.id;
    if (!brokerId) {
      return res.status(400).json({ success: false, message: 'Lich xem nha chua co moi gioi phu trach' });
    }

    const contract = await sequelize.transaction(async (transaction) => {
      const createdContract = await RentalContract.create({
        khach_hang_id,
        nha_cho_thue_id,
        nhan_vien_id: brokerId,
        gia_tri_hop_dong,
        phan_tram_hoa_hong: phan_tram_hoa_hong || 3,
        ngay_ky: new Date().toISOString().split('T')[0],
        ngay_bat_dau,
        ngay_ket_thuc,
        trang_thai: 'pending_payment'
      }, { transaction });

      const commissionAmount = roundMoney(createdContract.tien_hoa_hong);

      await Commission.create({
        nhan_vien_id: brokerId,
        hop_dong_thue_id: createdContract.id,
        so_tien: commissionAmount,
        loai: 'commission',
        trang_thai: 'pending'
      }, { transaction });

      await Appointment.update(
        { trang_thai: 'completed', nhan_vien_id: brokerId },
        { where: { id: appointmentId }, transaction }
      );

      await Property.update(
        { hien_thi_chi_tiet: false, broker_id: brokerId },
        { where: { id: nha_cho_thue_id }, transaction }
      );

      return createdContract;
    });

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

    if (contract.trang_thai !== 'pending_payment') {
      return res.status(400).json({ success: false, message: 'Hop dong khong o trang thai cho thanh toan' });
    }

    const property = await Property.findByPk(contract.nha_cho_thue_id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Khong thay nha cho thue cua hop dong nay' });
    }

    const landlord = await User.findByPk(property.chu_nha_id);
    const broker = await User.findByPk(contract.nhan_vien_id);
    if (!hasBankAccount(landlord)) {
      return res.status(400).json({ success: false, message: 'Chu nha chua co thong tin tai khoan ngan hang de nhan tien' });
    }
    if (!hasBankAccount(broker)) {
      return res.status(400).json({ success: false, message: 'Moi gioi chua co thong tin tai khoan ngan hang de nhan hoa hong' });
    }

    const depositContract = await DepositContract.findOne({
      where: { nha_cho_thue_id: contract.nha_cho_thue_id, trang_thai: 'active' }
    });

    const paymentSummary = await sequelize.transaction(async (transaction) => {
      const commissionAmount = roundMoney(contract.tien_hoa_hong);
      const contractValue = roundMoney(contract.gia_tri_hop_dong);
      const depositDeduction = depositContract ? Math.min(roundMoney(depositContract.tien_dam_bao), commissionAmount) : 0;
      const landlordReceives = Math.max(contractValue - (commissionAmount - depositDeduction), 0);
      const landlordPaysExtra = Math.max(commissionAmount - depositDeduction, 0);
      const landlordNewBalance = roundMoney(landlord.account_balance) + landlordReceives;
      const brokerNewBalance = roundMoney(broker.account_balance) + commissionAmount;

      const [updatedContracts] = await RentalContract.update(
        { trang_thai: 'active' },
        { where: { id: contract.id, trang_thai: 'pending_payment' }, transaction }
      );
      if (updatedContracts !== 1) {
        const error = new Error('Hop dong da duoc thanh toan truoc do');
        error.status = 409;
        throw error;
      }

      await Commission.update(
        { trang_thai: 'earned' },
        { where: { hop_dong_thue_id: contract.id, loai: 'commission' }, transaction }
      );

      await landlord.update({
        account_balance: landlordNewBalance
      }, { transaction });

      await broker.update({
        account_balance: brokerNewBalance
      }, { transaction });

      await logTransaction({
        user_id: req.user.id,
        actor_id: req.user.id,
        loai_giao_dich: 'rent_payment',
        so_tien: contractValue,
        doi_tuong: 'rental_contract',
        doi_tuong_id: contract.id,
        mo_ta: `Khách thuê thanh toán hợp đồng ${contractValue.toLocaleString('vi-VN')} VND cho đại lý.`
      }, { transaction });

      await logTransaction({
        user_id: landlord.id,
        actor_id: req.user.id,
        loai_giao_dich: 'landlord_payout',
        so_tien: landlordReceives,
        doi_tuong: 'rental_contract',
        doi_tuong_id: contract.id,
        mo_ta: `Chuyển ${landlordReceives.toLocaleString('vi-VN')} VND vào tài khoản ${landlord.bank_name} ${landlord.bank_account_number} của chủ nhà. Phí môi giới ${commissionAmount.toLocaleString('vi-VN')} VND, đã cấn trừ đảm bảo ${depositDeduction.toLocaleString('vi-VN')} VND, đại lý giữ lại ${landlordPaysExtra.toLocaleString('vi-VN')} VND từ tiền thuê.`
      }, { transaction });

      await logTransaction({
        user_id: broker.id,
        actor_id: req.user.id,
        loai_giao_dich: 'broker_payout',
        so_tien: commissionAmount,
        doi_tuong: 'rental_contract',
        doi_tuong_id: contract.id,
        mo_ta: `Chuyển hoa hồng ${commissionAmount.toLocaleString('vi-VN')} VND vào tài khoản ${broker.bank_name} ${broker.bank_account_number} của môi giới.`
      }, { transaction });

      if (depositDeduction > 0) {
        await depositContract.update({
          trang_thai: 'terminated',
          ghi_chu: `Tiền đảm bảo ${depositDeduction.toLocaleString('vi-VN')} VND đã được cấn trừ vào phí môi giới. Khi khách thuê thanh toán, đại lý giữ lại ${landlordPaysExtra.toLocaleString('vi-VN')} VND từ tiền thuê và chuyển ${landlordReceives.toLocaleString('vi-VN')} VND cho chủ nhà.`
        }, { transaction });

      }

      return {
        commission_amount: commissionAmount,
        deposit_deduction: depositDeduction,
        landlord_pays_extra: landlordPaysExtra,
        landlord_receives: landlordReceives,
        landlord_account: {
          bank_name: landlord.bank_name,
          bank_account_number: landlord.bank_account_number,
          bank_account_holder: landlord.bank_account_holder,
          new_balance: landlordNewBalance
        },
        broker_account: {
          bank_name: broker.bank_name,
          bank_account_number: broker.bank_account_number,
          bank_account_holder: broker.bank_account_holder,
          new_balance: brokerNewBalance
        }
      };
    });

    await contract.reload();
    res.json({ success: true, message: 'Thanh toan tien thue nha thanh cong!', data: contract, payment_summary: paymentSummary });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
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
    const { khach_hang_id, nha_cho_thue_id, ngay_gio, noi_dung_trao_doi, loai_trao_doi } = req.body;
    if (!khach_hang_id || !noi_dung_trao_doi) {
      return res.status(400).json({ success: false, message: 'Can chon khach hang va nhap noi dung trao doi' });
    }

    const interaction = await Interaction.create({
      khach_hang_id,
      nha_cho_thue_id: nha_cho_thue_id || null,
      ngay_gio: ngay_gio || new Date(),
      noi_dung_trao_doi,
      loai_trao_doi: loai_trao_doi || 'meeting',
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
    const property = await Property.findByPk(req.params.id, {
      include: [{ model: User, as: 'Landlord', attributes: ['id', 'full_name', 'email', 'phone_number'] }]
    });
    if (!property) return res.status(404).json({ success: false, message: 'Khong thay nha' });

    const depositContract = await DepositContract.findOne({ where: { nha_cho_thue_id: property.id } });
    if (depositContract) {
      if (req.body.trang_thai_hop_dong === 'pending_deposit') {
        const nextLegalStatus = req.body.trang_thai_phap_ly || depositContract.trang_thai_phap_ly;
        const nextCondition = req.body.hien_trang ?? property.hien_trang;
        const confirmedSurvey = await Appointment.findOne({
          where: {
            khach_hang_id: property.chu_nha_id,
            nha_cho_thue_id: property.id,
            loai_lich_hen: 'deposit_survey',
            trang_thai: { [Op.in]: ['confirmed', 'completed'] }
          }
        });

        if (!confirmedSurvey) {
          return res.status(400).json({ success: false, message: 'Can gui lich va duoc chu nha xac nhan truoc khi yeu cau nop tien dam bao' });
        }

        if (!nextCondition || !String(nextCondition).trim()) {
          return res.status(400).json({ success: false, message: 'Can cap nhat hien trang nha sau khi gap chu nha' });
        }

        if (nextLegalStatus !== 'verified') {
          return res.status(400).json({ success: false, message: 'Can duyet phap ly/dieu khoan phat sinh truoc khi yeu cau nop tien dam bao' });
        }
      }

      await property.update({
        hien_trang: req.body.hien_trang ?? property.hien_trang,
        hien_thi_chi_tiet: req.body.hien_thi_chi_tiet ?? property.hien_thi_chi_tiet
      });

      const contractPatch = {
        nhan_vien_id: depositContract.nhan_vien_id || req.user.id,
        ghi_chu: req.body.ghi_chu ?? depositContract.ghi_chu
      };
      if (req.body.trang_thai_hop_dong) contractPatch.trang_thai = req.body.trang_thai_hop_dong;
      if (req.body.lich_khao_sat !== undefined) contractPatch.lich_khao_sat = req.body.lich_khao_sat || null;
      if (req.body.trang_thai_phap_ly) contractPatch.trang_thai_phap_ly = req.body.trang_thai_phap_ly;
      if (req.body.ghi_chu_phap_ly !== undefined) contractPatch.ghi_chu_phap_ly = req.body.ghi_chu_phap_ly;
      await depositContract.update(contractPatch);

      if (req.body.trang_thai_hop_dong === 'pending_deposit') {
        await Appointment.update(
          {
            trang_thai: 'completed',
            last_message: 'Nhan vien da hoan tat khao sat va duyet thong tin ky gui. Chu nha vui long nop tien dam bao.',
            last_message_by: 'staff'
          },
          {
            where: {
              khach_hang_id: property.chu_nha_id,
              nha_cho_thue_id: property.id,
              loai_lich_hen: 'deposit_survey',
              trang_thai: { [Op.in]: ['pending', 'proposed', 'confirmed', 'rejected'] }
            }
          }
        );
      }

      if (req.body.lich_khao_sat) {
        const message = req.body.message || 'Nhan vien van phong de xuat lich khao sat nha ky gui.';
        const appointment = await Appointment.findOne({
          where: {
            khach_hang_id: property.chu_nha_id,
            nha_cho_thue_id: property.id,
            loai_lich_hen: 'deposit_survey',
            trang_thai: { [Op.in]: ['pending', 'proposed', 'confirmed', 'rejected'] }
          }
        });

        if (appointment) {
          await appointment.update({
            nhan_vien_id: appointment.nhan_vien_id || req.user.id,
            ngay_gio: req.body.lich_khao_sat,
            trang_thai: 'proposed',
            last_message: message,
            last_message_by: 'staff'
          });
        } else {
          await Appointment.create({
            khach_hang_id: property.chu_nha_id,
            nha_cho_thue_id: property.id,
            nhan_vien_id: req.user.id,
            ngay_gio: req.body.lich_khao_sat,
            ghi_chu: req.body.ghi_chu || 'Khao sat nha ky gui',
            trang_thai: 'proposed',
            loai_lich_hen: 'deposit_survey',
            last_message: message,
            last_message_by: 'staff'
          });
        }
      }
    } else {
      await property.update({
        hien_trang: req.body.hien_trang ?? property.hien_trang,
        hien_thi_chi_tiet: req.body.hien_thi_chi_tiet ?? property.hien_thi_chi_tiet
      });
    }

    res.json({ success: true, message: 'Da cap nhat danh gia nha', data: { property, depositContract } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
