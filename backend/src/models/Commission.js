const { sequelize, DataTypes } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Commission = sequelize.define('Commission', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  nhan_vien_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  hop_dong_thue_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  so_tien: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  loai: {
    type: DataTypes.ENUM('commission', 'deduction'),
    defaultValue: 'commission'
  },
  trang_thai: {
    type: DataTypes.ENUM('pending', 'earned', 'paid'),
    defaultValue: 'earned'
  }
}, {
  tableName: 'hoa_hong',
  underscored: true
});

module.exports = Commission;
