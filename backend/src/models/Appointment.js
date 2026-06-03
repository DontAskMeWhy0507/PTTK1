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
    allowNull: true
  },
  ghi_chu: {
    type: DataTypes.TEXT
  },
  trang_thai: {
    type: DataTypes.ENUM('pending', 'proposed', 'confirmed', 'rejected', 'completed', 'cancelled', 'no_show'),
    defaultValue: 'pending'
  },
  last_message: {
    type: DataTypes.TEXT
  },
  last_message_by: {
    type: DataTypes.ENUM('customer', 'staff', 'broker')
  }
}, {
  tableName: 'lich_hen',
  underscored: true
});

module.exports = Appointment;
