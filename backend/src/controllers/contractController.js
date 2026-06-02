const { Op } = require('sequelize');
const { ContractDocument, DepositContract, Property, Refund, RentalContract, User } = require('../models');

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
    req.user.role === 'employee' ||
    (req.user.role === 'landlord' && contract.Property?.chu_nha_id === req.user.id)
  );
  if (!allowed) return { error: { status: 403, message: 'Khong co quyen truy cap hop dong nay' } };

  return { contract };
};

const assertRentalAccess = async (req, id) => {
  const contract = await RentalContract.findByPk(id);
  if (!contract) return { error: { status: 404, message: 'Khong thay hop dong thue' } };

  const allowed = (
    req.user.role === 'admin' ||
    (req.user.role === 'employee' && contract.nhan_vien_id === req.user.id) ||
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
    if (req.user.role === 'employee') {
      where.nhan_vien_id = req.user.id;
    } else if (req.user.role === 'admin') {
      where = {};
    } else {
      const properties = await Property.findAll({ where: { chu_nha_id: req.user.id } });
      const propertyIds = properties.map((p) => p.id);
      where.nha_cho_thue_id = { [Op.in]: propertyIds };
    }

    const contracts = await DepositContract.findAll({
      where,
      include: [{ model: Property }, { model: Refund }]
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

    if (req.user.role !== 'landlord' || contract.Property?.chu_nha_id !== req.user.id) {
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
    else if (req.user.role === 'employee') {
      // Nhan vien xem duoc tat ca de biet ai quan ly
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
