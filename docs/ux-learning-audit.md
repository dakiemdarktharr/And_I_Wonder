# UI/UX và trải nghiệm học — 9/10/2026

## Đánh giá và thay đổi

Giao diện trước có bản sắc rõ ở ba cổng vào, nhưng trang học dài và nhiều khối có cùng trọng lượng thị giác. Người học khó biết nên bắt đầu ở đâu; việc mở toàn bộ đáp án quá sớm khuyến khích đọc thụ động. Các biểu đồ có dữ liệu đúng nhưng chỉ xem được. Calendar chưa ưu tiên đủ việc quay lại buổi học đang dở. Hướng dẫn dự án và bìa thư viện chưa truyền đạt đủ nội dung thực tế.

| Vấn đề | Cách xử lý |
|---|---|
| Đọc lâu, nhiều màu mạnh cạnh tranh với nội dung | Nền kem, mực tối, bề mặt đọc sáng; màu đậm dành cho hành động và dữ liệu cần phân biệt |
| Cần giữ pop art / heavy cel-shading | Viền mực 2–3 px, bóng cứng lệch 3–8 px, khối màu phẳng và các vật thể minh họa; giữ halftone ở trang vào |
| Lạc vị trí trong bài dài | Mục lục bám dưới header, neo từng phần, chế độ tập trung, thu gọn nền tảng tuần và ghi chú gốc |
| Tiến độ dễ bị hiểu thành năng lực | Chỉ báo “khối học đã hoàn thành”; không coi checkbox là đã thành thạo |
| Xem đáp án ngay, ít tự làm | Bản nháp theo bước, gợi ý riêng, mở/ẩn lời giải từng bước, phản hồi cho đáp số được chọn |
| Đồ thị tĩnh | Chọn chuỗi, ẩn/hiện, lần theo điểm, xem giá trị; chọn ô ma trận, lần theo suy luận; thêm mô hình tham số ở các bài phù hợp |
| Transition bị cắt khi đổi trang | Lớp chuyển cảnh nằm ở layout tồn tại xuyên route, mở rộng rồi tan khỏi trang đích; có timeout phục hồi và reduced motion |
| Daily thiếu vật thể liên quan | Lịch, checklist, bút và đồng hồ rơi từ cổng, đáp xuống rồi tan thành hạt |
| Dự án chưa đủ cụ thể để bắt tay làm | Năm bản hướng dẫn song ngữ: đầu vào, các bước, cây thư mục, số liệu kiểm tra, chỉ số báo cáo, bẫy và mốc bàn giao |
| Bìa sách chỉ mang tính biểu tượng | Thumbnail nguồn thật hoặc trang đầu PDF, manifest ghi nguồn; giấy cuộn có mặt tròn hướng ra người xem |
| Checklist mobile bị ép chữ vào cột nhỏ | Sửa grid khi ẩn số thứ tự; kiểm thử chiều rộng nội dung ở màn hình nhỏ |

## Palette

| Vai trò | Màu | Cách dùng |
|---|---|---|
| Giấy nền | `#F6F1E7` | Trang và khoảng nghỉ |
| Bề mặt đọc | `#FFFCF5` | Nội dung bài, tránh texture sau đoạn văn |
| Mực | `#202E36` | Chữ, viền và bóng cel |
| Xanh thép | `#315D8A` | Hành động chính, điều hướng, trạng thái chọn |
| Sage | `#BED5C9` | Phân vùng lịch, phần giải thích |
| Vàng đất | `#E8C96B` | Mốc học và sản phẩm cần bàn giao |
| Đất nung | `#C47760` | Cổng thư viện và điểm nhấn nhỏ |

Mục tiêu là giảm cạnh tranh thị giác và tăng độ đọc rõ. Đây là quyết định thiết kế, không phải khẳng định một màu cụ thể tự nó làm tăng khả năng ghi nhớ. Đồ thị có nhãn, giá trị và trạng thái ngoài màu sắc. Chữ nội dung không dùng uppercase kéo dài; tiêu đề lớn giữ chất Swiss/pop art.

## Những mô hình học đã tham khảo

- [Khan Academy — cách luyện tập](https://blog.khanacademy.org/how-should-people-practice-on-khan-academy/): gợi ý, giải thích và cơ hội tự diễn đạt lập luận. Áp dụng việc thử làm trước, sau đó so sánh từng bước.
- [Brilliant — mathematics](https://brilliant.org/mathematics/): học qua thao tác với mô hình và giải bài. Áp dụng chu trình dự đoán → thay một tham số → quan sát → giải thích.
- [IXL — SmartScore](https://www.ixl.com/help-center/article/1272663/how_does_the_smartscore_work): phản hồi luyện tập rõ ràng. Website này chỉ ghi hoàn thành và phản hồi cục bộ; chưa triển khai điểm thành thạo thích nghi.
- [Coursera — mastery learning](https://blog.coursera.org/how-to-integrate-mastery-learning-into-course-design/): chia nhỏ học phần, phản hồi, quay lại kiến thức và thử lại. Áp dụng cấu trúc lý thuyết → ví dụ → khám phá → tự luyện → sản phẩm.

## Phạm vi tương tác thực tế

- **523/523 bài tập** có workspace gắn riêng bằng khóa tuần/ngày/ID; **1.614 đoạn lời giải song ngữ** lấy từ chính lời giải của bài đó. 489 ID thô không đủ duy nhất, nên dùng khóa kết hợp để không lẫn bản nháp giữa các tuần.
- **164 bài, 182 điểm kiểm tra số học** có giá trị đích và dung sai khai báo rõ; nhận số thập phân Việt/Anh và phân số đơn giản. Không thực thi chuỗi nhập như mã.
- **359 bài** dùng tự làm và đối chiếu từng bước, phù hợp với chứng minh, lập trình và thiết kế nghiên cứu. Không có chấm tự động toàn bộ chứng minh hay mã nguồn.
- **52 bộ tham số bài tập và 6 bộ tham số ví dụ lý thuyết**, trên 19 loại mô hình tính toán: đạo hàm/sai phân, Hessian, OLS, Bayes, nhị thức, chuẩn, exponential, epsilon, KKT, gradient descent, Kalman, EWMA, AR, Beta, proximal, phương sai danh mục, Chebyshev, Hoeffding và Wilson.
- **523 hình theo buổi học** hỗ trợ khám phá dữ liệu hoặc lập luận. Công cụ đọc điểm/ô/bước khác với mô hình thay tham số; không gọi tất cả chúng là 523 mô phỏng toán riêng.
- Mô hình tính lồi dùng đúng `H=2[[a,b],[b,c]]`, hai trị riêng và mặt `ax²+2bxy+cy²`. Một dây cung thỏa Jensen không được coi là chứng minh toàn cục. Các mô hình có nút về dữ kiện gốc và nhãn rõ khi đang thử biến thể.
- Bản nháp bài tập lưu riêng trong trình duyệt. Checkbox của chủ tài khoản vẫn lưu MongoDB; khách không có quyền sửa tiến độ đó.

## Kiểm tra nội dung

Rà soát 175 bài đầu phát hiện và sửa phép kiểm tra thuộc span, sai số vi phân, điểm tối ưu quadratic đã dịch, trục PCA, thí nghiệm Monte Carlo có seed, lãi kép, thời điểm công bố đặc trưng, phương sai ước lượng, persistence MAE và xếp hạng tín hiệu. Gợi ý sai đi kèm cũng được sửa. Những điểm kiểm tra số học tuần 36–105 được đối chiếu lại với đề cụ thể, bao gồm ma trận chuyển trạng thái và quy ước turnover.

Chạy `node scripts/correct-foundation-answers.mjs` sau khi tái tạo dữ liệu nền tảng, rồi `node scripts/build-exercise-checkpoints.mjs`. Bộ sinh checkpoint báo lỗi nếu một khóa được chấm số không tồn tại, không tự đoán đáp số từ văn bản.

## Kiểm chứng kỹ thuật

Kiểm thử bao phủ toán học độc lập, đồ thị hữu hạn ở biên thanh trượt, tương ứng khóa bài, cấu trúc đủ 523 buổi, parser đáp số, OAuth, quyền ghi, Markdown/Obsidian và rollback khi lưu thất bại. Browser chạy desktop và mobile cho điều hướng, ngôn ngữ, checkbox, bản nháp, đáp số đúng/sai, Hessian đổi dấu, reset, reduced motion, bìa sách và hướng dẫn dự án. Build production được kiểm tra riêng. Những kiểm tra browser dùng tài khoản giả lập chỉ xác minh hành vi lỗi; không được tính là bằng chứng một lần ghi MongoDB thật.

Kết quả bản production cục bộ: **41/41 kiểm thử unit/integration đạt; 25 kiểm thử browser đạt**, một trường hợp hover desktop chủ động bỏ qua trên thiết bị cảm ứng; TypeScript và build production đạt. Tám ảnh kiểm tra desktop/mobile không tràn ngang và không có lỗi JavaScript. Lỗi tìm kiếm bị xóa chuỗi khi phản hồi phiên đăng nhập đến muộn cũng đã được sửa và có kiểm thử hồi quy riêng.
