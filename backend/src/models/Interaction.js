const { sequelize, DataTypes } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Interaction = sequelize.define('Interaction', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  nhan_vien_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  khach_hang_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  nha_cho_thue_id: {
    type: DataTypes.CHAR(36),
    allowNull: true
  },
  ngay_gio: {
    type: DataTypes.DATE,
    allowNull: false
  },
  noi_dung_trao_doi: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  loai_trao_doi: {
    type: DataTypes.ENUM('call', 'meeting', 'email', 'chat', 'site_visit', 'document_review'),
    defaultValue: 'meeting'
  }
}, {
  tableName: 'lich_su_lam_viec',
  underscored: true
});

module.exports = Interaction;
