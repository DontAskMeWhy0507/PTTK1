const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Property, DepositContract } = require('../models');

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
  viewer?.is_member || ['employee', 'admin'].includes(viewer?.role)
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
    res.json(properties.map((property) => serializeProperty(property, canViewDetails(viewer))));
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
    if (!['employee', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Chi nhan vien moi duoc tiep nhan nha ky gui' });
    }

    const { chu_nha_id, loai_nha, dien_tich, huong_nha, so_luong_phong, dia_chi_chi_tiet, gia_de_xuat, hien_trang } = req.body;

    const property = await Property.create({
      chu_nha_id: chu_nha_id || req.user.id,
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
      nhan_vien_id: req.user.id,
      trang_thai: 'pending_deposit',
      tien_dam_bao: 1000000,
      thoi_han_thang: 6
    });

    res.status(201).json({ success: true, message: 'Yeu cau ky gui thanh cong', data: { property, contract } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.payDeposit = async (req, res) => {
  try {
    const { contract_id } = req.params;
    const contract = await DepositContract.findByPk(contract_id);
    if (!contract) return res.status(404).json({ success: false, message: 'Khong thay hop dong' });

    const today = new Date().toISOString().split('T')[0];
    await contract.update({ trang_thai: 'active', ngay_ky: today, ngay_thanh_toan_dam_bao: today });
    await Property.update({ hien_thi_chi_tiet: true }, { where: { id: contract.nha_cho_thue_id } });

    res.json({ success: true, message: 'Nop tien thanh cong, nha da duoc hien thi', data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
