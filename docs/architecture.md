Context

Du an: He thong quan ly ky gui va cho thue nha (PTTK).
Pham vi hien tai: ban demo full-stack dung React + Express + Sequelize + SQLite, bam theo nghiep vu chinh trong `claude.md`.

Quyet dinh kien truc hien tai

- Database: SQLite qua Sequelize, file du lieu nam tai `backend/database.sqlite`.
- Primary key: UUID `CHAR(36)` cho cac thuc the chinh.
- Authentication: JWT bearer token, mat khau bam bang `bcryptjs`.
- API style: REST duoi prefix `/api`.
- Background job: `node-cron` quet hop dong ky gui het han 6 thang moi ngay.
- Frontend: Vite + React Router, phan vai customer, employee, admin.

Thuc the dang co trong code

- `users`
- `nha_cho_thue`
- `hop_dong_ky_gui`
- `hop_dong_thue`
- `lich_hen`
- `hoa_hong`
- `lich_su_lam_viec`
- `hoan_tien`
- `contract_documents`

Luong nghiep vu da duoc noi trong code

- Khach hang tim nha, xem chi tiet theo phan quyen thanh vien, dat/doi/huy lich xem nha, xem lich hen va hop dong thue cua minh.
- Nhan vien tiep nhan nha ky gui, quan ly hien thi nha, xem danh sach lich hen, xac nhan hoac huy lich, ghi nhan lich su lam viec, tao hop dong thue, xem lai hop dong da chot va hoa hong.
- Admin quan ly nguoi dung va phan quyen customer/employee/admin.
- Neu hop dong ky gui da qua 6 thang va nha chua duoc thue thi he thong tao phieu hoan tien 1.000.000 VND khi co yeu cau huy.
- Khi nhan vien tao hop dong thue, he thong tinh hoa hong va tao dong khau tru tien dam bao 1.000.000 VND neu hop dong ky gui dang hieu luc.
- He thong ho tro tai len va tai xuong file hop dong cho ca hop dong ky gui va hop dong thue. Trong ban demo SQLite, file duoc luu bang base64 trong bang `contract_documents`.
- Seed data co san nhieu mau: can ho chung cu dang ky gui, nha rieng da cho thue, studio het han cho hoan tien, phong tro cho nop tien dam bao.

Rang buoc nghiep vu dang ap dung

- Tien dam bao mac dinh: `1_000_000` VND.
- Thoi han hop dong ky gui mac dinh: `6` thang.
- Khi hop dong ky gui duoc kich hoat, he thong tu tinh `ngay_het_han`.
- Khi tao hop dong thue, he thong tu tinh `tien_hoa_hong` tu `gia_tri_hop_dong` va `phan_tram_hoa_hong`.

How to validate

1. Chay `npm run seed` trong `backend` de reset SQLite va sinh du lieu mau.
2. Chay backend voi `PORT=3001 npm start` va frontend voi `npm run build` hoac `npm run dev`.
3. Dung cac tai khoan seed de kiem tra login, ky gui, dat lich, xu ly lich va xem hoa hong.
4. Neu can kiem tra job 6 thang, cap nhat `ngay_het_han` cua mot `hop_dong_ky_gui` ve ngay qua khu roi cho cron hoac goi truc tiep logic tuong ung.
