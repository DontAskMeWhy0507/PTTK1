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
  is_member: !!user.is_member
});

exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone_number, role } = req.body;
    if (!email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'Vui long nhap day du ho ten, email va mat khau' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: 'Email da ton tai' });

    const password_hash = await bcrypt.hash(password, 10);
    
    const allowedPublicRoles = ['customer', 'landlord'];
    const allowedAdminRoles = ['customer', 'landlord', 'staff', 'broker', 'admin'];
    const finalRole = req.user?.role === 'admin'
      ? (allowedAdminRoles.includes(role) ? role : 'customer')
      : (allowedPublicRoles.includes(role) ? role : 'customer');

    if (finalRole === 'landlord' && !phone_number) {
      return res.status(400).json({ success: false, message: 'Chu nha can cung cap so dien thoai lien he' });
    }

    const user = await User.create({
      email,
      password_hash,
      full_name,
      phone_number,
      role: finalRole,
      is_member: true
    });

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
          phone_number: user.phone_number,
          is_member: !!user.is_member
        },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ success: true, token, user: publicUser(user) });
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
      attributes: ['id', 'email', 'full_name', 'phone_number', 'role', 'status', 'is_member', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminUpdateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Chi admin moi duoc quyen nay' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Khong thay nguoi dung' });

    const { email, password, full_name, phone_number, role, status, is_member } = req.body;
    
    const patch = {};
    if (email) patch.email = email;
    if (full_name) patch.full_name = full_name;
    if (phone_number) patch.phone_number = phone_number;
    if (role) patch.role = role;
    if (status) patch.status = status;
    if (is_member !== undefined) patch.is_member = is_member;
    
    if (password) {
      patch.password_hash = await bcrypt.hash(password, 10);
    }

    await user.update(patch);

    res.json({ success: true, message: 'Da cap nhat thong tin nguoi dung', data: publicUser(user) });
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

    const { role, status, is_member } = req.body;
    if (role && !['customer', 'staff', 'broker', 'admin', 'landlord'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Vai tro khong hop le' });
    }
    if (status && !['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Trang thai khong hop le' });
    }

    await user.update({
      role: role || user.role,
      status: status || user.status,
      is_member: is_member !== undefined ? is_member : user.is_member
    });

    res.json({ success: true, message: 'Da cap nhat phan quyen', data: publicUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
