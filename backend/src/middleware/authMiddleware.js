const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Yeu cau token xac thuc' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user || user.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Phien dang nhap da het hieu luc, vui long dang nhap lai' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      phone_number: user.phone_number,
      is_member: !!user.is_member
    };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token khong hop le hoac da het han' });
  }
};
