const { sequelize, DataTypes } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const ContractDocument = sequelize.define('ContractDocument', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  loai_hop_dong: {
    type: DataTypes.ENUM('deposit', 'rental'),
    allowNull: false
  },
  hop_dong_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  nguoi_tai_len_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  ten_file: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mime_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kich_thuoc: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  noi_dung_base64: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'contract_documents',
  underscored: true
});

module.exports = ContractDocument;
