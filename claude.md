# ĐỀ 3: PHẦN MỀM QUẢN LÝ KÝ GỬI VÀ CHO THUÊ NHÀ TẠI HÀ NỘI

## THÔNG TIN NGHIỆP VỤ GỐC

* **Bối cảnh:** Một đại lý ký gửi nhà cho thuê trong thành phố Hà Nội cần xây dựng phần mềm hỗ trợ quản lý.


* **Yêu cầu thông tin nhà ký gửi:** Loại nhà (căn hộ, nhà riêng, biệt thự, ki-ốt...), diện tích, hướng nhà, số lượng phòng, địa chỉ chi tiết, mức giá đề xuất, thông tin liên hệ của chủ nhà.


* **Quy trình ký kết:** Nhân viên liên hệ $\rightarrow$ sắp xếp lịch gặp $\rightarrow$ đánh giá hiện trạng nhà $\rightarrow$ thống nhất điều khoản theo mẫu đại lý $\rightarrow$ ký hợp đồng ký gửi. Nếu có điều khoản phát sinh, bộ phận tư vấn pháp luật xem xét quyết định.


* **Hiển thị thông tin:** Chỉ hiển thị sau khi ký hợp đồng. Khách hàng thành viên xem thông tin chi tiết; khách chưa đăng ký thành viên chỉ xem được nội dung tóm tắt.


* **Môi giới & Hoa hồng:** Mỗi môi giới phụ trách một nhóm khách hàng, dẫn khách đi xem thực địa, trao đổi và chốt hợp đồng. Hoa hồng tính theo % trên hợp đồng ký được. Phải lưu lại lịch sử làm việc với khách hàng.


* **Tiền đảm bảo:** Khách ký gửi đóng khoản tiền đảm bảo là **1.000.000 VNĐ**. Khoản này sẽ được trừ vào tiền hoa hồng sau khi sản phẩm đã được thuê. Sau **6 tháng** nếu không có khách thuê, tiền đảm bảo được hoàn trả nếu khách có yêu cầu và hợp đồng ký gửi chấm dứt.



---

# CHƯƠNG I. TỔNG QUAN DỰ ÁN

### 1.1 Giới thiệu bài toán

Trong những năm gần đây, nhu cầu thuê nhà ở, căn hộ, biệt thự và các loại hình bất động sản khác tại các thành phố lớn ngày càng tăng. Các công ty môi giới và đại lý ký gửi bất động sản đóng vai trò trung gian kết nối giữa chủ nhà và khách hàng có nhu cầu thuê nhà.

Hiện nay, phần lớn các hoạt động quản lý ký gửi vẫn được thực hiện thủ công thông qua hồ sơ giấy tờ, bảng tính hoặc các công cụ quản lý rời rạc. Điều này dẫn đến nhiều khó khăn như:

* Khó quản lý số lượng lớn bất động sản ký gửi.


* Dễ xảy ra sai sót trong quá trình lưu trữ thông tin.


* Khó theo dõi trạng thái hợp đồng ký gửi và hợp đồng thuê.


* Quản lý lịch hẹn khách hàng chưa hiệu quả.


* Khó kiểm soát hoa hồng của nhân viên môi giới.


* Mất nhiều thời gian xử lý các thủ tục hoàn tiền và chấm dứt hợp đồng.



Xuất phát từ những vấn đề trên, việc xây dựng hệ thống quản lý ký gửi và cho thuê bất động sản là cần thiết nhằm hỗ trợ tự động hóa quy trình nghiệp vụ và nâng cao hiệu quả hoạt động của doanh nghiệp.

### 1.2 Mục tiêu xây dựng hệ thống

Hệ thống được xây dựng nhằm các mục tiêu sau:

* Quản lý tập trung toàn bộ thông tin nhà ký gửi.


* Hỗ trợ quy trình ký gửi và cho thuê bất động sản.


* Quản lý hợp đồng ký gửi và hợp đồng thuê.


* Hỗ trợ khách hàng tìm kiếm và xem thông tin bất động sản.


* Quản lý lịch hẹn xem nhà giữa khách hàng và nhân viên môi giới.


* Theo dõi lịch sử làm việc với khách hàng.


* Tự động tính toán và quản lý hoa hồng nhân viên.


* Theo dõi khoản tiền đảm bảo của chủ nhà.


* Hỗ trợ xử lý hoàn tiền và chấm dứt hợp đồng khi hết thời hạn ký gửi.



### 1.3 Phạm vi hệ thống

Hệ thống tập trung quản lý các nghiệp vụ:

* Đăng ký và quản lý tài khoản người dùng.


* Quản lý bất động sản ký gửi.


* Quản lý hợp đồng ký gửi.


* Quản lý hợp đồng thuê.


* Quản lý lịch hẹn xem nhà.


* Quản lý lịch sử làm việc.


* Quản lý hoa hồng môi giới.


* Quản lý hoàn tiền đảm bảo.



### 1.4 Đối tượng sử dụng

* **Chủ nhà:** Là người sở hữu bất động sản và có nhu cầu ký gửi cho thuê thông qua công ty môi giới.


* **Khách hàng:** Là người có nhu cầu tìm kiếm và thuê bất động sản.


* **Nhân viên:** Là nhân viên môi giới hoặc nhân viên pháp lý của công ty, chịu trách nhiệm tiếp nhận hồ sơ, xử lý nghiệp vụ và hỗ trợ khách hàng.



### 1.5 Mô tả quy trình nghiệp vụ tổng quát

1. Chủ nhà gửi thông tin ký gửi bất động sản.


2. Chủ nhà nộp tiền đảm bảo theo quy định.


3. Nhân viên tiếp nhận và đánh giá hiện trạng bất động sản.


4. Trường hợp cần thiết (có điều khoản phát sinh) sẽ thực hiện thẩm định pháp lý.


5. Hai bên ký hợp đồng ký gửi.


6. Thông tin bất động sản được công khai trên hệ thống (Phân quyền xem theo loại thành viên).


7. Khách hàng tìm kiếm và xem thông tin nhà.


8. Khách hàng đặt lịch xem nhà.


9. Nhân viên môi giới đưa khách đi xem thực tế (thực địa).


10. Hai bên thống nhất và ký hợp đồng thuê.


11. Hệ thống tự động tính hoa hồng cho nhân viên môi giới và khấu trừ tiền đảm bảo.


12. Nếu sau 6 tháng không cho thuê được, chủ nhà có quyền yêu cầu chấm dứt hợp đồng và nhận lại tiền đảm bảo.



---

# CHƯƠNG II. PHÂN TÍCH YÊU CẦU VÀ SƠ ĐỒ PHÂN RÃ CHỨC NĂNG

### 2.1 Phân tích yêu cầu chức năng

#### 2.1.1 Nhóm chức năng hệ thống (Dùng chung)

* **Đăng ký tài khoản:** Cho phép người dùng tạo tài khoản mới để sử dụng các chức năng của hệ thống.


* **Đăng nhập / Đăng xuất:** Cho phép người dùng truy cập hoặc kết thúc phiên làm việc an toàn.


* **Phân quyền người dùng:** Hệ thống xác định quyền truy cập tương ứng với từng vai trò (Chủ nhà, Khách hàng, Môi giới, Pháp lý).



#### 2.1.2 Nhóm chức năng của chủ nhà

* **Gửi thông tin ký gửi:** Chủ nhà khai báo thông tin bất động sản cần cho thuê.


* **Nộp tiền đảm bảo:** Thực hiện thanh toán khoản tiền đảm bảo 1.000.000 VNĐ theo quy định.


* **Quản lý hợp đồng ký gửi:** Theo dõi tình trạng và nội dung hợp đồng ký gửi.


* **Hủy hợp đồng ký gửi:** Yêu cầu chấm dứt hợp đồng trước hoặc sau thời hạn.


* **Theo dõi hoàn tiền:** Kiểm tra trạng thái hoàn trả khoản tiền đảm bảo.



#### 2.1.3 Nhóm chức năng của khách hàng

* **Tìm kiếm nhà:** Tìm kiếm bất động sản theo nhiều tiêu chí (loại nhà, diện tích, giá, hướng...).


* **Xem thông tin nhà:** Xem mô tả, hình ảnh (Xem tóm tắt nếu là khách thường, xem chi tiết nếu là thành viên).


* **Quản lý lịch hẹn:** Đặt lịch xem nhà, Đổi lịch xem nhà, Hủy lịch xem nhà.


* **Xem hợp đồng thuê:** Tra cứu thông tin hợp đồng thuê đã ký.



#### 2.1.4 Nhóm chức năng của nhân viên

* **Tiếp nhận nhà ký gửi:** Tiếp nhận hồ sơ ký gửi ban đầu từ chủ nhà.


* **Cập nhật thông tin nhà:** Cập nhật hiện trạng thực tế và thông tin bất động sản sau khi khảo sát.


* **Quản lý pháp lý:** Kiểm tra hồ sơ pháp lý, phê duyệt các điều khoản phát sinh.


* **Quản lý lịch hẹn khách hàng:** Điều phối, xác nhận lịch xem nhà thực địa.


* **Quản lý hợp đồng:** Quản lý, lập hợp đồng ký gửi và hợp đồng thuê.


* **Quản lý lịch sử làm việc:** Ghi nhận quá trình tương tác, dẫn khách đi xem nhà.


* **Theo dõi hoa hồng:** Theo dõi doanh thu hoa hồng và các khoản khấu trừ.



### 2.2 Mô tả sơ đồ phân rã chức năng (FDD)

Sơ đồ phân rã chức năng (Functional Decomposition Diagram - FDD) mô tả hệ thống theo cấu trúc phân cấp từ tổng quát đến chi tiết.

* **Mức gốc (Mức tổng quát):** "Hệ thống quản lý ký gửi và cho thuê bất động sản".


* **Mức 1 (Bốn nhóm chức năng chính):** Chức năng hệ thống (dùng chung), Chức năng của chủ nhà, Chức năng của khách hàng, Chức năng của nhân viên.


* **Mức 2 (Các chức năng con cụ thể):** Phân rã chi tiết từ mức 1 phục vụ cho từng đối tượng sử dụng riêng biệt.



---

# CHƯƠNG III. MÔ TẢ CHI TIẾT BIỂU ĐỒ USE CASE

### 3.1 Các tác nhân của hệ thống (Actors)

* **Người dùng (Actor tổng quát):** Được kế thừa bởi Chủ nhà và Khách hàng. Chức năng: Đăng ký tài khoản, Đăng nhập, Đăng xuất.


* **Chủ nhà:** Thực hiện gửi thông tin ký gửi, Nộp tiền đảm bảo, Quản lý hợp đồng ký gửi, Hủy hợp đồng ký gửi, Theo dõi hoàn tiền.


* **Khách hàng:** Thực hiện xem thông tin nhà (theo phân quyền), Đặt lịch xem nhà, Thay đổi/Hủy lịch xem nhà, Xem hợp đồng thuê.


* **Nhân viên:** Thực hiện tiếp nhận nhà ký gửi, Quản lý pháp lý, Cập nhật thông tin nhà, Quản lý lịch hẹn, Quản lý lịch sử làm việc, Quản lý hợp đồng, Theo dõi hoa hồng.



### 3.2 Mô tả quan hệ giữa các Use Case

* **Mối quan hệ Include (Bắt buộc):**
* `Gửi thông tin ký gửi` $\ll\text{include}\gg$ `Nộp tiền đảm bảo`: Yêu cầu nộp tiền đảm bảo để hoàn tất hồ sơ ký gửi.


* `Quản lý hợp đồng` $\ll\text{include}\gg$ `Tính và theo dõi hoa hồng`: Tự động tính toán hoa hồng ngay khi chốt hợp đồng thuê.




* **Mối quan hệ Extend (Mở rộng/Tùy chọn):**
* `Quản lý hợp đồng ký gửi` $\ll\text{extend}\gg$ `Hủy hợp đồng ký gửi`: Kích hoạt khi chủ nhà muốn chấm dứt hợp đồng.


* `Hủy hợp đồng ký gửi` $\ll\text{extend}\gg$ `Theo dõi hoàn tiền`: Xuất hiện khi hợp đồng hủy thỏa mãn điều kiện hoàn tiền.


* `Đặt lịch xem nhà` $\ll\text{extend}\gg$ `Thay đổi hoặc hủy lịch xem nhà`: Thực hiện khi khách hàng phát sinh nhu cầu đổi/hủy.


* `Tiếp nhận nhà ký gửi` $\ll\text{extend}\gg$ `Quản lý pháp lý`: Chỉ kích hoạt khi xuất hiện điều khoản phát sinh cần bộ phận pháp luật duyệt.





### 3.3 Đánh giá biểu đồ Use Case

Biểu đồ Use Case đã mô tả đầy đủ các chức năng nghiệp vụ chính của hệ thống từ khâu tiếp nhận bất động sản ký gửi, xử lý hồ sơ, quản lý pháp lý, quảng bá thông tin nhà, tổ chức xem nhà, ký kết hợp đồng thuê cho đến tính toán hoa hồng và hoàn trả tiền đảm bảo. Các quan hệ phụ thuộc thể hiện chính xác quy trình vận hành thực tế của đại lý bất động sản.

---

# CHƯƠNG IV. MÔ TẢ CHI TIẾT SƠ ĐỒ LUỒNG DỮ LIỆU (DFD)

### 4.1 Sơ đồ ngữ cảnh (DFD Context)

Hệ thống tương tác trực tiếp với 3 tác nhân bên ngoài:

1. **Chủ nhà:**
* *Dữ liệu gửi vào:* Thông tin nhà & thông tin liên hệ, Trạng thái thanh toán tiền đảm bảo, Yêu cầu hủy hợp đồng.


* *Dữ liệu nhận về:* Thông tin hợp đồng ký gửi, Trạng thái hoàn tiền đảm bảo.




2. **Khách hàng:**
* *Dữ liệu gửi vào:* Yêu cầu xem nhà, Yêu cầu đổi/hủy lịch hẹn.


* *Dữ liệu nhận về:* Mô tả/Thông tin nhà (Tóm tắt/Chi tiết), Thông tin hợp đồng cho thuê, Lịch hẹn xem nhà.




3. **Nhân viên:**
* *Dữ liệu gửi vào:* Thông tin nhà được cập nhật (hiện trạng), Lịch sử làm việc, Hợp đồng, Trạng thái pháp lý.


* *Dữ liệu nhận về:* Thông tin ký gửi cần xử lý, Yêu cầu xem nhà, Yêu cầu đổi lịch hẹn, Lịch hẹn xem nhà, Hợp đồng, Trạng thái hoa hồng.





### 4.2 Sơ đồ mức 0 (DFD Level 0)

#### 4.2.1 Danh sách các kho dữ liệu (Data Stores)

* **D1. Chủ nhà:** Lưu trữ thông tin cá nhân của chủ nhà ký gửi.


* **D2. Nhà ký gửi:** Lưu trữ chi tiết thông tin, thông số và hiện trạng của bất động sản cho thuê.


* **D3. Hợp đồng ký gửi:** Lưu trữ thông tin hợp đồng ký gửi, tiền đảm bảo, trạng thái hiệu lực.


* **D4. Hợp đồng cho thuê:** Lưu trữ thông tin giao dịch thuê, giá trị hợp đồng, hoa hồng thu được.


* **D5. Lịch sử làm việc:** Nhật ký tương tác, trao đổi, dẫn khách xem thực địa của môi giới.



#### 4.2.2 Mô tả chi tiết các tiến trình xử lý

* **Tiến trình 0: Xử lý thông tin ký gửi**
* *Vào:* Thông tin nhà và thông tin chủ nhà từ Chủ nhà.


* *Xử lý:* Kiểm tra tính hợp lệ, đầy đủ, tách dữ liệu.


* *Ra:* Ghi dữ liệu vào kho D1 (Chủ nhà) và D2 (Nhà ký gửi).




* **Tiến trình 1: Tiếp nhận thông tin ký gửi**
* *Vào:* Dữ liệu từ kho D1 và D2.


* *Xử lý:* Tổng hợp hồ sơ ký gửi, phân bổ cho nhân viên phụ trách.


* *Ra:* Gửi thông tin ký gửi đến cho Nhân viên.




* **Tiến trình 2: Lưu hợp đồng**
* *Vào:* Trạng thái tiền đảm bảo (Chủ nhà); Hợp đồng & Trạng thái pháp lý (Nhân viên).


* *Xử lý:* Kiểm tra tính hợp lệ của hợp đồng, kiểm tra kết quả thẩm định pháp lý và ghi nhận tiền đảm bảo.


* *Ra:* Ghi vào kho D3, D4 và gửi thông tin hợp đồng cho Chủ nhà.




* **Tiến trình 3: Lấy thông tin nhà**
* *Vào:* Yêu cầu lấy thông tin (Khách hàng); Dữ liệu từ kho D2 và D4.


* *Xử lý:* Kiểm tra quyền truy cập (Khách thường chỉ xem tóm tắt, Thành viên xem chi tiết).


* *Ra:* Gửi thông tin nhà phù hợp cho Khách hàng.




* **Tiến trình 4: Hẹn xem nhà**
* *Vào:* Yêu cầu xem nhà, đổi lịch (Khách hàng); Lịch hẹn (Nhân viên).


* *Xử lý:* Kiểm tra lịch trống, sắp xếp, cập nhật và điều phối lịch hẹn.


* *Ra:* Phản hồi lịch hẹn cho cả Khách hàng và Nhân viên.




* **Tiến trình 5: Cập nhật thông tin nhà**
* *Vào:* Thông tin cập nhật, đánh giá hiện trạng từ Nhân viên.


* *Xử lý:* Chuẩn hóa dữ liệu hiện trạng thực tế.


* *Ra:* Cập nhật thông tin mới vào kho D2 (Nhà ký gửi).




* **Tiến trình 6: Xem thông tin hợp đồng**
* *Vào:* Dữ liệu từ kho D3 và D4.


* *Xử lý:* Truy xuất và hiển thị thông tin hợp đồng.


* *Ra:* Gửi thông tin hợp đồng cho Nhân viên tra cứu.




* **Tiến trình 7: Cập nhật lịch sử làm việc**
* *Vào:* Nội dung làm việc, kết quả trao đổi, ghi chú thực địa từ Nhân viên.


* *Xử lý:* Chuẩn hóa và ghi nhật ký công việc.


* *Ra:* Lưu dữ liệu vào kho D5 (Lịch sử làm việc).




* **Tiến trình 8: Lấy lịch sử làm việc**
* *Vào:* Dữ liệu từ kho D5.


* *Xử lý:* Tìm kiếm và lọc lịch sử chăm sóc khách hàng.


* *Ra:* Hiển thị lịch sử làm việc cho Nhân viên.




* **Tiến trình 9: Xác nhận hoa hồng**
* *Vào:* Dữ liệu từ kho D4 (Hợp đồng thuê) và D5 (Lịch sử làm việc).


* *Xử lý:* Tính toán hoa hồng theo tỷ lệ %; thực hiện khấu trừ khoản tiền đảm bảo 1.000.000 VNĐ đã nộp ban đầu của chủ nhà.


* *Ra:* Trả về thông tin trạng thái và số tiền hoa hồng thực nhận cho Nhân viên.




* **Tiến trình 10: Kiểm tra thời hạn 6 tháng**
* *Vào:* Dữ liệu kho D3 và Yêu cầu hủy hợp đồng từ Chủ nhà.


* *Xử lý:* Kiểm tra điều kiện: Hợp đồng đủ 6 tháng + Nhà chưa được thuê + Chủ nhà có yêu cầu hủy.


* *Ra:* Chuyển thông tin trạng thái đủ điều kiện sang Tiến trình 11.




* **Tiến trình 11: Chấm dứt hợp đồng**
* *Vào:* Tình trạng chấm dứt từ Tiến trình 10.


* *Xử lý:* Cập nhật trạng thái hợp đồng, tính toán và thực hiện hoàn trả tiền đảm bảo.


* *Ra:* Trả về trạng thái hoàn tiền và thông báo chấm dứt cho Chủ nhà.





---

# CHƯƠNG V. THIẾT KẾ CƠ SỞ DỮ LIỆU (ERD - ENTITY RELATIONSHIP DIAGRAM)

### 5.1 Mô tả chi tiết các thực thể và thuộc tính

#### 1. Thực thể Chủ Nhà (ChuNha)

* `id` (VARCHAR - PK): Mã chủ nhà.


* `hoTen` (VARCHAR): Họ tên chủ nhà.


* `sdt` (VARCHAR): Số điện thoại liên hệ.


* `diaChiLienHe` (VARCHAR): Địa chỉ liên hệ của chủ nhà.



#### 2. Thực thể Nhà Cho Thuê (NhaChoThue)

* `id` (VARCHAR - PK): Mã căn nhà.


* `chuNha_id` (VARCHAR - FK): Mã chủ nhà sở hữu.


* `loaiNha` (VARCHAR): Loại nhà (căn hộ, nhà riêng, biệt thự, ki-ốt...).


* `dienTich` (FLOAT): Diện tích sử dụng.


* `huongNha` (VARCHAR): Hướng nhà.


* `soLuongPhong` (INT): Số lượng phòng.


* `diaChiChiTiet` (VARCHAR): Địa chỉ chi tiết của căn nhà.


* `giaDeXuat` (FLOAT): Mức giá đề xuất cho thuê.


* `hienTrang` (VARCHAR): Kết quả đánh giá hiện trạng nhà.


* `hienThiChiTiet` (BIT): Cờ điều khiển hiển thị chi tiết (0: Chỉ xem tóm tắt, 1: Xem chi tiết).



#### 3. Thực thể Nhân Viên (NhanVien)

* `id` (VARCHAR - PK): Mã nhân viên.


* `hoTen` (VARCHAR): Họ tên nhân viên.


* `vaiTro` (VARCHAR): Vai trò bộ phận (Môi giới, Pháp lý...).



#### 4. Thực thể Khách Hàng (KhachHang)

* `id` (VARCHAR - PK): Mã khách hàng.


* `nhanVien_id` (VARCHAR - FK): Nhân viên môi giới phụ trách nhóm.


* `hoTen` (VARCHAR): Họ tên khách hàng.


* `sdt` (VARCHAR): Số điện thoại khách hàng.


* `laThanhVien` (BIT): Trạng thái thành viên (0: Khách thường - xem tóm tắt, 1: Thành viên - xem chi tiết).



#### 5. Thực thể Hợp Đồng Ký Gửi (HopDongKyGui)

* `id` (VARCHAR - PK): Mã hợp đồng ký gửi.


* `nhaChoThue_id` (VARCHAR - FK): Mã nhà được ký gửi.


* `nhanVien_id` (VARCHAR - FK): Nhân viên xử lý/pháp lý ký kết.


* `ngayKy` (DATE): Ngày ký kết hợp đồng.


* `tienDamBao` (FLOAT): Khoản tiền đảm bảo (mặc định 1.000.000 VNĐ).


* `trangThai` (VARCHAR): Trạng thái (Chờ duyệt, Đang hiệu lực, Hết hạn, Chấm dứt, Hoàn tiền).


* `thoiHan` (INT): Thời hạn hợp đồng tính bằng tháng (mặc định tối thiểu 6 tháng).



#### 6. Thực thể Hợp Đồng Thuê (HopDongThue)

* `id` (VARCHAR - PK): Mã hợp đồng thuê.


* `khachHang_id` (VARCHAR - FK): Mã khách thuê.


* `nhaChoThue_id` (VARCHAR - FK): Mã nhà được thuê.


* `nhanVien_id` (VARCHAR - FK): Nhân viên môi giới chốt hợp đồng.


* `ngayKy` (DATE): Ngày ký hợp đồng thuê.


* `giaTriHopDong` (FLOAT): Giá trị tiền thuê chốt trên hợp đồng.


* `phanTramHoaHong` (FLOAT): Tỷ lệ phần trăm hoa hồng được hưởng.


* `tienHoaHong` (FLOAT): Số tiền hoa hồng tính toán ($\text{tienHoaHong} = \text{giaTriHopDong} \times \text{phanTramHoaHong}$, sau đó khấu trừ 1.000.000 VNĐ tiền đảm bảo của chủ nhà).



#### 7. Thực thể Lịch Sử Làm Việc (LichSuLamViec)

* `id` (VARCHAR - PK): Mã lịch sử công việc.


* `nhanVien_id` (VARCHAR - FK): Nhân viên môi giới thực hiện.


* `khachHang_id` (VARCHAR - FK): Khách hàng tương tác.


* `ngayGio` (DATETIME): Thời gian diễn ra buổi làm việc/thực địa.


* `noiDungTraoDoi` (VARCHAR): Nội dung chi tiết buổi làm việc, kết quả dẫn khách.



### 5.2 Mô tả các mối quan hệ Logic

* **Quan hệ SoHuu (ChuNha - NhaChoThue):** Cấu trúc `ChuNha (1) -------- (N) NhaChoThue`. Một chủ nhà sở hữu nhiều nhà, một nhà thuộc một chủ duy nhất.


* **Quan hệ ThuocVe (NhaChoThue - HopDongKyGui):** Cấu trúc `NhaChoThue (1) -------- (1) HopDongKyGui`. Một căn nhà tại một thời điểm có một hợp đồng ký gửi hiệu lực.


* **Quan hệ XetDuyet (NhanVien - HopDongKyGui):** Cấu trúc `NhanVien (1) -------- (N) HopDongKyGui`. Một nhân viên duyệt/xử lý nhiều hợp đồng ký gửi.


* **Quan hệ DanhGia (NhanVien - NhaChoThue):** Cấu trúc `NhanVien (1) -------- (N) NhaChoThue`. Nhân viên phụ trách đánh giá hiện trạng cho nhiều căn nhà.


* **Quan hệ DuocThue (NhaChoThue - HopDongThue):** Cấu trúc `NhaChoThue (1) -------- (N) HopDongThue`. Một nhà có thể phát sinh nhiều hợp đồng thuê theo chu kỳ thời gian.


* **Quan hệ ChotHopDong (NhanVien - HopDongThue):** Cấu trúc `NhanVien (1) -------- (N) HopDongThue`. Một môi giới có thể chốt nhiều hợp đồng thuê.


* **Quan hệ Thue (KhachHang - HopDongThue):** Cấu trúc `KhachHang (1) -------- (N) HopDongThue`. Một khách hàng có thể thực hiện thuê nhà nhiều lần.


* **Quan hệ GhiNhan (NhanVien - LichSuLamViec):** Cấu trúc `NhanVien (1) -------- (N) LichSuLamViec`. Nhân viên ghi nhận nhiều nhật ký làm việc.


* **Quan hệ ThamGia (KhachHang - LichSuLamViec):** Cấu trúc `KhachHang (1) -------- (N) LichSuLamViec`. Khách hàng tham gia vào nhiều phiên làm việc.



### 5.3 Chuyển đổi mô hình quan hệ (SQL Schema cơ bản)

```sql
ChuNha (id PK, hoTen, sdt, diaChiLienHe)
NhanVien (id PK, hoTen, vaiTro)
KhachHang (id PK, nhanVien_id FK, hoTen, sdt, laThanhVien)
NhaChoThue (id PK, chuNha_id FK, loaiNha, dienTich, huongNha, soLuongPhong, diaChiChiTiet, giaDeXuat, hienTrang, hienThiChiTiet)
HopDongKyGui (id PK, nhaChoThue_id FK, nhanVien_id FK, ngayKy, tienDamBao, trangThai, thoiHan)
HopDongThue (id PK, khachHang_id FK, nhaChoThue_id FK, nhanVien_id FK, ngayKy, giaTriHopDong, phanTramHoaHong, tienHoaHong)
LichSuLamViec (id PK, nhanVien_id FK, khachHang_id FK, ngayGio, noiDungTraoDoi)

```

### 5.4 Mở rộng hệ thống (Bổ sung thực thể theo đề xuất cải tiến)

Để mô hình hóa toàn diện các nghiệp vụ thực tế đã được nêu ra ở các chương trước, cấu trúc CSDL được bổ sung thêm các bảng chi tiết sau:

#### 8. Thực thể Tài Khoản & Vai Trò (TaiKhoan & VaiTro)

* `TaiKhoan` (id PK, tenDangNhap, matKhau, email, trangThai, vaiTro_id FK) $\rightarrow$ Phục vụ chức năng Đăng ký, Đăng nhập, Phân quyền hệ thống.


* `VaiTro` (id PK, tenVaiTro, moTa) $\rightarrow$ Định nghĩa các quyền: CHU_NHA, KHACH_HANG, MOI_GIOI, PHAP_LY.



#### 9. Thực thể Lịch Hẹn Xem Nhà (LichHenXemNha)

* `LichHenXemNha` (id PK, khachHang_id FK, nhanVien_id FK, nhaChoThue_id FK, ngayGioHen, trangThai) $\rightarrow$ Phục vụ chức năng Đặt/Đổi/Hủy lịch hẹn của Khách hàng và Nhân viên. Trạng thái gồm: Chờ xác nhận, Đã xác nhận, Đã xem, Đã hủy.



#### 10. Thực thể Thẩm Định Pháp Lý (ThamDinhPhapLy)

* `ThamDinhPhapLy` (id PK, hopDongKyGui_id FK, nhanVienPhapLy_id FK, noiDungXemXet, quyetDinhBit, ngayDuyet) $\rightarrow$ Xử lý các điều khoản phát sinh khi ký gửi. `quyetDinhBit` (0: Từ chối ký kết, 1: Chấp nhận ký kết).



#### 11. Thực thể Giao Dịch Đảm Bảo & Hoàn Tiền (ThanhToanDamBao & HoanTien)

* `ThanhToanDamBao` (id PK, hopDongKyGui_id FK, ngayDong, soTien, phuongThuc, trangThai) $\rightarrow$ Quản lý khoản nộp 1.000.000 VNĐ ban đầu của chủ nhà.


* `HoanTien` (id PK, hopDongKyGui_id FK, ngayYeuCau, ngayHoan, soTienHoan, trangThai) $\rightarrow$ Xử lý nghiệp vụ khi hết 6 tháng không có khách thuê và chủ nhà yêu cầu hủy hợp đồng.



---

# CHƯƠNG VI. LỰA CHỌN CÔNG NGHỆ (TECH STACK)

Để đáp ứng tối ưu mô hình kiến trúc và các đặc thù nghiệp vụ, hệ thống lựa chọn các công nghệ sau:

* **Frontend - React:** Dùng để xây dựng giao diện người dùng theo kiến trúc component.


* *Ưu điểm:* Khả năng cập nhật trạng thái UI linh hoạt không cần tải lại trang. Thiết kế Responsive tương thích mượt mà trên cả máy tính và các thiết bị di động, đáp ứng hoàn hảo cho nhân viên môi giới khi phải di chuyển ngoài thực địa để cập nhật hiện trạng nhà hoặc kiểm tra lịch hẹn.




* **Backend - Node.js:** Chịu trách nhiệm xử lý logic nghiệp vụ toàn bộ hệ thống, điều phối phân quyền, xử lý tính toán hoa hồng tự động và kết nối giao tiếp với CSDL.


* *Ưu điểm:* Khả năng xử lý bất đồng bộ cực kỳ mạnh mẽ, chịu tải lượng request đồng thời (concurrent requests) tốt khi có nhiều khách hàng cùng tìm kiếm nhà. Việc kết hợp cùng hệ sinh thái chung JavaScript từ Frontend lên Backend giúp đội ngũ phát triển dễ dàng bảo trì và tích hợp các RESTful API.




* **Database - SQLite:** Sử dụng làm hệ quản trị cơ sở dữ liệu quan hệ cho dự án.


* *Ưu điểm:* Cấu trúc gọn nhẹ, cấu hình đơn giản, không tốn tài nguyên cài đặt phức tạp nhưng vẫn đảm bảo toàn vẹn dữ liệu (ACID) cực tốt cho các giao dịch lưu trữ thông tin nhà, hợp đồng ký gửi, hợp đồng thuê và tính toán số liệu hoa hồng.