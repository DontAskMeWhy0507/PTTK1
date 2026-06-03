const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user && user.status === 'active') {
        req.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          is_member: !!user.is_member
        };
      }
    }
    next();
  } catch (error) {
    next();
  }
};
