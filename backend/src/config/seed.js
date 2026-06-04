require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, configureSqlite } = require('../config/database');
require('../models');
const {
  Appointment,
  Commission,
  DepositContract,
  Interaction,
  Property,
  RentalContract,
  TransactionLog,
  User
} = require('../models');

const dateOnly = (date) => date.toISOString().split('T')[0];

async function seed() {
  console.log('--- Cleaning database ---');
  await configureSqlite();
  await sequelize.sync({ force: true });
  console.log('--- Database created ---');

  const hash = await bcrypt.hash('123456', 10);
  const today = new Date();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const nextSurvey = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const nextYear = new Date(today);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const expiredStart = new Date(today);
  expiredStart.setMonth(expiredStart.getMonth() - 7);

  console.log('--- Seeding users ---');
  const users = await User.bulkCreate([
    { email: 'admin@pttk.vn', password_hash: hash, full_name: 'Admin He Thong', phone_number: '0900000001', role: 'admin', status: 'active', is_member: true },
    { email: 'staff1@pttk.vn', password_hash: hash, full_name: 'Nguyen Van Phong', phone_number: '0900000002', role: 'staff', status: 'active', is_member: true },
    { email: 'broker1@pttk.vn', password_hash: hash, full_name: 'Le Quang Broker', phone_number: '0900000003', role: 'broker', status: 'active', is_member: true, bank_name: 'Vietcombank', bank_account_number: '970400000003', bank_account_holder: 'LE QUANG BROKER' },
    { email: 'broker2@pttk.vn', password_hash: hash, full_name: 'Pham Minh Broker', phone_number: '0900000004', role: 'broker', status: 'active', is_member: true, bank_name: 'Techcombank', bank_account_number: '190300000004', bank_account_holder: 'PHAM MINH BROKER' },
    { email: 'landlord1@gmail.com', password_hash: hash, full_name: 'Anh Chu Nha A', phone_number: '0900000005', role: 'landlord', status: 'active', is_member: true, bank_name: 'BIDV', bank_account_number: '124100000005', bank_account_holder: 'ANH CHU NHA A' },
    { email: 'landlord2@gmail.com', password_hash: hash, full_name: 'Chi Chu Nha B', phone_number: '0900000006', role: 'landlord', status: 'active', is_member: true, bank_name: 'ACB', bank_account_number: '998800000006', bank_account_holder: 'CHI CHU NHA B' },
    { email: 'customer1@gmail.com', password_hash: hash, full_name: 'Khach Thue Mot', phone_number: '0900000007', role: 'customer', status: 'active', is_member: true },
    { email: 'customer2@gmail.com', password_hash: hash, full_name: 'Khach Thue Hai', phone_number: '0900000008', role: 'customer', status: 'active', is_member: true }
  ], { returning: true });

  const staff = users.find((u) => u.email === 'staff1@pttk.vn');
  const broker1 = users.find((u) => u.email === 'broker1@pttk.vn');
  const broker2 = users.find((u) => u.email === 'broker2@pttk.vn');
  const landlord1 = users.find((u) => u.email === 'landlord1@gmail.com');
  const landlord2 = users.find((u) => u.email === 'landlord2@gmail.com');
  const customer1 = users.find((u) => u.email === 'customer1@gmail.com');
  const customer2 = users.find((u) => u.email === 'customer2@gmail.com');

  console.log('--- Seeding properties ---');
  const properties = await Property.bulkCreate([
    {
      chu_nha_id: landlord1.id,
      loai_nha: 'Can ho chung cu',
      dien_tich: 75.5,
      huong_nha: 'Dong Nam',
      so_luong_phong: 2,
      dia_chi_chi_tiet: 'P1205, Toa nha Vinhomes, Nam Tu Liem, Ha Noi',
      gia_de_xuat: 12000000,
      hien_trang: 'Moi ban giao, day du noi that',
      broker_id: broker1.id,
      hien_thi_chi_tiet: false
    },
    {
      chu_nha_id: landlord1.id,
      loai_nha: 'Nha rieng',
      dien_tich: 48,
      huong_nha: 'Tay',
      so_luong_phong: 3,
      dia_chi_chi_tiet: 'So 12, Ngo 88, Cau Giay, Ha Noi',
      gia_de_xuat: 8500000,
      hien_trang: 'Dang cho nhan vien danh gia',
      broker_id: null,
      hien_thi_chi_tiet: false
    },
    {
      chu_nha_id: landlord2.id,
      loai_nha: 'Studio',
      dien_tich: 32,
      huong_nha: 'Nam',
      so_luong_phong: 1,
      dia_chi_chi_tiet: 'Studio S303, Thanh Xuan, Ha Noi',
      gia_de_xuat: 6500000,
      hien_trang: 'Het han ky gui, chua cho thue duoc',
      broker_id: null,
      hien_thi_chi_tiet: false
    },
    {
      chu_nha_id: landlord2.id,
      loai_nha: 'Nha pho',
      dien_tich: 90,
      huong_nha: 'Dong',
      so_luong_phong: 4,
      dia_chi_chi_tiet: 'So 8 Pho Mau, Long Bien, Ha Noi',
      gia_de_xuat: 15000000,
      hien_trang: 'Chu nha moi gui yeu cau, chua khao sat',
      broker_id: null,
      hien_thi_chi_tiet: false
    },
    {
      chu_nha_id: landlord1.id,
      loai_nha: 'Can ho cao cap',
      dien_tich: 68,
      huong_nha: 'Bac',
      so_luong_phong: 2,
      dia_chi_chi_tiet: 'Can 1808, Imperia Garden, Thanh Xuan, Ha Noi',
      gia_de_xuat: 18000000,
      hien_trang: 'Da xac minh phap ly, san sang cho khach xem',
      broker_id: broker2.id,
      hien_thi_chi_tiet: true
    },
    {
      chu_nha_id: landlord2.id,
      loai_nha: 'Nha nguyen can',
      dien_tich: 110,
      huong_nha: 'Tay Bac',
      so_luong_phong: 5,
      dia_chi_chi_tiet: 'So 35, Ngo 120 Hoang Quoc Viet, Cau Giay, Ha Noi',
      gia_de_xuat: 22000000,
      hien_trang: 'Dang cho chu nha nop tien dam bao sau khao sat',
      broker_id: null,
      hien_thi_chi_tiet: false
    },
    {
      chu_nha_id: landlord1.id,
      loai_nha: 'Phong dich vu',
      dien_tich: 28,
      huong_nha: 'Dong Bac',
      so_luong_phong: 1,
      dia_chi_chi_tiet: 'Tang 3, So 19 Tran Duy Hung, Cau Giay, Ha Noi',
      gia_de_xuat: 5500000,
      hien_trang: 'Da duyet va hien thi de khach dat lich',
      broker_id: null,
      hien_thi_chi_tiet: true
    }
  ], { returning: true });

  console.log('--- Seeding deposit contracts ---');
  const activeDeposit = await DepositContract.create({
    nha_cho_thue_id: properties[0].id,
    nhan_vien_id: staff.id,
    ngay_ky: dateOnly(today),
    tien_dam_bao: 1000000,
    trang_thai: 'terminated',
    thoi_han_thang: 6,
    lich_khao_sat: dateOnly(today),
    trang_thai_phap_ly: 'verified',
    ghi_chu_phap_ly: 'Da doi chieu so hong va thong tin chu nha',
    ghi_chu: 'Tien dam bao da khau tru vao phi moi gioi trong hop dong thue mau'
  });

  await DepositContract.create({
    nha_cho_thue_id: properties[1].id,
    nhan_vien_id: null,
    tien_dam_bao: 1000000,
    trang_thai: 'pending_deposit',
    thoi_han_thang: 6,
    lich_khao_sat: nextSurvey,
    trang_thai_phap_ly: 'needs_update',
    ghi_chu_phap_ly: 'Can bo sung anh chup giay to nha truoc khi ky gui'
  });

  const expiredDeposit = await DepositContract.create({
    nha_cho_thue_id: properties[2].id,
    nhan_vien_id: staff.id,
    ngay_ky: dateOnly(expiredStart),
    tien_dam_bao: 1000000,
    trang_thai: 'active',
    thoi_han_thang: 6,
    lich_khao_sat: dateOnly(expiredStart),
    trang_thai_phap_ly: 'verified',
    ghi_chu_phap_ly: 'Hop dong mau het han hon 6 thang, dung de test huy va hoan tien'
  });

  await DepositContract.create({
    nha_cho_thue_id: properties[3].id,
    nhan_vien_id: null,
    tien_dam_bao: 1000000,
    trang_thai: 'draft',
    thoi_han_thang: 6,
    lich_khao_sat: nextWeek,
    trang_thai_phap_ly: 'pending',
    ghi_chu_phap_ly: 'Mau cho nhan vien test cap nhat lich khao sat va phap ly'
  });

  await DepositContract.create({
    nha_cho_thue_id: properties[4].id,
    nhan_vien_id: staff.id,
    ngay_ky: dateOnly(today),
    tien_dam_bao: 1000000,
    trang_thai: 'active',
    thoi_han_thang: 6,
    lich_khao_sat: dateOnly(today),
    trang_thai_phap_ly: 'verified',
    ghi_chu_phap_ly: 'Nha san sang cho thue, dung de test tao hop dong moi va khau tru dam bao'
  });

  await DepositContract.create({
    nha_cho_thue_id: properties[5].id,
    nhan_vien_id: staff.id,
    tien_dam_bao: 1000000,
    trang_thai: 'pending_deposit',
    thoi_han_thang: 6,
    lich_khao_sat: dateOnly(nextSurvey),
    trang_thai_phap_ly: 'verified',
    ghi_chu_phap_ly: 'Da khao sat xong, cho chu nha nop tien dam bao'
  });

  await DepositContract.create({
    nha_cho_thue_id: properties[6].id,
    nhan_vien_id: staff.id,
    ngay_ky: dateOnly(today),
    tien_dam_bao: 1000000,
    trang_thai: 'active',
    thoi_han_thang: 6,
    lich_khao_sat: dateOnly(today),
    trang_thai_phap_ly: 'verified',
    ghi_chu_phap_ly: 'Nha active chua co moi gioi, dung de test broker nhan nha'
  });

  console.log('--- Seeding rental contract ---');
  const paidRental = await RentalContract.create({
    khach_hang_id: customer2.id,
    nha_cho_thue_id: properties[0].id,
    nhan_vien_id: broker1.id,
    ngay_ky: dateOnly(today),
    gia_tri_hop_dong: 144000000,
    phan_tram_hoa_hong: 3,
    trang_thai: 'active',
    ngay_bat_dau: dateOnly(today),
    ngay_ket_thuc: dateOnly(nextYear)
  });

  await Commission.create({
    nhan_vien_id: broker1.id,
    hop_dong_thue_id: paidRental.id,
    so_tien: paidRental.tien_hoa_hong,
    loai: 'commission',
    trang_thai: 'earned'
  });

  const paidRentalCommission = Number(paidRental.tien_hoa_hong || 0);
  const paidRentalDepositDeduction = 1000000;
  const paidRentalLandlordReceives = Number(paidRental.gia_tri_hop_dong || 0) - (paidRentalCommission - paidRentalDepositDeduction);
  await landlord1.update({ account_balance: paidRentalLandlordReceives });
  await broker1.update({ account_balance: paidRentalCommission });

  console.log('--- Seeding appointments ---');
  await Appointment.bulkCreate([
    {
      khach_hang_id: customer1.id,
      nha_cho_thue_id: properties[0].id,
      nhan_vien_id: broker1.id,
      ngay_gio: tomorrow,
      ghi_chu: 'Khach muon xem can ho chung cu',
      trang_thai: 'confirmed',
      last_message: 'Lich xem nha da duoc xac nhan vao ngay mai',
      last_message_by: 'broker'
    },
    {
      khach_hang_id: landlord2.id,
      nha_cho_thue_id: properties[1].id,
      nhan_vien_id: staff.id,
      ngay_gio: nextSurvey,
      ghi_chu: 'Lich khao sat ky gui mau',
      trang_thai: 'proposed',
      loai_lich_hen: 'deposit_survey',
      last_message: 'Nhan vien van phong de xuat lich khao sat nha ky gui.',
      last_message_by: 'staff'
    }
  ]);

  console.log('--- Seeding interactions ---');
  await Interaction.bulkCreate([
    {
      nhan_vien_id: broker1.id,
      khach_hang_id: customer1.id,
      nha_cho_thue_id: properties[0].id,
      ngay_gio: new Date(),
      noi_dung_trao_doi: 'Da goi xac nhan nhu cau va hen lich xem nha.',
      loai_trao_doi: 'call'
    },
    {
      nhan_vien_id: broker1.id,
      khach_hang_id: customer2.id,
      nha_cho_thue_id: properties[0].id,
      ngay_gio: new Date(),
      noi_dung_trao_doi: 'Khach da thanh toan hop dong thue mau.',
      loai_trao_doi: 'meeting'
    }
  ]);

  console.log('--- Seeding transaction logs ---');

  await TransactionLog.bulkCreate([
    {
      user_id: landlord1.id,
      actor_id: landlord1.id,
      loai_giao_dich: 'deposit_payment',
      so_tien: 1000000,
      doi_tuong: 'deposit_contract',
      doi_tuong_id: activeDeposit.id,
      mo_ta: 'Chủ nhà thanh toán tiền đảm bảo ký gửi'
    },
    {
      user_id: customer2.id,
      actor_id: customer2.id,
      loai_giao_dich: 'rent_payment',
      so_tien: paidRental.gia_tri_hop_dong,
      doi_tuong: 'rental_contract',
      doi_tuong_id: paidRental.id,
      mo_ta: 'Khách thuê thanh toán hợp đồng thuê mẫu'
    },
    {
      user_id: landlord1.id,
      actor_id: customer2.id,
      loai_giao_dich: 'landlord_payout',
      so_tien: paidRentalLandlordReceives,
      doi_tuong: 'rental_contract',
      doi_tuong_id: paidRental.id,
      mo_ta: `Chuyển ${paidRentalLandlordReceives.toLocaleString('vi-VN')} VND vào tài khoản ${landlord1.bank_name} ${landlord1.bank_account_number} của chủ nhà. Phí môi giới ${paidRentalCommission.toLocaleString('vi-VN')} VND, đã cấn trừ đảm bảo ${paidRentalDepositDeduction.toLocaleString('vi-VN')} VND.`
    },
    {
      user_id: broker1.id,
      actor_id: customer2.id,
      loai_giao_dich: 'broker_payout',
      so_tien: paidRentalCommission,
      doi_tuong: 'rental_contract',
      doi_tuong_id: paidRental.id,
      mo_ta: `Chuyển hoa hồng ${paidRentalCommission.toLocaleString('vi-VN')} VND vào tài khoản ${broker1.bank_name} ${broker1.bank_account_number} của môi giới.`
    },
  ]);

  console.log('--- Finished seeding ---');
  console.log('Accounts password: 123456');
  console.log('admin@pttk.vn | staff1@pttk.vn | broker1@pttk.vn');
  console.log('landlord1@gmail.com | landlord2@gmail.com');
  console.log('customer1@gmail.com | customer2@gmail.com');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
