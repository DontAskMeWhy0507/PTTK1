const { sequelize, DataTypes } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const TransactionLog = sequelize.define('TransactionLog', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: () => uuidv4()
  },
  user_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  actor_id: {
    type: DataTypes.CHAR(36),
    allowNull: true
  },
  loai_giao_dich: {
    type: DataTypes.ENUM(
      'deposit_payment',
      'rent_payment',
      'commission_pending',
      'commission_earned',
      'deposit_deduction',
      'deposit_refund',
      'rental_contract_created',
      'landlord_payout',
      'broker_payout'
    ),
    allowNull: false
  },
  so_tien: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  doi_tuong: {
    type: DataTypes.STRING,
    allowNull: false
  },
  doi_tuong_id: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  mo_ta: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  thoi_gian: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'lich_su_giao_dich',
  underscored: true
});

module.exports = TransactionLog;
