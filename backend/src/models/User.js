const { sequelize, DataTypes } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.ENUM('landlord', 'customer', 'employee', 'admin'),
    defaultValue: 'customer'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active'
  }
}, {
  tableName: 'users',
  underscored: true
});

module.exports = User;
