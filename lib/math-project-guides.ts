export {researchProjectGuides as mathProjectGuides} from './research-project-guides';
/** Original v2 mathematical briefs; canonical shared by pages and public search. */
export const archivedMathProjectGuides=[
 {id:'P01',en:'Projection, conditioning and stable least squares',vi:'Phép chiếu, độ điều kiện và bình phương tối thiểu ổn định',weeks:'W05–16',
 enBody:String.raw`**Question.** When does an exact least-squares identity remain a trustworthy numerical calculation?

1. Prove the projection/orthogonality result for a full-column-rank matrix $A\in\mathbb R^{n\times p}$, not only a 2×2 example. Explain the null-space case with the pseudoinverse.
2. Derive the normal equations and identify why forming $A^TA$ squares the 2-norm condition number. Use QR or SVD solves for the actual implementation.
3. Fixture: $A=((1,0),(1,1),(1,2))$, $b=(1,2,2)^T$ gives coefficients $(7/6,1/2)^T$ and residual $(-1/6,1/3,-1/6)^T$. Verify $A^Tr=0$ using exact fractions independently of your solver.
4. Construct nearly dependent columns $(1,1,1)^T$ and $(1,1+\epsilon,1-\epsilon)^T$; compare solution error and residual norm as ε shrinks. State input perturbation and precision explicitly.
5. Deliver a proof notebook, a tiny runnable solver with fixtures, and a numerical failure report. A small residual alone does not establish a small coefficient error.

**Acceptance:** proof hypotheses and dimensions correct; exact fixture correct; QR/SVD used; a genuine conditioning failure explained. Use the 50-minute derivation/numerical blocks already in W05–16; there is no additional project homework.`,
 viBody:String.raw`**Câu hỏi.** Khi nào một đồng nhất thức bình phương tối thiểu chính xác vẫn cho phép tính số đáng tin?

1. Chứng minh kết quả chiếu/trực giao với ma trận $A\in\mathbb R^{n\times p}$ hạng cột đầy đủ, không chỉ ví dụ 2×2. Giải thích trường hợp có không gian kernel bằng giả nghịch đảo.
2. Dẫn xuất phương trình chuẩn và lý do tạo $A^TA$ bình phương số điều kiện chuẩn 2. Dùng phép giải QR hoặc SVD khi cài đặt.
3. Fixture: $A=((1,0),(1,1),(1,2))$, $b=(1,2,2)^T$ cho hệ số $(7/6,1/2)^T$, phần dư $(-1/6,1/3,-1/6)^T$. Kiểm tra $A^Tr=0$ bằng phân số chính xác, độc lập solver.
4. Dựng hai cột gần phụ thuộc $(1,1,1)^T$ và $(1,1+\epsilon,1-\epsilon)^T$; so sai số nghiệm và chuẩn residual khi ε nhỏ dần. Ghi rõ nhiễu đầu vào và độ chính xác số.
5. Bàn giao notebook chứng minh, solver nhỏ chạy được có fixture và báo cáo lỗi số. Residual nhỏ tự nó không xác nhận sai số hệ số nhỏ.

**Đạt khi:** giả thiết/kích thước chứng minh đúng; fixture chính xác; dùng QR/SVD; giải thích một thất bại do độ điều kiện thật. Dùng các block dẫn xuất/số 50 phút đã có trong W05–16; không thêm bài dự án ngoài giờ.`},
 {id:'P02',en:'Inference with assumptions and a sandwich',vi:'Suy luận có giả thiết và phương sai sandwich',weeks:'W45–60',
 enBody:String.raw`**Question.** What uncertainty remains valid when an estimating equation is useful but its working likelihood is wrong?

1. Choose the ratio estimating equation $\sum W_i(Y_i-\theta)=0$ or the quasi-Poisson log-mean problem. State the estimand, IID sampling unit and moments. Do not use a financial row-wise IID assumption without a separate argument.
2. Derive consistency and the asymptotic linear expansion. Identify the derivative A and score variance B; prove the plug-in sandwich converges.
3. Compare model information and sandwich variance on a deliberately misspecified finite distribution. For $Y=3B$, $B\sim\mathrm{Bernoulli}(1/2)$, the log-mean asymptotic variance is 1, whereas Poisson information suggests 2/3.
4. Build a support-dependent Uniform endpoint counterexample. Derive its n-rate and exponential limit analytically before simulation.
5. Deliver a proof, assumptions table, exact fixtures and a simulation diagnostic. Plot empirical behavior only as implementation evidence; it is not proof of asymptotic validity.

**Acceptance:** no unidentified target, unjustified Taylor limit or unsupported information equality. Use W45–60 scheduled exercises and numerical blocks; repair time replaces extensions.`,
 viBody:String.raw`**Câu hỏi.** Bất định nào còn hợp lệ khi phương trình ước lượng hữu ích nhưng likelihood làm việc sai?

1. Chọn phương trình tỷ số $\sum W_i(Y_i-\theta)=0$ hoặc bài log-trung bình quasi-Poisson. Nêu đại lượng đích, đơn vị IID và moment. Không giả sử hàng dữ liệu tài chính IID khi chưa có lập luận riêng.
2. Dẫn xuất nhất quán và khai triển tuyến tính tiệm cận. Xác định đạo hàm A, phương sai score B; chứng minh sandwich thế vào hội tụ.
3. So information mô hình với sandwich trên phân phối hữu hạn cố ý chỉ định sai. Với $Y=3B$, $B\sim\mathrm{Bernoulli}(1/2)$, phương sai tiệm cận log-trung bình bằng 1, còn information Poisson gợi ý 2/3.
4. Dựng phản ví dụ đầu mút Uniform có support phụ thuộc tham số. Dẫn xuất tốc độ n và giới hạn mũ bằng toán trước mô phỏng.
5. Bàn giao chứng minh, bảng giả thiết, fixture chính xác và chẩn đoán mô phỏng. Đồ thị thực nghiệm chỉ là minh chứng cài đặt, không chứng minh tính hợp lệ tiệm cận.

**Đạt khi:** không có đích chưa xác định, giới hạn Taylor thiếu căn cứ hoặc đẳng thức information không được hỗ trợ. Dùng bài tập và block số W45–60; giờ sửa thay phần mở rộng.`},
 {id:'P03',en:'Dependent loss and chronological comparison',vi:'Loss phụ thuộc và so sánh theo thời gian',weeks:'W73–84',
 enBody:String.raw`**Question.** How much information is contained in overlapping forecast errors?

1. Derive the finite-n variance of an average from the full autocovariance matrix and then its long-run limit under absolute summability.
2. Use the moving-average fixture $D_t=h^{-1}\sum_{j=0}^{h-1}\epsilon_{t-j}$. Prove $\gamma_0=\sigma^2/h$ but $\Omega=\sigma^2$. Compare with an IID formula and explain the factor h.
3. Implement paired loss differences on identical forecast origins. Resample aligned time blocks, never independent streams; record bandwidth/block choices made before scoring.
4. Analyze two failures: a unit root and a common random component $D_t=Z+\epsilon_t$. Derive why stationary asymptotics do not follow simply from a stationary-looking plot.
5. Deliver an exact covariance test, a selected dependent-CLT assumption statement, a HAC/block sensitivity calculation and a bounded conclusion. External datasets are optional; all core work runs with original synthetic data on a CPU.

**Acceptance:** correct pairing, no future target access, and a derivation that distinguishes finite-sample variance, variance convergence and a distributional CLT. All work replaces corresponding W73–84 blocks.`,
 viBody:String.raw`**Câu hỏi.** Sai số dự báo chồng lấn chứa bao nhiêu thông tin?

1. Dẫn xuất phương sai hữu hạn n của trung bình từ toàn bộ ma trận tự hiệp phương sai, rồi giới hạn dài hạn dưới khả tổng tuyệt đối.
2. Dùng fixture trung bình trượt $D_t=h^{-1}\sum_{j=0}^{h-1}\epsilon_{t-j}$. Chứng minh $\gamma_0=\sigma^2/h$ nhưng $\Omega=\sigma^2$. So với công thức IID và giải thích hệ số h.
3. Cài đặt hiệu loss cặp trên cùng gốc dự báo. Lấy mẫu lại block thời gian đã ghép, không lấy hai chuỗi độc lập; ghi bandwidth/độ dài block chọn trước khi chấm.
4. Phân tích hai thất bại: nghiệm đơn vị và thành phần ngẫu nhiên chung $D_t=Z+\epsilon_t$. Dẫn xuất vì sao không suy ra tiệm cận dừng chỉ từ đồ thị trông dừng.
5. Bàn giao kiểm tra hiệp phương sai chính xác, giả thiết CLT phụ thuộc đã chọn, tính nhạy HAC/block và kết luận giới hạn. Dữ liệu ngoài tùy chọn; mọi phần lõi chạy trên CPU với dữ liệu giả lập nguyên bản.

**Đạt khi:** ghép cặp đúng, không truy cập nhãn tương lai và dẫn xuất phân biệt phương sai hữu hạn, hội tụ phương sai, CLT phân phối. Mọi việc thay block tương ứng W73–84.`},
 {id:'P04',en:'Learning bounds and partial feedback',vi:'Cận học thống kê và phản hồi từng phần',weeks:'W85–96',
 enBody:String.raw`**Question.** Which guarantee matches the sampling and feedback model?

1. Prove a finite-class uniform bound and the ERM 2ε excess-risk bound. Name the fixed hypothesis class, loss range and IID assumption.
2. Prove projected OGD regret with D,G,T and the comparator class explicit. Test the zero-diameter and zero-gradient boundaries.
3. For a Bernoulli bandit, derive Beta posterior updates and a UCB pull-count bound from its concentration event. Separate pseudo-regret, realized regret and full-information online loss.
4. Construct delayed feedback where the immediate-feedback proof's sample count is incorrect. Describe what must change; do not assert an unchanged bound.
5. Deliver three proof sheets plus one counterexample. A Thompson-sampling regret theorem used as a black box must be named as such. Dynamic regret is elective replacement work, not an extra compulsory project.

**Migration:** v1 P04 was an agent research workbench. That artifact remains in the legacy view. v2 P04 is mathematical learning theory, and is not completed by finishing the old automation project.`,
 viBody:String.raw`**Câu hỏi.** Bảo đảm nào khớp mô hình lấy mẫu và phản hồi?

1. Chứng minh cận đồng đều lớp hữu hạn và cận excess risk ERM 2ε. Nêu lớp giả thuyết cố định, miền loss và giả thiết IID.
2. Chứng minh regret OGD có chiếu với D,G,T và lớp đối chứng rõ ràng. Kiểm tra biên đường kính không và gradient không.
3. Với bandit Bernoulli, dẫn xuất cập nhật hậu nghiệm Beta và cận số lần kéo UCB từ biến cố tập trung. Tách pseudo-regret, regret thực hiện và loss online phản hồi đầy đủ.
4. Dựng phản hồi trễ làm số mẫu trong chứng minh phản hồi tức thì sai. Nêu phần phải đổi; không khẳng định cận giữ nguyên.
5. Bàn giao ba bản chứng minh cùng một phản ví dụ. Định lý regret Thompson sampling dùng như hộp đen phải ghi rõ. Dynamic regret là công việc elective thay thế, không phải dự án bắt buộc thêm.

**Migration:** P04 v1 là workbench nghiên cứu bằng agent. Artifact ấy vẫn ở bản cũ. P04 v2 là toán học learning theory, không được tính hoàn thành nhờ dự án automation cũ.`},
 {id:'P05',en:'Sequential-inference mathematical capstone',vi:'Capstone toán suy luận tuần tự',weeks:'W97–105',
 enBody:String.raw`**Main track:** a Gaussian state-space predictor with fixed versus past-only adaptive noise. The earlier Thompson-sampling/UCB replication remains a separate legacy project; bandits are now linked through P04 and W92–96.

1. W97: derive conditional Gaussian projection, innovation orthogonality and an observability failure. State state/observation dimensions and independence assumptions.
2. W98: derive paired dependent uncertainty, a unit-root failure and innovation likelihood. Distinguish conditional moment checks from full calibration.
3. W99–101: complete the four-part A exam, scheduled repair and transfer B. Project completion cannot waive a failed mathematical gate.
4. W102: prove the Joseph covariance identity; quantify wrong-R risk exactly (assumed gain 1/2 has MSE 5/4, optimal gain 1/5 has MSE 4/5). Prove the bias from selecting the smallest noisy validation estimate.
5. W103–105: repair and reconstruct proofs; produce a local report with theorem hypotheses, counterexamples, fixtures, timestamps, dependent uncertainty and remaining gaps. Keep failed outcomes visible.

**CPU-only experiment:** a two-dimensional linear Gaussian generator is enough. Begin with exact scalar/matrix fixtures, then simulate a declared noise shift. Such a shift is a mismatch diagnostic; do not apply a stationary CLT across it without a new argument. No rented GPU, paid data, API or market-profit claim is required.

**Acceptance:** all four reasoning domains pass their manual rubrics with no critical error, and the capstone's claims are traced to derivations. This establishes evidence of selected coursework competence, not original research independence or a degree. Publishing is a separate user-authorized step.`,
 viBody:String.raw`**Nhánh chính:** dự báo trạng thái Gaussian với nhiễu cố định so với thích nghi chỉ dùng quá khứ. Dự án tái lập Thompson sampling/UCB cũ giữ riêng ở v1; bandits nay liên kết qua P04 và W92–96.

1. W97: dẫn xuất phép chiếu Gaussian có điều kiện, innovation trực giao và thất bại quan sát. Nêu kích thước trạng thái/quan sát và giả thiết độc lập.
2. W98: dẫn xuất bất định phụ thuộc cặp, thất bại nghiệm đơn vị và likelihood innovation. Phân biệt kiểm tra moment có điều kiện với hiệu chuẩn đầy đủ.
3. W99–101: hoàn thành đề A bốn phần, buổi sửa trong lịch và đề B chuyển bối cảnh. Hoàn thành dự án không miễn gate toán bị trượt.
4. W102: chứng minh đồng nhất thức Joseph; định lượng rủi ro R sai chính xác (gain giả định 1/2 có MSE 5/4, gain tối ưu 1/5 có MSE 4/5). Chứng minh độ chệch khi chọn validation nhiễu nhỏ nhất.
5. W103–105: sửa và tái dựng chứng minh; viết báo cáo cục bộ có giả thiết định lý, phản ví dụ, fixture, thời điểm, bất định phụ thuộc và phần còn thiếu. Giữ kết quả trượt rõ ràng.

**Thí nghiệm chỉ cần CPU:** bộ sinh tuyến tính Gaussian hai chiều là đủ. Bắt đầu bằng fixture vô hướng/ma trận chính xác rồi mô phỏng dịch chuyển nhiễu đã nêu. Dịch chuyển này là chẩn đoán sai mô hình; không áp dụng CLT dừng xuyên nó khi chưa có lập luận mới. Không cần GPU thuê, dữ liệu/API trả tiền hoặc kết luận lợi nhuận thị trường.

**Đạt khi:** bốn mảng lập luận đạt rubric thủ công, không lỗi nghiêm trọng và mọi kết luận capstone truy được về dẫn xuất. Đây là minh chứng năng lực học phần được chọn, không phải độc lập nghiên cứu mới hay bằng cấp. Publish là bước riêng cần người dùng yêu cầu.`},
];
