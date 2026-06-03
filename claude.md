**ĐẠI HỌC QUỐC GIA HÀ NỘI**

**TRƯỜNG ĐẠI HỌC CÔNG NGHỆ**

**BÁO CÁO BÀI TẬP LỚN CUỐI KỲ**

**Class: INT2020E_1**

**Lecturer: TS.Dư Phương Hạnh**

**23020576 Vũ Tiến Tuấn Trung**

**23020572 Vũ Thanh Tùng**

**23020565 Đặng Anh Quế**

**23020579 Nguyễn Quang Vinh**

# Mục lục

[Mục lục 1](#_Toc300179687)

[Danh mục hình ảnh 2](#_Toc133773125)

[Tổng quan dự án 3](#_Toc563983390)

[1\. Bối cảnh và vấn đề 4](#_Toc234302186)

[2\. Mục tiêu dự án 4](#_Toc1025583043)

[3\. Đối tượng sử dụng 5](#_Toc1832520806)

[Phân tích yêu cầu 6](#_Toc1572404303)

[4\. Yêu cầu chức năng và phi chức năng 7](#_Toc1809507380)

[a. Yêu cầu chức năng 7](#_Toc327389663)

[Hình xx Sơ đồ phân rã chức năng 7](#_Toc1225800086)

[b. Yêu cầu phi chức năng 10](#_Toc1023428834)

[5\. Tác nhân của hệ thống 10](#_Toc1210253134)

[6\. Biểu đồ ca sử dụng 11](#_Toc1682076866)

[7\. Mô hình luồng dữ liệu DFD 11](#_Toc921235671)

[a. DFD context 11](#_Toc944044568)

[b. DFD lv0 11](#_Toc519976768)

[c. DFD lv1 11](#_Toc1003282252)

[Thiết kế hệ thống (System Design) 11](#_Toc465037037)

[1\. Mô hình kiến trúc hệ thống \* Đặt hình ảnh kiến trúc tổng thể ở đây để người đọc nhìn một cách trực quan thay vì phải đọc chữ từ đầu. 12](#_Toc1479992014)

[2\. Thiết kế các module chức năng 12](#_Toc279645876)

[3\. Lựa chọn công nghệ 12](#_Toc991217700)

[a. Frontend: React 12](#_Toc2088318466)

[b. Backend: Node.js 12](#_Toc1219550710)

[c. Database: sqlite 12](#_Toc1765322874)

[4\. Thiết kế cơ sở dữ liệu 12](#_Toc5060040)

[a. ERD 12](#_Toc1583430787)

[b. Mô tả các bảng dữ liệu 12](#_Toc1934552035)

[c. Quan hệ giữa các bảng 12](#_Toc1377623160)

[5\. Thiết kế API 12](#_Toc259314085)

[6\. Thiết kế giao diện người dùng 12](#_Toc77986667)

[7\. Thiết kế bảo mật và phân quyền 12](#_Toc1529776722)

[Cài đặt và thực nghiệm 13](#_Toc1031210693)

[Kết luận 14](#_Toc2100058044)

[1\. Kết quả đạt được 14](#_Toc739173241)

[2\. Hạn chế 14](#_Toc1510281112)

[3\. Hướng phát triển trong tương lai 14](#_Toc1359277501)

Phân chia công việc

|     |     |     |     |
| --- | --- | --- | --- |
| Thành viên | Khó khăn khi làm  <br>bài tập lớn | Phần giá trị nhất trong  <br>đóng góp của mình | Đóng góp |
| Vũ Tiến Tuấn Trung | Khúc mắc data store trong DFD và entity trong lược đồ quan hệ có nhiều thứ gây mâu thuẫn khi thiết kế 2 cái này. Khó khăn khi phải thiết kế code theo đúng tài liệu về DFD, Use case và ERD. | Code và thiết kế tổng quan hệ thống. Đóng góp sửa nội dung của DFD và ERD | 25% |
| Đặng Anh Quế | Xác định sai các entity và process trong DFD (nên tách hay gộp Môi giới và Nhân viên đại lý, nên giữ bộ phận pháp luật, thiếu dữ liệu Lịch sử làm việc) | Thiết kế cơ bản và hoàn thiện DFD | 25% |
| Nguyễn Quang Vinh | Chưa xác định rõ được người dùng sẽ có chức năng cụ thể gì khi thiết kế, khi xem lại phần của các thành viên khác mới chỉnh lại yêu cầu cho chuẩn. Nghiệp vụ đề đưa ra chung chung nên phải mò nhiều, use case có lúc phân rã quá nhỏ không phù hợp hoặc gộp user (khách hàng và chủ nhà) khiến code khó nên lại phải tách ra | Thiết kế yêu cầu chức năng và use case của hệ thông | 25% |
| Vũ Thanh Tùng | Gặp khó khăn trong việc xác định nên gộp người dùng là chủ nhà với khách hàng, nhân viên đại lý với môi giới.<br><br>Chưa rõ việc có nên phân chia gộp các người dùng vào và thêm role hay là sẽ tách ra thành chủ nhà và khách hàng.<br><br>Vẫn khá mông lung trong việc có thêm phần pháp lý vào không hay chỉ để cho nhân viên làm pháp lý. | Thiết kế hoàn thiện ERD, lựa chọn công nghệ | 25% |

# Tổng quan dự án

## Bối cảnh và vấn đề

Để kết nối hiệu quả giữa chủ nhà và khách thuê, các đại lý trung gian ký gửi nhà đất đóng vai trò quản lý giao dịch. Việc vận hành một đại lý như vậy đòi hỏi phải xử lý và lưu trữ thông tin liên quan đến thông số nhà đất, trạng thái hợp đồng, lịch trình làm việc và các giao dịch tài chính.

**Vấn đề tồn tại:** Việc tiếp nhận và quản lý thủ công các thông số chi tiết của căn nhà dễ dẫn đến sai sót thông tin giữa các biểu mẫu.

- Quy trình phối hợp giữa các bộ phận cần được tối ưu hóa, từ việc nhân viên liên hệ sắp xếp lịch gặp chủ nhà để đánh giá hiện trạng , đến việc xem xét trạng thái pháp lý của hợp đồng, và hợp đồng được ký giữa khách hàng thuê nhà và môi giới.
- Cần theo dõi hợp đồng cho thuê nhà để tính toán số toàn hoa hồng cho môi giới một cách tự động
- Quản lý tài chính đối với khoản tiền đảm bảo 1.000.000 VNĐ của khách ký gửi dễ bị nhầm lẫn trong việc theo dõi thời hạn 6 tháng để hoàn trả hoặc khấu trừ vào hoa hồng sau khi sản phẩm được thuê.

## Mục tiêu dự án

- Phát triển một hệ thống phần mềm hỗ trợ quản lý tối ưu cho đại lý ký gửi nhà cho thuê
- **Tự động hóa luồng công việc nghiệp vụ** từ khâu chủ nhà gửi thông tin , nhân viên lên lịch đánh giá hiện trạng , xem xét điều khoản phát sinh , cho đến khi hợp đồng ký kết thành công và hiển thị sản phẩm.
- Thiết lập cơ chế phân quyền xem thông tin sản phẩm giữa khách hàng chưa đăng ký thành viên và khách hàng đã là thành viên.
- Hỗ trợ phân công khách hàng cho môi giới, hỗ trợ lưu lịch sử làm việc, trao đổi, đi thực địa và tự động tính toán hoa hồng môi giới thu được.
- Theo dõi và xử lý chính xác trạng thái của khoản tiền đảm bảo 1.000.000 VNĐ, tự động cảnh báo mốc thời gian 6 tháng để thực hiện hoàn trả hoặc khấu trừ hợp lệ theo nguyện vọng của khách hàng.

## Đối tượng sử dụng

- **Chủ nhà:** Là người sở hữu bất động sản và có nhu cầu ký gửi cho thuê. Trong hệ thống, họ chịu trách nhiệm cung cấp các thông số chi tiết về căn nhà (loại hình, diện tích, hướng, mức giá) và thông tin liên hệ. Chủ nhà sẽ sử dụng phần mềm để theo dõi tiến độ đánh giá hiện trạng, kiểm tra thông tin hợp đồng ký gửi, đóng khoản tiền đảm bảo và nhận các thông báo về trạng thái đặt cọc hoặc hoàn tiền khi kết thúc hợp đồng.
- **Khách hàng:** Là người có nhu cầu tìm kiếm và thuê nhà (bao gồm cả khách vãng lai chưa đăng ký và khách đã là thành viên). Họ tương tác với hệ thống để xem các thông tin mô tả nhà đất, gửi yêu cầu đi xem nhà thực tế, nhận xác nhận hoặc yêu cầu đổi lịch hẹn. Khi quyết định thuê, khách hàng sẽ nhận và theo dõi các thông tin liên quan đến hợp đồng cho thuê cuối cùng.
- **Nhân viên:** Là đội ngũ trực tiếp quản lý, vận hành các nghiệp vụ môi giới. Nhân viên sử dụng hệ thống để tiếp nhận thông tin ký gửi từ chủ nhà, đánh giá và cập nhật trạng thái pháp lý, cũng như sắp xếp lịch hẹn xem nhà cho khách. Đồng thời, hệ thống giúp họ lưu trữ toàn bộ lịch sử làm việc, quản lý trạng thái hợp đồng và theo dõi mức hoa hồng nhận được sau khi chốt giao dịch thành công.

# Phân tích yêu cầu

## Yêu cầu chức năng và phi chức năng

### Yêu cầu chức năng

### Hình xx Sơ đồ phân rã chức năng

|     |     |     |     |
| --- | --- | --- | --- |
| **Mã YC** | **Tên chức năng** | **Tác nhân** | **Mô tả chi tiết (Dựa trên luồng dữ liệu DFD)** |
| **I** | **Nhóm chức năng Hệ thống (Dùng chung)** |     |     |
| FR-HT-01 | Đăng ký tài khoản | Tất cả tác nhân | Người dùng cung cấp thông tin định danh cá nhân để tạo tài khoản mới trên hệ thống, phục vụ cho quá trình sử dụng dịch vụ. |
| FR-HT-02 | Đăng nhập / đăng xuất | Tất cả tác nhân | Tác nhân cung cấp thông tin đăng nhập để hệ thống xác thực danh tính, bảo mật phiên làm việc trước khi cho phép trao đổi dữ liệu. |
| FR-HT-03 | Dashboard nhà | Tất cả tác nhân | Hệ thống tổng hợp và hiển thị trực quan các dữ liệu, thống kê tổng quan về tình trạng nhà, các giao dịch và thông báo quan trọng trên màn hình chính. |
| **II** | **Nhóm chức năng của chủ nhà** |     |     |
| FR-CN-01 | Gửi thông tin ký gửi | Chủ nhà | Chủ nhà gửi "Thông tin nhà" vào hệ thống để bắt đầu quy trình ký gửi tài sản. |
| FR-CN-02 | Nộp tiền đảm bảo | Chủ nhà | Chủ nhà nộp "Tiền đảm bảo" vào hệ thống và nhận lại phản hồi về "Trạng thái đặt cọc" để xác nhận việc nộp tiền thành công. |
| FR-CN-03 | Quản lý hợp đồng ký gửi | Chủ nhà | Hệ thống cung cấp "Thông tin hợp đồng ký gửi" để chủ nhà xem xét, tra cứu và theo dõi tình trạng. |
| FR-CN-04 | Xem và quản lý lịch hẹn | Chủ nhà | Chủ nhà xem và thao tác với lịch hẹn để chốt được lịch khảo sát nhà với nhân viên đại lý |
| **III** | **Nhóm chức năng của khách hàng** |     |     |
| FR-KH-01 | Xem thông tin nhà | Khách hàng | Hệ thống hiển thị "Thông tin nhà" và cung cấp "Mô tả nhà" chi tiết để khách hàng tìm hiểu. |
| FR-KH-02 | Nộp tiền thuê nhà | Khách hàng | Khách hàng đẩy dữ liệu thanh toán vào hệ thống để thực hiện "Nộp tiền thuê nhà" |
| FR-KH-03 | Xem hợp đồng cho thuê | Khách hàng | Sau khi giao dịch thành công, hệ thống cung cấp "Thông tin hợp đồng cho thuê" để khách hàng theo dõi |
| FR-KH-04 | Tìm kiếm nhà\* | Khách hàng | Khách hàng gửi "Tiêu chí tìm kiếm" (giá, diện tích, khu vực) vào hệ thống, hệ thống lọc dữ liệu và trả về danh sách các căn nhà phù hợp. |
| **IV** | **Nhóm chức năng của nhân viên đại lý** |     |     |
| FR-NVDL-01 | Tiếp nhận nhà ký gửi | Nhân viên đại lý | Hệ thống chuyển "Thông tin ký gửi" (từ chủ nhà) sang cho nhân viên đại lý để tiếp nhận, đánh giá và xử lý |
| FR-NVDL-02 | Cập nhật thông tin nhà | Nhân viên đại lý | Nhân viên đại lý đẩy dữ liệu "Cập nhật thông tin nhà" vào hệ thống |
| FR-NVDL-03 | Cập nhật trạng thái pháp lý | Nhân viên đại lý | Nhân viên xác minh giấy tờ và đẩy dữ liệu "Trạng thái pháp lý" |
| FR-NVDL-04 | Xem và quản lý lịch hẹn | Nhân viên đại lý | Nhân viên đại lý lên lịch hẹn/ thay đổi để chốt với chủ nhà |
| FR-NVDL-05 | Quản lý hợp đồng ký gửi | Nhân viên đại lý | Nhân viên đại lý cập nhật tiến độ, tạo lập và truy xuất "Hợp đồng ký gửi" trên hệ thống để hoàn tất thủ tục với chủ nhà. |
| FR-NVDL-06 | Quản lý lịch sử làm việc | Nhân viên đại lý | Nhân viên ghi nhận các hoạt động tác nghiệp ("Lịch sử làm việc") vào hệ thống và có thể truy xuất để báo cáo. |
| **V** | **Nhóm chức năng của môi giới** |     |     |
| FR-MG-01 | Quản lý lịch hẹn xem nhà | Môi giới | Môi giới gửi "Yêu cầu đặt/cập nhật lịch hẹn" vào hệ thống để sắp xếp thời gian dẫn khách hàng đi xem nhà thực tế. |
| FR-MG-02 | Quản lý lịch sử làm việc | Môi giới | Môi giới ghi nhận nhật ký các hoạt động tương tác với khách hàng ("Lịch sử làm việc") lưu trữ vào cơ sở dữ liệu của hệ thống. |
| FR-MG-03 | Quản lý hợp đồng cho thuê | Môi giới | Môi giới theo dõi tình trạng phê duyệt, hỗ trợ bổ sung thông tin để tạo lập "Hợp đồng cho thuê" với khách hàng |
| FR-MG-04 | Xem lịch sử nhận hoa hồng | Môi giới | Hệ thống tính toán và hiển thị thông tin "Lịch sử nhận hoa hồng" cho môi giới sau khi các giao dịch được chốt thành công và giải ngân. |

### Yêu cầu phi chức năng

|     |     |     |
| --- | --- | --- |
| **Mã YC** | **Tiêu chí** | **Mô tả chi tiết** |
| **NFR-01** | **Hiệu năng** | Thời gian phản hồi của hệ thống khi tra cứu/tìm kiếm sản phẩm không vượt quá 2 giây. Hỗ trợ nhiều người dùng truy cập đồng thời mà không bị gián đoạn. |
| **NFR-02** | **Bảo mật** | Mật khẩu người dùng phải được băm trước khi lưu vào cơ sở dữ liệu. Toàn bộ giao tiếp giữa trình duyệt và máy chủ phải được mã hóa thông qua giao thức HTTPS. |
| **NFR-03** | **Tính khả dụng** | Giao diện thân thiện, dễ sử dụng, hỗ trợ hiển thị tốt trên cả máy tính và thiết bị di động để thuận tiện cho môi giới đi thực địa. |
| **NFR-04** | **Tính sẵn sàng** | Hệ thống phải đảm bảo hoạt động liên tục |

## Tác nhân của hệ thống

- **Chủ nhà:** Đóng vai trò là nguồn cung cấp dữ liệu đầu vào (thông tin bất động sản, thông tin liên hệ) và trực tiếp kích hoạt các luồng giao dịch tài chính liên quan đến tiền đảm bảo (nộp tiền, yêu cầu hoàn tiền).
- **Khách hàng:** Đóng vai trò là người tiêu thụ thông tin (tra cứu, xem chi tiết sản phẩm) và là người phát sinh các yêu cầu nghiệp vụ về lịch trình (đặt/đổi/hủy lịch hẹn xem nhà).
- **Nhân viên:** Đóng vai trò là người vận hành và kiểm soát trạng thái của hệ thống. Tác nhân này trực tiếp xử lý các yêu cầu đầu vào từ Chủ nhà và Khách hàng, cập nhật trạng thái dữ liệu (pháp lý, hợp đồng, lịch sử làm việc) và nhận các kết xuất đầu ra về doanh thu/hoa hồng.

## Biểu đồ ca sử dụng

Hình xx: Biểu đồ ca sử dụng của hệ thống

**Đặc tả ca sử dụng "Đăng ký tài khoản"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Đăng ký tài khoản** |
| **Mô tả yêu cầu** | Là người dùng, tôi muốn đăng ký tài khoản để sử dụng dịch vụ trên hệ thống. |
| **Tác nhân** | Người dùng (Chủ nhà, Khách hàng) |
| **Luồng sự kiện cơ bản** | 1\. Chọn chức năng "Đăng ký", hệ thống hiển thị form.<br><br>2\. Nhập: Họ tên, SĐT, Email, Mật khẩu, Xác nhận mật khẩu, chọn Vai trò.<br><br>3\. Nhấn yêu cầu đăng ký.<br><br>4\. Hệ thống kiểm tra định dạng và độ trùng lặp.<br><br>5\. Mã hóa mật khẩu, tạo tài khoản, gửi OTP xác nhận.<br><br>6\. Chuyển hướng sang trang Đăng nhập. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | 1\. Thiếu thông tin: Báo "Vui lòng nhập đủ các trường".<br><br>2\. Email/SĐT đã tồn tại: Báo "Đã được sử dụng".<br><br>3\. Mật khẩu không khớp hoặc quá yếu: Báo lỗi tương ứng. |
| **Yêu cầu đặc biệt** | Mật khẩu phải được băm (hashing) trước khi lưu. |
| **Tiền điều kiện** | Chưa có tài khoản trên hệ thống. |
| **Hậu điều kiện** | Tài khoản được tạo thành công. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Đăng nhập"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Đăng nhập** |
| **Mô tả yêu cầu** | Là người dùng, tôi muốn đăng nhập để truy cập vào các chức năng hệ thống tương ứng quyền hạn. |
| **Tác nhân** | Người dùng (Tất cả) |
| **Luồng sự kiện cơ bản** | 1\. Chọn chức năng "Đăng nhập".<br><br>2\. Nhập Email/SĐT và mật khẩu, nhấn Đăng nhập.<br><br>3\. Hệ thống kiểm tra tính hợp lệ.<br><br>4\. Hệ thống xác định vai trò tài khoản (Admin, Nhân viên, Chủ nhà, Khách).<br><br>5\. Cấp phiên làm việc và điều hướng về trang chủ tương ứng. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Sai Email/Mật khẩu |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Đã có tài khoản hợp lệ. |
| **Hậu điều kiện** | Đăng nhập thành công, vào được hệ thống. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Gửi thông tin ký gửi"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Gửi thông tin ký gửi** |
| **Mô tả yêu cầu** | Là chủ nhà, tôi muốn cung cấp thông tin chi tiết về căn nhà lên hệ thống để đại lý tiến hành tiếp nhận và hỗ trợ cho thuê. |
| **Tác nhân** | Chủ nhà |
| **Luồng sự kiện cơ bản** | 1\. Chủ nhà đăng nhập vào hệ thống.<br><br>2\. Chủ nhà chọn chức năng "Ký gửi nhà mới".<br><br>3\. Hệ thống hiển thị biểu mẫu điền thông tin ký gửi.<br><br>4\. Chủ nhà nhập các thông số (loại nhà, diện tích, số phòng, giá đề xuất, địa chỉ).<br><br>5\. Chủ nhà tải lên hình ảnh hiện trạng<br><br>6\. Chủ nhà nhấn nút "Gửi yêu cầu".<br><br>7\. Hệ thống kiểm tra tính đầy đủ và hợp lệ của dữ liệu đầu vào.<br><br>8\. Hệ thống lưu thông tin, khởi tạo hồ sơ căn nhà với mã định danh duy nhất và chuyển trạng thái thành "Đang ký gửi".<br><br>9\. Hệ thống thông báo gửi thành công cho chủ nhà. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | 1\. Chủ nhà không nhập đủ các trường thông tin bắt buộc.<br><br>2\. Hệ thống thông báo: "Vui lòng điền đầy đủ các thông tin bắt buộc có dấu (\*)". |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Chủ nhà đã đăng nhập tài khoản. Có kết nối internet. |
| **Hậu điều kiện** | Hồ sơ nhà được tạo thành công trên CSDL. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Nộp tiền đảm bảo"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Nộp tiền đảm bảo** |
| **Mô tả yêu cầu** | Là chủ nhà, tôi muốn nộp khoản tiền đảm bảo 1.000.000 VNĐ để xác nhận ký gửi. |
| **Tác nhân** | Chủ nhà |
| **Luồng sự kiện cơ bản** | 1\. Chủ nhà chọn hồ sơ đang "Chờ đóng phí", chọn "Nộp tiền".<br><br>2\. Hệ thống hiện thông tin chuyển khoản/mã QR.<br><br>3\. Chủ nhà thanh toán<br><br>4\. Hệ thống báo thành công. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Đã Gửi thông tin ký gửi thành công. |
| **Hậu điều kiện** | Nhà ký gửi chính thức được kích hoạt. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Quản lý hợp đồng ký gửi"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Quản lý hợp đồng ký gửi** |
| **Mô tả yêu cầu** | Là chủ nhà, tôi muốn xem chi tiết và theo dõi trạng thái hợp đồng ký gửi tài sản của mình. |
| **Tác nhân** | Chủ nhà |
| **Luồng sự kiện cơ bản** | 1\. Chủ nhà chọn mục "Hợp đồng ký gửi của tôi".<br><br>2\. Hệ thống hiển thị danh sách các hợp đồng.<br><br>3\. Chủ nhà click vào để xem chi tiết điều khoản, thời hạn và trạng thái. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Đã có hợp đồng ký gửi trên hệ thống. |
| **Hậu điều kiện** | Xem được thông tin hợp đồng. |
| **Điểm mở rộng** | Kích hoạt Ca sử dụng **"Hủy hợp đồng ký gửi"** khi chủ nhà chọn tùy chọn chấm dứt hợp tác. |

**Đặc tả ca sử dụng "Hủy hợp đồng ký gửi"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Hủy hợp đồng ký gửi (UC Mở rộng)** |
| **Mô tả yêu cầu** | Là chủ nhà, tôi muốn chấm dứt hợp đồng khi không còn nhu cầu ký gửi. |
| **Tác nhân** | Chủ nhà |
| **Luồng sự kiện cơ bản** | 1\. Kích hoạt từ UC "Quản lý hợp đồng ký gửi".<br><br>2\. Chủ nhà nhấn "Yêu cầu hủy" và nhập lý do.<br><br>3\. Hệ thống kiểm tra điều kiện hủy.<br><br>4\. Chuyển trạng thái hợp đồng thành "Đã hủy" và gỡ bài niêm yết. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không thể hủy nếu nhà đang có khách tiến hành chốt (Trạng thái "Đang thương thảo"). |
| **Yêu cầu đặc biệt** | Nếu thời gian >= 6 tháng, kích hoạt điểm mở rộng Theo dõi hoàn tiền. |
| **Tiền điều kiện** | Đang ở trong UC Quản lý hợp đồng ký gửi. |
| **Hậu điều kiện** | Hợp đồng bị chấm dứt. |
| **Điểm mở rộng** | Kích hoạt Ca sử dụng **"Theo dõi hoàn tiền"** nếu đủ điều kiện (>= 6 tháng chưa cho thuê). |

**Đặc tả ca sử dụng "Theo dõi hoàn tiền"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Theo dõi hoàn tiền (UC Mở rộng)** |
| **Mô tả yêu cầu** | Là chủ nhà, tôi muốn theo dõi tiến độ hoàn trả khoản tiền đảm bảo 1.000.000 VNĐ. |
| **Tác nhân** | Chủ nhà |
| **Luồng sự kiện cơ bản** | 1\. Kích hoạt từ UC "Hủy hợp đồng ký gửi" (nếu đủ điều kiện).<br><br>2\. Hệ thống tự động tạo phiếu yêu cầu hoàn tiền gửi đến kế toán.<br><br>3\. Chủ nhà truy cập mục "Hoàn tiền" để xem trạng thái (Đang xử lý / Đã hoàn trả). |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Đã hủy hợp đồng ký gửi hợp lệ (>6 tháng). |
| **Hậu điều kiện** | Tiền được hoàn trả lại cho chủ nhà. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Xem thông tin nhà"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Xem thông tin nhà** |
| **Mô tả yêu cầu** | Là khách hàng, tôi muốn xem chi tiết các sản phẩm nhà đất đang cho thuê. |
| **Tác nhân** | Khách hàng |
| **Luồng sự kiện cơ bản** | 1\. Khách hàng sử dụng bộ lọc tìm kiếm nhà.<br><br>2\. Click vào một căn nhà để xem chi tiết.<br><br>3\. Hệ thống hiển thị toàn bộ thông tin (địa chỉ, hình ảnh, giá cả) do đã đăng nhập. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Khách hàng đã đăng nhập. |
| **Hậu điều kiện** | Hiển thị nội dung sản phẩm. |
| **Điểm mở rộng** | Kích hoạt Ca sử dụng **"Đặt lịch xem nhà"** khi khách hàng nhấn nút Đặt lịch. |

**Đặc tả ca sử dụng "Đặt lịch xem nhà"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Đặt lịch xem nhà (UC Mở rộng)** |
| **Mô tả yêu cầu** | Là khách hàng, tôi muốn đặt hẹn để đến xem trực tiếp căn nhà. |
| **Tác nhân** | Khách hàng |
| **Luồng sự kiện cơ bản** | 1\. Kích hoạt từ UC "Xem thông tin nhà".<br><br>2\. Khách hàng chọn đặt lịch xem nhà<br><br>3\. Hệ thống gửi thông báo đến môi giới<br><br>4\. Chờ môi giới gửi lại lịch hẹn<br><br>5\. Hệ thống gửi lịch hẹn cho khách hàng |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Chọn giờ quá khứ hoặc trùng lịch: Hệ thống báo lỗi. |
| **Yêu cầu đặc biệt** | Chỉ đặt lịch được cho nhà "Đã đăng tin". |
| **Tiền điều kiện** | Đang ở UC Xem thông tin nhà. |
| **Hậu điều kiện** | Lịch hẹn được tạo. |
| **Điểm mở rộng** | Kích hoạt Ca sử dụng **"Thay đổi/hủy lịch xem nhà"** nếu khách có nhu cầu sửa đổi sau đó. |

**Đặc tả ca sử dụng "Xác nhận/thay đổi lịch xem nhà"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Xác nhận/thay đổi lịch xem nhà (UC Mở rộng)** |
| **Mô tả yêu cầu** | Là khách hàng, tôi muốn xác nhận/thay đổi lịch xem nhà |
| **Tác nhân** | Khách hàng |
| **Luồng sự kiện cơ bản** | 1\. Kích hoạt từ UC "Đặt lịch xem nhà" (truy cập quản lý lịch).<br><br>2\. Chọn "Đổi lịch" (chọn giờ mới) hoặc "Xác nhận"<br><br>3\. Hệ thống cập nhật trạng thái và thông báo cho Nhân viên. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | không |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Đã có lịch hẹn. |
| **Hậu điều kiện** | Lịch hẹn được cập nhật. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Xem hợp đồng thuê"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Xem hợp đồng thuê** |
| **Mô tả yêu cầu** | Là khách hàng, tôi muốn xem lại bản mềm hợp đồng thuê nhà đã ký kết. |
| **Tác nhân** | Khách hàng |
| **Luồng sự kiện cơ bản** | 1\. Khách hàng truy cập "Hợp đồng thuê của tôi".<br><br>2\. Hệ thống hiển thị danh sách hợp đồng đã chốt.<br><br>3\. Khách hàng click vào để xem chi tiết điều khoản, thời hạn, tiền cọc. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Giao dịch thuê nhà đã chốt thành công. |
| **Hậu điều kiện** | Khách xem được hợp đồng. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Tiếp nhận nhà ký gửi"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Tiếp nhận nhà ký gửi** |
| **Mô tả yêu cầu** | Là nhân viên, tôi muốn kiểm duyệt hồ sơ do chủ nhà gửi trước khi đưa lên hệ thống. |
| **Tác nhân** | Nhân viên |
| **Luồng sự kiện cơ bản** | 1\. Nhân viên mở danh sách "Yêu cầu ký gửi mới".<br><br>2\. Xem chi tiết thông số và đánh giá sơ bộ.<br><br>3\. Xác nhận tiếp nhận để lên lịch khảo sát thực tế. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Thông tin sai lệch: Từ chối và ghi lý do. |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Chủ nhà đã gửi yêu cầu. |
| **Hậu điều kiện** | Hồ sơ chuyển sang trạng thái "Đang khảo sát". |
| **Điểm mở rộng** | Kích hoạt Ca sử dụng **"Quản lý pháp lý"** nếu có các điều khoản phát sinh |

**Đặc tả ca sử dụng "Quản lý pháp lý"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Quản lý pháp lý (UC Mở rộng)** |
| **Mô tả yêu cầu** | Là nhân viên, tôi muốn đưa hợp đồng vào trạng thái tham khảo pháp lý |
| **Tác nhân** | Nhân viên |
| **Luồng sự kiện cơ bản** | 1\. Kích hoạt từ luồng Tiếp nhận hồ sơ khi có ngoại lệ.<br><br>2\. Đánh giá rủi ro pháp lý.<br><br>3\. Bấm "Chấp nhận" hoặc "Từ chối" điều khoản.<br><br>4\. Lưu quyết định và phản hồi cho khách hàng. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không |
| **Yêu cầu đặc biệt** | Lưu vết lịch sử tư vấn. |
| **Tiền điều kiện** | Có điều khoản phát sinh. |
| **Hậu điều kiện** | Quyết định pháp lý được đưa ra. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Cập nhật thông tin nhà"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Cập nhật thông tin nhà** |
| **Mô tả yêu cầu** | Là nhân viên, tôi muốn cập nhật lại thông số, hình ảnh nhà sau khi đi khảo sát thực tế. |
| **Tác nhân** | Nhân viên |
| **Luồng sự kiện cơ bản** | 1\. Nhân viên truy cập hồ sơ nhà<br><br>2\. Bổ sung hình ảnh thực tế, sửa lại giá chốt hoặc mô tả hiện trạng.<br><br>3\. Nhấn "Lưu cập nhật".<br><br>4\. Chuyển trạng thái nhà thành "Đã đăng tin". |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Đã hoàn thành khảo sát thực tế. |
| **Hậu điều kiện** | Thông tin nhà hiển thị công khai lên hệ thống cho khách xem. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Quản lý lịch hẹn khách hàng"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Quản lý lịch hẹn khách hàng** |
| **Mô tả yêu cầu** | Là nhân viên, tôi muốn xem và xử lý các yêu cầu đặt lịch đi xem nhà từ khách. |
| **Tác nhân** | Nhân viên |
| **Luồng sự kiện cơ bản** | 1\. Truy cập danh sách "Lịch hẹn chờ xác nhận".<br><br>2\. Chọn một lịch hẹn, xem thông tin khách và khung giờ.<br><br>3\. Nhấn "Chấp nhận" hoặc đề xuất đổi giờ khác.<br><br>4\. Hệ thống cập nhật lịch làm việc cá nhân của môi giới. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Khách hàng đã đặt lịch. |
| **Hậu điều kiện** | Lịch xem thực địa được chốt. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Quản lý lịch sử làm việc"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Quản lý lịch sử làm việc** |
| **Mô tả yêu cầu** | Là nhân viên, tôi muốn ghi nhận lại kết quả sau mỗi lần dẫn khách đi xem nhà. |
| **Tác nhân** | Nhân viên |
| **Luồng sự kiện cơ bản** | 1\. Nhân viên truy cập vào lịch hẹn đã diễn ra.<br><br>2\. Cập nhật kết quả: "Khách ưng ý", "Khách từ chối" hoặc ghi chú trao đổi.<br><br>3\. Nhấn "Lưu nhật ký".<br><br>4\. Hệ thống lưu vết vào lịch sử chăm sóc khách hàng. |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Buổi hẹn xem nhà đã diễn ra. |
| **Hậu điều kiện** | Lịch sử tương tác được lưu lại. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Quản lý hợp đồng"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Quản lý hợp đồng** |
| **Mô tả yêu cầu** | Là nhân viên, tôi muốn tạo hợp đồng ký gửi/thuê nhà sau khi chốt |
| **Tác nhân** | Nhân viên |
| **Luồng sự kiện cơ bản** | 1\. Nhập thông tin giao dịch (giá chốt, thời hạn).<br><br>2\. Lưu hợp đồng<br><br>3\. **Bắt buộc kích hoạt ca sử dụng "Tính và theo dõi hoa hồng"** (nếu là hợp đồng thuê) |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Bỏ trống thông tin bắt buộc. |
| **Yêu cầu đặc biệt** | Bắt buộc gọi UC Tính hoa hồng . |
| **Tiền điều kiện** | Có hồ sơ khách và nhà. |
| **Hậu điều kiện** | Hợp đồng có hiệu lực. |
| **Điểm mở rộng** | Không |

**Đặc tả ca sử dụng "Tính và theo dõi hoa hồng"**

|     |     |
| --- | --- |
| **Tên ca sử dụng** | **Tính và theo dõi hoa hồng (UC Include)** |
| **Mô tả yêu cầu** | Là nhân viên, tôi muốn hệ thống tính hoa hồng tự động cho tôi. |
| **Tác nhân** | Nhân viên |
| **Luồng sự kiện cơ bản** | 1\. Kích hoạt ngầm từ UC "Quản lý hợp đồng".<br><br>2\. Lấy Giá trị chốt thuê nhân % hoa hồng.<br><br>3\. Lưu vết giao dịch |
| **Luồng sự kiện thay thế** | Không |
| **Luồng sự kiện lỗi** | Không |
| **Yêu cầu đặc biệt** | Không |
| **Tiền điều kiện** | Hợp đồng thuê hoàn tất. |
| **Hậu điều kiện** | Hoa hồng được ghi nhận. |
| **Điểm mở rộng** | Không |

## Mô hình luồng dữ liệu DFD

### DFD context

Ở Context level, Hệ thống ký gửi nhà cho thuê gồm có 4 tác nhân ngoài:

<div class="joplin-table-wrapper"><table><tbody><tr><td><p>Tác nhân</p></td><td><p>Luồng vào của tác nhân với<br>hệ thống</p></td><td><p>Luồng ra của hệ thống với<br>tác nhân</p></td></tr><tr><td><p>Chủ nhà</p></td><td><ul><li>Thông tin nhà, thông tin liên hệ của chủ nhà</li><li>Giao dịch tiền đảm bảo</li><li>Xác nhận / Đổi lịch hẹn</li><li>Yêu cầu hủy hợp đồng</li></ul></td><td><ul><li>Thông tin hợp đồng ký gửi</li><li>Giao dịch tiền thuê nhà</li><li>Lịch hẹn</li><li>Trạng thái hoàn tiền</li></ul></td></tr><tr><td><p>Nhân viên đại lý</p></td><td><ul><li>Thông tin nhà được cập nhật</li><li>Lịch hẹn xem nhà</li><li>Hợp đồng ký gửi</li><li>Trạng thái pháp lý</li></ul></td><td><ul><li>Thông tin nhà, chủ nhà</li><li>Xác nhận / Yêu cầu đổi lịch hẹn</li><li>Lịch sử làm việc</li><li>Thông tin hợp đồng ký gửi</li><li>Lịch sử giao dịch</li></ul></td></tr><tr><td><p>Khách hàng</p></td><td><ul><li>Thông tin khách hàng</li><li>Mô tả nhà</li><li>Yêu cầu xem nhà</li><li>Xác nhận / Yêu cầu đổi lịch</li><li>Giao dịch tiền thuê nhà</li></ul></td><td><ul><li>Thông tin nhà</li><li>Trạng thái hợp đồng cho thuê</li><li>Lịch hẹn</li></ul></td></tr><tr><td><p>Môi giới</p></td><td><ul><li>Hợp đồng cho thuê</li><li>Lịch sử làm việc</li><li>Lịch hẹn</li></ul></td><td><ul><li>Thông tin hợp đồng cho thuê</li><li>Yêu cầu xem nhà</li><li>Xác nhận / Yêu cầu đổi lịch hẹn</li><li>Lịch sử làm việc</li><li>Giao dịch tiền hoa hồng</li><li>Lịch sử giao dịch</li></ul></td></tr></tbody></table></div>

### DFD lv0

Ảnh phóng to của DFD level 0: https://drive.google.com/drive/folders/1Spa4hS9VaTujjb4qJNUkEGwRtZLC8BfD?usp=sharing

Ở level 0: hệ thống có 7 Data Store:

|     |     |
| --- | --- |
| **Tên Data Store** | **Mô tả tóm tắt** |
| **Nhà ký gửi** | Lưu trữ thông tin về nhà được cung cấp bởi Chủ nhà, cập nhật bởi Nhân viên đại lý và cung cấp thông tin này cho Khách hàng. |
| **Chủ nhà** | Lưu trữ thông tin về Chủ nhà (họ tên, thông tin liên lạc, ...) do Chủ nhà cung cấp. |
| **Khách hàng** | Lưu trữ thông tin Khách hàng (họ tên, thông tin liên lạc, ...) do Khách hàng cung cấp. |
| **Hợp đồng ký gửi** | Lưu trữ điều khoản, trạng thái hiệu lực (hoặc tình trạng chấm dứt) của hợp đồng ký gửi giữa Chủ nhà và công ty. |
| **Hợp đồng cho thuê** | Lưu trữ thông tin chi tiết của các hợp đồng cho thuê đã được xác nhận hợp lệ, phục vụ cho việc tra cứu của Môi giới và Nhân viên đại lý. |
| **Lịch sử làm việc** | Lưu trữ toàn bộ ghi nhận về quá trình hoạt động, dẫn khách xem nhà và tương tác của Môi giới để Nhân viên đại lý truy xuất, theo dõi tiến độ. |
| **Lịch sử giao dịch** | Lưu trữ minh bạch tất cả các biến động tài chính (tiền đảm bảo, tiền thuê nhà, hoa hồng, giao dịch hoàn tiền) để phục vụ cho việc đối soát sổ sách và tra cứu. |

Ở level 0, hệ thống được phân rã thành 11 tiến trình chính:  

|     |     |     |     |
| --- | --- | --- | --- |
| **Tiến trình nghiệp vụ** | **Dữ liệu**  <br>**đầu vào** | **Dữ liệu**  <br>**đầu ra** | **Mô tả tóm tắt** |
| 0: Xử lý thông tin ký gửi | \- Thông tin nhà, chủ nhà (Từ: Chủ nhà) | \- Thông tin nhà (Lưu vào: D Nhà ký gửi)<br><br>\- Thông tin chủ nhà (Lưu vào: D Chủ nhà)<br><br>\- Thông tin ký gửi (Tới: Nhân viên đại lý) | Khi Chủ nhà có nhu cầu cho thuê, họ sẽ cung cấp các thông tin chi tiết về đặc điểm ngôi nhà cũng như thông tin cá nhân. Hệ thống sẽ tiếp nhận, phân tích, phân loại và lưu trữ các dữ liệu này vào hai kho dữ liệu "Nhà ký gửi" và "Chủ nhà". Đồng thời, một luồng thông tin tóm tắt về yêu cầu ký gửi sẽ được tự động gửi cho Nhân viên đại lý để họ nắm bắt tình hình. |
| 1: Xử lý hợp đồng ký gửi | \- Giao dịch tiền đảm bảo (1 tr) (Từ: Chủ nhà)<br><br>\- Trạng thái pháp lý (Từ: Nhân viên đại lý)<br><br>\- Hợp đồng ký gửi (Từ: Nhân viên đại lý | \- Hợp đồng ký gửi (Đến Chủ nhà)<br><br>\- Hợp đồng ký gửi (Lưu vào: D Hợp đồng ký gửi)<br><br>\- Giao dịch tiền đảm bảo (Lưu vào: D Lịch sử giao dịch) | Tiến trình này bắt đầu bằng việc nhân viên đem hợp đồng ký gửi đến cho chủ nhà. Sau khi Nhân viên đại lý xác nhận trạng thái pháp lý của bất động sản là hợp lệ và xác nhận khoản tiền đảm bảo trị giá 1 triệu đồng từ Chủ nhà, hệ thống sẽ cập nhật Hợp đồng ký gửi. Thông tin hợp đồng sẽ được lưu trữ vào kho "Hợp đồng ký gửi" và bản sao dữ liệu được phản hồi lại cho Chủ nhà. Thêm vào đó, giao dịch nộp tiền đảm bảo cũng sẽ được ghi nhận vào kho "Lịch sử giao dịch". |
| 2: Lấy thông tin khách hàng | \- Thông tin khách hàng (Từ: Khách hàng) | \- Thông tin khách hàng (Lưu vào: D Khách hàng) | Ghi nhận và lưu trữ hồ sơ của khách hàng có nhu cầu thuê. |
| 3: Lấy thông tin nhà | \- Yêu cầu xem nhà (Từ: Khách hàng)<br><br>\- Thông tin nhà (Từ: D Nhà ký gửi)<br><br>\- Thông tin hợp đồng cho thuê (Từ: D Hợp đồng cho thuê) | \- Mô tả nhà (Tới: Khách hàng) | Trích xuất thông tin nhà từ kho dữ liệu dựa trên yêu cầu xem nhà để cung cấp cho khách hàng. |
| 4: Xử lý lịch hẹn | \- Yêu cầu xem nhà (Từ: Khách hàng)<br><br>\- Lịch hẹn (Từ Nhân viên đại lý, Môi giới)<br><br>\- Xác nhận / Yêu cầu đổi lịch (Từ: Khách hàng) | \- Xác nhận / Yêu cầu đổi lịch (Tới: Nhân viên đại lý, Môi giới)<br><br>\- Yêu cầu xem nhà (Tới: Môi giới)<br><br>\- Lịch hẹn (Tới: Khách hàng) | Hệ thống tiếp nhận yêu cầu xem nhà từ phía khách hàng và chuyển tiếp thông tin này cho nhân viên đại lý và môi giới nắm bắt. Dựa trên yêu cầu đó, nhân viên đại lý và môi giới sẽ phối hợp sắp xếp một lịch hẹn phù hợp nhất và đẩy thông tin lịch hẹn đề xuất đến khách hàng.<br><br>Sau khi nhận được lịch, khách hàng sẽ tiến hành xem xét và gửi phản hồi (đồng ý hoặc muốn dời lịch) vào hệ thống. Phản hồi này được chuyển tới nhân viên đại lý và môi giới. Tại đây, hệ thống sẽ rẽ nhánh xử lý: nếu khách hàng yêu cầu thay đổi, nhân viên và môi giới sẽ dựa vào đó để chọn lại một ngày khác và gửi lại lịch mới; nếu khách hàng không cần thay đổi, lịch hẹn được xác nhận là lịch chính thức để các bên tiến hành gặp mặt. |
| 5: Xử lý tiền hoa hồng / thuê nhà | \- Giao dịch tiền thuê nhà (Từ: Khách hàng)<br><br>\- Hợp đồng cho thuê (Từ D: Hợp đồng cho thuê) | \- Giao dịch tiền thuê nhà (Tới: Chủ nhà)<br><br>\- Giao dịch tiền hoa hồng (Tới: Môi giới)<br><br>\- Giao dịch thuê nhà, hoa hồng (Lưu vào: D Lịch sử giao dịch) | Hệ thống tình toán tiền hoa hồng để trả cho môi giới và tiếp nhận các khoản thanh toán và ghi vết vào lịch sử giao dịch. |
| 6: Lưu hợp đồng cho thuê | \- Hợp đồng cho thuê (Từ: Môi giới)<br><br>\- Hợp đồng ký gửi (Từ: D Hợp đồng ký gửi) | \- Hợp đồng cho thuê (Lưu vào: D Hợp đồng cho thuê)<br><br>\- Lịch sử làm việc (Lưu vào: D Lịch sử làm việc)<br><br>\- Trạng thái hợp đồng cho thuê (Tới: Khách hàng) | Môi giới sẽ gửi thông tin hợp đồng cho thuê vào hệ thống. Tiến trình này sẽ thực hiện đối chiếu các điều khoản này với bản gốc trong kho "Hợp đồng ký gửi" để đảm bảo tính nhất quán, không vi phạm các thỏa thuận ban đầu với chủ nhà. Nếu mọi thông tin đều hợp lệ, Hợp đồng cho thuê chính thức sẽ được tạo lập và lưu trữ vĩnh viễn vào kho "Hợp đồng cho thuê". Sau đó, hệ thống sẽ cập nhật trạng thái hợp đồng gửi về cho khách hàng và lưu Lịch sử làm việc vào kho Lịch sử làm việc. |
| 7: Cập nhật lịch sử làm việc | \- Lịch sử làm việc (Từ: Môi giới) | \- Lịch sử làm việc (Lưu vào: D Lịch sử làm việc) | Ghi nhận lại các hoạt động và tiến độ công việc do phía môi giới thực hiện. |
| 8: Lấy lịch sử làm việc | \- Lịch sử làm việc (Từ: D Lịch sử làm việc) | \- Lịch sử làm việc (Tới: Nhân viên đại lý, Môi giới) | Truy xuất dữ liệu quá trình làm việc của môi giới để nhân viên đại lý và môi giới có thể kiểm tra, đối chiếu. |
| 9: Cập nhật thông tin nhà | \- Thông tin nhà được cập nhật (Từ: Nhân viên đại lý) | \- Thông tin được cập nhật (Lưu vào: D Nhà ký gửi) | Chỉnh sửa, bổ sung thông tin mới nhất về trạng thái hoặc đặc điểm của nhà vào kho dữ liệu. |
| 10: Xem thông tin hợp đồng | \- Thông tin hợp đồng cho thuê (Từ: Môi giới)<br><br>\- Hợp đồng cho thuê (Từ: D Hợp đồng cho thuê) | \- Hợp đồng cho thuê (Tới: Môi giới)<br><br>\- Hợp đồng ký gửi (Tới: Nhân viên đại lý) | Truy xuất và cung cấp chi tiết của một hợp đồng cho thuê cụ thể khi có yêu cầu. |
| 11: Kiểm tra thời hạn 6 tháng | \- Yêu cầu hủy (Từ: Chủ nhà)<br><br>\- Hợp đồng ký gửi (Từ: D Hợp đồng ký gửi) | \- Tình trạng chấm dứt (Tới: Tiến trình 12) | Khi chủ nhà muốn chấm dứt hợp đồng, hệ thống sẽ kiểm tra hồ sơ của căn nhà có thỏa mãn điều kiện: "đã qua mốc 6 tháng kể từ ngày ký gửi mà hệ thống vẫn chưa ghi nhận bất kỳ giao dịch cho thuê nào thành công" hay không. Kết quả của quá trình rà soát này sẽ được hệ thống ghi nhận thành "trạng thái chấm dứt" cho tiến trình 12. |
| 12: Chấm dứt hợp đồng | \- Tình trạng chấm dứt (Từ: Tiến trình 11) | \- Trạng thái hoàn tiền (Tới: Chủ nhà)<br><br>\- Giao dịch hoàn tiền (Lưu vào: D Lịch sử giao dịch)<br><br>\- Trạng thái chấm dút (Lưu vào: D Hợp đồng ký gửi) | Khi nhận được "tình trạng chấm dứt" (đã xác nhận hồ sơ thỏa mãn quy định: ) từ Tiến trình 11, hệ thống sẽ chính thức đóng hồ sơ bằng cách cập nhật "trạng thái chấm dứt" vào kho dữ liệu "Hợp đồng ký gửi". Ngay sau đó, tiến trình sẽ gửi trạng thái hoàn trả khoản tiền đảm bảo nếu đạt điều kiện nhà chưa được thuê sau 6 tháng cho chủ nhà, đồng thời lưu vết "giao dịch hoàn tiền" này vào kho "Lịch sử giao dịch". |
| 13: Xem giao dịch | \- Lịch sử giao dịch (Từ: D Lịch sử giao dịch) | \- Lịch sử giao dịch (Tới: Nhân viên đại lý, Môi giới) | Cho phép nhân viên đại lý và môi giới tra cứu và xem lại các biến động tài chính, dòng tiền đã diễn ra trong hệ thống. |

# Thiết kế hệ thống (System Design)

## Mô hình kiến trúc hệ thống \* Đặt hình ảnh kiến trúc tổng thể ở đây để người đọc nhìn một cách trực quan thay vì phải đọc chữ từ đầu.

## Thiết kế các module chức năngLựa chọn công nghệ

### a. Frontend: React

**React** được lựa chọn để xây dựng lớp giao diện người dùng (Frontend) của hệ thống. Đây là thư viện JavaScript phổ biến, hỗ trợ xây dựng giao diện web hiện đại, linh hoạt và có khả năng tái sử dụng cao.

Trong hệ thống, React được sử dụng để phát triển các giao diện đặc thù dành cho **ba nhóm người dùng chính**:

- **Chủ nhà**
- **Khách hàng**
- **Nhân viên / Môi giới**

Mỗi nhóm người dùng sẽ có các chức năng nghiệp vụ riêng như: gửi thông tin ký gửi, xem thông tin nhà, đặt lịch xem nhà, quản lý lịch hẹn, cập nhật hợp đồng và theo dõi hoa hồng.

React phù hợp với yêu cầu của hệ thống nhờ các ưu điểm nổi bật sau:

- **Xây dựng giao diện theo Component:** Các thành phần như _form đăng ký, form gửi thông tin nhà, danh sách nhà, chi tiết nhà, lịch hẹn, hợp đồng_ có thể được tách thành các component riêng biệt. Điều này giúp tổ chức mã nguồn rõ ràng, dễ bảo trì và tối ưu khả năng tái sử dụng.
- **Cập nhật giao diện nhanh chóng:** Khi có sự thay đổi về trạng thái hồ sơ nhà, lịch hẹn hoặc hợp đồng, React có khả năng cập nhật lại giao diện một cách linh hoạt mà không cần tải lại toàn bộ trang web.
- **Hỗ trợ giao diện Responsive:** Hệ thống cần hiển thị tốt trên cả máy tính và thiết bị di động (đặc biệt quan trọng đối với nhân viên môi giới khi đi khảo sát thực địa). React kết hợp với các CSS Framework hoặc thư viện giao diện giúp xây dựng trải nghiệm người dùng thân thiện trên nhiều kích thước màn hình.
- **Dễ dàng tích hợp API:** React có thể gọi các REST API từ Backend để lấy và xử lý luồng dữ liệu liên quan đến nhà ở, lịch hẹn, hợp đồng, thông báo và thông tin người dùng.

Vai trò của React trong hệ thống:

- Hiển thị danh sách các căn nhà đang được cho thuê.
- Hiển thị chi tiết thông tin nhà và hình ảnh đính kèm.
- Cung cấp biểu mẫu (form) đăng ký, đăng nhập.
- Cung cấp biểu mẫu gửi thông tin ký gửi nhà.
- Hỗ trợ luồng thao tác: đặt, đổi và hủy lịch xem nhà.
- Hiển thị thông tin hợp đồng, trạng thái tiền đảm bảo, hoàn tiền và hoa hồng.
- Tạo giao diện cá nhân hóa theo từng vai trò và quyền hạn của người dùng.

### b. Backend: Node.js

Node.js được lựa chọn để xây dựng lớp xử lý nghiệp vụ phía máy chủ. Backend chịu trách nhiệm tiếp nhận yêu cầu từ Frontend, xử lý logic nghiệp vụ, xác thực người dùng, phân quyền và giao tiếp với cơ sở dữ liệu sqlite.

Trong hệ thống này, Node.js có thể được kết hợp với framework **Express.js** để xây dựng REST API. Các API này phục vụ cho những chức năng như đăng ký, đăng nhập, quản lý nhà ký gửi, đặt lịch xem nhà, quản lý hợp đồng, xử lý tiền đảm bảo và tính hoa hồng.

Node.js phù hợp với hệ thống vì các lý do sau:

- **Xử lý tốt các yêu cầu đồng thời**: Hệ thống có nhiều người dùng truy cập cùng lúc để tìm kiếm nhà, đặt lịch xem nhà hoặc cập nhật hồ sơ. Node.js có mô hình xử lý bất đồng bộ, phù hợp với các ứng dụng web có nhiều thao tác đọc/ghi dữ liệu.
- **Phù hợp để xây dựng REST API**: Backend có thể cung cấp các API rõ ràng cho Frontend React, giúp tách biệt giao diện và xử lý nghiệp vụ.
- **Dùng chung ngôn ngữ JavaScript**: Cả Frontend và Backend đều sử dụng JavaScript, giúp quá trình phát triển thống nhất hơn, giảm chi phí học tập và trao đổi giữa các thành viên trong nhóm.
- **Dễ tích hợp với dịch vụ bên ngoài**: Node.js hỗ trợ tốt việc tích hợp các dịch vụ như gửi email/OTP, thông báo, thanh toán QR hoặc lưu trữ hình ảnh.
- **Cộng đồng lớn, nhiều thư viện hỗ trợ**: Có nhiều thư viện hỗ trợ xác thực JWT, mã hóa mật khẩu, upload file, kiểm tra dữ liệu đầu vào và kết nối sqlite.

Vai trò của Node.js trong hệ thống:

- Xử lý đăng ký, đăng nhập, đăng xuất.
- Xác thực và phân quyền người dùng theo vai trò Chủ nhà, Khách hàng, Nhân viên.
- Tiếp nhận và xử lý thông tin nhà ký gửi.
- Quản lý trạng thái hồ sơ nhà: đang ký gửi, đang khảo sát, chờ đóng phí, đã đăng tin, đã cho thuê, đã hủy.
- Xử lý đặt lịch, đổi lịch, hủy lịch xem nhà.
- Quản lý hợp đồng ký gửi và hợp đồng thuê.
- Theo dõi tiền đảm bảo 1.000.000 VNĐ và điều kiện hoàn tiền sau 6 tháng.
- Tự động tính hoa hồng cho nhân viên khi hợp đồng thuê được chốt.
- Gửi thông báo đến người dùng khi có thay đổi trạng thái.

### c. Database: sqlite

sqlite được lựa chọn làm hệ quản trị cơ sở dữ liệu cho hệ thống. Đây là hệ quản trị cơ sở dữ liệu quan hệ phổ biến, ổn định, dễ sử dụng và phù hợp với các hệ thống quản lý nghiệp vụ có nhiều bảng dữ liệu liên kết với nhau.

Hệ thống quản lý ký gửi và cho thuê nhà có nhiều nhóm dữ liệu quan hệ như người dùng, nhà ký gửi, lịch hẹn, hợp đồng, tiền đảm bảo, hoa hồng và lịch sử làm việc. Vì vậy, sqlite là lựa chọn phù hợp để đảm bảo tính nhất quán và toàn vẹn dữ liệu.

sqlite phù hợp với hệ thống vì các lý do sau:

- **Phù hợp với dữ liệu có quan hệ rõ ràng**: Các thực thể như Chủ nhà, Khách hàng, Nhân viên, Nhà, Lịch hẹn, Hợp đồng và Hoa hồng có mối quan hệ chặt chẽ với nhau. sqlite hỗ trợ khóa chính, khóa ngoại và ràng buộc dữ liệu để quản lý các quan hệ này.
- **Đảm bảo tính toàn vẹn dữ liệu**: Những nghiệp vụ như tạo hợp đồng, ghi nhận tiền đảm bảo, hoàn tiền và tính hoa hồng cần dữ liệu chính xác. sqlite hỗ trợ transaction để đảm bảo các thao tác quan trọng được thực hiện nhất quán.
- **Hiệu năng tốt cho truy vấn nghiệp vụ**: Hệ thống cần tìm kiếm, lọc danh sách nhà và truy vấn hợp đồng, lịch hẹn thường xuyên. sqlite hỗ trợ đánh chỉ mục để tối ưu tốc độ truy vấn.
- **Dễ triển khai và bảo trì**: sqlite có tài liệu đầy đủ, công cụ quản trị phổ biến và dễ triển khai trong môi trường học tập hoặc thực tế.
- **Tương thích tốt với Node.js**: Node.js có nhiều thư viện hỗ trợ kết nối sqlite như sqlite2, sequelize hoặc prisma.

Vai trò của sqlite trong hệ thống:

- Lưu thông tin tài khoản người dùng và vai trò.
- Lưu thông tin nhà ký gửi.
- Lưu hình ảnh và tài liệu liên quan dưới dạng đường dẫn file.
- Lưu lịch hẹn xem nhà.
- Lưu hợp đồng ký gửi và hợp đồng thuê.
- Lưu giao dịch tiền đảm bảo, trạng thái hoàn tiền.
- Lưu thông tin hoa hồng của nhân viên.
- Lưu lịch sử làm việc và thông báo.

## Thiết kế cơ sở dữ liệu

### ERD

### Mô tả các bảng dữ liệu

# b1. Bảng Chủ Nhà (ChuNha)

Lưu trữ thông tin các chủ sở hữu nhà thực hiện ký gửi nhà cho thuê tại đại lý.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| id  | INT | PK, AI, NN | Mã chủ nhà |
| ho_ten | VARCHAR(100) | NN  | Họ và tên chủ nhà |
| so_dien_thoai | VARCHAR(20) | NN, UQ | Số điện thoại liên hệ |
| email | VARCHAR(100) | UQ  | Email liên hệ |
| dia_chi_lien_he | VARCHAR(255) | NULL | Địa chỉ liên hệ |
| created_at | DATETIME | NN  | Ngày tạo hồ sơ |

**Mục đích:** Quản lý thông tin cá nhân của các chủ nhà có nhu cầu cho thuê bất động sản thông qua đại lý.

# b2. Bảng Nhà Cho Thuê (NhaChoThue)

Lưu trữ thông tin chi tiết các bất động sản được chủ nhà ký gửi cho đại lý.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| id  | INT | PK, AI, NN | Mã khách hàng |
| ho_ten | VARCHAR(100) | NN  | Họ và tên khách hàng |
| so_dien_thoai | VARCHAR(20) | NN, UQ | Số điện thoại |
| email | VARCHAR(100) | UQ  | Email |
| dia_chi_lien_he | VARCHAR(255) | NULL | Địa chỉ liên hệ |
| trang_thai_thanh_vien | VARCHAR(50) | NN  | Trạng thái thành viên |
| created_at | DATETIME | NN  | Ngày tạo |

**Mục đích:** Quản lý danh sách các bất động sản được ký gửi cho thuê.

# b3. Bảng Khách Hàng (KhachHang)

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| id  | INT | PK, AI, NN | Mã khách hàng |
| ho_ten | VARCHAR(100) | NN  | Họ và tên khách hàng |
| so_dien_thoai | VARCHAR(20) | NN, UQ | Số điện thoại |
| email | VARCHAR(100) | UQ  | Email |
| dia_chi_lien_he | VARCHAR(255) | NULL | Địa chỉ liên hệ |
| trang_thai_thanh_vien | VARCHAR(50) | NN  | Trạng thái thành viên |
| created_at | DATETIME | NN  | Ngày tạo |

**Mục đích:** Quản lý thông tin khách hàng có nhu cầu tìm thuê nhà.

# b4. Bảng Môi Giới (MoiGioi)

Lưu trữ thông tin các nhân viên môi giới trực tiếp thực hiện giao dịch.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| id  | INT | PK, AI, NN | Mã môi giới |
| ho_ten | VARCHAR(100) | NN  | Họ tên môi giới |
| so_dien_thoai | VARCHAR(20) | NN, UQ | Số điện thoại |
| email | VARCHAR(100) | UQ  | Email |
| ty_le_hoa_hong | DECIMAL(5,2) | NN  | Tỷ lệ hoa hồng (%) |
| created_at | DATETIME | NN  | Ngày tạo |

**Mục đích:** Quản lý đội ngũ môi giới tham gia hoạt động cho thuê nhà.

# b5. Bảng Nhân Viên Đại Lý (NhanVienDaiLy)

Lưu trữ thông tin nhân viên làm việc tại đại lý.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| id  | INT | PK, AI, NN | Mã nhân viên |
| ho_ten | VARCHAR(100) | NN  | Họ tên nhân viên |
| so_dien_thoai | VARCHAR(20) | NN, UQ | Số điện thoại |
| email | VARCHAR(100) | UQ  | Email |
| chuc_vu | VARCHAR(50) | NN  | Chức vụ |
| created_at | DATETIME | NN  | Ngày tạo |

**Mục đích:** Quản lý nhân sự của đại lý tham gia xử lý hồ sơ và giao dịch.

# b6. Bảng Hợp Đồng Ký Gửi (HopDongKyGui)

Lưu trữ thông tin hợp đồng ký gửi nhà giữa chủ nhà và đại lý.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| id  | INT | PK, AI, NN | Mã hợp đồng ký gửi |
| chu_nha_id | INT | FK, NN | Chủ nhà |
| nha_cho_thue_id | INT | FK, NN | Nhà ký gửi |
| nhan_vien_dai_ly_id | INT | FK, NN | Nhân viên phụ trách |
| ngay_ky | DATETIME | NN  | Ngày ký |
| ngay_het_han | DATETIME | NN  | Ngày hết hạn |
| tien_cam_ket | DECIMAL(15,2) | NN  | Tiền cam kết |
| trang_thai_phap_ly | VARCHAR(50) | NN  | Trạng thái pháp lý |
| trang_thai_hop_dong | VARCHAR(50) | NN  | Trạng thái hợp đồng |
| dieu_khoan | TEXT | NULL | Điều khoản |
| created_at | DATETIME | NN  | Ngày tạo |

**Mục đích:** Quản lý quá trình ký gửi nhà cho thuê từ chủ nhà đến đại lý.

# b7. Bảng Hợp Đồng Cho Thuê (HopDongChoThue)

Lưu trữ thông tin hợp đồng thuê nhà giữa khách hàng và chủ nhà.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| id  | INT | PK, AI, NN | Mã hợp đồng thuê |
| khach_hang_id | INT | FK, NN | Khách hàng |
| chu_nha_id | INT | FK, NN | Chủ nhà |
| nha_cho_thue_id | INT | FK, NN | Nhà cho thuê |
| moi_gioi_id | INT | FK, NN | Môi giới |
| ngay_ky | DATETIME | NN  | Ngày ký |
| ngay_bat_dau_thue | DATETIME | NN  | Ngày bắt đầu thuê |
| ngay_ket_thuc_thue | DATETIME | NN  | Ngày kết thúc thuê |
| gia_thue | DECIMAL(15,2) | NN  | Giá thuê |
| tien_dat_coc | DECIMAL(15,2) | NN  | Tiền đặt cọc |
| ty_le_hoa_hong | DECIMAL(5,2) | NN  | Tỷ lệ hoa hồng |
| tien_hoa_hong | DECIMAL(15,2) | NN  | Tiền hoa hồng |
| trang_thai | VARCHAR(50) | NN  | Trạng thái |
| dieu_khoan | TEXT | NULL | Điều khoản |
| created_at | DATETIME | NN  | Ngày tạo |

**Mục đích:** Quản lý các giao dịch thuê nhà đã được ký kết thành công.

# b8. Bảng Lịch Sử Làm Việc (LichSuLamViec)

Lưu trữ toàn bộ quá trình tác nghiệp của nhân viên và môi giới liên quan đến các hợp đồng.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Mô tả** |
| --- | --- | --- | --- |
| id  | INT | PK, AI, NN | Mã lịch sử |
| khach_hang_id | INT | FK, NN | Khách hàng |
| moi_gioi_id | INT | FK, NN | Môi giới |
| nhan_vien_dai_ly_id | INT | FK, NN | Nhân viên |
| nha_cho_thue_id | INT | FK, NN | Nhà liên quan |
| hop_dong_cho_thue_id | INT | FK, NN | Hợp đồng thuê |
| thoi_gian_lam_viec | DATETIME | NN  | Thời gian làm việc |
| loai_lam_viec | VARCHAR(100) | NN  | Loại công việc |
| noi_dung | TEXT | NULL | Nội dung |
| ket_qua | TEXT | NULL | Kết quả |
| created_at | DATETIME | NN  | Ngày tạo |

**Mục đích:** Theo dõi lịch sử chăm sóc khách hàng, dẫn xem nhà, tư vấn và xử lý hồ sơ.

# b9. Bảng Lịch Sử Giao Dịch (LichSuGiaoDich)

Lưu trữ các giao dịch tài chính phát sinh trong quá trình ký gửi và cho thuê.

**Mục đích:** Theo dõi và lưu vết toàn bộ các khoản thanh toán, đặt cọc, hoa hồng và các giao dịch tài chính phát sinh trong hệ thống.

### Quan hệ giữa các bảng

## Thiết kế APIThiết kế giao diện người dùngThiết kế bảo mật và phân quyền

# Cài đặt và thực nghiệm

# Kết luận

## Kết quả đạt đượcHạn chế Hướng phát triển trong tương lai