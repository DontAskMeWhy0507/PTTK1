-- ============================================================================
-- PTTK: Seed Data for Testing
-- ============================================================================

USE pttk_rental_management;

-- Clear old data (optional, disable if not needed)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE users;
TRUNCATE TABLE chu_nha;
TRUNCATE TABLE khach_hang;
TRUNCATE TABLE nha_cho_thue;
TRUNCATE TABLE hop_dong_ky_gui;
TRUNCATE TABLE hop_dong_thue;
TRUNCATE TABLE lich_hen;
TRUNCATE TABLE lich_su_lam_viec;
TRUNCATE TABLE deposit_return_queue;
TRUNCATE TABLE hoa_hong_log;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- Seed: users
-- ============================================================================
-- PWD 'password123' hashed (demo hash)
INSERT INTO users (id, email, password_hash, phone_number, full_name, role, is_member, status) VALUES
('u-admin-001', 'admin@pttk.vn', '$2b$12$K1eYlY8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7', '0901234567', 'Hệ Thống Admin', 'admin', 0, 'active'),
('u-emp-001', 'nhanvien1@pttk.vn', '$2b$12$K1eYlY8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7', '0901112222', 'Nguyễn Văn Môi Giới', 'employee', 0, 'active'),
('u-emp-002', 'nhanvien2@pttk.vn', '$2b$12$K1eYlY8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7', '0903334444', 'Trần Thị Broker', 'employee', 0, 'active'),
('u-land-001', 'chunha1@gmail.com', '$2b$12$K1eYlY8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7', '0911111111', 'Ông Chủ Nhà Giàu', 'landlord', 0, 'active'),
('u-land-002', 'chunha2@gmail.com', '$2b$12$K1eYlY8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7', '0922222222', 'Bà Chủ Nhà Xinh', 'landlord', 0, 'active'),
('u-cust-001', 'khach1@gmail.com', '$2b$12$K1eYlY8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7', '0988888888', 'Anh Thuê Nhà', 'customer', 0, 'active'),
('u-cust-002', 'khach2@gmail.com', '$2b$12$K1eYlY8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7z8y7', '0977777777', 'Chị Thành Viên', 'customer', 1, 'active');

-- ============================================================================
-- Seed: Profiles
-- ============================================================================
INSERT INTO chu_nha (id, user_id, so_dien_thoai, dia_chi_lien_he, cccd_number, bank_account) VALUES
('cn-001', 'u-land-001', '0911111111', '123 Đường Láng, Hà Nội', '001090123456', 'VCB-00123456789'),
('cn-002', 'u-land-002', '0922222222', '456 Lê Lợi, TP.HCM', '002090654321', 'TCB-98765432100');

INSERT INTO khach_hang (id, user_id, nhan_vien_id, so_dien_thoai, dia_chi, cccd_number, la_thanh_vien) VALUES
('kh-001', 'u-cust-001', 'u-emp-001', '0988888888', '789 Giải Phóng, Hà Nội', '034090111222', 0),
('kh-002', 'u-cust-002', 'u-emp-002', '0977777777', '101 Cầu Giấy, Hà Nội', '035090333444', 1);

-- ============================================================================
-- Seed: nha_cho_thue
-- ============================================================================
INSERT INTO nha_cho_thue (id, chu_nha_id, loai_nha, dien_tich, huong_nha, so_luong_phong, dia_chi_chi_tiet, gia_de_xuat, hien_trang, hien_thi_chi_tiet) VALUES
('nha-001', 'cn-001', 'Căn hộ chung cư', 75.5, 'Đông Nam', 2, 'P1203, Tòa A1, Vinhomes Ocean Park', 12000000.00, 'Mới bàn giao, full nội thất', 1),
('nha-002', 'cn-001', 'Nhà riêng', 45.0, 'Nam', 3, 'Số 5, Ngõ 10, Trần Duy Hưng, Hà Nội', 15000000.00, 'Sạch sẽ, gần phố', 1),
('nha-003', 'cn-002', 'Studio', 30.0, 'Tây', 1, 'Tầng 5, Số 88 Lý Tự Trọng, Quận 1, TP.HCM', 8000000.00, 'Nội thất cơ bản', 0);

-- ============================================================================
-- Seed: hop_dong_ky_gui
-- ============================================================================
-- Nhà 1: Active
INSERT INTO hop_dong_ky_gui (id, nha_cho_thue_id, nhan_vien_id, ngay_ky, tien_dam_bao, trang_thai, thoi_han_thang, ngay_thanh_toan_dam_bao) VALUES
('hkg-001', 'nha-001', 'u-emp-001', '2026-01-01', 1000000.00, 'active', 6, '2026-01-02');

-- Nhà 2: Sắp hết hạn (giả lập ký từ 5 tháng trước)
INSERT INTO hop_dong_ky_gui (id, nha_cho_thue_id, nhan_vien_id, ngay_ky, tien_dam_bao, trang_thai, thoi_han_thang, ngay_thanh_toan_dam_bao) VALUES
('hkg-002', 'nha-002', 'u-emp-002', '2025-12-15', 1000000.00, 'active', 6, '2025-12-16');

-- Nhà 3: Đang chờ đóng tiền
INSERT INTO hop_dong_ky_gui (id, nha_cho_thue_id, nhan_vien_id, ngay_ky, tien_dam_bao, trang_thai, thoi_han_thang) VALUES
('hkg-003', 'nha-003', 'u-emp-001', '2026-05-20', 1000000.00, 'pending_deposit', 12);

-- ============================================================================
-- Seed: hop_dong_thue
-- ============================================================================
-- Khách 1 thuê Nhà 1
INSERT INTO hop_dong_thue (id, khach_hang_id, nha_cho_thue_id, nhan_vien_id, ngay_ky, gia_tri_hop_dong, phan_tram_hoa_hong, trang_thai, ngay_bat_dau, ngay_ket_thuc) VALUES
('hdt-001', 'kh-001', 'nha-001', 'u-emp-001', '2026-02-01', 12000000.00, 3.00, 'active', '2026-02-15', '2027-02-14');

-- ============================================================================
-- Seed: lich_hen
-- ============================================================================
INSERT INTO lich_hen (id, khach_hang_id, nha_cho_thue_id, nhan_vien_id, ngay_gio, trang_thai, ghi_chu) VALUES
('lh-001', 'kh-001', 'nha-001', 'u-emp-001', '2026-01-25 14:30:00', 'completed', 'Khách ưng nhà, chuẩn bị chốt'),
('lh-002', 'kh-002', 'nha-002', 'u-emp-002', '2026-06-05 09:00:00', 'pending', 'Khách muốn xem kỹ pháp lý');

-- ============================================================================
-- Seed: lich_su_lam_viec
-- ============================================================================
INSERT INTO lich_su_lam_viec (id, nhan_vien_id, khach_hang_id, ngay_gio, noi_dung_trao_doi, loai_trao_doi) VALUES
('ls-001', 'u-emp-001', 'kh-001', '2026-01-20 10:00:00', 'Gọi điện tư vấn chung cư Vinhomes', 'call'),
('ls-002', 'u-emp-001', 'kh-001', '2026-01-25 15:30:00', 'Dẫn khách đi xem nhà trực tiếp', 'site_visit');

-- ============================================================================
-- Seed: hoa_hong_log
-- ============================================================================
INSERT INTO hoa_hong_log (id, nhan_vien_id, hop_dong_thue_id, so_tien, loai, trang_thai) VALUES
('hh-001', 'u-emp-001', 'hdt-001', 360000.00, 'commission', 'earned');

-- ============================================================================
-- Finished seeding
-- ============================================================================
