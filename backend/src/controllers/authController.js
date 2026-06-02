const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  full_name: user.full_name,
  phone_number: user.phone_number,
  role: user.role,
  status: user.status,
  is_member: user.role === 'customer'
});

exports.register = async (req, res) => {
  try {
    if (req.user) {
      return res.status(400).json({ success: false, message: 'Ban da dang nhap, khong the dang ky tai khoan moi' });
    }
    const { email, password, full_name, phone_number } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: 'Email da ton tai' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash, full_name, phone_number, role: 'customer' });

    res.status(201).json({ success: true, message: 'Dang ky thanh cong', data: publicUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Email hoac mat khau khong dung' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: 'Email hoac mat khau khong dung' });

    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Tai khoan khong hoat dong' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        is_member: user.role === 'customer'
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ success: true, access_token: token, user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Chi admin moi duoc quan ly nguoi dung' });
    }

    const users = await User.findAll({
      attributes: ['id', 'email', 'full_name', 'phone_number', 'role', 'status', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Chi admin moi duoc phan quyen' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Khong thay nguoi dung' });

    const { role, status } = req.body;
    if (role && !['customer', 'employee', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Vai tro khong hop le' });
    }
    if (status && !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trang thai khong hop le' });
    }

    await user.update({ role: role || user.role, status: status || user.status });

    res.json({ success: true, message: 'Da cap nhat phan quyen', data: publicUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
