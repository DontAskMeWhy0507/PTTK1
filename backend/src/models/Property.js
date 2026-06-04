const { sequelize, DataTypes } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  chu_nha_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  loai_nha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dien_tich: {
    type: DataTypes.FLOAT
  },
  huong_nha: {
    type: DataTypes.STRING
  },
  so_luong_phong: {
    type: DataTypes.INTEGER
  },
  dia_chi_chi_tiet: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gia_de_xuat: {
    type: DataTypes.DECIMAL(15, 2)
  },
  broker_id: {
    type: DataTypes.CHAR(36),
    allowNull: true
  },
  hien_trang: {
    type: DataTypes.STRING
  },
  hinh_anh: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  hien_thi_chi_tiet: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'nha_cho_thue',
  underscored: true
});

module.exports = Property;
