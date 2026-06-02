const { sequelize, DataTypes } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Refund = sequelize.define('Refund', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  hop_dong_ky_gui_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  ngay_yeu_cau: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  ngay_hoan: {
    type: DataTypes.DATEONLY
  },
  so_tien_hoan: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  trang_thai: {
    type: DataTypes.ENUM('pending', 'approved', 'paid', 'rejected'),
    defaultValue: 'pending'
  },
  ghi_chu: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'hoan_tien',
  underscored: true
});

module.exports = Refund;
