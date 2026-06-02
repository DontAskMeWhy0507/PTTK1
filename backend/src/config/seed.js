require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
require('../models');
const {
  Appointment,
  Commission,
  ContractDocument,
  DepositContract,
  Interaction,
  Property,
  Refund,
  RentalContract,
  User
} = require('../models');

const today = new Date().toISOString().split('T')[0];

const textDocument = (text) => Buffer.from(text, 'utf8').toString('base64');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('--- Database created ---');

  const hash = await bcrypt.hash('123456', 10);

  const users = await User.bulkCreate([
    { email: 'admin@pttk.vn', password_hash: hash, full_name: 'Admin He Thong', role: 'admin', phone_number: '0900000000', status: 'active' },
    { email: 'nhanvien1@pttk.vn', password_hash: hash, full_name: 'Nguyen Van Moi Gioi', role: 'employee', phone_number: '0901112222', status: 'active' },
    { email: 'nhanvien2@pttk.vn', password_hash: hash, full_name: 'Tran Thi Broker', role: 'employee', phone_number: '0903334444', status: 'active' },
    { email: 'khachchunha1@gmail.com', password_hash: hash, full_name: 'Khach Ky Gui 1', role: 'customer', phone_number: '0911111111', status: 'active' },
    { email: 'khachchunha2@gmail.com', password_hash: hash, full_name: 'Khach Ky Gui 2', role: 'customer', phone_number: '0922222222', status: 'active' },
    { email: 'khach1@gmail.com', password_hash: hash, full_name: 'Anh Thue Nha', role: 'customer', phone_number: '0988888888', status: 'active' },
    { email: 'khach2@gmail.com', password_hash: hash, full_name: 'Chi Thanh Vien', role: 'customer', phone_number: '0977777777', status: 'active' }
  ], { returning: true });

  const employee = users.find((user) => user.email === 'nhanvien1@pttk.vn');
  const employee2 = users.find((user) => user.email === 'nhanvien2@pttk.vn');
  const landlord = users.find((user) => user.email === 'khachchunha1@gmail.com');
  const landlord2 = users.find((user) => user.email === 'khachchunha2@gmail.com');
  const customer = users.find((user) => user.email === 'khach1@gmail.com');
  const customer2 = users.find((user) => user.email === 'khach2@gmail.com');

  const properties = await Property.bulkCreate([
    {
      chu_nha_id: landlord.id,
      loai_nha: 'Can ho chung cu',
      dien_tich: 72,
      huong_nha: 'Dong Nam',
      so_luong_phong: 2,
      dia_chi_chi_tiet: '123 Nguyen Trai, Quan 1, TP.HCM',
      gia_de_xuat: 15000000,
      hien_trang: 'Full noi that',
      hien_thi_chi_tiet: true
    },
    {
      chu_nha_id: landlord.id,
      loai_nha: 'Nha rieng',
      dien_tich: 96,
      huong_nha: 'Nam',
      so_luong_phong: 3,
      dia_chi_chi_tiet: '44 Le Van Sy, Quan 3, TP.HCM',
      gia_de_xuat: 22000000,
      hien_trang: 'Moi son sua',
      hien_thi_chi_tiet: true
    },
    {
      chu_nha_id: landlord2.id,
      loai_nha: 'Studio',
      dien_tich: 34,
      huong_nha: 'Bac',
      so_luong_phong: 1,
      dia_chi_chi_tiet: '9 Nguyen Hue, Quan 1, TP.HCM',
      gia_de_xuat: 9500000,
      hien_trang: 'Can trong, co bep rieng',
      hien_thi_chi_tiet: false
    },
    {
      chu_nha_id: landlord.id,
      loai_nha: 'Phong tro',
      dien_tich: 24,
      huong_nha: 'Tay',
      so_luong_phong: 1,
      dia_chi_chi_tiet: '88 Phan Xich Long, Phu Nhuan, TP.HCM',
      gia_de_xuat: 5200000,
      hien_trang: 'Dang cho nop tien dam bao',
      hien_thi_chi_tiet: false
    }
  ], { returning: true });

  const [condo, house, studio, room] = properties;

  const activeDeposit = await DepositContract.create({
    nha_cho_thue_id: condo.id,
    nhan_vien_id: employee.id,
    ngay_ky: today,
    tien_dam_bao: 1000000,
    trang_thai: 'active',
    thoi_han_thang: 6,
    ngay_thanh_toan_dam_bao: today
  });

  const rentedDeposit = await DepositContract.create({
    nha_cho_thue_id: house.id,
    nhan_vien_id: employee.id,
    ngay_ky: today,
    tien_dam_bao: 1000000,
    trang_thai: 'terminated',
    thoi_han_thang: 6,
    ngay_thanh_toan_dam_bao: today,
    ghi_chu: 'Nha da duoc thue, tien dam bao da khau tru vao hoa hong'
  });

  const expiredDeposit = await DepositContract.create({
    nha_cho_thue_id: studio.id,
    nhan_vien_id: employee2.id,
    ngay_ky: '2025-06-01',
    tien_dam_bao: 1000000,
    trang_thai: 'cancelled',
    thoi_han_thang: 6,
    ngay_thanh_toan_dam_bao: '2025-06-01',
    ghi_chu: 'Qua 6 thang chua co khach thue, dang cho hoan tien'
  });

  await expiredDeposit.update({ ngay_het_han: '2025-12-01' });

  const pendingDeposit = await DepositContract.create({
    nha_cho_thue_id: room.id,
    trang_thai: 'pending_deposit',
    tien_dam_bao: 1000000,
    thoi_han_thang: 6,
    ghi_chu: 'Chu nha chua nop tien dam bao'
  });

  const rentalContract = await RentalContract.create({
    khach_hang_id: customer.id,
    nha_cho_thue_id: house.id,
    nhan_vien_id: employee.id,
    ngay_ky: today,
    gia_tri_hop_dong: 264000000,
    phan_tram_hoa_hong: 3,
    trang_thai: 'active',
    ngay_bat_dau: today,
    ngay_ket_thuc: '2027-06-02'
  });

  await Commission.bulkCreate([
    {
      nhan_vien_id: employee.id,
      hop_dong_thue_id: rentalContract.id,
      so_tien: rentalContract.tien_hoa_hong,
      loai: 'commission',
      trang_thai: 'earned'
    },
    {
      nhan_vien_id: employee.id,
      hop_dong_thue_id: rentalContract.id,
      so_tien: 1000000,
      loai: 'deduction',
      trang_thai: 'earned'
    }
  ]);

  await Refund.create({
    hop_dong_ky_gui_id: expiredDeposit.id,
    ngay_yeu_cau: today,
    so_tien_hoan: 1000000,
    trang_thai: 'pending',
    ghi_chu: 'Hoan tien do het han 6 thang va chua cho thue duoc'
  });

  const appointment = await Appointment.create({
    khach_hang_id: customer.id,
    nha_cho_thue_id: condo.id,
    nhan_vien_id: employee.id,
    ngay_gio: new Date(Date.now() + 24 * 60 * 60 * 1000),
    ghi_chu: 'Khach muon xem can ho buoi chieu',
    trang_thai: 'pending'
  });

  await Appointment.create({
    khach_hang_id: customer2.id,
    nha_cho_thue_id: condo.id,
    nhan_vien_id: employee.id,
    ngay_gio: new Date(Date.now() + 48 * 60 * 60 * 1000),
    ghi_chu: 'Khach muon xem nha vao cuoi tuan',
    trang_thai: 'confirmed'
  });

  await Interaction.bulkCreate([
    {
      nhan_vien_id: employee.id,
      khach_hang_id: customer.id,
      nha_cho_thue_id: house.id,
      ngay_gio: new Date(),
      noi_dung_trao_doi: 'Da dan khach di xem nha va chot hop dong thue',
      loai_trao_doi: 'site_visit'
    },
    {
      nhan_vien_id: employee.id,
      khach_hang_id: customer2.id,
      nha_cho_thue_id: condo.id,
      ngay_gio: new Date(),
      noi_dung_trao_doi: 'Da goi xac nhan lich xem can ho',
      loai_trao_doi: 'call'
    }
  ]);

  const depositText = textDocument('Hop dong ky gui mau - Can ho chung cu - tien dam bao 1.000.000 VND');
  const rentalText = textDocument('Hop dong thue mau - Nha rieng - gia tri 264.000.000 VND');

  await ContractDocument.bulkCreate([
    {
      loai_hop_dong: 'deposit',
      hop_dong_id: activeDeposit.id,
      nguoi_tai_len_id: employee.id,
      ten_file: 'hop-dong-ky-gui-can-ho.txt',
      mime_type: 'text/plain',
      kich_thuoc: Buffer.byteLength(depositText, 'base64'),
      noi_dung_base64: depositText
    },
    {
      loai_hop_dong: 'rental',
      hop_dong_id: rentalContract.id,
      nguoi_tai_len_id: employee.id,
      ten_file: 'hop-dong-thue-nha-rieng.txt',
      mime_type: 'text/plain',
      kich_thuoc: Buffer.byteLength(rentalText, 'base64'),
      noi_dung_base64: rentalText
    }
  ]);

  console.log('--- Seed data created ---');
  console.log(`Sample active deposit contract: ${activeDeposit.id}`);
  console.log(`Sample rented deposit contract: ${rentedDeposit.id}`);
  console.log(`Sample expired deposit contract: ${expiredDeposit.id}`);
  console.log(`Sample pending deposit contract: ${pendingDeposit.id}`);
  console.log(`Sample rental contract: ${rentalContract.id}`);
  console.log(`Sample appointment: ${appointment.id}`);
  console.log('All accounts password: 123456');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
