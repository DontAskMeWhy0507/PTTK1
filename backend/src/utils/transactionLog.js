const { TransactionLog } = require('../models');

const logTransaction = (payload) => TransactionLog.create({
  user_id: payload.user_id,
  actor_id: payload.actor_id || null,
  loai_giao_dich: payload.loai_giao_dich,
  so_tien: Number(payload.so_tien || 0),
  doi_tuong: payload.doi_tuong,
  doi_tuong_id: payload.doi_tuong_id,
  mo_ta: payload.mo_ta,
  thoi_gian: payload.thoi_gian || new Date()
});

module.exports = { logTransaction };
