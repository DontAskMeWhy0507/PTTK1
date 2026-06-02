-- ============================================================================
-- PTTK: Hệ thống quản lý ký gửi và cho thuê nhà
-- Database: MySQL 8.0+
-- Encoding: utf8mb4
-- ============================================================================

-- Database setup
CREATE DATABASE IF NOT EXISTS pttk_rental_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pttk_rental_management;

-- ============================================================================
-- Table: users (tất cả user: ChuNha, KhachHang, NhanVien dùng chung)
-- ============================================================================
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email login',
  password_hash VARCHAR(255) NOT NULL COMMENT 'Bcrypt hash',
  phone_number VARCHAR(20) COMMENT 'SĐT',
  full_name VARCHAR(255) NOT NULL COMMENT 'Họ tên',
  role ENUM('landlord', 'customer', 'employee', 'admin') NOT NULL DEFAULT 'customer' COMMENT 'Vai trò',
  is_member TINYINT(1) DEFAULT 0 COMMENT 'Khách hàng: 0=guest, 1=member',
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active' COMMENT 'Trạng thái tài khoản',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Người dùng: Chủ nhà, Khách hàng, Nhân viên, Admin';

-- ============================================================================
-- Table: chu_nha (Chủ nhà)
-- ============================================================================
CREATE TABLE chu_nha (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  user_id CHAR(36) NOT NULL UNIQUE COMMENT 'FK -> users',
  so_dien_thoai VARCHAR(20) COMMENT 'SĐT liên hệ',
  dia_chi_lien_he VARCHAR(500) COMMENT 'Địa chỉ liên hệ',
  cccd_number VARCHAR(50) COMMENT 'Số CCCD',
  bank_account VARCHAR(100) COMMENT 'Tài khoản ngân hàng',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_chu_nha_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Thông tin Chủ nhà';

-- ============================================================================
-- Table: khach_hang (Khách hàng)
-- ============================================================================
CREATE TABLE khach_hang (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  user_id CHAR(36) NOT NULL UNIQUE COMMENT 'FK -> users',
  nhan_vien_id CHAR(36) COMMENT 'FK -> nhan_vien (Broker gán)',
  so_dien_thoai VARCHAR(20) COMMENT 'SĐT',
  dia_chi VARCHAR(500) COMMENT 'Địa chỉ',
  cccd_number VARCHAR(50) COMMENT 'Số CCCD',
  la_thanh_vien TINYINT(1) DEFAULT 0 COMMENT '0=Guest, 1=Member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_khach_hang_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_khach_hang_nhan_vien FOREIGN KEY (nhan_vien_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_la_thanh_vien (la_thanh_vien)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Thông tin Khách hàng';

-- ============================================================================
-- Table: nha_cho_thue (Nhà cho thuê)
-- ============================================================================
CREATE TABLE nha_cho_thue (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  chu_nha_id CHAR(36) NOT NULL COMMENT 'FK -> chu_nha',
  loai_nha VARCHAR(100) NOT NULL COMMENT 'Loại nhà (Phòng, Nhà riêng, Chung cư, ...)',
  dien_tich FLOAT COMMENT 'Diện tích (m2)',
  huong_nha VARCHAR(50) COMMENT 'Hướng nhà (Đông, Tây, Nam, Bắc, ...)',
  so_luong_phong INT COMMENT 'Số phòng ngủ',
  dia_chi_chi_tiet VARCHAR(500) NOT NULL COMMENT 'Địa chỉ chi tiết',
  gia_de_xuat DECIMAL(15, 2) COMMENT 'Giá đề xuất cho thuê',
  hien_trang VARCHAR(255) COMMENT 'Tình trạng nhà (Mới, Cũ, ...)',
  hien_thi_chi_tiet TINYINT(1) DEFAULT 0 COMMENT '0=Hidden, 1=Visible (search)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_nha_cho_thue_chu_nha FOREIGN KEY (chu_nha_id) REFERENCES chu_nha(id) ON DELETE CASCADE,
  INDEX idx_loai_nha (loai_nha),
  INDEX idx_dia_chi (dia_chi_chi_tiet(100)),
  INDEX idx_gia_de_xuat (gia_de_xuat),
  INDEX idx_hien_thi (hien_thi_chi_tiet)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Thông tin nhà cho thuê';

-- ============================================================================
-- Table: hop_dong_ky_gui (Hợp đồng ký gửi)
-- ============================================================================
CREATE TABLE hop_dong_ky_gui (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  nha_cho_thue_id CHAR(36) NOT NULL COMMENT 'FK -> nha_cho_thue',
  nhan_vien_id CHAR(36) COMMENT 'FK -> nhan_vien (Broker duyệt)',
  ngay_ky DATE COMMENT 'Ngày ký hợp đồng',
  tien_dam_bao DECIMAL(15, 2) DEFAULT 1000000.00 COMMENT 'Tiền đảm bảo (mặc định 1M VND)',
  trang_thai ENUM('draft', 'pending_deposit', 'active', 'terminated', 'cancelled') DEFAULT 'draft' COMMENT 'Trạng thái ký gửi',
  thoi_han_thang INT DEFAULT 6 COMMENT 'Thời hạn (tháng)',
  ngay_thanh_toan_dam_bao DATE COMMENT 'Ngày Chủ nhà nộp tiền đảm bảo',
  ngay_het_han DATE COMMENT 'Ngày hết hạn (compute: ngay_ky + thoi_han_thang)',
  ghi_chu TEXT COMMENT 'Ghi chú',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_hop_dong_ky_gui_nha FOREIGN KEY (nha_cho_thue_id) REFERENCES nha_cho_thue(id) ON DELETE CASCADE,
  CONSTRAINT fk_hop_dong_ky_gui_nhan_vien FOREIGN KEY (nhan_vien_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_trang_thai (trang_thai),
  INDEX idx_ngay_het_han (ngay_het_han),
  INDEX idx_nhan_vien_id (nhan_vien_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Hợp đồng ký gửi (Chủ nhà gửi nhà)';

-- ============================================================================
-- Table: hop_dong_thue (Hợp đồng cho thuê)
-- ============================================================================
CREATE TABLE hop_dong_thue (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  khach_hang_id CHAR(36) NOT NULL COMMENT 'FK -> khach_hang',
  nha_cho_thue_id CHAR(36) NOT NULL COMMENT 'FK -> nha_cho_thue',
  nhan_vien_id CHAR(36) NOT NULL COMMENT 'FK -> nhan_vien (Broker xử lý)',
  ngay_ky DATE COMMENT 'Ngày ký',
  gia_tri_hop_dong DECIMAL(15, 2) COMMENT 'Giá trị hợp đồng thuê',
  phan_tram_hoa_hong DECIMAL(5, 2) DEFAULT 3.00 COMMENT 'Phần trăm hoa hồng (%)',
  tien_hoa_hong DECIMAL(15, 2) COMMENT 'Tiền hoa hồng (auto-calc)',
  trang_thai ENUM('draft', 'pending_sign', 'active', 'completed', 'cancelled') DEFAULT 'draft' COMMENT 'Trạng thái',
  ngay_bat_dau DATE COMMENT 'Ngày bắt đầu thuê',
  ngay_ket_thuc DATE COMMENT 'Ngày kết thúc thuê',
  ghi_chu TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_hop_dong_thue_khach FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE,
  CONSTRAINT fk_hop_dong_thue_nha FOREIGN KEY (nha_cho_thue_id) REFERENCES nha_cho_thue(id) ON DELETE CASCADE,
  CONSTRAINT fk_hop_dong_thue_nhan_vien FOREIGN KEY (nhan_vien_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_trang_thai (trang_thai),
  INDEX idx_ngay_bat_dau (ngay_bat_dau),
  INDEX idx_nhan_vien_id (nhan_vien_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Hợp đồng cho thuê (Khách hàng thuê nhà)';

-- ============================================================================
-- Table: lich_hen (Lịch hẹn xem nhà)
-- ============================================================================
CREATE TABLE lich_hen (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  khach_hang_id CHAR(36) NOT NULL COMMENT 'FK -> khach_hang',
  nha_cho_thue_id CHAR(36) NOT NULL COMMENT 'FK -> nha_cho_thue',
  nhan_vien_id CHAR(36) COMMENT 'FK -> nhan_vien (Broker chốt lịch)',
  ngay_gio DATETIME NOT NULL COMMENT 'Ngày giờ hẹn',
  trang_thai ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'pending' COMMENT 'Trạng thái lịch hẹn',
  ghi_chu VARCHAR(500) COMMENT 'Ghi chú',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_lich_hen_khach FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE,
  CONSTRAINT fk_lich_hen_nha FOREIGN KEY (nha_cho_thue_id) REFERENCES nha_cho_thue(id) ON DELETE CASCADE,
  CONSTRAINT fk_lich_hen_nhan_vien FOREIGN KEY (nhan_vien_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_trang_thai (trang_thai),
  INDEX idx_ngay_gio (ngay_gio),
  INDEX idx_nhan_vien_id (nhan_vien_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lịch hẹn xem nhà';

-- ============================================================================
-- Table: lich_su_lam_viec (Lịch sử làm việc / Interaction log)
-- ============================================================================
CREATE TABLE lich_su_lam_viec (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  nhan_vien_id CHAR(36) NOT NULL COMMENT 'FK -> nhan_vien',
  khach_hang_id CHAR(36) NOT NULL COMMENT 'FK -> khach_hang',
  ngay_gio DATETIME NOT NULL COMMENT 'Ngày giờ làm việc',
  noi_dung_trao_doi TEXT COMMENT 'Nội dung trao đổi / ghi chú',
  loai_trao_doi ENUM('call', 'meeting', 'email', 'chat', 'site_visit', 'document_review') DEFAULT 'call' COMMENT 'Loại trao đổi',
  ghi_chu VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_lich_su_nhan_vien FOREIGN KEY (nhan_vien_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_lich_su_khach_hang FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE,
  INDEX idx_nhan_vien_id (nhan_vien_id),
  INDEX idx_khach_hang_id (khach_hang_id),
  INDEX idx_ngay_gio (ngay_gio),
  INDEX idx_loai_trao_doi (loai_trao_doi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lịch sử tương tác Nhân viên - Khách hàng';

-- ============================================================================
-- Table: deposit_return_queue (Hàng chờ hoàn tiền / khấu trừ hoa hồng)
-- ============================================================================
CREATE TABLE deposit_return_queue (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  hop_dong_ky_gui_id CHAR(36) NOT NULL COMMENT 'FK -> hop_dong_ky_gui',
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending' COMMENT 'Trạng thái xử lý',
  action_type ENUM('return_full', 'deduct_commission', 'return_partial') DEFAULT 'return_full' COMMENT 'Loại hành động',
  return_amount DECIMAL(15, 2) COMMENT 'Số tiền cần hoàn',
  deduct_amount DECIMAL(15, 2) COMMENT 'Số tiền khấu trừ hoa hồng',
  triggered_date DATE COMMENT 'Ngày bộ lọc phát hiện hết hạn',
  processed_date DATETIME COMMENT 'Ngày xử lý',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_return_queue_hop_dong FOREIGN KEY (hop_dong_ky_gui_id) REFERENCES hop_dong_ky_gui(id) ON DELETE CASCADE,
  INDEX idx_status (status),
  INDEX idx_triggered_date (triggered_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Hàng chờ hoàn tiền (tự động trigger sau 6 tháng)';

-- ============================================================================
-- Table: hoa_hong_log (Lịch sử hoa hồng)
-- ============================================================================
CREATE TABLE hoa_hong_log (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  nhan_vien_id CHAR(36) NOT NULL COMMENT 'FK -> nhan_vien',
  hop_dong_thue_id CHAR(36) COMMENT 'FK -> hop_dong_thue',
  deposit_return_queue_id CHAR(36) COMMENT 'FK -> deposit_return_queue (nếu khấu trừ)',
  so_tien DECIMAL(15, 2) NOT NULL COMMENT 'Số tiền hoa hồng',
  loai ENUM('commission', 'deduction') DEFAULT 'commission' COMMENT 'Loại (thêm/khấu)',
  trang_thai ENUM('earned', 'pending', 'confirmed', 'paid') DEFAULT 'earned' COMMENT 'Trạng thái thanh toán',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_hoa_hong_nhan_vien FOREIGN KEY (nhan_vien_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_hoa_hong_hop_dong FOREIGN KEY (hop_dong_thue_id) REFERENCES hop_dong_thue(id) ON DELETE SET NULL,
  CONSTRAINT fk_hoa_hong_return_queue FOREIGN KEY (deposit_return_queue_id) REFERENCES deposit_return_queue(id) ON DELETE SET NULL,
  INDEX idx_nhan_vien_id (nhan_vien_id),
  INDEX idx_trang_thai (trang_thai),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lịch sử hoa hồng';

-- ============================================================================
-- Table: auth_tokens (JWT token blacklist / refresh tokens)
-- ============================================================================
CREATE TABLE auth_tokens (
  id CHAR(36) PRIMARY KEY COMMENT 'UUID',
  user_id CHAR(36) NOT NULL COMMENT 'FK -> users',
  token_jti VARCHAR(500) NOT NULL UNIQUE COMMENT 'JWT JTI claim (unique token ID)',
  token_type ENUM('access', 'refresh') DEFAULT 'access' COMMENT 'Loại token',
  expires_at DATETIME NOT NULL COMMENT 'Hạn token',
  revoked_at DATETIME COMMENT 'Ngày revoke (NULL nếu không revoke)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_auth_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at),
  INDEX idx_revoked_at (revoked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='JWT token tracking (blacklist/refresh management)';

-- ============================================================================
-- Views & Computed columns (optional)
-- ============================================================================

-- View: Thông tin hợp đồng ký gửi với người dùng và nhà
CREATE VIEW v_hop_dong_ky_gui_detail AS
SELECT
  hkg.id,
  hkg.ngay_ky,
  hkg.trang_thai,
  hkg.tien_dam_bao,
  hkg.thoi_han_thang,
  hkg.ngay_het_han,
  nha.id AS nha_id,
  nha.loai_nha,
  nha.dia_chi_chi_tiet,
  chu.id AS chu_nha_id,
  u_chu.full_name AS chu_nha_name,
  u_chu.email AS chu_nha_email,
  nv.id AS nhan_vien_id,
  u_nv.full_name AS nhan_vien_name
FROM hop_dong_ky_gui hkg
LEFT JOIN nha_cho_thue nha ON hkg.nha_cho_thue_id = nha.id
LEFT JOIN chu_nha chu ON nha.chu_nha_id = chu.id
LEFT JOIN users u_chu ON chu.user_id = u_chu.id
LEFT JOIN users nv ON hkg.nhan_vien_id = nv.id
LEFT JOIN users u_nv ON nv.id = u_nv.id;

-- View: Thông tin hợp đồng thuê với chi tiết
CREATE VIEW v_hop_dong_thue_detail AS
SELECT
  hdt.id,
  hdt.ngay_ky,
  hdt.trang_thai,
  hdt.gia_tri_hop_dong,
  hdt.phan_tram_hoa_hong,
  hdt.tien_hoa_hong,
  hdt.ngay_bat_dau,
  hdt.ngay_ket_thuc,
  khach.id AS khach_hang_id,
  u_khach.full_name AS khach_hang_name,
  u_khach.email AS khach_hang_email,
  nha.id AS nha_id,
  nha.dia_chi_chi_tiet,
  nha.gia_de_xuat,
  nv.id AS nhan_vien_id,
  u_nv.full_name AS nhan_vien_name
FROM hop_dong_thue hdt
LEFT JOIN khach_hang khach ON hdt.khach_hang_id = khach.id
LEFT JOIN users u_khach ON khach.user_id = u_khach.id
LEFT JOIN nha_cho_thue nha ON hdt.nha_cho_thue_id = nha.id
LEFT JOIN users nv ON hdt.nhan_vien_id = nv.id
LEFT JOIN users u_nv ON nv.id = u_nv.id;

-- ============================================================================
-- Triggers (optional - auto-compute ngay_het_han)
-- ============================================================================

DELIMITER //

CREATE TRIGGER trg_hop_dong_ky_gui_insert
BEFORE INSERT ON hop_dong_ky_gui
FOR EACH ROW
BEGIN
  IF NEW.ngay_ky IS NOT NULL AND NEW.thoi_han_thang IS NOT NULL THEN
    SET NEW.ngay_het_han = DATE_ADD(NEW.ngay_ky, INTERVAL NEW.thoi_han_thang MONTH);
  END IF;
END //

CREATE TRIGGER trg_hop_dong_ky_gui_update
BEFORE UPDATE ON hop_dong_ky_gui
FOR EACH ROW
BEGIN
  IF (NEW.ngay_ky <> OLD.ngay_ky OR NEW.thoi_han_thang <> OLD.thoi_han_thang) THEN
    IF NEW.ngay_ky IS NOT NULL AND NEW.thoi_han_thang IS NOT NULL THEN
      SET NEW.ngay_het_han = DATE_ADD(NEW.ngay_ky, INTERVAL NEW.thoi_han_thang MONTH);
    END IF;
  END IF;
END //

-- Auto-compute hoa hồng khi tạo hợp đồng thuê
CREATE TRIGGER trg_hop_dong_thue_insert
BEFORE INSERT ON hop_dong_thue
FOR EACH ROW
BEGIN
  IF NEW.gia_tri_hop_dong IS NOT NULL AND NEW.phan_tram_hoa_hong IS NOT NULL THEN
    SET NEW.tien_hoa_hong = (NEW.gia_tri_hop_dong * NEW.phan_tram_hoa_hong) / 100;
  END IF;
END //

CREATE TRIGGER trg_hop_dong_thue_update
BEFORE UPDATE ON hop_dong_thue
FOR EACH ROW
BEGIN
  IF (NEW.gia_tri_hop_dong <> OLD.gia_tri_hop_dong OR NEW.phan_tram_hoa_hong <> OLD.phan_tram_hoa_hong) THEN
    IF NEW.gia_tri_hop_dong IS NOT NULL AND NEW.phan_tram_hoa_hong IS NOT NULL THEN
      SET NEW.tien_hoa_hong = (NEW.gia_tri_hop_dong * NEW.phan_tram_hoa_hong) / 100;
    END IF;
  END IF;
END //

DELIMITER ;

-- ============================================================================
-- Permissions / Roles (basic - adapt as needed)
-- ============================================================================

-- Create app user (não dùng root)
-- GRANT ALL PRIVILEGES ON pttk_rental_management.* TO 'pttk_app'@'localhost' IDENTIFIED BY 'strong_password_here';

-- ============================================================================
-- End of schema
-- ============================================================================
