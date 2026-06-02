const { sequelize, DataTypes } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const RentalContract = sequelize.define('RentalContract', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  khach_hang_id: { type: DataTypes.CHAR(36), allowNull: false },
  nha_cho_thue_id: { type: DataTypes.CHAR(36), allowNull: false },
  nhan_vien_id: { type: DataTypes.CHAR(36), allowNull: false },
  ngay_ky: { type: DataTypes.DATEONLY },
  gia_tri_hop_dong: { type: DataTypes.DECIMAL(15, 2) },
  phan_tram_hoa_hong: { type: DataTypes.DECIMAL(5, 2), defaultValue: 3.00 },
  tien_hoa_hong: { type: DataTypes.DECIMAL(15, 2) },
  trang_thai: {
    type: DataTypes.ENUM('draft', 'pending_sign', 'active', 'completed', 'cancelled'),
    defaultValue: 'draft'
  },
  ngay_bat_dau: { type: DataTypes.DATEONLY },
  ngay_ket_thuc: { type: DataTypes.DATEONLY }
}, {
  tableName: 'hop_dong_thue',
  underscored: true,
  hooks: {
    beforeSave: (contract) => {
      if (contract.gia_tri_hop_dong && contract.phan_tram_hoa_hong) {
        contract.tien_hoa_hong = (contract.gia_tri_hop_dong * contract.phan_tram_hoa_hong) / 100;
      }
    }
  }
});

module.exports = RentalContract;
