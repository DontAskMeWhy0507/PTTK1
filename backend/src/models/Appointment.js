const { sequelize, DataTypes } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  khach_hang_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  nha_cho_thue_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  nhan_vien_id: {
    type: DataTypes.CHAR(36),
    allowNull: true
  },
  ngay_gio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ghi_chu: {
    type: DataTypes.TEXT
  },
  trang_thai: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'lich_hen',
  underscored: true
});

module.exports = Appointment;
