const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Property, DepositContract } = require('../models');
const { logTransaction } = require('../utils/transactionLog');

const getViewer = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const canViewDetails = (viewer) => Boolean(
  viewer?.is_member || ['staff', 'broker', 'admin'].includes(viewer?.role)
);

const serializeProperty = (property, showFullDetails) => {
  const data = property.toJSON();
  const maskedAddress = data.dia_chi_chi_tiet
    ? `${data.dia_chi_chi_tiet.substring(0, 15)}...`
    : null;

  return {
    ...data,
    dia_chi_chi_tiet: showFullDetails ? data.dia_chi_chi_tiet : maskedAddress,
    thong_tin_day_du: showFullDetails,
    mo_ta_tom_tat: `${data.loai_nha} - ${data.dien_tich || '---'}m2 - ${Number(data.gia_de_xuat || 0).toLocaleString('vi-VN')}d/thang`
  };
};

exports.getAllProperties = async (req, res) => {
  try {
    const { q } = req.query;
    const viewer = getViewer(req);
    const where = { hien_thi_chi_tiet: true };

    if (q) {
      where[Op.or] = [
        { loai_nha: { [Op.like]: `%${q}%` } },
        { dia_chi_chi_tiet: { [Op.like]: `%${q}%` } }
      ];
    }

    const properties = await Property.findAll({ where });
    res.json({ success: true, data: properties.map((property) => serializeProperty(property, canViewDetails(viewer))) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const viewer = getViewer(req);
    const property = await Property.findOne({
      where: {
        id: req.params.id,
        hien_thi_chi_tiet: true
      }
    });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Khong tim thay nha' });
    }

    res.json({
      success: true,
      data: serializeProperty(property, canViewDetails(viewer))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDepositRequest = async (req, res) => {
  try {
    if (req.user.role !== 'landlord') {
      return res.status(403).json({ success: false, message: 'Chi Chu nha moi duoc thuc hien ky gui nha' });
    }

    const { loai_nha, dien_tich, huong_nha, so_luong_phong, dia_chi_chi_tiet, gia_de_xuat, hien_trang } = req.body;

    const property = await Property.create({
      chu_nha_id: req.user.id,
      loai_nha,
      dien_tich,
      huong_nha,
      so_luong_phong,
      dia_chi_chi_tiet,
      gia_de_xuat,
      hien_trang,
      hien_thi_chi_tiet: false
    });

    const contract = await DepositContract.create({
      nha_cho_thue_id: property.id,
      trang_thai: 'draft',
      tien_dam_bao: 1000000,
      thoi_han_thang: 6
    });

    res.status(201).json({ success: true, message: 'Yeu cau ky gui thanh cong. Vui long cho nhan vien lien he.', data: { property, contract } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.customerPayDeposit = async (req, res) => {
  try {
    const { contract_id } = req.params;
    const contract = await DepositContract.findByPk(contract_id, { include: [{ model: Property }] });
    if (!contract) return res.status(404).json({ success: false, message: 'Khong thay hop dong' });

    if (contract.Property.chu_nha_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Ban khong co quyen thanh toan hop dong nay' });
    }

    if (contract.trang_thai !== 'pending_deposit') {
      return res.status(400).json({ success: false, message: 'Hop dong khong o trang thai cho thanh toan' });
    }

    const today = new Date().toISOString().split('T')[0];
    await contract.update({ 
      trang_thai: 'paid', 
      ngay_thanh_toan_dam_bao: today
    });

    await logTransaction({
      user_id: req.user.id,
      actor_id: req.user.id,
      loai_giao_dich: 'deposit_payment',
      so_tien: contract.tien_dam_bao,
      doi_tuong: 'deposit_contract',
      doi_tuong_id: contract.id,
      mo_ta: 'Chu nha thanh toan tien dam bao ky gui'
    });

    res.json({ success: true, message: 'Thanh toan thanh cong, dang cho nhan vien xac nhan', data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.staffSignContract = async (req, res) => {
  try {
    const { contract_id } = req.params;
    const contract = await DepositContract.findByPk(contract_id);
    if (!contract) return res.status(404).json({ success: false, message: 'Khong thay hop dong' });

    if (!['staff', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Chi nhan vien moi duoc xac nhan hop dong' });
    }

    if (contract.trang_thai !== 'paid') {
      return res.status(400).json({ success: false, message: 'Khach hang chua thanh toan hoac hop dong da duoc xu ly' });
    }

    const today = new Date().toISOString().split('T')[0];
    await contract.update({ 
      trang_thai: 'active', 
      ngay_ky: today, 
      nhan_vien_id: req.user.id
    });
    await Property.update({ hien_thi_chi_tiet: true }, { where: { id: contract.nha_cho_thue_id } });

    res.json({ success: true, message: 'Ky hop dong thanh cong, nha da duoc hien thi cho moi gioi', data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.claimProperty = async (req, res) => {
  try {
    if (req.user.role !== 'broker') {
      return res.status(403).json({ success: false, message: 'Chi moi gioi moi duoc nhan nha' });
    }

    const property = await Property.findByPk(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Khong thay nha' });

    if (property.broker_id) {
      return res.status(400).json({ success: false, message: 'Nha nay da co moi gioi khac quan ly' });
    }

    const contract = await DepositContract.findOne({ where: { nha_cho_thue_id: property.id, trang_thai: 'active' } });
    if (!contract) {
      return res.status(400).json({ success: false, message: 'Nha nay chua hoan tat hop dong ky gui' });
    }

    await property.update({ broker_id: req.user.id });
    res.json({ success: true, message: 'Ban da nhan quan ly nha nay thanh cong', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAvailableForBrokers = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: {
        broker_id: null,
        hien_thi_chi_tiet: true
      },
      include: [{ model: DepositContract, where: { trang_thai: 'active' } }]
    });
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBrokerManagedProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { broker_id: req.user.id }
    });
    res.json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
