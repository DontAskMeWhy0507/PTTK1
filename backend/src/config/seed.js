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
    { email: 'broker1@pttk.vn', password_hash: hash, full_name: 'Le Quang Broker', phone_number: '0900000003', role: 'broker', status: 'active', is_member: true },
    { email: 'broker2@pttk.vn', password_hash: hash, full_name: 'Pham Minh Broker', phone_number: '0900000004', role: 'broker', status: 'active', is_member: true },
    { email: 'landlord1@gmail.com', password_hash: hash, full_name: 'Anh Chu Nha A', phone_number: '0900000005', role: 'landlord', status: 'active', is_member: true },
    { email: 'landlord2@gmail.com', password_hash: hash, full_name: 'Chi Chu Nha B', phone_number: '0900000006', role: 'landlord', status: 'active', is_member: true },
    { email: 'customer1@gmail.com', password_hash: hash, full_name: 'Khach Thue Mot', phone_number: '0900000007', role: 'customer', status: 'active', is_member: true },
    { email: 'customer2@gmail.com', password_hash: hash, full_name: 'Khach Thue Hai', phone_number: '0900000008', role: 'customer', status: 'active', is_member: true }
  ], { returning: true });

  const staff = users.find((u) => u.email === 'staff1@pttk.vn');
  const broker1 = users.find((u) => u.email === 'broker1@pttk.vn');
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
      hien_thi_chi_tiet: true
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
      hien_thi_chi_tiet: true
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
    }
  ], { returning: true });

  console.log('--- Seeding deposit contracts ---');
  const activeDeposit = await DepositContract.create({
    nha_cho_thue_id: properties[0].id,
    nhan_vien_id: staff.id,
    ngay_ky: dateOnly(today),
    tien_dam_bao: 1000000,
    trang_thai: 'active',
    thoi_han_thang: 6,
    lich_khao_sat: dateOnly(today),
    trang_thai_phap_ly: 'verified',
    ghi_chu_phap_ly: 'Da doi chieu so hong va thong tin chu nha'
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

  console.log('--- Seeding rental contract ---');
  const paidRental = await RentalContract.create({
    khach_hang_id: customer2.id,
    nha_cho_thue_id: properties[0].id,
    nhan_vien_id: broker1.id,
    ngay_ky: dateOnly(today),
    gia_tri_hop_dong: 144000000,
    phan_tram_hoa_hong: 3,
    trang_thai: 'paid',
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
      mo_ta: 'Chu nha thanh toan tien dam bao ky gui'
    },
    {
      user_id: customer2.id,
      actor_id: customer2.id,
      loai_giao_dich: 'rent_payment',
      so_tien: paidRental.gia_tri_hop_dong,
      doi_tuong: 'rental_contract',
      doi_tuong_id: paidRental.id,
      mo_ta: 'Khach thue thanh toan hop dong thue mau'
    },
    {
      user_id: broker1.id,
      actor_id: customer2.id,
      loai_giao_dich: 'commission_earned',
      so_tien: paidRental.tien_hoa_hong,
      doi_tuong: 'rental_contract',
      doi_tuong_id: paidRental.id,
      mo_ta: 'Hoa hong moi gioi tu hop dong thue mau'
    }
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
