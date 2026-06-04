const { TransactionLog } = require('../models');

const logTransaction = async (payload, options = {}) => {
  const where = {
    user_id: payload.user_id,
    loai_giao_dich: payload.loai_giao_dich,
    doi_tuong: payload.doi_tuong,
    doi_tuong_id: payload.doi_tuong_id
  };

  const existing = await TransactionLog.findOne({ where, transaction: options.transaction });
  if (existing) return existing;

  return TransactionLog.create({
    user_id: payload.user_id,
    actor_id: payload.actor_id || null,
    loai_giao_dich: payload.loai_giao_dich,
    so_tien: Number(payload.so_tien || 0),
    doi_tuong: payload.doi_tuong,
    doi_tuong_id: payload.doi_tuong_id,
    mo_ta: payload.mo_ta,
    thoi_gian: payload.thoi_gian || new Date()
  }, options);
};

module.exports = { logTransaction };
