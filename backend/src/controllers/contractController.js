const { Op } = require('sequelize');
const { ContractDocument, DepositContract, Property, Refund, RentalContract, TransactionLog, User } = require('../models');
const { logTransaction } = require('../utils/transactionLog');

const documentAttributes = [
  'id',
  'loai_hop_dong',
  'hop_dong_id',
  'nguoi_tai_len_id',
  'ten_file',
  'mime_type',
  'kich_thuoc',
  'created_at',
  'updated_at'
];

const assertDepositAccess = async (req, id) => {
  const contract = await DepositContract.findByPk(id, { include: [{ model: Property }] });
  if (!contract) return { error: { status: 404, message: 'Khong thay hop dong ky gui' } };

  const allowed = (
    req.user.role === 'admin' ||
    req.user.role === 'staff' ||
    req.user.role === 'broker' ||
    req.user.role === 'employee' ||
    contract.Property?.chu_nha_id === req.user.id
  );
  if (!allowed) return { error: { status: 403, message: 'Khong co quyen truy cap hop dong nay' } };

  return { contract };
};

const assertRentalAccess = async (req, id) => {
  const contract = await RentalContract.findByPk(id);
  if (!contract) return { error: { status: 404, message: 'Khong thay hop dong thue' } };

  const allowed = (
    req.user.role === 'admin' ||
    req.user.role === 'staff' ||
    (req.user.role === 'broker' && contract.nhan_vien_id === req.user.id) ||
    (req.user.role === 'customer' && contract.khach_hang_id === req.user.id)
  );
  if (!allowed) return { error: { status: 403, message: 'Khong co quyen truy cap hop dong nay' } };

  return { contract };
};

const assertContractAccess = async (req, type, id) => (
  type === 'deposit' ? assertDepositAccess(req, id) : assertRentalAccess(req, id)
);

const getDocuments = (type, contractId) => ContractDocument.findAll({
  where: { loai_hop_dong: type, hop_dong_id: contractId },
  attributes: documentAttributes,
  order: [['created_at', 'DESC']]
});

exports.getMyDepositContracts = async (req, res) => {
  try {
    let where = {};
    const role = req.user.role;

    if (role === 'admin') {
      where = {};
    } else if (role === 'staff' || role === 'employee') {
      where = {}; // Staff xem het de phe duyet
    } else if (role === 'broker') {
      // Broker xem nhung nha minh dang duoc giao
      const managedProperties = await Property.findAll({ where: { broker_id: req.user.id } });
      const managedIds = managedProperties.map(p => p.id);
      where.nha_cho_thue_id = { [Op.in]: managedIds };
    } else if (role === 'landlord') {
      // Chu nha xem chinh nha minh dang ky gui
      const myProperties = await Property.findAll({ where: { chu_nha_id: req.user.id } });
      const myPropertyIds = myProperties.map((p) => p.id);
      where.nha_cho_thue_id = { [Op.in]: myPropertyIds };
    } else {
      return res.status(403).json({ success: false, message: 'Chi Chu nha moi duoc xem hop dong ky gui' });
    }

    const contracts = await DepositContract.findAll({
      where,
      include: [{ model: Property }, { model: Refund }],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDepositContractDetail = async (req, res) => {
  try {
    const contract = await DepositContract.findByPk(req.params.id, {
      include: [{ model: Property }, { model: Refund }]
    });

    if (!contract) return res.status(404).json({ success: false, message: 'Khong thay hop dong' });

    const access = await assertDepositAccess(req, contract.id);
    if (access.error) return res.status(access.error.status).json({ success: false, message: access.error.message });

    const data = contract.toJSON();
    data.Documents = await getDocuments('deposit', contract.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelDepositContract = async (req, res) => {
  try {
    const access = await assertDepositAccess(req, req.params.id);
    if (access.error) return res.status(access.error.status).json({ success: false, message: access.error.message });
    const contract = access.contract;

    // Cho phep admin hoac chu nha huy
    if (req.user.role !== 'admin' && contract.Property?.chu_nha_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Ban khong duoc phep huy hop dong nay' });
    }

    const rented = await RentalContract.findOne({
      where: {
        nha_cho_thue_id: contract.nha_cho_thue_id,
        trang_thai: { [Op.in]: ['active', 'completed'] }
      }
    });

    const today = new Date().toISOString().split('T')[0];
    const expired = contract.ngay_het_han && new Date(contract.ngay_het_han) <= new Date(today);

    await contract.update({
      trang_thai: 'cancelled',
      ghi_chu: rented
        ? 'Hop dong ky gui da duoc tat toan do nha da cho thue'
        : (expired ? 'Chu nha yeu cau huy sau 6 thang, tao phieu hoan tien' : 'Chu nha yeu cau huy truoc han')
    });
    await Property.update({ hien_thi_chi_tiet: false }, { where: { id: contract.nha_cho_thue_id } });

    let refund = null;
    if (!rented && expired) {
      refund = await Refund.create({
        hop_dong_ky_gui_id: contract.id,
        ngay_yeu_cau: today,
        so_tien_hoan: contract.tien_dam_bao,
        trang_thai: 'pending',
        ghi_chu: req.body?.ghi_chu || 'Hoan tien dam bao do het han 6 thang va chua co khach thue'
      });

      await logTransaction({
        user_id: contract.Property.chu_nha_id,
        actor_id: req.user.id,
        loai_giao_dich: 'deposit_refund',
        so_tien: contract.tien_dam_bao,
        doi_tuong: 'refund',
        doi_tuong_id: refund.id,
        mo_ta: 'Tao yeu cau hoan tien dam bao cho chu nha'
      });
    }

    res.json({ success: true, message: 'Da xu ly yeu cau huy hop dong', data: { contract, refund } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyRentalContracts = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'customer') where.khach_hang_id = req.user.id;
    else if (['staff', 'broker', 'admin'].includes(req.user.role)) {
      // Nhan vien va Admin xem duoc tat ca
    }
    else return res.status(403).json({ success: false, message: 'Khong co quyen xem hop dong thue' });

    const contracts = await RentalContract.findAll({
      where,
      include: [
        { model: Property },
        { model: User, as: 'Broker', attributes: ['id', 'full_name', 'phone_number'] },
        { model: User, as: 'Customer', attributes: ['id', 'full_name', 'phone_number'] }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRentalContractDetail = async (req, res) => {
  try {
    const contract = await RentalContract.findByPk(req.params.id, {
      include: [
        { model: Property },
        { model: User, as: 'Broker', attributes: ['id', 'full_name', 'phone_number'] },
        { model: User, as: 'Customer', attributes: ['id', 'full_name', 'phone_number'] }
      ]
    });

    if (!contract) return res.status(404).json({ success: false, message: 'Khong thay hop dong thue' });

    const access = await assertRentalAccess(req, contract.id);
    if (access.error) return res.status(access.error.status).json({ success: false, message: access.error.message });

    const data = contract.toJSON();
    data.Documents = await getDocuments('rental', contract.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.listContractDocuments = async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!['deposit', 'rental'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Loai hop dong khong hop le' });
    }

    const access = await assertContractAccess(req, type, id);
    if (access.error) return res.status(access.error.status).json({ success: false, message: access.error.message });

    res.json({ success: true, data: await getDocuments(type, id) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadContractDocument = async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!['deposit', 'rental'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Loai hop dong khong hop le' });
    }

    if (type === 'deposit') {
      if (!['admin', 'staff'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Chi Nhan vien van phong moi duoc tai len hop dong ky gui' });
      }
    } else if (type === 'rental') {
      if (!['admin', 'broker'].includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'Chi Nhan vien moi gioi moi duoc tai len hop dong thue' });
      }
    }

    const access = await assertContractAccess(req, type, id);
    if (access.error) return res.status(access.error.status).json({ success: false, message: access.error.message });

    const { ten_file, mime_type, kich_thuoc, noi_dung_base64 } = req.body;
    if (!ten_file || !mime_type || !kich_thuoc || !noi_dung_base64) {
      return res.status(400).json({ success: false, message: 'Thieu thong tin file hop dong' });
    }

    const document = await ContractDocument.create({
      loai_hop_dong: type,
      hop_dong_id: id,
      nguoi_tai_len_id: req.user.id,
      ten_file,
      mime_type,
      kich_thuoc,
      noi_dung_base64
    });

    const data = document.toJSON();
    delete data.noi_dung_base64;
    res.status(201).json({ success: true, message: 'Da tai hop dong len', data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.downloadContractDocument = async (req, res) => {
  try {
    const document = await ContractDocument.findByPk(req.params.documentId);
    if (!document) return res.status(404).json({ success: false, message: 'Khong thay file hop dong' });

    const access = await assertContractAccess(req, document.loai_hop_dong, document.hop_dong_id);
    if (access.error) return res.status(access.error.status).json({ success: false, message: access.error.message });

    res.json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processRefund = async (req, res) => {
  try {
    if (!['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Chi nhan vien hoac admin moi duoc xu ly hoan tien' });
    }

    const refund = await Refund.findByPk(req.params.refundId);
    if (!refund) return res.status(404).json({ success: false, message: 'Khong thay phieu hoan tien' });

    await refund.update({
      trang_thai: req.body.trang_thai || 'completed',
      ghi_chu: req.body.ghi_chu || refund.ghi_chu,
      ngay_hoan: req.body.trang_thai === 'completed' ? new Date().toISOString().split('T')[0] : refund.ngay_hoan
    });

    res.json({ success: true, message: 'Da cap nhat trang thai hoan tien', data: refund });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTransactionLogs = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'admin') {
      // Admin xem tat ca
    } else if (['staff', 'broker'].includes(req.user.role)) {
      where.actor_id = req.user.id;
    } else {
      where.user_id = req.user.id;
    }

    const transactions = await TransactionLog.findAll({
      where,
      include: [
        { model: User, as: 'User', attributes: ['id', 'full_name', 'email', 'role'] },
        { model: User, as: 'Actor', attributes: ['id', 'full_name', 'email', 'role'] }
      ],
      order: [['thoi_gian', 'DESC']]
    });

    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
