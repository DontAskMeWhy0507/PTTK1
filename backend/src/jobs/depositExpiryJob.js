const cron = require('node-cron');
const { DepositContract, Property } = require('../models');
const { Op } = require('sequelize');

// Run every day at 08:00 AM
cron.schedule('0 8 * * *', async () => {
  console.log('--- Đang quét các hợp đồng ký gửi đến hạn 6 tháng ---');
  try {
    const today = new Date().toISOString().split('T')[0];

    // Find active contracts that are expired
    const expiredContracts = await DepositContract.findAll({
      where: {
        trang_thai: 'active',
        ngay_het_han: { [Op.lte]: today }
      }
    });

    for (const contract of expiredContracts) {
      // Logic check: Nếu nhà chưa được thuê thì hoàn tiền, nếu đã được thuê thì có thể khấu trừ (tùy nghiệp vụ cụ thể)
      // Ở đây ta chuyển trạng thái sang 'terminated' để chờ admin xử lý hoàn tiền
      await contract.update({ trang_thai: 'terminated' });
      console.log(`Hợp đồng ${contract.id} đã hết hạn 6 tháng và được chuyển sang hàng chờ xử lý.`);
    }
  } catch (error) {
    console.error('Lỗi khi quét hợp đồng hết hạn:', error);
  }
});
