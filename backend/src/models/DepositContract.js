const { sequelize, DataTypes } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const DepositContract = sequelize.define('DepositContract', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  nha_cho_thue_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  nhan_vien_id: {
    type: DataTypes.CHAR(36)
  },
  ngay_ky: {
    type: DataTypes.DATEONLY
  },
  tien_dam_bao: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 1000000.00
  },
  trang_thai: {
    type: DataTypes.ENUM('draft', 'pending_deposit', 'paid', 'active', 'terminated', 'cancelled'),
    defaultValue: 'draft'
  },
  thoi_han_thang: {
    type: DataTypes.INTEGER,
    defaultValue: 6
  },
  ngay_thanh_toan_dam_bao: {
    type: DataTypes.DATEONLY
  },
  ngay_het_han: {
    type: DataTypes.DATEONLY
  },
  ghi_chu: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'hop_dong_ky_gui',
  underscored: true,
  hooks: {
    beforeSave: (contract) => {
      if (contract.ngay_ky && contract.thoi_han_thang) {
        const date = new Date(contract.ngay_ky);
        date.setMonth(date.getMonth() + contract.thoi_han_thang);
        contract.ngay_het_han = date.toISOString().split('T')[0];
      }
    }
  }
});

module.exports = DepositContract;
