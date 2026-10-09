import type { Bilingual } from '../../lib/lesson-types';

export type FoundationExerciseTeaching = {
  application: Bilingual;
  formula: Bilingual;
  steps: Bilingual[];
  solution?: Bilingual[];
};

type Pair = readonly [string, string];
const bi = (en: string, vi: string): Bilingual => ({ en: String.raw`${en}`, vi: String.raw`${vi}` });
const lesson = (application: Pair, formula: Pair, steps: Pair[]): FoundationExerciseTeaching => ({
  application: bi(...application),
  formula: bi(...formula),
  steps: steps.map(([en, vi]) => bi(en, vi)),
});

const teaching: Record<string, FoundationExerciseTeaching> = {
  'f-w001-e1': lesson(
    ['A derivative is the local sensitivity of a transformed measurement; the finite difference checks it over a nonzero interval.', 'Đạo hàm đo độ nhạy cục bộ của đại lượng biến đổi; sai phân hữu hạn kiểm tra độ dốc trên một khoảng khác không.'],
    ['In general, f′(a)=limₕ→₀[f(a+h)−f(a)]/h when this finite limit exists. For f(x)=½(3x−2)², f′(x)=3(3x−2)=9x−6; the forward difference [f(x+h)−f(x)]/h for h≠0 approximates f′(x) as h→0.', 'Nói chung, f′(a)=limₕ→₀[f(a+h)−f(a)]/h khi giới hạn hữu hạn này tồn tại. Với f(x)=½(3x−2)², f′(x)=3(3x−2)=9x−6; sai phân tiến [f(x+h)−f(x)]/h khi h≠0 xấp xỉ f′(x) khi h→0.'],
    [['Set u=3x−2 and differentiate ½u²: the outer derivative is u and u′=3.', 'Đặt u=3x−2 rồi lấy đạo hàm ½u²: đạo hàm lớp ngoài là u và u′=3.'], ['Substitute x=1 into the original function and derivative separately; this gives f(1)=½ and f′(1)=3.', 'Thay x=1 riêng vào hàm gốc và đạo hàm; nhận được f(1)=½ và f′(1)=3.'], ['Evaluate f(1.1), then divide f(1.1)−f(1) by 0.1; label that secant slope as an approximation, not the exact derivative.', 'Tính f(1,1), rồi chia f(1,1)−f(1) cho 0,1; gọi độ dốc dây cung là xấp xỉ, không phải đạo hàm chính xác.']],
  ),
  'f-w001-e2': lesson(
    ['A rank-deficient design cannot distinguish coefficient changes in its null space; predictions can still be unique.', 'Ma trận thiết kế thiếu hạng không phân biệt được các thay đổi hệ số thuộc kernel; dự đoán vẫn có thể duy nhất.'],
    ['For A∈Rᵐˣ² with columns a and 2a and a≠0, Aβ=(β₁+2β₂)a, rank(A)=1, and N(A)={β:β₁+2β₂=0}; if a=0, rank(A)=0 and N(A)=R². In general rank(A)+dim N(A)=number of columns.', 'Với A∈Rᵐˣ² có hai cột a và 2a, a≠0, ta có Aβ=(β₁+2β₂)a, rank(A)=1 và N(A)={β:β₁+2β₂=0}; nếu a=0 thì rank(A)=0 và N(A)=R². Tổng quát, rank(A)+dim N(A)=số cột.'],
    [['Recognize the second column is twice the first nonzero column, so the column span has dimension one.', 'Nhận ra cột thứ hai gấp đôi cột thứ nhất khác không, nên không gian cột có số chiều một.'], ['Set Aβ=0; the repeated row pattern reduces the kernel condition to β₁+2β₂=0.', 'Đặt Aβ=0; các hàng lặp lại rút điều kiện kernel về β₁+2β₂=0.'], ['For the target, solve β₁+2β₂=3 and parameterize all solutions as (3−2t,t), t∈R.', 'Với vế phải đã cho, giải β₁+2β₂=3 và tham số hóa mọi nghiệm thành (3−2t,t), t∈R.']],
  ),
  'f-w001-e3': lesson(
    ['A positive test is evidence about disease only after accounting for prevalence and false positives in the tested population.', 'Kết quả dương tính chỉ là bằng chứng về bệnh sau khi tính tỷ lệ hiện mắc và dương tính giả trong quần thể được xét nghiệm.'],
    ['Bayes: P(D|+) = P(+|D)P(D) / [P(+|D)P(D)+P(+|Dᶜ)P(Dᶜ)], with P(+|Dᶜ)=1−specificity.', 'Bayes: P(D|+) = P(+|D)P(D) / [P(+|D)P(D)+P(+|Dᶜ)P(Dᶜ)], trong đó P(+|Dᶜ)=1−độ đặc hiệu.'],
    [['In 10,000 people, prevalence 1% gives 100 with disease and 9,900 without disease.', 'Trong 10.000 người, tỷ lệ hiện mắc 1% cho 100 người bệnh và 9.900 người không bệnh.'], ['Apply sensitivity to the diseased group: 90 test positive; apply the 5% false-positive rate to the other group: 495 test positive.', 'Áp dụng độ nhạy cho nhóm bệnh: 90 dương tính; áp dụng tỷ lệ dương tính giả 5% cho nhóm còn lại: 495 dương tính.'], ['Divide true positives by all positives, 90/(90+495)=2/13; the denominator is the full positive group.', 'Chia số dương tính thật cho toàn bộ ca dương tính, 90/(90+495)=2/13; mẫu số là toàn bộ nhóm dương tính.']],
  ),
  'f-w001-e4': lesson(
    ['The ε–N definition turns a convergence claim into a threshold that works for every requested tolerance.', 'Định nghĩa ε–N biến khẳng định hội tụ thành ngưỡng có hiệu lực với mọi sai số yêu cầu.'],
    ['aₙ→L iff ∀ε>0 ∃N∈N ∀n≥N: |aₙ−L|<ε. For 2/n→0 choose N=⌊2/ε⌋+1.', 'aₙ→L khi và chỉ khi ∀ε>0 ∃N∈N ∀n≥N: |aₙ−L|<ε. Với 2/n→0, chọn N=⌊2/ε⌋+1.'],
    [['Start with an arbitrary ε>0 and solve the target inequality 2/n<ε for a lower bound on n.', 'Bắt đầu với ε>0 tùy ý và giải bất đẳng thức cần đạt 2/n<ε để tìm cận dưới của n.'], ['Choose the integer floor(2/ε)+1, which is strictly larger than 2/ε even when 2/ε is already an integer.', 'Chọn số nguyên floor(2/ε)+1; nó lớn hơn nghiêm ngặt 2/ε kể cả khi 2/ε vốn là số nguyên.'], ['For each n≥N, use n≥N>2/ε to conclude 2/n<ε, then close by the definition.', 'Với mọi n≥N, dùng n≥N>2/ε để suy ra 2/n<ε, rồi kết luận theo định nghĩa.']],
  ),
  'f-w001-e5': lesson(
    ['The model gives exact sampling moments; a seeded simulation provides reproducibility for a realization, not a proof of those moments.', 'Mô hình cho moment lấy mẫu chính xác; mô phỏng có seed tái lập một lần chạy, không chứng minh các moment đó.'],
    ['For IID Bernoulli(p), S~Binomial(n,p), E[S]=np, Var(S)=np(1−p), and SE(S/n)=√(p(1−p)/n).', 'Với Bernoulli(p) IID, S~Binomial(n,p), E[S]=np, Var(S)=np(1−p), và SE(S/n)=√(p(1−p)/n).'],
    [['Use independence and common success probability to identify S as Binomial(25,0.4).', 'Dùng tính độc lập và xác suất thành công chung để nhận diện S~Binomial(25;0,4).'], ['Compute E[S]=10 and Var(S)=25(0.4)(0.6)=6; the sample proportion has variance 6/625.', 'Tính E[S]=10 và Var(S)=25(0,4)(0,6)=6; tỷ lệ mẫu có phương sai 6/625.'], ['Take the square root for the standard error, about 0.098; distinguish model identities from one simulated count.', 'Lấy căn để được sai số chuẩn khoảng 0,098; phân biệt đẳng thức mô hình với một số đếm mô phỏng.']],
  ),
  'f-w001-e6': lesson(
    ['Duplicate predictors make individual slope coefficients ambiguous while leaving a combined fitted direction identifiable.', 'Biến dự báo trùng khiến từng hệ số góc mơ hồ nhưng vẫn nhận diện được hướng khớp kết hợp.'],
    ['Xβ=β₁1+(β₂+2β₃)x; since 1 and x are independent, rank(X)=2 and only β₁ and β₂+2β₃ are identifiable.', 'Xβ=β₁1+(β₂+2β₃)x; vì 1 và x độc lập, rank(X)=2 và chỉ β₁ cùng β₂+2β₃ được nhận diện.'],
    [['Compare the last two columns and note that 2x is exactly twice x, so three columns span at most two directions.', 'So sánh hai cột cuối và thấy 2x đúng bằng hai lần x, nên ba cột sinh nhiều nhất hai hướng.'], ['Check that the constant vector and x are not multiples; the rank is therefore exactly two.', 'Kiểm tra vector hằng và x không phải bội của nhau; do đó hạng đúng bằng hai.'], ['Collect coefficients on x; only their combination β₂+2β₃ affects Xβ, so neither slope is separately determined.', 'Gom hệ số của x; chỉ tổng β₂+2β₃ ảnh hưởng Xβ, nên không xác định riêng từng hệ số góc.']],
  ),
  'f-w001-e7': lesson(
    ['A Jacobian chain rule propagates local changes through an intermediate coordinate map, with matrix orientation fixed by dimensions.', 'Quy tắc dây chuyền Jacobian truyền biến thiên cục bộ qua phép đổi tọa độ trung gian, với hướng ma trận được xác định bởi kích thước.'],
    ['For z=(u,v): ∇₍ₓ,ᵧ₎F = J_z(x,y)ᵀ ∇₍ᵤ,ᵥ₎F; here J has rows ∇uᵀ and ∇vᵀ.', 'Với z=(u,v): ∇₍ₓ,ᵧ₎F = J_z(x,y)ᵀ ∇₍ᵤ,ᵥ₎F; ở đây các hàng của J là ∇uᵀ và ∇vᵀ.'],
    [['At (1,1), compute u=1 and v=2, giving the outer gradient ∇₍ᵤ,ᵥ₎F=(2,1).', 'Tại (1,1), tính u=1 và v=2, nên gradient lớp ngoài là ∇₍ᵤ,ᵥ₎F=(2,1).'], ['Form the Jacobian rows (2,−1) and (1,2y); at y=1, J=[[2,−1],[1,2]].', 'Lập hai hàng Jacobian (2,−1) và (1,2y); tại y=1, J=[[2,−1],[1,2]].'], ['Multiply Jᵀ(2,1)=(5,0); the transpose converts coordinate derivatives into the column gradient in (x,y).', 'Nhân Jᵀ(2,1)=(5,0); chuyển vị đưa đạo hàm theo tọa độ về gradient cột theo (x,y).']],
  ),
  'f-w001-e8': lesson(
    ['Boundedness controls the size of terms but does not force a single long-run value; subsequences expose persistent oscillation.', 'Tính bị chặn kiểm soát độ lớn số hạng nhưng không buộc chúng tiến đến một giá trị; dãy con bộc lộ dao động kéo dài.'],
    ['If aₙ converges to L, every subsequence also converges to L. Thus two subsequential limits that differ disprove convergence.', 'Nếu aₙ hội tụ đến L thì mọi dãy con cũng hội tụ đến L. Vì vậy hai giới hạn dãy con khác nhau bác bỏ hội tụ.'],
    [['Choose aₙ=(−1)ⁿ; its absolute value is always 1, so it is bounded.', 'Chọn aₙ=(−1)ⁿ; trị tuyệt đối luôn bằng 1 nên dãy bị chặn.'], ['The even subsequence is constantly 1 and converges to 1; the odd subsequence is constantly −1 and converges to −1.', 'Dãy con chỉ số chẵn luôn bằng 1 và hội tụ đến 1; dãy con chỉ số lẻ luôn bằng −1 và hội tụ đến −1.'], ['Since a convergent sequence cannot have subsequences with different limits, the original sequence does not converge.', 'Vì dãy hội tụ không thể có hai dãy con với giới hạn khác nhau, dãy ban đầu không hội tụ.']],
  ),
  'f-w001-e9': lesson(
    ['A spam filter’s flagged messages combine true and false positives, so the posterior depends on the base rate.', 'Thư bị bộ lọc gắn cờ gồm cả dương tính thật và giả, nên xác suất hậu nghiệm phụ thuộc tỷ lệ nền.'],
    ['P(S|F)=P(F|S)P(S)/[P(F|S)P(S)+P(F|Sᶜ)P(Sᶜ)].', 'P(S|F)=P(F|S)P(S)/[P(F|S)P(S)+P(F|Sᶜ)P(Sᶜ)].'],
    [['Multiply the prior and sensitivity to get P(S∩F)=0.1·0.8=0.08.', 'Nhân xác suất tiên nghiệm và độ nhạy để được P(S∩F)=0,1·0,8=0,08.'], ['Add true and false flag rates: P(F)=0.1·0.8+0.9·0.1=0.17.', 'Cộng tỷ lệ gắn cờ thật và giả: P(F)=0,1·0,8+0,9·0,1=0,17.'], ['Divide to obtain 0.08/0.17=8/17≈0.4706; the 0.1 false-positive rate is not specificity.', 'Chia được 0,08/0,17=8/17≈0,4706; tỷ lệ dương tính giả 0,1 không phải độ đặc hiệu.']],
  ),
  'f-w001-e10': lesson(
    ['An expectation describes the average across the model’s repeated experiments, while the observed sample proportion remains random.', 'Kỳ vọng mô tả trung bình qua các lần lặp theo mô hình, còn tỷ lệ quan sát được vẫn ngẫu nhiên.'],
    ['For IID indicators Iᵢ~Bernoulli(p), E(Ȳ)=p and Var(Ȳ)=p(1−p)/N for Ȳ=N⁻¹ΣIᵢ.', 'Với các chỉ báo IID Iᵢ~Bernoulli(p), E(Ȳ)=p và Var(Ȳ)=p(1−p)/N với Ȳ=N⁻¹ΣIᵢ.'],
    [['Set p=1/6 and express the proportion as the average of N independent six-indicators.', 'Đặt p=1/6 và viết tỷ lệ thành trung bình của N chỉ báo độc lập cho mặt sáu.'], ['Use linearity to get expectation 1/6; independence gives variance (1/6)(5/6)/N=5/(36N).', 'Dùng tính tuyến tính để được kỳ vọng 1/6; độc lập cho phương sai (1/6)(5/6)/N=5/(36N).'], ['These are exact model moments for every N; a realized fraction can differ from 1/6 and is an outcome, not an identity.', 'Đây là moment chính xác của mô hình với mọi N; tỷ lệ quan sát có thể khác 1/6 và là kết quả mẫu, không phải đồng nhất thức.']],
  ),
  'f-w002-e1': lesson(
    ['Negating a universal tail condition describes a failure at some tolerance, with infinitely late violations.', 'Phủ định điều kiện đuôi phổ quát mô tả một sai số có vi phạm ở tùy ý xa về sau.'],
    ['Negate ∀ε>0 ∃N ∀n≥N P(ε,n) as ∃ε₀>0 ∀N ∃n≥N such that ¬P(ε₀,n).', 'Phủ định ∀ε>0 ∃N ∀n≥N P(ε,n) thành ∃ε₀>0 ∀N ∃n≥N sao cho ¬P(ε₀,n).'],
    [['Negate the outer “for every ε>0” first: choose one fixed ε₀>0.', 'Phủ định lượng từ ngoài “với mọi ε>0” trước: chọn một ε₀>0 cố định.'], ['Negate existence of a cutoff N by requiring every proposed N to have a violating index n≥N.', 'Phủ định sự tồn tại cutoff N bằng cách yêu cầu mọi N đưa ra đều có chỉ số vi phạm n≥N.'], ['Negate the strict inequality to |aₙ−L|≥ε₀; the result says failure persists arbitrarily far out, not convergence.', 'Phủ định bất đẳng thức nghiêm thành |aₙ−L|≥ε₀; kết quả nói lỗi còn xảy ra tùy ý xa, không phải hội tụ.']],
  ),
  'f-w002-e2': lesson(
    ['Induction verifies a formula generated by a recurrence by passing the claimed closed form through one update.', 'Quy nạp xác minh công thức sinh bởi truy hồi bằng cách đưa dạng tường minh qua một bước cập nhật.'],
    ['If aₙ=(5·3ⁿ⁻¹−1)/2, then aₙ₊₁=3aₙ+1=(5·3ⁿ−1)/2.', 'Nếu aₙ=(5·3ⁿ⁻¹−1)/2 thì aₙ₊₁=3aₙ+1=(5·3ⁿ−1)/2.'],
    [['At n=1 the expression is (5−1)/2=2, matching the initial condition.', 'Tại n=1, biểu thức bằng (5−1)/2=2, khớp điều kiện đầu.'], ['Assume the formula holds at n and substitute that expression into 3aₙ+1.', 'Giả sử công thức đúng tại n rồi thế biểu thức đó vào 3aₙ+1.'], ['Simplify to the same claimed expression with n replaced by n+1, completing the induction step.', 'Rút gọn về công thức đã nêu với n thay bằng n+1, hoàn tất bước quy nạp.']],
  ),
  'f-w002-e3': lesson(
    ['Injectivity depends on the domain: restricting to nonnegative inputs removes the ± ambiguity of squaring.', 'Tính đơn ánh phụ thuộc miền xác định: giới hạn đầu vào không âm loại bỏ mơ hồ ± khi bình phương.'],
    ['x²=y² iff x=y or x=−y; on [0,∞), x² is strictly increasing and inverse is √y for y≥0.', 'x²=y² khi và chỉ khi x=y hoặc x=−y; trên [0,∞), x² tăng nghiêm ngặt và hàm ngược là √y với y≥0.'],
    [['On R, use x=1 and y=−1 to show equal outputs can have distinct inputs.', 'Trên R, lấy x=1 và y=−1 để cho thấy đầu ra bằng nhau có thể ứng với đầu vào khác nhau.'], ['For nonnegative x,y, x²=y² implies (x−y)(x+y)=0; since x+y≥0 and equality forces x=y.', 'Với x,y không âm, x²=y² suy ra (x−y)(x+y)=0; vì x+y≥0, trường hợp bằng nhau buộc x=y.'], ['Every t≥0 has the unique preimage √t in [0,∞), proving surjectivity and identifying the inverse.', 'Mỗi t≥0 có tiền ảnh duy nhất √t trong [0,∞), chứng minh toàn ánh và xác định hàm ngược.']],
  ),
  'f-w002-e4': lesson(
    ['Contrapositive proof is useful when the negation of the conclusion gives a direct algebraic structure.', 'Chứng minh phản đảo hữu ích khi phủ định kết luận tạo ra cấu trúc đại số trực tiếp.'],
    ['To prove P⇒Q, prove ¬Q⇒¬P. Every integer is even or odd; the square of an even integer is even.', 'Để chứng minh P⇒Q, chứng minh ¬Q⇒¬P. Mọi số nguyên chẵn hoặc lẻ; bình phương số chẵn là chẵn.'],
    [['Assume the contrapositive hypothesis that n is even, so n=2k for some k∈Z.', 'Giả sử giả thiết phản đảo rằng n chẵn, tức n=2k với k∈Z.'], ['Square it: n²=4k²=2(2k²), which is even.', 'Bình phương: n²=4k²=2(2k²), nên chẵn.'], ['This proves even n implies even n², the contrapositive; therefore odd n² implies odd n.', 'Điều này chứng minh n chẵn kéo theo n² chẵn, tức phản đảo; do đó n² lẻ kéo theo n lẻ.']],
  ),
  'f-w002-e5': lesson(
    ['A universal implication is tested by finding a pair satisfying its premise and violating its conclusion; a domain restriction can remove the ambiguity.', 'Kiểm tra mệnh đề kéo theo phổ quát bằng cặp thỏa tiền đề nhưng vi phạm kết luận; giới hạn miền có thể loại mơ hồ.'],
    ['x²=y² iff x=±y; if x,y≥0, then equality of squares implies x=y.', 'x²=y² khi và chỉ khi x=±y; nếu x,y≥0 thì bình phương bằng nhau suy ra x=y.'],
    [['Choose x=1,y=−1: the squares agree but x≠y, so the unrestricted claim is false.', 'Chọn x=1,y=−1: bình phương bằng nhau nhưng x≠y, nên mệnh đề không giới hạn là sai.'], ['Repair the statement by restricting both variables to the nonnegative reals.', 'Sửa mệnh đề bằng cách giới hạn cả hai biến trong tập số thực không âm.'], ['With x,y≥0, factor x²−y²=(x−y)(x+y)=0; if x+y>0 then x=y, and if x+y=0 both are zero.', 'Với x,y≥0, phân tích x²−y²=(x−y)(x+y)=0; nếu x+y>0 thì x=y, còn nếu x+y=0 thì cả hai bằng 0.']],
  ),
  'f-w003-e1': lesson(
    ['The equality case tells when a norm bound is sharp; it is determined by collinearity, including the sign of the scalar.', 'Trường hợp đẳng thức cho biết khi nào cận chuẩn đạt sắc; điều kiện là cùng phương, kể cả dấu của hệ số.'],
    ['Cauchy–Schwarz equality holds iff one vector is a scalar multiple of the other; here (c,1)=λ(1,2).', 'Đẳng thức Cauchy–Schwarz xảy ra khi và chỉ khi một vector là bội vô hướng của vector kia; ở đây (c,1)=λ(1,2).'],
    [['Set (c,1)=λ(1,2) and compare second coordinates to get λ=1/2.', 'Đặt (c,1)=λ(1,2) và so sánh tọa độ thứ hai để được λ=1/2.'], ['Compare first coordinates: c=λ=1/2; this pair makes the vectors collinear.', 'So sánh tọa độ thứ nhất: c=λ=1/2; cặp này làm hai vector cùng phương.'], ['The inner product is positive here, so the absolute-value equality is satisfied; verify both sides or state collinearity criterion.', 'Tích trong ở đây dương nên đẳng thức trị tuyệt đối được thỏa; kiểm tra hai vế hoặc nêu tiêu chuẩn cùng phương.']],
  ),
  'f-w003-e2': lesson(
    ['A dual norm converts a constraint on x into a sharp worst-case bound for a linear score aᵀx.', 'Chuẩn đối ngẫu biến điều kiện trên x thành cận xấu nhất sắc cho điểm tuyến tính aᵀx.'],
    ['By Cauchy–Schwarz, |aᵀx|≤||a||₂||x||₂≤3||a||₂; for a≠0, equality at x=3a/||a||₂.', 'Theo Cauchy–Schwarz, |aᵀx|≤||a||₂||x||₂≤3||a||₂; nếu a≠0, đạt đẳng thức tại x=3a/||a||₂.'],
    [['Apply Cauchy–Schwarz to the inner product aᵀx.', 'Áp dụng Cauchy–Schwarz cho tích trong aᵀx.'], ['Use the constraint ||x||₂≤3 to obtain the upper bound 3||a||₂.', 'Dùng điều kiện ||x||₂≤3 để nhận cận trên 3||a||₂.'], ['Choose x in the direction of a with norm 3; substitution attains the bound and proves sharpness.', 'Chọn x cùng hướng a và có chuẩn 3; thay vào đạt cận, chứng minh tính sắc.']],
  ),
  'f-w003-e3': lesson(
    ['The null space describes coefficient changes invisible to the linear predictor; only contrasts orthogonal to it can be recovered.', 'Kernel mô tả thay đổi hệ số mà bộ dự báo tuyến tính không nhìn thấy; chỉ tổ hợp trực giao với kernel mới khôi phục được.'],
    ['For A=[[1,2],[2,4]], N(A)=span{(−2,1)}, rank(A)=1; cᵀβ is identifiable iff cᵀh=0 for every h∈N(A).', 'Với A=[[1,2],[2,4]], N(A)=span{(−2,1)}, rank(A)=1; cᵀβ nhận diện được khi và chỉ khi cᵀh=0 với mọi h∈N(A).'],
    [['Reduce Aβ=0 to β₁+2β₂=0, giving a one-dimensional null space spanned by (−2,1).', 'Rút Aβ=0 về β₁+2β₂=0, được kernel một chiều sinh bởi (−2,1).'], ['The rows and columns each have one independent direction, so rank(A)=1.', 'Mỗi hệ hàng và cột có một hướng độc lập, nên rank(A)=1.'], ['Two compatible coefficient vectors differ by a null vector h; their contrast agrees exactly when cᵀh=0.', 'Hai vector hệ số tương thích sai khác bởi vector kernel h; tổ hợp của chúng bằng nhau đúng khi cᵀh=0.']],
  ),
  'f-w003-e4': lesson(
    ['Cauchy–Schwarz is an upper bound valid for all vectors; orthogonality is the separate zero-inner-product condition.', 'Cauchy–Schwarz là cận trên đúng với mọi vector; trực giao là điều kiện riêng rằng tích trong bằng không.'],
    ['x⊥y iff xᵀy=0. Equality in |xᵀy|≤||x||||y|| occurs iff x,y are linearly dependent (including zero vectors).', 'x⊥y khi và chỉ khi xᵀy=0. Đẳng thức |xᵀy|≤||x||||y|| xảy ra khi x,y phụ thuộc tuyến tính (kể cả vector 0).'],
    [['Take x=y=(1,0); the inequality is equality, yet xᵀy=1, so they are not orthogonal.', 'Lấy x=y=(1,0); bất đẳng thức thành đẳng thức nhưng xᵀy=1 nên chúng không trực giao.'], ['State the actual test for orthogonality: compute the inner product and obtain zero.', 'Nêu phép kiểm tra trực giao thực sự: tính tích trong và nhận được 0.'], ['Separate the two facts: zero inner product implies equality at zero, while general equality means collinearity, not orthogonality.', 'Tách hai sự kiện: tích trong bằng 0 cho đẳng thức tại 0, còn đẳng thức nói chung là cùng phương, không phải trực giao.']],
  ),
  'f-w003-e5': lesson(
    ['The triangle inequality bounds the length of a combined displacement by the sum of the separate lengths.', 'Bất đẳng thức tam giác chặn độ dài dịch chuyển tổng bằng tổng độ dài các dịch chuyển thành phần.'],
    ['||x+y||₂²=||x||₂²+2xᵀy+||y||₂²≤(||x||₂+||y||₂)² by Cauchy–Schwarz.', '||x+y||₂²=||x||₂²+2xᵀy+||y||₂²≤(||x||₂+||y||₂)² theo Cauchy–Schwarz.'],
    [['Expand the squared norm using the inner product identity.', 'Khai triển bình phương chuẩn bằng đồng nhất thức tích trong.'], ['Bound the cross term xᵀy by |xᵀy|≤||x||₂||y||₂; this is where Cauchy–Schwarz enters.', 'Chặn số hạng chéo xᵀy bằng |xᵀy|≤||x||₂||y||₂; đây là chỗ dùng Cauchy–Schwarz.'], ['The right side becomes (||x||₂+||y||₂)²; take nonnegative square roots to conclude.', 'Vế phải thành (||x||₂+||y||₂)²; lấy căn không âm để kết luận.']],
  ),
  'f-w004-e1': lesson(
    ['The limit definition verifies a derivative by canceling the finite increment before taking the limit.', 'Định nghĩa giới hạn xác minh đạo hàm bằng cách khử gia số hữu hạn trước khi lấy giới hạn.'],
    ['The general definition is f′(a)=limₕ→₀[f(a+h)−f(a)]/h, if the finite limit exists. For f(x)=x³, f′(a)=limₕ→₀[(a+h)³−a³]/h=3a², since the quotient simplifies to 3a²+3ah+h².', 'Định nghĩa tổng quát là f′(a)=limₕ→₀[f(a+h)−f(a)]/h nếu giới hạn hữu hạn tồn tại. Với f(x)=x³, f′(a)=limₕ→₀[(a+h)³−a³]/h=3a², vì thương rút gọn thành 3a²+3ah+h².'],
    [['Expand (a+h)³ and subtract a³ so the numerator has a factor h.', 'Khai triển (a+h)³ rồi trừ a³ để tử số có nhân tử h.'], ['Cancel h only for h≠0, then take h→0 in 3a²+3ah+h².', 'Chỉ khử h khi h≠0, rồi cho h→0 trong 3a²+3ah+h².'], ['Substitute a=−2 into 3a² to obtain 12.', 'Thay a=−2 vào 3a² để được 12.']],
  ),
  'f-w004-e2': lesson(
    ['Taylor’s theorem replaces a nearby nonlinear value by a tangent prediction plus a quantified curvature error.', 'Định lý Taylor thay giá trị phi tuyến lân cận bằng dự đoán tiếp tuyến cộng sai số độ cong được định lượng.'],
    ['For f twice differentiable on the segment from 0 to h, |f(h)−f(0)−f′(0)h|≤½ sup|f″|·h²; for eˣ and |h|≤0.1, sup|f″|≤e⁰·¹.', 'Nếu f khả vi hai lần trên đoạn từ 0 đến h, |f(h)−f(0)−f′(0)h|≤½ sup|f″|·h²; với eˣ và |h|≤0,1, sup|f″|≤e⁰·¹.'],
    [['At zero, e⁰=1 and derivative is 1, so the first-order polynomial is 1+h.', 'Tại 0, e⁰=1 và đạo hàm bằng 1, nên đa thức bậc nhất là 1+h.'], ['Use the Lagrange remainder and bound eᶜ by e⁰·¹ on the entire interval between 0 and h.', 'Dùng số dư Lagrange và chặn eᶜ bởi e⁰·¹ trên toàn đoạn giữa 0 và h.'], ['Conclude the absolute error is at most ½e⁰·¹h²; state that this bound applies for the stated interval.', 'Kết luận sai số tuyệt đối không quá ½e⁰·¹h²; nêu rõ cận này áp dụng trên khoảng đã cho.']],
  ),
  'f-w004-e3': lesson(
    ['Continuity only requires nearby values to approach the function value; differentiability requires one common linear slope from both sides.', 'Liên tục chỉ cần giá trị lân cận tiến tới giá trị hàm; khả vi cần một độ dốc tuyến tính chung từ hai phía.'],
    ['At an interior point a, f′(a) exists exactly when the finite left and right limits of [f(a+h)−f(a)]/h as h→0 agree. For f(x)=|x|, f(x)→0=f(0), but at a=0 the quotient is 1 for h>0 and −1 for h<0.', 'Tại điểm trong a, f′(a) tồn tại khi và chỉ khi hai giới hạn hữu hạn trái và phải của [f(a+h)−f(a)]/h khi h→0 bằng nhau. Với f(x)=|x|, f(x)→0=f(0), nhưng tại a=0 thương bằng 1 khi h>0 và −1 khi h<0.'],
    [['Use |x−0|→0 to verify continuity at zero.', 'Dùng |x−0|→0 để kiểm tra tính liên tục tại 0.'], ['For h>0, |h|/h=1; for h<0, |h|/h=−1.', 'Khi h>0, |h|/h=1; khi h<0, |h|/h=−1.'], ['Because the one-sided limits disagree, the derivative limit does not exist although continuity holds.', 'Vì hai giới hạn một phía khác nhau, giới hạn đạo hàm không tồn tại dù hàm liên tục.']],
  ),
  'f-w004-e4': lesson(
    ['A chain rule tracks how an outer response changes through an inner nonlinear input, and the domain follows the composed function.', 'Quy tắc dây chuyền theo dõi đáp ứng ngoài biến đổi qua đầu vào phi tuyến bên trong; miền theo hàm hợp.'],
    ['For q(x)=sin(g(x)), q′(x)=cos(g(x))g′(x); here q′(x)=2x cos(x²+1), valid for all real x.', 'Với q(x)=sin(g(x)), q′(x)=cos(g(x))g′(x); ở đây q′(x)=2x cos(x²+1), đúng với mọi x thực.'],
    [['Identify the inner function g(x)=x²+1 and compute g′(x)=2x.', 'Nhận diện hàm trong g(x)=x²+1 và tính g′(x)=2x.'], ['Differentiate sine at the outer input to get cos(g(x)), then multiply by the inner derivative.', 'Lấy đạo hàm sine tại đầu vào ngoài được cos(g(x)), rồi nhân đạo hàm hàm trong.'], ['Substitute x=0 to get q′(0)=0; both the polynomial input and sine are defined everywhere.', 'Thay x=0 được q′(0)=0; đầu vào đa thức và sine đều xác định trên toàn trục số.']],
  ),
  'f-w004-e5': lesson(
    ['A second-order Taylor model captures local curvature; a third-derivative bound controls the leftover error over the whole interval.', 'Mô hình Taylor bậc hai nắm độ cong cục bộ; cận đạo hàm bậc ba kiểm soát phần dư trên toàn khoảng.'],
    ['At x=1, T₂(1+h)=h−h²/2 for ln(1+h); |R₃|≤sup|f‴|·|h|³/6, with f‴(x)=2/x³.', 'Tại x=1, T₂(1+h)=h−h²/2 cho ln(1+h); |R₃|≤sup|f‴|·|h|³/6, với f‴(x)=2/x³.'],
    [['Compute f(1)=0, f′(1)=1, f″(1)=−1; hence T₂(1.1)=0.1−0.1²/2=0.095.', 'Tính f(1)=0, f′(1)=1, f″(1)=−1; do đó T₂(1,1)=0,1−0,1²/2=0,095.'], ['On [1,1.1], |f‴(x)|=2/x³≤2, so the remainder is bounded by 2(0.1)³/6.', 'Trên [1;1,1], |f‴(x)|=2/x³≤2, nên phần dư không quá 2(0,1)³/6.'], ['Report the approximation and error bound separately; the bound relies on the derivative bound throughout the interval.', 'Báo riêng xấp xỉ và cận sai số; cận này dựa vào chặn đạo hàm trên toàn khoảng.']],
  ),
  'f-w005-e1': lesson(
    ['A kernel describes inputs annihilated by a linear transformation; closure confirms it is itself a vector space of invisible directions.', 'Kernel mô tả các đầu vào bị ánh xạ tuyến tính triệt tiêu; tính đóng xác nhận nó là không gian vector gồm các hướng không nhìn thấy.'],
    ['For linear T, T(0)=0, T(u+v)=T(u)+T(v), and T(cu)=cT(u); these establish the subspace criteria for ker(T).', 'Với T tuyến tính, T(0)=0, T(u+v)=T(u)+T(v), và T(cu)=cT(u); các đẳng thức này cho tiêu chuẩn không gian con của ker(T).'],
    [['Verify 0∈ker(T) from linearity, so the set is nonempty.', 'Dùng tính tuyến tính để xác minh 0∈ker(T), nên tập không rỗng.'], ['For u,v in the kernel, apply linearity to T(u+v) and show it remains zero.', 'Với u,v thuộc kernel, áp dụng tính tuyến tính cho T(u+v) và cho thấy kết quả vẫn bằng 0.'], ['For scalar c and u in the kernel, show T(cu)=cT(u)=0; conclude closure and subspace.', 'Với vô hướng c và u thuộc kernel, chứng minh T(cu)=cT(u)=0; kết luận tính đóng và không gian con.']],
  ),
  'f-w005-e2': lesson(
    ['Rank–nullity balances the dimension of parameter directions into visible and invisible components.', 'Định lý hạng–kernel cân bằng số chiều các hướng tham số thành phần nhìn thấy và không nhìn thấy.'],
    ['For A:Rⁿ→Rᵐ, rank(A)+nullity(A)=n. Solve Ax=0 to get the null-space basis.', 'Với A:Rⁿ→Rᵐ, rank(A)+nullity(A)=n. Giải Ax=0 để tìm cơ sở kernel.'],
    [['Note row 3=row 1+row 2, while rows 1 and 2 are independent; rank(A)=2.', 'Nhận thấy hàng 3=hàng 1+hàng 2, còn hai hàng đầu độc lập; rank(A)=2.'], ['Solve x₂+x₃=0 and x₁+2x₂=0, giving x=t(2,−1,1).', 'Giải x₂+x₃=0 và x₁+2x₂=0, được x=t(2,−1,1).'], ['The kernel basis has one vector, so nullity=1 and rank+nullity=2+1=3, the number of columns.', 'Cơ sở kernel có một vector nên nullity=1 và rank+nullity=2+1=3, bằng số cột.']],
  ),
  'f-w005-e3': lesson(
    ['To design a linear map with a prescribed kernel, choose independent measurements that vanish exactly along the target subspace.', 'Để dựng ánh xạ tuyến tính có kernel cho trước, chọn các phép đo độc lập triệt tiêu đúng trên không gian con mục tiêu.'],
    ['For any subspace K⊆Rⁿ, choose a matrix A whose rows are a basis of K⊥; then ker(A)=(row(A))⊥=K. Here A=[[1,−1,0],[0,0,1]], so Ax=0 iff x₁=x₂ and x₃=0, and rank(A)=2.', 'Với mọi không gian con K⊆Rⁿ, chọn ma trận A có các hàng là một cơ sở của K⊥; khi đó ker(A)=(row(A))⊥=K. Ở đây A=[[1,−1,0],[0,0,1]], nên Ax=0 khi và chỉ khi x₁=x₂ và x₃=0, và rank(A)=2.'],
    [['Use row (1,−1,0) to enforce x₁=x₂ and row (0,0,1) to enforce x₃=0.', 'Dùng hàng (1,−1,0) để buộc x₁=x₂ và hàng (0,0,1) để buộc x₃=0.'], ['Solve both equations to get every kernel vector t(1,1,0), verifying equality of sets.', 'Giải cả hai phương trình để được mọi vector kernel dạng t(1,1,0), xác minh hai tập bằng nhau.'], ['The two rows are independent, hence rank two; rank–nullity also agrees with the one-dimensional kernel.', 'Hai hàng độc lập nên hạng bằng hai; định lý hạng–kernel cũng khớp với kernel một chiều.']],
  ),
  'f-w005-e4': lesson(
    ['Identifiable contrasts are quantities constant across every coefficient vector giving the same fitted observations.', 'Tổ hợp được nhận diện là đại lượng không đổi trên mọi vector hệ số cho cùng dữ liệu khớp.'],
    ['cᵀβ is identifiable iff c⊥N(X), equivalently cᵀh=0 for every h∈N(X).', 'cᵀβ được nhận diện khi và chỉ khi c⊥N(X), tương đương cᵀh=0 với mọi h∈N(X).'],
    [['If Xβ=Xβ′, then h=β′−β lies in N(X); the contrast changes by cᵀh.', 'Nếu Xβ=Xβ′ thì h=β′−β thuộc N(X); tổ hợp thay đổi một lượng cᵀh.'], ['Therefore it is constant across solutions exactly when c annihilates every null direction.', 'Vì vậy đại lượng không đổi trên mọi nghiệm đúng khi c triệt tiêu mọi hướng kernel.'], ['For h=(1,−1,0), the first proposed c has dot product 0 and is identifiable; the second has dot product 1 and is not.', 'Với h=(1,−1,0), c thứ nhất có tích vô hướng 0 nên nhận diện được; c thứ hai có tích 1 nên không.']],
  ),
  'f-w005-e5': lesson(
    ['A positive-dimensional null space rules out uniqueness whenever a linear system is consistent.', 'Kernel có số chiều dương loại trừ tính duy nhất mỗi khi hệ tuyến tính có nghiệm.'],
    ['For any A, Ax=b has a unique solution iff it is consistent and ker(A)={0}, equivalently A has full column rank. Here A has four columns and rank two, so nullity=4−2=2; if Ax₀=b and h∈N(A) is nonzero, x₀+th solves it for every t.', 'Với mọi A, Ax=b có nghiệm duy nhất khi và chỉ khi hệ tương thích và ker(A)={0}, tương đương A đủ hạng cột. Ở đây A có bốn cột và hạng hai nên nullity=4−2=2; nếu Ax₀=b và h∈N(A) khác 0 thì x₀+th là nghiệm với mọi t.'],
    [['Apply rank–nullity to the domain R⁴ to obtain a two-dimensional kernel, which contains nonzero h.', 'Áp dụng hạng–kernel trên miền R⁴ để được kernel hai chiều, chứa vector h khác 0.'], ['If b is in the column space, choose a solution x₀ and verify A(x₀+th)=b for every real t.', 'Nếu b thuộc không gian cột, chọn nghiệm x₀ và kiểm tra A(x₀+th)=b với mọi t thực.'], ['If b is outside the column space there is no solution; otherwise infinitely many, so uniqueness never occurs.', 'Nếu b ngoài không gian cột thì không có nghiệm; nếu có thì có vô số, nên không bao giờ duy nhất.']],
  ),
  'f-w006-e1': lesson(
    ['Least squares makes the residual orthogonal to every modeled direction, which yields the normal equations.', 'Bình phương tối thiểu làm phần dư trực giao với mọi hướng được mô hình hóa, từ đó cho phương trình chuẩn.'],
    ['For J(β)=||y−Xβ||₂², ∇J=−2Xᵀ(y−Xβ); stationarity is XᵀXβ=Xᵀy iff Xᵀr=0.', 'Với J(β)=||y−Xβ||₂², ∇J=−2Xᵀ(y−Xβ); điểm dừng thỏa XᵀXβ=Xᵀy khi và chỉ khi Xᵀr=0.'],
    [['Write r=y−Xβ and expand the squared norm or differentiate with respect to β.', 'Đặt r=y−Xβ rồi khai triển bình phương chuẩn hoặc lấy đạo hàm theo β.'], ['Set the gradient to zero: Xᵀ(y−Xβ)=0, then rearrange into the normal equations.', 'Cho gradient bằng 0: Xᵀ(y−Xβ)=0, rồi sắp xếp thành phương trình chuẩn.'], ['Interpret Xᵀr=0 columnwise: the residual is orthogonal to every column of X and thus to Col(X).', 'Diễn giải Xᵀr=0 theo từng cột: phần dư trực giao với mọi cột của X và do đó với Col(X).']],
  ),
  'f-w006-e2': lesson(
    ['Projection gives the closest point on a one-dimensional model direction, and the residual is the orthogonal error.', 'Phép chiếu cho điểm gần nhất trên hướng mô hình một chiều; phần dư là sai số trực giao.'],
    ['For u≠0, proj_span(u)(y)=(uᵀy/uᵀu)u, and y=p+r with p⊥r.', 'Với u≠0, proj_span(u)(y)=(uᵀy/uᵀu)u, và y=p+r với p⊥r.'],
    [['Compute uᵀy=3 and uᵀu=2, so the projection coefficient is 3/2 and p=(3/2,3/2,0).', 'Tính uᵀy=3 và uᵀu=2, nên hệ số chiếu là 3/2 và p=(3/2,3/2,0).'], ['Subtract to obtain r=y−p=(1/2,−1/2,2), then check uᵀr=0.', 'Lấy y−p được r=(1/2,−1/2,2), rồi kiểm tra uᵀr=0.'], ['Verify ||y||²=9, ||p||²=9/2, and ||r||²=9/2; the squared lengths add.', 'Kiểm tra ||y||²=9, ||p||²=9/2, và ||r||²=9/2; bình phương độ dài cộng lại.']],
  ),
  'f-w006-e3': lesson(
    ['When two design columns repeat one direction, least squares identifies its fitted coefficient combination but not a unique coefficient pair.', 'Khi hai cột thiết kế lặp lại một hướng, bình phương tối thiểu nhận diện tổ hợp hệ số khớp nhưng không nhận diện một cặp duy nhất.'],
    ['Xβ=(β₁+2β₂)u; minimize ||y−cu||² at ĉ=uᵀy/(uᵀu), so all minimizers satisfy β₁+2β₂=ĉ.', 'Xβ=(β₁+2β₂)u; tối thiểu hóa ||y−cu||² tại ĉ=uᵀy/(uᵀu), nên mọi nghiệm tối ưu thỏa β₁+2β₂=ĉ.'],
    [['Collapse the two columns into the single scalar c=β₁+2β₂, leaving a one-dimensional projection problem.', 'Gộp hai cột thành vô hướng c=β₁+2β₂, còn lại bài toán chiếu một chiều.'], ['Differentiate ||y−cu||² or project y onto span{u} to find ĉ=uᵀy/(uᵀu).', 'Lấy đạo hàm ||y−cu||² hoặc chiếu y lên span{u} để tìm ĉ=uᵀy/(uᵀu).'], ['The fitted vector ĉu is unique, but all coefficient pairs on β₁+2β₂=ĉ attain it.', 'Vector khớp ĉu là duy nhất, nhưng mọi cặp hệ số trên đường β₁+2β₂=ĉ đều đạt nó.']],
  ),
  'f-w006-e4': lesson(
    ['A projection matrix leaves model-space vectors unchanged and maps every input onto the model space.', 'Ma trận chiếu giữ nguyên vector trong không gian mô hình và ánh xạ mọi đầu vào lên không gian đó.'],
    ['For full-column-rank X, P=X(XᵀX)⁻¹Xᵀ is symmetric and idempotent: Pᵀ=P, P²=P.', 'Với X hạng cột đầy đủ, P=X(XᵀX)⁻¹Xᵀ đối xứng và lũy đẳng: Pᵀ=P, P²=P.'],
    [['Transpose the product and use symmetry of XᵀX and its inverse to obtain Pᵀ=P.', 'Chuyển vị tích và dùng tính đối xứng của XᵀX cùng nghịch đảo để được Pᵀ=P.'], ['In P², combine the middle factor XᵀX(XᵀX)⁻¹=I; the remaining expression is P.', 'Trong P², rút gọn thừa số giữa XᵀX(XᵀX)⁻¹=I; biểu thức còn lại là P.'], ['Symmetry means orthogonal projection; idempotence means projecting an already projected vector changes nothing.', 'Đối xứng biểu thị chiếu trực giao; lũy đẳng nghĩa là chiếu lại vector đã chiếu không làm thay đổi nó.']],
  ),
  'f-w006-e5': lesson(
    ['Orthogonal decomposition separates unavoidable projection error from extra error introduced by a candidate fit.', 'Phân rã trực giao tách sai số chiếu không tránh được khỏi sai số tăng thêm do mô hình khớp ứng viên.'],
    ['Since y−p⊥p−q for p,q∈S, ||y−q||²=||y−p||²+||p−q||².', 'Vì y−p⊥p−q với p,q∈S, ||y−q||²=||y−p||²+||p−q||².'],
    [['Rewrite y−q=(y−p)+(p−q); both terms are vectors in Rⁿ.', 'Viết y−q=(y−p)+(p−q); cả hai số hạng là vector trong Rⁿ.'], ['Because p−q∈S and y−p⊥S, the cross inner product is zero.', 'Vì p−q∈S và y−p⊥S, tích trong chéo bằng 0.'], ['Expand the squared norm and compare candidates: the one closer to p has smaller residual norm.', 'Khai triển bình phương chuẩn rồi so sánh ứng viên: ứng viên gần p hơn có chuẩn phần dư nhỏ hơn.']],
  ),
  'f-w007-e1': lesson(
    ['Positive semidefiniteness means a quadratic energy never becomes negative, which can be checked along eigen-directions.', 'Bán xác định dương nghĩa là năng lượng bậc hai không bao giờ âm, có thể kiểm tra trên các hướng riêng.'],
    ['For real symmetric A=QΛQᵀ, xᵀAx=Σᵢλᵢzᵢ² with z=Qᵀx; thus A⪰0 iff every λᵢ≥0.', 'Với A=QΛQᵀ đối xứng thực, xᵀAx=Σᵢλᵢzᵢ² với z=Qᵀx; vì vậy A⪰0 khi và chỉ khi mọi λᵢ≥0.'],
    [['Invoke the spectral theorem for a real symmetric matrix and write x in the orthonormal eigenbasis.', 'Dùng định lý phổ cho ma trận đối xứng thực và biểu diễn x theo cơ sở riêng trực chuẩn.'], ['If every eigenvalue is nonnegative, each weighted square λᵢzᵢ² is nonnegative, so xᵀAx≥0.', 'Nếu mọi trị riêng không âm thì từng tích λᵢzᵢ² không âm, nên xᵀAx≥0.'], ['Conversely, test the quadratic form on each eigenvector; its value is λᵢ times the squared norm, forcing λᵢ≥0.', 'Ngược lại, thử dạng toàn phương trên từng vector riêng; giá trị bằng λᵢ nhân bình phương chuẩn, buộc λᵢ≥0.']],
  ),
  'f-w007-e2': lesson(
    ['The Rayleigh quotient measures quadratic energy per unit squared length and is bounded by the extreme eigenvalues.', 'Thương Rayleigh đo năng lượng bậc hai trên bình phương độ dài đơn vị và bị chặn bởi trị riêng cực trị.'],
    ['For symmetric A with spectrum in [1,7], 1≤xᵀAx/(xᵀx)≤7 for x≠0; equality occurs in the λ=1 or λ=7 eigenspace.', 'Với A đối xứng có phổ trong [1,7], 1≤xᵀAx/(xᵀx)≤7 khi x≠0; đẳng thức xảy ra trong không gian riêng λ=1 hoặc λ=7.'],
    [['Expand x=Σcᵢvᵢ in an orthonormal eigenbasis; numerator is Σλᵢcᵢ² and denominator Σcᵢ².', 'Khai triển x=Σcᵢvᵢ theo cơ sở riêng trực chuẩn; tử số là Σλᵢcᵢ² và mẫu số là Σcᵢ².'], ['Use 1≤λᵢ≤7 term by term to bound the weighted average.', 'Dùng 1≤λᵢ≤7 cho từng số hạng để chặn trung bình có trọng số.'], ['Equality at the lower or upper endpoint requires all nonzero coordinates to lie in the corresponding extreme eigenspace.', 'Đẳng thức ở cận dưới hoặc trên yêu cầu mọi tọa độ khác 0 thuộc không gian riêng cực trị tương ứng.']],
  ),
  'f-w007-e3': lesson(
    ['A zero variance direction in a covariance matrix means the corresponding linear combination has no random variation.', 'Hướng phương sai bằng không trong ma trận hiệp phương sai nghĩa là tổ hợp tuyến tính tương ứng không biến thiên ngẫu nhiên.'],
    ['vᵀΣv=Var(vᵀX); a square-integrable scalar has variance zero iff it equals its expectation almost surely.', 'vᵀΣv=Var(vᵀX); biến vô hướng có bình phương khả tích có phương sai 0 khi và chỉ khi bằng kỳ vọng hầu chắc chắn.'],
    [['Use Σ=E[(X−EX)(X−EX)ᵀ] to expand vᵀΣv as E[(vᵀX−E[vᵀX])²].', 'Dùng Σ=E[(X−EX)(X−EX)ᵀ] để khai triển vᵀΣv thành E[(vᵀX−E[vᵀX])²].'], ['This expectation is exactly Var(vᵀX), finite under the stated finite-second-moment assumption.', 'Kỳ vọng này đúng bằng Var(vᵀX), hữu hạn theo giả thiết moment bậc hai hữu hạn.'], ['A nonnegative square has expectation zero iff it vanishes almost surely, giving the constant-a.s. equivalence.', 'Bình phương không âm có kỳ vọng 0 khi và chỉ khi bằng 0 hầu chắc chắn, cho tương đương hằng số a.s.']],
  ),
  'f-w007-e4': lesson(
    ['The real symmetric spectral theorem relies on symmetry; nonsymmetric matrices can rotate vectors without real eigen-directions.', 'Định lý phổ đối xứng thực cần tính đối xứng; ma trận không đối xứng có thể quay vector mà không có hướng riêng thực.'],
    ['For R=[[0,−1],[1,0]], det(R−λI)=λ²+1, whose roots ±i are not real; Rᵀ≠R.', 'Với R=[[0,−1],[1,0]], det(R−λI)=λ²+1 có nghiệm ±i không thực; Rᵀ≠R.'],
    [['Use the quarter-turn matrix R; its columns are not symmetric across the diagonal.', 'Dùng ma trận quay một phần tư vòng R; các phần tử không đối xứng qua đường chéo.'], ['Compute the characteristic polynomial det(R−λI)=λ²+1 and solve for eigenvalues ±i.', 'Tính đa thức đặc trưng det(R−λI)=λ²+1 và tìm trị riêng ±i.'], ['The example lacks the real-symmetry hypothesis and has no real eigenvalues, so the stated real theorem cannot apply.', 'Ví dụ thiếu giả thiết đối xứng thực và không có trị riêng thực, nên định lý thực đã nêu không áp dụng.']],
  ),
  'f-w007-e5': lesson(
    ['Minimizing a symmetric quadratic form on the unit sphere selects its smallest eigenvalue and an associated eigenvector.', 'Tối thiểu dạng toàn phương đối xứng trên mặt cầu đơn vị chọn trị riêng nhỏ nhất và vector riêng tương ứng.'],
    ['For ||x||₂=1, min xᵀAx=λ_min(A). For A=[[4,1],[1,2]], eigenvalues are 3±√2.', 'Với ||x||₂=1, min xᵀAx=λ_min(A). Với A=[[4,1],[1,2]], trị riêng là 3±√2.'],
    [['Solve det(A−λI)=0: λ²−6λ+7=0, so the smaller root is 3−√2.', 'Giải det(A−λI)=0: λ²−6λ+7=0, nên nghiệm nhỏ là 3−√2.'], ['For λ=3−√2, the first row gives y=−(1+√2)x; choose a nonzero vector in this eigendirection.', 'Với λ=3−√2, hàng đầu cho y=−(1+√2)x; chọn vector khác 0 theo hướng riêng này.'], ['Normalize that vector to unit length; the spectral expansion shows its quadratic value is the minimum eigenvalue.', 'Chuẩn hóa vector thành độ dài đơn vị; khai triển phổ cho thấy giá trị toàn phương bằng trị riêng nhỏ nhất.']],
  ),
  'f-w008-e1': lesson(
    ['The SVD separates a linear map into orthogonal input directions, singular-value scaling, and output directions.', 'SVD tách ánh xạ tuyến tính thành hướng vào trực giao, co giãn theo giá trị kỳ dị và hướng ra.'],
    ['For A=diag(2,0,0) as a 3×2 matrix, singular values are 2,0; A=UΣVᵀ with U=I₃, V=I₂, Σ=[[2,0],[0,0],[0,0]].', 'Với A=diag(2,0,0) dạng ma trận 3×2, giá trị kỳ dị là 2,0; A=UΣVᵀ với U=I₃, V=I₂, Σ=[[2,0],[0,0],[0,0]].'],
    [['Compute AᵀA=diag(4,0); its eigenvalues 4 and 0 give singular values 2 and 0.', 'Tính AᵀA=diag(4,0); trị riêng 4 và 0 cho giá trị kỳ dị 2 và 0.'], ['The coordinate unit vectors already give the right and left singular directions, so identity orthogonal factors work.', 'Các vector đơn vị tọa độ đã là hướng kỳ dị phải và trái, nên các thừa số trực giao đơn vị dùng được.'], ['A(x₁,x₂)=(2x₁,0,0); it vanishes exactly when x₁=0, hence N(A)=span{(0,1)}.', 'A(x₁,x₂)=(2x₁,0,0); nó bằng 0 đúng khi x₁=0, nên N(A)=span{(0,1)}.']],
  ),
  'f-w008-e2': lesson(
    ['The pseudoinverse chooses, among equally good fits, the coefficient vector with smallest Euclidean norm.', 'Nghịch đảo giả chọn vector hệ số có chuẩn Euclid nhỏ nhất trong các nghiệm khớp tốt như nhau.'],
    ['For any real matrix A, A⁺b is a least-squares minimizer of ||Ax−b||₂ and, among all such minimizers, has minimum Euclidean norm; no rank assumption is needed. If A has full row rank, A⁺=Aᵀ(AAᵀ)⁻¹. Here A=[1 1] has full row rank, A⁺=(1/2,1/2)ᵀ; all exact fits satisfy β₁+β₂=2, and A⁺b=(1,1)ᵀ.', 'Với mọi ma trận thực A, A⁺b là nghiệm cực tiểu bình phương của ||Ax−b||₂ và có chuẩn Euclid nhỏ nhất trong các nghiệm cực tiểu đó; không cần giả thiết hạng. Nếu A đủ hạng hàng thì A⁺=Aᵀ(AAᵀ)⁻¹. Ở đây A=[1 1] đủ hạng hàng, A⁺=(1/2,1/2)ᵀ; mọi nghiệm chính xác thỏa β₁+β₂=2 và A⁺b=(1,1)ᵀ.'],
    [['Since b=2 is in the range, least-squares residual can be zero; solve β₁+β₂=2 for all fits.', 'Vì b=2 thuộc ảnh, phần dư bình phương tối thiểu có thể bằng 0; giải β₁+β₂=2 để có mọi nghiệm khớp.'], ['Use A⁺=Aᵀ(AAᵀ)⁻¹=(1/2,1/2)ᵀ to obtain the minimum-norm coefficient pair (1,1).', 'Dùng A⁺=Aᵀ(AAᵀ)⁻¹=(1/2,1/2)ᵀ để được cặp hệ số chuẩn nhỏ nhất (1,1).'], ['Check that (1,1) satisfies the equation and is orthogonal to the null direction (1,−1), so no other fit has smaller norm.', 'Kiểm tra (1,1) thỏa phương trình và trực giao với hướng kernel (1,−1), nên không nghiệm khớp nào có chuẩn nhỏ hơn.']],
  ),
  'f-w008-e3': lesson(
    ['Forming normal equations squares the spectral spread of a design matrix, which explains their numerical sensitivity.', 'Lập phương trình chuẩn bình phương độ phân tán phổ của ma trận thiết kế, giải thích độ nhạy số học.'],
    ['For full column rank X, eigenvalues of XᵀX are σᵢ(X)², so κ₂(XᵀX)=σ_max²/σ_min²=κ₂(X)².', 'Với X hạng cột đầy đủ, trị riêng của XᵀX là σᵢ(X)², nên κ₂(XᵀX)=σ_max²/σ_min²=κ₂(X)².'],
    [['Use the SVD X=UΣVᵀ to write XᵀX=VΣ²Vᵀ.', 'Dùng SVD X=UΣVᵀ để viết XᵀX=VΣ²Vᵀ.'], ['The largest and smallest eigenvalues of XᵀX are σ_max² and σ_min².', 'Trị riêng lớn nhất và nhỏ nhất của XᵀX là σ_max² và σ_min².'], ['Take their ratio and compare with κ₂(X)=σ_max/σ_min; full column rank ensures σ_min>0.', 'Lấy tỷ số và so với κ₂(X)=σ_max/σ_min; hạng cột đầy đủ bảo đảm σ_min>0.']],
  ),
  'f-w008-e4': lesson(
    ['Numerically solving a least-squares problem is safer when the algorithm avoids squaring an already large condition number.', 'Giải bình phương tối thiểu bằng số an toàn hơn khi thuật toán tránh bình phương một số điều kiện vốn đã lớn.'],
    ['κ₂(XᵀX)=κ₂(X)²=10¹². QR works with X directly and avoids explicitly forming the squared-condition normal equations.', 'κ₂(XᵀX)=κ₂(X)²=10¹². QR làm việc trực tiếp với X và tránh lập tường minh phương trình chuẩn có số điều kiện bị bình phương.'],
    [['Apply the condition-number identity to obtain 10¹² for XᵀX.', 'Áp dụng đồng nhất thức số điều kiện để được 10¹² cho XᵀX.'], ['Recognize that roundoff in a system with condition number 10¹² can be greatly amplified.', 'Nhận ra sai số làm tròn trong hệ có số điều kiện 10¹² có thể bị khuếch đại mạnh.'], ['Prefer a QR factorization for a stable solve; state that the conclusion concerns finite-precision sensitivity under the given conditioning.', 'Ưu tiên phân tích QR để giải ổn định; nêu kết luận liên quan độ nhạy số hữu hạn với điều kiện đã cho.']],
  ),
  'f-w008-e5': lesson(
    ['Low-rank approximation optimizes matrix error in a chosen norm; it does not by itself certify out-of-sample prediction quality.', 'Xấp xỉ hạng thấp tối ưu sai số ma trận theo chuẩn đã chọn; tự nó không chứng nhận chất lượng dự đoán ngoài mẫu.'],
    ['By the Eckart–Young theorem, the spectral-norm error of rank-k truncation is σₖ₊₁; at rank 1 it is 2.', 'Theo định lý Eckart–Young, sai số chuẩn phổ của xấp xỉ hạng k là σₖ₊₁; ở hạng 1, sai số bằng 2.'],
    [['Order singular values: 5≥2≥0.1; truncating to rank one discards the second and third directions.', 'Sắp trị kỳ dị: 5≥2≥0,1; cắt về hạng một loại bỏ hướng thứ hai và thứ ba.'], ['The largest discarded singular value is 2, so that is the spectral approximation error, not 0.1.', 'Giá trị kỳ dị bị loại lớn nhất là 2, nên đó là sai số xấp xỉ phổ, không phải 0,1.'], ['Predictive accuracy also depends on how signal, noise, and future data align; matrix norm alone supplies no such guarantee.', 'Độ chính xác dự đoán còn tùy sự tương hợp giữa tín hiệu, nhiễu và dữ liệu tương lai; riêng chuẩn ma trận không bảo đảm điều đó.']],
  ),
  'f-w009-e1': lesson(
    ['The derivative of a composed model is a matrix product; checking dimensions prevents reversing the chain rule.', 'Đạo hàm của mô hình hợp là tích ma trận; kiểm tra kích thước giúp tránh đảo thứ tự quy tắc dây chuyền.'],
    ['D(g∘f)(x)=Dg(f(x))Df(x), with Dg 1×3 and Df 3×2. At (1,2), the result is (10,5).', 'D(g∘f)(x)=Dg(f(x))Df(x), với Dg kích thước 1×3 và Df kích thước 3×2. Tại (1,2), kết quả là (10,5).'],
    [['Compute f(1,2)=(3,2,1), then Dg(a,b,c)=(b,a,1) gives (2,3,1).', 'Tính f(1,2)=(3,2,1), rồi Dg(a,b,c)=(b,a,1) cho (2,3,1).'], ['Build Df with rows (1,1), (y,x), and (2x,0); at (1,2) these are (1,1),(2,1),(2,0).', 'Lập Df với các hàng (1,1), (y,x), (2x,0); tại (1,2) chúng là (1,1),(2,1),(2,0).'], ['Multiply the row Jacobian (2,3,1) by Df to obtain (2+6+2, 2+3+0)=(10,5).', 'Nhân Jacobian hàng (2,3,1) với Df để được (2+6+2, 2+3+0)=(10,5).']],
  ),
  'f-w009-e2': lesson(
    ['A directional derivative measures change per unit distance along a specified direction, so the direction vector must be normalized.', 'Đạo hàm theo hướng đo biến thiên trên mỗi đơn vị độ dài theo hướng đã chọn, nên cần chuẩn hóa vector hướng.'],
    ['Dᵤf(x)=∇f(x)·u for ||u||₂=1. Here ∇f(1,−1)=(−1,3) and u=(3/5,4/5).', 'Dᵤf(x)=∇f(x)·u khi ||u||₂=1. Ở đây ∇f(1,−1)=(−1,3) và u=(3/5,4/5).'],
    [['Differentiate f=x²+3xy: ∇f=(2x+3y,3x).', 'Lấy đạo hàm f=x²+3xy: ∇f=(2x+3y,3x).'], ['Evaluate at (1,−1) to get (−1,3); normalize v=(3,4) by its norm 5.', 'Tính tại (1,−1) được (−1,3); chuẩn hóa v=(3,4) bằng độ dài 5.'], ['Take the dot product with (3/5,4/5), yielding −3/5+12/5=9/5.', 'Tính tích vô hướng với (3/5,4/5), được −3/5+12/5=9/5.']],
  ),
  'f-w009-e3': lesson(
    ['Coordinate-wise derivatives inspect only axis paths; differentiability requires one linear approximation to work along every approach.', 'Đạo hàm riêng chỉ kiểm tra các đường trục tọa độ; khả vi đòi hỏi một xấp xỉ tuyến tính đúng theo mọi cách tiến tới.'],
    ['For f(x,y)=x²y/(x⁴+y²) off the origin and f(0,0)=0, both coordinate partials are 0 but f(t,t²)=1/2 for t≠0.', 'Với f(x,y)=x²y/(x⁴+y²) ngoài gốc và f(0,0)=0, hai đạo hàm riêng đều 0 nhưng f(t,t²)=1/2 khi t≠0.'],
    [['Along the x-axis and y-axis the numerator is zero, so each partial difference quotient at the origin is zero.', 'Trên trục x và trục y, tử số bằng 0 nên mỗi thương sai phân riêng tại gốc bằng 0.'], ['Along y=x², substitute x=t,y=t²: numerator and denominator are both t⁴, giving value 1/2.', 'Theo y=x², thay x=t,y=t²: tử và mẫu đều bằng t⁴, cho giá trị 1/2.'], ['This path does not approach f(0,0)=0, so f is discontinuous; differentiability would imply continuity and therefore fails.', 'Đường này không tiến tới f(0,0)=0 nên hàm không liên tục; khả vi kéo theo liên tục nên cũng thất bại.']],
  ),
  'f-w009-e4': lesson(
    ['Implicit differentiation finds a response derivative without solving the constraint explicitly, provided the partial derivative in y is nonzero.', 'Lấy đạo hàm ẩn tìm đạo hàm đáp ứng mà không cần giải tường minh ràng buộc, khi đạo hàm riêng theo y khác 0.'],
    ['Fₓx′+Fᵧy′=0, so y′=−Fₓx′/Fᵧ where Fᵧ≠0. For x²+y²=25 at (3,4), y′=−3/2 when x′=2.', 'Fₓx′+Fᵧy′=0 nên y′=−Fₓx′/Fᵧ khi Fᵧ≠0. Với x²+y²=25 tại (3,4), y′=−3/2 khi x′=2.'],
    [['Differentiate F(x(t),y(t))=0 by the chain rule: Fₓx′+Fᵧy′=0.', 'Lấy đạo hàm F(x(t),y(t))=0 theo quy tắc dây chuyền: Fₓx′+Fᵧy′=0.'], ['Solve for y′ only after noting Fᵧ is nonzero; here Fᵧ=2y=8.', 'Giải y′ sau khi lưu ý Fᵧ khác 0; ở đây Fᵧ=2y=8.'], ['At (3,4), Fₓ=6 and x′=2, giving y′=−6·2/8=−3/2.', 'Tại (3,4), Fₓ=6 và x′=2, nên y′=−6·2/8=−3/2.']],
  ),
  'f-w009-e5': lesson(
    ['A coordinate Jacobian changes area locally by the absolute value of its determinant.', 'Jacobian tọa độ biến đổi diện tích cục bộ theo trị tuyệt đối định thức.'],
    ['For (x,y)=(r cosθ,r sinθ), det ∂(x,y)/∂(r,θ)=r; polar area element is r dr dθ for r≥0.', 'Với (x,y)=(r cosθ,r sinθ), det ∂(x,y)/∂(r,θ)=r; phần tử diện tích cực là r dr dθ khi r≥0.'],
    [['Differentiate coordinates to form rows (cosθ,−r sinθ) and (sinθ,r cosθ).', 'Lấy đạo hàm tọa độ để lập hai hàng (cosθ,−r sinθ) và (sinθ,r cosθ).'], ['Compute the determinant r cos²θ+r sin²θ=r.', 'Tính định thức r cos²θ+r sin²θ=r.'], ['Interpret the absolute determinant as local area scale; under standard polar coordinates r≥0, the factor is r.', 'Diễn giải trị tuyệt đối định thức là tỷ lệ diện tích cục bộ; với tọa độ cực chuẩn r≥0, hệ số là r.']],
  ),
  'f-w010-e1': lesson(
    ['A Lipschitz Hessian controls how quickly curvature changes and therefore bounds the error after a quadratic local model.', 'Hessian Lipschitz kiểm soát tốc độ thay đổi độ cong, từ đó chặn sai số sau mô hình cục bộ bậc hai.'],
    ['If ||H(u)−H(v)||₂≤L||u−v|| on the segment, then |R₃|≤(L/6)||h||³ in the second-order Taylor expansion.', 'Nếu ||H(u)−H(v)||₂≤L||u−v|| trên đoạn thẳng thì |R₃|≤(L/6)||h||³ trong khai triển Taylor bậc hai.'],
    [['Write the second-order remainder in integral form, comparing H(x+th) with H(x) along 0≤t≤1.', 'Viết phần dư bậc hai dạng tích phân, so sánh H(x+th) với H(x) trên 0≤t≤1.'], ['Use the Lipschitz bound to get ||H(x+th)−H(x)||₂≤Lt||h||.', 'Dùng cận Lipschitz để có ||H(x+th)−H(x)||₂≤Lt||h||.'], ['Multiply by ||h||² and integrate the weight (1−t): L||h||³∫₀¹t(1−t)dt=L||h||³/6.', 'Nhân với ||h||² rồi tích phân trọng số (1−t): L||h||³∫₀¹t(1−t)dt=L||h||³/6.']],
  ),
  'f-w010-e2': lesson(
    ['The Hessian classifies a stationary point through curvature in every direction; positive definiteness gives a strict local minimum.', 'Hessian phân loại điểm dừng qua độ cong theo mọi hướng; xác định dương cho cực tiểu địa phương nghiêm ngặt.'],
    ['For a symmetric 2×2 Hessian, positive definiteness follows from H₁₁>0 and det(H)>0; both functions have these properties.', 'Với Hessian đối xứng 2×2, xác định dương theo H₁₁>0 và det(H)>0; cả hai hàm đều thỏa.'],
    [['Both gradients vanish at the origin, so the Hessian test applies there.', 'Gradient của cả hai hàm bằng 0 tại gốc nên áp dụng được phép thử Hessian.'], ['For f, H=[[6,2],[2,2]], with leading entry 6>0 and determinant 8>0; it is positive definite.', 'Với f, H=[[6,2],[2,2]], phần tử đầu 6>0 và định thức 8>0; Hessian xác định dương.'], ['For g, H=[[6,2],[2,4]], with determinant 20>0 and positive leading entry; both origins are strict local minima.', 'Với g, H=[[6,2],[2,4]], định thức 20>0 và phần tử đầu dương; gốc của cả hai là cực tiểu địa phương nghiêm ngặt.']],
  ),
  'f-w010-e3': lesson(
    ['Lagrange multipliers find the point on a regular constraint surface where the objective gradient is normal to that surface.', 'Nhân tử Lagrange tìm điểm trên mặt ràng buộc chính quy mà gradient mục tiêu vuông góc mặt đó.'],
    ['For constraint c(x,y)=0 with ∇c≠0, solve ∇f=λ∇c and c=0. Here (2x,2y)=λ(1,2), x+2y=6.', 'Với ràng buộc c(x,y)=0 và ∇c≠0, giải ∇f=λ∇c cùng c=0. Ở đây (2x,2y)=λ(1,2), x+2y=6.'],
    [['Set up 2x=λ and 2y=2λ from the two gradient coordinates.', 'Lập 2x=λ và 2y=2λ từ hai tọa độ gradient.'], ['Thus x=λ/2 and y=λ; substitute into x+2y=6 to obtain (5/2)λ=6.', 'Suy ra x=λ/2 và y=λ; thế vào x+2y=6 được (5/2)λ=6.'], ['Solve λ=12/5, giving (x,y)=(6/5,12/5); convexity of squared norm makes this the global constrained minimum.', 'Giải λ=12/5, được (x,y)=(6/5,12/5); tính lồi của bình phương chuẩn khiến đây là cực tiểu toàn cục có ràng buộc.']],
  ),
  'f-w010-e4': lesson(
    ['A constraint qualification is needed for the multiplier equation; a singular constraint gradient can miss a feasible optimum.', 'Phương trình nhân tử cần điều kiện chính quy; gradient ràng buộc suy biến có thể bỏ sót cực trị khả thi.'],
    ['At the feasible point x=0, f′(0)=1 while c′(0)=0, so 1=λ·0 has no solution although the feasible set is {0}.', 'Tại điểm khả thi x=0, f′(0)=1 còn c′(0)=0, nên 1=λ·0 vô nghiệm dù tập khả thi là {0}.'],
    [['The constraint x²=0 forces x=0, leaving a singleton feasible set where f attains its minimum.', 'Ràng buộc x²=0 buộc x=0, tạo tập khả thi chỉ một điểm nơi f đạt cực tiểu.'], ['Compute f′(0)=1 and c′(0)=2·0=0.', 'Tính f′(0)=1 và c′(0)=2·0=0.'], ['The multiplier condition 1=λ·0 is impossible; identify ∇c≠0 as the regularity condition that fails.', 'Điều kiện nhân tử 1=λ·0 là bất khả; chỉ ra ∇c≠0 là điều kiện chính quy đã thất bại.']],
  ),
  'f-w010-e5': lesson(
    ['A bounded Hessian gives a finite curvature penalty, so a sufficiently short step along negative gradient decreases the objective.', 'Hessian bị chặn cho chi phí độ cong hữu hạn, nên bước đủ ngắn theo gradient âm sẽ giảm mục tiêu.'],
    ['If ||H||₂≤M on the step segment, f(x−αg)≤f(x)−α||g||²+(M/2)α²||g||²; choose 0<α<2/M when M>0.', 'Nếu ||H||₂≤M trên đoạn bước, f(x−αg)≤f(x)−α||g||²+(M/2)α²||g||²; chọn 0<α<2/M khi M>0.'],
    [['Set g=∇f(x) and apply Taylor along displacement h=−αg.', 'Đặt g=∇f(x) và áp dụng Taylor theo độ dời h=−αg.'], ['The linear term is −α||g||²; the second-order remainder is at most (M/2)α²||g||².', 'Số hạng tuyến tính là −α||g||²; phần dư bậc hai không quá (M/2)α²||g||².'], ['Factor α||g||²: the change is negative when 1−Mα/2>0, giving the stated sufficient step bound.', 'Đặt nhân tử α||g||²: biến thiên âm khi 1−Mα/2>0, cho cận bước đủ nhỏ đã nêu.']],
  ),
  'f-w011-e1': lesson(
    ['Changing integration order can simplify a region when the boundary is easier to describe using the other variable.', 'Đổi thứ tự tích phân có thể đơn giản hóa miền khi biên dễ mô tả hơn theo biến còn lại.'],
    ['The region 0≤x≤1, x≤y≤1 is equivalently 0≤y≤1, 0≤x≤y; ∬1 dA is its area 1/2.', 'Miền 0≤x≤1, x≤y≤1 tương đương 0≤y≤1, 0≤x≤y; ∬1 dA bằng diện tích 1/2.'],
    [['Read the original inequalities: for fixed x, y runs from x to 1.', 'Đọc bất đẳng thức ban đầu: với x cố định, y chạy từ x đến 1.'], ['Project the region onto the y-axis, then for fixed y identify x from 0 to y.', 'Chiếu miền lên trục y, rồi với y cố định xác định x chạy từ 0 đến y.'], ['Write ∫₀¹∫₀ʸ f(x,y)dxdy; for f=1 the integral is ∫₀¹y dy=1/2.', 'Viết ∫₀¹∫₀ʸ f(x,y)dxdy; với f=1, tích phân là ∫₀¹y dy=1/2.']],
  ),
  'f-w011-e2': lesson(
    ['Polar coordinates exploit radial symmetry; the Jacobian contributes an extra factor r to area.', 'Tọa độ cực tận dụng đối xứng xuyên tâm; Jacobian thêm thừa số r vào diện tích.'],
    ['On the radius-2 disk, x²+y²=r² and dA=r dr dθ; integral = ∫₀²π∫₀²r³drdθ=8π.', 'Trên đĩa bán kính 2, x²+y²=r² và dA=r dr dθ; tích phân = ∫₀²π∫₀²r³drdθ=8π.'],
    [['Translate the disk to 0≤r≤2 and 0≤θ≤2π.', 'Đổi đĩa thành miền 0≤r≤2 và 0≤θ≤2π.'], ['Replace x²+y² by r² and include the area factor r, producing integrand r³.', 'Thay x²+y² bằng r² và thêm hệ số diện tích r, được hàm dưới dấu tích phân r³.'], ['Integrate r³ to get 4, then multiply by angular length 2π to obtain 8π.', 'Tích phân r³ được 4, rồi nhân độ dài góc 2π để được 8π.']],
  ),
  'f-w011-e3': lesson(
    ['An affine coordinate map scales area by the absolute determinant of its linear part.', 'Phép đổi tọa độ affine co giãn diện tích theo trị tuyệt đối định thức của phần tuyến tính.'],
    ['For (x,y)=(2u+v,u+3v), J=[[2,1],[1,3]], |det J|=5; the unit square maps to area 5.', 'Với (x,y)=(2u+v,u+3v), J=[[2,1],[1,3]], |det J|=5; hình vuông đơn vị biến thành diện tích 5.'],
    [['Differentiate the linear coordinate formulas with respect to u and v to form J.', 'Lấy đạo hàm công thức tọa độ tuyến tính theo u,v để lập J.'], ['Compute det J=2·3−1·1=5, a positive area scale.', 'Tính det J=2·3−1·1=5, hệ số diện tích dương.'], ['Multiply the unit-square area 1 by 5; translation is absent and orientation does not change the area magnitude.', 'Nhân diện tích hình vuông đơn vị 1 với 5; không có tịnh tiến và hướng không đổi độ lớn diện tích.']],
  ),
  'f-w011-e4': lesson(
    ['The one-inverse change-of-variables formula requires injectivity; a many-to-one map must count each branch separately.', 'Công thức đổi biến dùng một nghịch đảo cần tính đơn ánh; ánh xạ nhiều-một phải tính riêng từng nhánh.'],
    ['For y=u² on [−1,1], inverse branches are u=±√y for 0<y≤1; split the domain into monotone branches.', 'Với y=u² trên [−1,1], các nhánh nghịch đảo là u=±√y khi 0<y≤1; chia miền thành các nhánh đơn điệu.'],
    [['Observe u and −u have the same image, so no single-valued inverse exists on the whole interval.', 'Nhận thấy u và −u có cùng ảnh, nên không có nghịch đảo đơn trị trên toàn khoảng.'], ['Split into [−1,0] and [0,1], where the map is one-to-one on each branch.', 'Chia thành [−1,0] và [0,1], nơi ánh xạ đơn ánh trên mỗi nhánh.'], ['Apply the one-dimensional formula with the absolute inverse derivative on both branches; the shared endpoint has measure zero.', 'Áp dụng công thức một chiều với trị tuyệt đối đạo hàm nghịch đảo trên cả hai nhánh; điểm biên chung có độ đo 0.']],
  ),
  'f-w011-e5': lesson(
    ['Squaring a Gaussian integral turns a one-dimensional integral into a radial two-dimensional integral.', 'Bình phương tích phân Gaussian biến tích phân một chiều thành tích phân hai chiều theo bán kính.'],
    ['I²=∬R²e^{−(x²+y²)}dxdy=2π∫₀∞e^{−r²}rdr=π; since I>0, I=√π.', 'I²=∬R²e^{−(x²+y²)}dxdy=2π∫₀∞e^{−r²}rdr=π; vì I>0 nên I=√π.'],
    [['Use the given finite positive integral and Tonelli/Fubini for the nonnegative product to write I² as a double integral.', 'Dùng tích phân hữu hạn dương đã cho và Tonelli/Fubini cho tích không âm để viết I² thành tích phân kép.'], ['Convert to polar coordinates over the plane; integrate angle from 0 to 2π and radius from 0 to infinity.', 'Đổi sang tọa độ cực trên mặt phẳng; tích phân góc từ 0 đến 2π và bán kính từ 0 đến vô cùng.'], ['Substitute s=r² so ∫₀∞e^{−r²}rdr=1/2; obtain I²=π and take the positive root.', 'Đặt s=r² để ∫₀∞e^{−r²}rdr=1/2; được I²=π và lấy căn dương.']],
  ),
  'f-w012-e1': lesson(
    ['Monotone bounded sequences converge in R; the supremum identifies the limit without estimating an arbitrary tail directly.', 'Dãy đơn điệu bị chặn hội tụ trong R; supremum xác định giới hạn mà không cần chặn trực tiếp từng đuôi.'],
    ['If aₙ increases and is bounded above, then aₙ→sup{aₙ}. Here sup{1−1/(n+1):n≥1}=1.', 'Nếu aₙ tăng và bị chặn trên thì aₙ→sup{aₙ}. Ở đây sup{1−1/(n+1):n≥1}=1.'],
    [['Check monotonicity: aₙ₊₁−aₙ=1/((n+1)(n+2))>0.', 'Kiểm tra tăng: aₙ₊₁−aₙ=1/((n+1)(n+2))>0.'], ['Each term is below 1, and terms approach 1, so the supremum is 1.', 'Mỗi số hạng nhỏ hơn 1 và các số hạng tiến tới 1, nên supremum bằng 1.'], ['Apply the monotone convergence theorem for real sequences to conclude the limit equals the supremum.', 'Áp dụng định lý hội tụ đơn điệu cho dãy thực để kết luận giới hạn bằng supremum.']],
  ),
  'f-w012-e2': lesson(
    ['The Cauchy criterion checks that late sequence terms cluster tightly, independent of knowing the limit in advance.', 'Tiêu chuẩn Cauchy kiểm tra các số hạng về sau tụ lại gần nhau, không cần biết trước giới hạn.'],
    ['For m,n≥N, |1/m−1/n|≤max(1/m,1/n)≤1/N; choose an integer N>1/ε.', 'Với m,n≥N, |1/m−1/n|≤max(1/m,1/n)≤1/N; chọn số nguyên N>1/ε.'],
    [['Fix ε>0 and choose N>1/ε so 1/N<ε.', 'Cố định ε>0 và chọn N>1/ε để 1/N<ε.'], ['For m,n≥N, both 1/m and 1/n lie between 0 and 1/N.', 'Với m,n≥N, cả 1/m và 1/n nằm giữa 0 và 1/N.'], ['Their distance is at most 1/N<ε, proving the sequence is Cauchy.', 'Khoảng cách của chúng không quá 1/N<ε, chứng minh dãy Cauchy.']],
  ),
  'f-w012-e3': lesson(
    ['Subsequences can certify nonconvergence by preserving distinct limiting behaviors of the original sequence.', 'Dãy con có thể chứng nhận không hội tụ bằng cách giữ hai hành vi giới hạn khác nhau của dãy gốc.'],
    ['A convergent sequence and every subsequence share the same limit; for bₙ=(−1)ⁿ+1/n, even and odd limits differ.', 'Dãy hội tụ và mọi dãy con có cùng giới hạn; với bₙ=(−1)ⁿ+1/n, giới hạn chỉ số chẵn và lẻ khác nhau.'],
    [['Bound the terms using |bₙ|≤1+1/n≤2, so the sequence is bounded.', 'Chặn số hạng bằng |bₙ|≤1+1/n≤2, nên dãy bị chặn.'], ['Along even n, (−1)ⁿ=1 and 1/n→0, hence the subsequence tends to 1.', 'Với n chẵn, (−1)ⁿ=1 và 1/n→0, nên dãy con tiến tới 1.'], ['Along odd n the sign is −1 and the terms tend to −1; distinct subsequential limits rule out convergence.', 'Với n lẻ dấu là −1 và số hạng tiến tới −1; hai giới hạn dãy con khác nhau loại trừ hội tụ.']],
  ),
  'f-w012-e4': lesson(
    ['A recurrence can be bounded and shown monotone by comparing its next value to its current value and a proposed invariant ceiling.', 'Có thể chứng minh truy hồi bị chặn và đơn điệu bằng cách so sánh số hạng sau với hiện tại và trần bất biến dự kiến.'],
    ['xₙ₊₁−xₙ=(2−xₙ)/2; if xₙ≤2 then xₙ₊₁≤2. Any limit L satisfies L=(L+2)/2.', 'xₙ₊₁−xₙ=(2−xₙ)/2; nếu xₙ≤2 thì xₙ₊₁≤2. Mọi giới hạn L thỏa L=(L+2)/2.'],
    [['Base case x₁=1≤2; if xₙ≤2, recurrence gives xₙ₊₁≤2, proving the upper bound by induction.', 'Cơ sở x₁=1≤2; nếu xₙ≤2 thì truy hồi cho xₙ₊₁≤2, chứng minh cận trên bằng quy nạp.'], ['The same bound makes xₙ₊₁−xₙ=(2−xₙ)/2≥0, so the sequence is increasing.', 'Cùng cận đó cho xₙ₊₁−xₙ=(2−xₙ)/2≥0, nên dãy tăng.'], ['Monotone bounded convergence gives a limit; pass to the recurrence and solve L=(L+2)/2, hence L=2.', 'Định lý dãy tăng bị chặn cho giới hạn; đưa giới hạn qua truy hồi rồi giải L=(L+2)/2, được L=2.']],
  ),
  'f-w012-e5': lesson(
    ['Negating the Cauchy condition describes pairs of arbitrarily late terms that remain a fixed positive distance apart.', 'Phủ định điều kiện Cauchy mô tả các cặp số hạng tùy ý xa nhau vẫn cách một khoảng dương cố định.'],
    ['Not Cauchy iff ∃ε₀>0 ∀N∈N ∃m,n≥N with |aₘ−aₙ|≥ε₀.', 'Không Cauchy khi và chỉ khi ∃ε₀>0 ∀N∈N ∃m,n≥N sao cho |aₘ−aₙ|≥ε₀.'],
    [['Negate “for every ε>0” to obtain one fixed ε₀ that witnesses failure.', 'Phủ định “với mọi ε>0” để có một ε₀ cố định làm chứng cho thất bại.'], ['Negate the tail condition: for every cutoff N, find two indices m,n both at least N.', 'Phủ định điều kiện đuôi: với mọi cutoff N, tìm hai chỉ số m,n đều ít nhất N.'], ['Require their distance at least ε₀; for aₙ=(−1)ⁿ choose ε₀=1 and one even plus one odd index beyond N.', 'Yêu cầu khoảng cách của chúng ít nhất ε₀; với aₙ=(−1)ⁿ chọn ε₀=1 và một chỉ số chẵn cùng một chỉ số lẻ sau N.']],
  ),
  'f-w013-e1': lesson(
    ['A global Lipschitz bound converts input closeness into output closeness uniformly over the entire domain.', 'Cận Lipschitz toàn cục biến độ gần đầu vào thành độ gần đầu ra đồng đều trên toàn miền.'],
    ['If ||f(x)−f(y)||≤L||x−y|| for all x,y∈D and finite L>0, choose δ=ε/L; if L=0, f is constant.', 'Nếu ||f(x)−f(y)||≤L||x−y|| với mọi x,y∈D và 0<L<∞, chọn δ=ε/L; nếu L=0 thì f hằng.'],
    [['Fix ε>0 and take δ=ε/L when L>0; this choice does not depend on x or y.', 'Cố định ε>0 và lấy δ=ε/L khi L>0; lựa chọn này không phụ thuộc x,y.'], ['Whenever x,y∈D and ||x−y||<δ, apply the Lipschitz inequality to get ||f(x)−f(y)||<ε.', 'Khi x,y∈D và ||x−y||<δ, áp dụng bất đẳng thức Lipschitz để có ||f(x)−f(y)||<ε.'], ['Because the same δ works for every pair in D, this is uniform continuity.', 'Vì cùng một δ dùng được cho mọi cặp trong D, đây là liên tục đều.']],
  ),
  'f-w013-e2': lesson(
    ['Uniform continuity fails near a boundary when inputs become arbitrarily close but outputs stay a fixed distance apart.', 'Liên tục đều thất bại gần biên khi đầu vào gần tùy ý nhưng đầu ra vẫn cách một khoảng cố định.'],
    ['For xₙ=1/n and yₙ=1/(n+1), |xₙ−yₙ|=1/[n(n+1)]→0 but |1/xₙ−1/yₙ|=1.', 'Với xₙ=1/n và yₙ=1/(n+1), |xₙ−yₙ|=1/[n(n+1)]→0 nhưng |1/xₙ−1/yₙ|=1.'],
    [['Both sequences lie in (0,1] and their input distance is 1/[n(n+1)], which tends to zero.', 'Cả hai dãy nằm trong (0,1] và khoảng cách đầu vào là 1/[n(n+1)], tiến về 0.'], ['Apply f(x)=1/x: outputs are n and n+1, separated by exactly one.', 'Áp dụng f(x)=1/x: đầu ra là n và n+1, cách nhau đúng một đơn vị.'], ['Uniform continuity would force output distance below any fixed ε for sufficiently close inputs; choosing ε=1/2 contradicts this pair sequence.', 'Liên tục đều buộc khoảng cách đầu ra nhỏ hơn mọi ε cố định khi đầu vào đủ gần; chọn ε=1/2 mâu thuẫn với các cặp này.']],
  ),
  'f-w013-e3': lesson(
    ['A direct modulus of continuity can prove uniform continuity on an interval without relying on compactness.', 'Một modulus liên tục trực tiếp có thể chứng minh liên tục đều trên khoảng mà không cần viện dẫn compact.'],
    ['For x,y≥0, |√x−√y|≤√|x−y|; choosing δ=ε² proves uniform continuity on [0,4].', 'Với x,y≥0, |√x−√y|≤√|x−y|; chọn δ=ε² để chứng minh liên tục đều trên [0,4].'],
    [['Assume x≥y; rationalize to write √x−√y=(x−y)/(√x+√y).', 'Giả sử x≥y; hữu tỷ hóa để viết √x−√y=(x−y)/(√x+√y).'], ['Alternatively square the nonnegative difference and use (√x−√y)²≤x−y; this also handles y=0.', 'Hoặc bình phương hiệu không âm và dùng (√x−√y)²≤x−y; cách này cũng xử lý y=0.'], ['If |x−y|<ε² then |√x−√y|<ε, with δ independent of the points in the interval.', 'Nếu |x−y|<ε² thì |√x−√y|<ε, với δ không phụ thuộc điểm trong khoảng.']],
  ),
  'f-w013-e4': lesson(
    ['Compactness provides a convergent subsequence of inputs; continuity transfers that convergence to the outputs.', 'Tính compact cho dãy con đầu vào hội tụ; tính liên tục truyền hội tụ đó sang đầu ra.'],
    ['Every sequence in compact K has a convergent subsequence xₙₖ→x∈K; continuity yields f(xₙₖ)→f(x).', 'Mọi dãy trong compact K có dãy con hội tụ xₙₖ→x∈K; tính liên tục cho f(xₙₖ)→f(x).'],
    [['Use sequential compactness of K to extract xₙₖ→x with x∈K.', 'Dùng tính compact dãy của K để trích xₙₖ→x với x∈K.'], ['Apply continuity at x: f(xₙₖ) converges to f(x), which lies in f(K).', 'Áp dụng liên tục tại x: f(xₙₖ) hội tụ đến f(x), thuộc f(K).'], ['If only boundedness of scalar outputs is known, Bolzano–Weierstrass also supplies a convergent output subsequence; the compact-input argument identifies its limit in the image.', 'Nếu chỉ biết đầu ra vô hướng bị chặn, Bolzano–Weierstrass cũng cho dãy con đầu ra hội tụ; lập luận đầu vào compact xác định giới hạn thuộc ảnh.']],
  ),
  'f-w013-e5': lesson(
    ['Sequential compactness makes continuous images compact by lifting an image sequence to the compact domain.', 'Tính compact dãy khiến ảnh liên tục compact bằng cách nâng dãy ảnh về miền compact.'],
    ['A subset of Rᵐ is compact iff every sequence in it has a subsequence converging to a point in the set.', 'Tập con của Rᵐ compact khi và chỉ khi mọi dãy trong tập có dãy con hội tụ đến một điểm thuộc tập.'],
    [['Take any sequence yₙ∈f(K) and choose xₙ∈K with f(xₙ)=yₙ.', 'Lấy dãy yₙ∈f(K) bất kỳ và chọn xₙ∈K sao cho f(xₙ)=yₙ.'], ['Compactness of K gives a subsequence xₙₖ→x∈K.', 'Tính compact của K cho dãy con xₙₖ→x∈K.'], ['Continuity gives yₙₖ=f(xₙₖ)→f(x)∈f(K); sequential compactness proves the image is compact.', 'Tính liên tục cho yₙₖ=f(xₙₖ)→f(x)∈f(K); compact dãy chứng minh ảnh compact.']],
  ),
  'f-w014-e1': lesson(
    ['Uniform convergence is controlled by the largest error over the whole domain, not by checking points one at a time.', 'Hội tụ đều được kiểm soát bởi sai số lớn nhất trên toàn miền, không phải kiểm tra từng điểm riêng lẻ.'],
    ['supₓ∈[−5,5]|x/n−0|=5/n→0; the uniform error is exactly 5/n.', 'supₓ∈[−5,5]|x/n−0|=5/n→0; sai số đều chính xác bằng 5/n.'],
    [['For every x in the interval, |x/n|≤5/n.', 'Với mọi x trong khoảng, |x/n|≤5/n.'], ['The endpoints attain magnitude 5/n, so the supremum equals this bound.', 'Hai đầu mút đạt độ lớn 5/n nên supremum bằng cận này.'], ['Since 5/n→0, the supremum error tends to zero, which is the definition of uniform convergence.', 'Vì 5/n→0, supremum sai số tiến về 0, đúng định nghĩa hội tụ đều.']],
  ),
  'f-w014-e2': lesson(
    ['Pointwise convergence allows the convergence speed to depend on x; values near a boundary can prevent one uniform cutoff.', 'Hội tụ từng điểm cho phép tốc độ phụ thuộc x; giá trị gần biên có thể ngăn một cutoff đều.'],
    ['On [0,1], xⁿ→0 for x<1 and xⁿ=1 at x=1; supₓ|xⁿ−f(x)|=1 for every n.', 'Trên [0,1], xⁿ→0 khi x<1 và xⁿ=1 tại x=1; supₓ|xⁿ−f(x)|=1 với mọi n.'],
    [['Fix x<1: geometric powers tend to zero; at x=1 the sequence stays one, giving the pointwise limit.', 'Cố định x<1: lũy thừa hình học tiến về 0; tại x=1 dãy luôn bằng 1, cho giới hạn từng điểm.'], ['For every n, choose x<1 arbitrarily close to 1; xⁿ can be arbitrarily close to 1 while f(x)=0.', 'Với mỗi n, chọn x<1 tùy ý gần 1; xⁿ có thể tùy ý gần 1 trong khi f(x)=0.'], ['Thus the supremum error is 1, not a quantity tending to zero, so convergence is not uniform.', 'Vì vậy supremum sai số bằng 1, không tiến về 0, nên hội tụ không đều.']],
  ),
  'f-w014-e3': lesson(
    ['The uniform Cauchy criterion plus completeness of the real numbers creates a pointwise limit and controls the same tail uniformly.', 'Tiêu chuẩn Cauchy đều cùng tính đầy đủ của số thực tạo giới hạn từng điểm và kiểm soát đều cùng phần đuôi.'],
    ['If supₓ|fₙ(x)−fₘ(x)|→0 as n,m→∞, then for each x the sequence is Cauchy in R and has a limit f(x).', 'Nếu supₓ|fₙ(x)−fₘ(x)|→0 khi n,m→∞ thì với mỗi x, dãy là Cauchy trong R và có giới hạn f(x).'],
    [['Given ε>0, choose N so that m,n≥N implies supₓ|fₙ−fₘ|<ε/2.', 'Với ε>0, chọn N sao cho m,n≥N kéo theo supₓ|fₙ−fₘ|<ε/2.'], ['For each x, completeness gives fₘ(x)→f(x); let m→∞ in the pointwise inequality to obtain |fₙ(x)−f(x)|≤ε/2.', 'Với mỗi x, tính đầy đủ cho fₘ(x)→f(x); cho m→∞ trong bất đẳng thức điểm để được |fₙ(x)−f(x)|≤ε/2.'], ['The bound is independent of x, so supₓ|fₙ−f|≤ε/2<ε for n≥N, proving uniform convergence.', 'Cận không phụ thuộc x nên supₓ|fₙ−f|≤ε/2<ε khi n≥N, chứng minh hội tụ đều.']],
  ),
  'f-w014-e4': lesson(
    ['A uniform tail bound transfers boundedness from one known function to the limit over the full domain.', 'Cận đuôi đều truyền tính bị chặn từ một hàm đã biết sang giới hạn trên toàn miền.'],
    ['Choose N with supₓ|f−f_N|<1; then |f(x)|≤|f_N(x)|+1, so ||f||∞≤||f_N||∞+1.', 'Chọn N sao cho supₓ|f−f_N|<1; khi đó |f(x)|≤|f_N(x)|+1, nên ||f||∞≤||f_N||∞+1.'],
    [['Uniform convergence gives an index N for tolerance ε=1.', 'Hội tụ đều cho chỉ số N ứng với sai số ε=1.'], ['Use the triangle inequality pointwise: |f(x)|≤|f_N(x)|+|f(x)−f_N(x)|.', 'Dùng bất đẳng thức tam giác tại từng điểm: |f(x)|≤|f_N(x)|+|f(x)−f_N(x)|.'], ['Take suprema and use boundedness of f_N to obtain the finite bound ||f_N||∞+1.', 'Lấy supremum và dùng tính bị chặn của f_N để được cận hữu hạn ||f_N||∞+1.']],
  ),
  'f-w014-e5': lesson(
    ['Pointwise convergence of derivatives can fail to be uniform when the transition near zero becomes sharper with n.', 'Hội tụ từng điểm của đạo hàm có thể không đều khi vùng chuyển gần 0 ngày càng sắc theo n.'],
    ['fₙ→|x|, fₙ′(x)=x/√(x²+1/n)→g(x), where g(0)=0 and g(x)=sgn(x) for x≠0; at xₙ=1/√n the error is 1−1/√2.', 'fₙ→|x|, fₙ′(x)=x/√(x²+1/n)→g(x), với g(0)=0 và g(x)=sgn(x) khi x≠0; tại xₙ=1/√n sai số là 1−1/√2.'],
    [['Take the pointwise limit of √(x²+1/n): it is |x|; its derivative is 0 at zero and ±1 away from zero.', 'Lấy giới hạn từng điểm của √(x²+1/n): được |x|; đạo hàm bằng 0 tại 0 và ±1 ngoài 0.'], ['Differentiate each smooth fₙ to get x/√(x²+1/n), then take the pointwise limit.', 'Lấy đạo hàm từng fₙ trơn để được x/√(x²+1/n), rồi lấy giới hạn từng điểm.'], ['At xₙ=1/√n, fₙ′=1/√2 while g(xₙ)=1, so the supremum error stays at least 1−1/√2.', 'Tại xₙ=1/√n, fₙ′=1/√2 còn g(xₙ)=1, nên supremum sai số luôn ít nhất 1−1/√2.']],
  ),
  'f-w015-e1': lesson(
    ['A uniform error bound controls the integral error by the domain length times the worst pointwise discrepancy.', 'Cận sai số đều kiểm soát sai số tích phân bằng độ dài miền nhân độ lệch điểm lớn nhất.'],
    ['|∫ₐᵇ fₙ−∫ₐᵇf|≤(b−a)sup_[a,b]|fₙ−f|; here the bound is 5·0.01=0.05.', '|∫ₐᵇ fₙ−∫ₐᵇf|≤(b−a)sup_[a,b]|fₙ−f|; ở đây cận là 5·0,01=0,05.'],
    [['Use linearity to write the difference as ∫₋₂³(fₙ−f).', 'Dùng tính tuyến tính để viết hiệu thành ∫₋₂³(fₙ−f).'], ['Apply |∫g|≤∫|g| and the pointwise bound 0.01.', 'Áp dụng |∫g|≤∫|g| và cận điểm 0,01.'], ['Multiply by interval length 3−(−2)=5 to obtain 0.05.', 'Nhân với độ dài khoảng 3−(−2)=5 để được 0,05.']],
  ),
  'f-w015-e2': lesson(
    ['A shrinking spike can vanish pointwise almost everywhere while retaining positive height at its center and nonzero area at each finite n.', 'Gai nhọn co lại có thể triệt tiêu từng điểm hầu khắp nơi nhưng giữ chiều cao dương tại tâm và diện tích khác 0 ở mọi n hữu hạn.'],
    ['For n≥2, the triangular support has base 2/n and height 1, so ∫₀¹fₙ=1/n; the pointwise limit is 1 at x=1/2 and 0 elsewhere.', 'Với n≥2, giá tam giác có đáy 2/n và chiều cao 1 nên ∫₀¹fₙ=1/n; giới hạn từng điểm bằng 1 tại x=1/2 và 0 nơi khác.'],
    [['If x≠1/2, then n|x−1/2| eventually exceeds 1, so fₙ(x)=0; at the center fₙ=1.', 'Nếu x≠1/2 thì n|x−1/2| cuối cùng vượt 1 nên fₙ(x)=0; tại tâm fₙ=1.'], ['The triangle’s support width is 2/n and height is 1, so its area is (1/2)(2/n)(1)=1/n.', 'Độ rộng giá tam giác là 2/n, chiều cao 1, nên diện tích (1/2)(2/n)(1)=1/n.'], ['For n≥2 it fits inside [0,1]; its integrals tend to 0 while each finite-n integral equals 1/n.', 'Với n≥2 tam giác nằm trong [0,1]; tích phân tiến về 0 và mỗi tích phân tại n hữu hạn bằng 1/n.']],
  ),
  'f-w015-e3': lesson(
    ['A uniform geometric envelope makes every partial-sum tail small at once, which is the Weierstrass M-test mechanism.', 'Một bao hình học đồng đều làm đuôi mọi tổng riêng nhỏ cùng lúc, đúng cơ chế kiểm tra M Weierstrass.'],
    ['If |gₖ(x)|≤2⁻ᵏ for all x, then supₓ|Σₖ>N gₖ(x)|≤Σₖ>N2⁻ᵏ=2⁻ᴺ.', 'Nếu |gₖ(x)|≤2⁻ᵏ với mọi x thì supₓ|Σₖ>N gₖ(x)|≤Σₖ>N2⁻ᵏ=2⁻ᴺ.'],
    [['Apply the triangle inequality to any finite tail: |Σgₖ(x)|≤Σ|gₖ(x)|.', 'Áp dụng bất đẳng thức tam giác cho đuôi hữu hạn: |Σgₖ(x)|≤Σ|gₖ(x)|.'], ['Use the common bound 2⁻ᵏ and sum the geometric series from k=N+1 onward.', 'Dùng cận chung 2⁻ᵏ và tính tổng cấp số nhân từ k=N+1 trở đi.'], ['The tail bound 2⁻ᴺ is independent of x and tends to zero, proving uniform convergence and the stated error control.', 'Cận đuôi 2⁻ᴺ không phụ thuộc x và tiến về 0, chứng minh hội tụ đều cùng kiểm soát sai số đã nêu.']],
  ),
  'f-w015-e4': lesson(
    ['Differentiating a pointwise limit is a theorem with hypotheses; agreement at one point does not establish a general interchange rule.', 'Lấy đạo hàm giới hạn từng điểm là định lý có giả thiết; trùng nhau tại một điểm không thiết lập quy tắc đổi thứ tự tổng quát.'],
    ['For n≥2, fₙ′(0)=0, so limₙfₙ′(0)=0; the pointwise limit is 0 on [0,1), whose right derivative at 0 is also 0.', 'Với n≥2, fₙ′(0)=0 nên limₙfₙ′(0)=0; giới hạn từng điểm bằng 0 trên [0,1), có đạo hàm phải tại 0 cũng bằng 0.'],
    [['Find the pointwise limit: it is f(x)=0 for 0≤x<1 and f(1)=1.', 'Tìm giới hạn từng điểm: f(x)=0 với 0≤x<1 và f(1)=1.'], ['For n≥2, the derivative of xⁿ at zero is zero, so the derivative sequence at zero tends to zero.', 'Với n≥2, đạo hàm xⁿ tại 0 bằng 0, nên dãy đạo hàm tại 0 tiến về 0.'], ['The right derivative of f at the endpoint 0 is also zero; this local equality alone says nothing about uniform derivative convergence or interchange at other points.', 'Đạo hàm phải của f tại đầu mút 0 cũng bằng 0; sự trùng nhau cục bộ này không nói gì về hội tụ đều của đạo hàm hay đổi thứ tự tại điểm khác.']],
  ),
  'f-w015-e5': lesson(
    ['Uniform convergence on a finite interval allows the integral and limit to be interchanged with a quantitative error bound.', 'Hội tụ đều trên khoảng hữu hạn cho phép đổi giới hạn và tích phân với cận sai số định lượng.'],
    ['fₙ(x)=e⁻ˣ(1+sin x/n)→e⁻ˣ uniformly on [0,2], since sup error≤1/n; ∫₀²e⁻ˣdx=1−e⁻².', 'fₙ(x)=e⁻ˣ(1+sin x/n)→e⁻ˣ đều trên [0,2], vì sai số supremum≤1/n; ∫₀²e⁻ˣdx=1−e⁻².'],
    [['Subtract e⁻ˣ: the absolute difference is e⁻ˣ|sin x|/n≤1/n throughout the interval.', 'Trừ e⁻ˣ: độ lệch tuyệt đối là e⁻ˣ|sin x|/n≤1/n trên toàn khoảng.'], ['This supremum bound tends to zero, identifying the uniform limit e⁻ˣ.', 'Cận supremum này tiến về 0, xác định giới hạn đều là e⁻ˣ.'], ['Integrate the limit directly to get [−e⁻ˣ]₀²=1−e⁻²; the integral errors are at most 2/n.', 'Tích phân giới hạn được [−e⁻ˣ]₀²=1−e⁻²; sai số tích phân không quá 2/n.']],
  ),
  'f-w016-e1': lesson(
    ['Rank–nullity converts the dimension of unobservable directions into the rank, which limits the range dimension.', 'Định lý hạng–kernel chuyển số chiều hướng không quan sát được thành hạng, giới hạn số chiều ảnh.'],
    ['For T:R⁴→R³, rank(T)+dim ker(T)=4; if nullity is 2 then rank is 2, less than dim R³=3.', 'Với T:R⁴→R³, rank(T)+dim ker(T)=4; nếu nullity bằng 2 thì rank bằng 2, nhỏ hơn dim R³=3.'],
    [['Apply rank–nullity to the four-dimensional domain: rank=4−2=2.', 'Áp dụng hạng–kernel trên miền bốn chiều: rank=4−2=2.'], ['A map onto R³ must have image dimension three.', 'Ánh xạ phủ R³ phải có ảnh số chiều ba.'], ['Since rank is two, it cannot be onto; the conclusion uses the stated finite-dimensional spaces.', 'Vì hạng bằng hai nên không thể toàn ánh; kết luận dùng đúng các không gian hữu hạn chiều đã nêu.']],
  ),
  'f-w016-e2': lesson(
    ['A second-derivative bound controls the first-order Taylor error by half the curvature bound times the squared step.', 'Cận đạo hàm bậc hai kiểm soát sai số Taylor bậc nhất bằng nửa cận độ cong nhân bình phương bước.'],
    ['If |f″(u)|≤M between x and x+h, then |f(x+h)−f(x)−hf′(x)|≤M h²/2; here M=4,h=0.1 gives 0.02.', 'Nếu |f″(u)|≤M giữa x và x+h thì |f(x+h)−f(x)−hf′(x)|≤M h²/2; ở đây M=4,h=0,1 cho 0,02.'],
    [['Check the segment from x to x+0.1 lies inside the stated radius-0.2 neighborhood.', 'Kiểm tra đoạn từ x đến x+0,1 nằm trong lân cận bán kính 0,2 đã nêu.'], ['Use the Lagrange remainder bound M|h|²/2.', 'Dùng cận phần dư Lagrange M|h|²/2.'], ['Substitute M=4 and |h|=0.1 to obtain 4·0.01/2=0.02.', 'Thay M=4 và |h|=0,1 để được 4·0,01/2=0,02.']],
  ),
  'f-w016-e3': lesson(
    ['The extreme value theorem guarantees attainment because a closed bounded interval is compact and the objective is continuous.', 'Định lý giá trị cực trị bảo đảm đạt được vì khoảng đóng bị chặn là compact và hàm mục tiêu liên tục.'],
    ['If K is compact and f:K→R is continuous, f(K) is compact in R and therefore contains its maximum and minimum.', 'Nếu K compact và f:K→R liên tục thì f(K) compact trong R nên chứa giá trị lớn nhất và nhỏ nhất.'],
    [['Identify K=[−2,3], which is closed and bounded in R and hence compact.', 'Xác định K=[−2,3], đóng và bị chặn trong R nên compact.'], ['Use continuity of f on every point of K to conclude f(K) is compact.', 'Dùng tính liên tục của f tại mọi điểm K để kết luận f(K) compact.'], ['A compact subset of R is closed and bounded, so its supremum and infimum belong to f(K); their preimages attain the extrema.', 'Tập compact trong R đóng và bị chặn, nên supremum và infimum thuộc f(K); tiền ảnh của chúng đạt cực trị.']],
  ),
  'f-w016-e4': lesson(
    ['Open endpoints allow a bounded continuous function to approach its extreme bounds without attaining them.', 'Đầu mút mở cho phép hàm liên tục bị chặn tiến tới các cận cực trị mà không đạt chúng.'],
    ['For f(x)=x on (0,1), inf f=0 and sup f=1, but neither endpoint belongs to the domain.', 'Với f(x)=x trên (0,1), inf f=0 và sup f=1, nhưng không đầu mút nào thuộc miền.'],
    [['Choose the identity function, continuous on the open interval and bounded between 0 and 1.', 'Chọn hàm đồng nhất, liên tục trên khoảng mở và bị chặn giữa 0 và 1.'], ['Values can approach 0 from above and 1 from below, making these the infimum and supremum.', 'Giá trị có thể tiến tới 0 từ phía trên và 1 từ phía dưới, nên đó là infimum và supremum.'], ['For every x∈(0,1), 0<x<1; thus neither bound is attained.', 'Với mọi x∈(0,1), 0<x<1; do đó không cận nào đạt được.']],
  ),
  'f-w016-e5': lesson(
    ['Existence of coordinate partials only checks axis behavior; a path-dependent limit can disprove continuity and differentiability.', 'Sự tồn tại đạo hàm riêng chỉ kiểm tra hành vi trên trục; giới hạn phụ thuộc đường đi có thể bác bỏ liên tục và khả vi.'],
    ['For f(x,y)=x²y/(x⁴+y²), f(0,0)=0, both partials at the origin are 0; along y=x² the values equal 1/2.', 'Với f(x,y)=x²y/(x⁴+y²), f(0,0)=0, hai đạo hàm riêng tại gốc bằng 0; dọc y=x² giá trị bằng 1/2.'],
    [['Compute each partial using its coordinate axis: the function is zero on both axes, so both partials equal zero.', 'Tính từng đạo hàm riêng theo trục tọa độ: hàm bằng 0 trên cả hai trục nên hai đạo hàm riêng bằng 0.'], ['Approach along (t,t²); substitution gives f=1/2 for every t≠0, not tending to the origin value.', 'Tiến theo (t,t²); thay vào cho f=1/2 với mọi t≠0, không tiến tới giá trị tại gốc.'], ['The failed inference is “partials exist, therefore continuous”; differentiability would imply continuity, so the function is not differentiable.', 'Suy luận sai là “đạo hàm riêng tồn tại nên liên tục”; khả vi sẽ kéo theo liên tục, vì vậy hàm không khả vi.']],
  ),
  'f-w016-e6': lesson(
    ['Orthogonal projection is unique because two candidate residuals would force their difference into both a subspace and its orthogonal complement.', 'Phép chiếu trực giao duy nhất vì hai phần dư ứng viên buộc hiệu của chúng thuộc cả không gian con lẫn phần bù trực giao.'],
    ['If p,q∈S and y−p,y−q∈S⊥, then q−p=(y−p)−(y−q)∈S⊥; also q−p∈S, so q−p=0.', 'Nếu p,q∈S và y−p,y−q∈S⊥ thì q−p=(y−p)−(y−q)∈S⊥; đồng thời q−p∈S, nên q−p=0.'],
    [['Subtract the two orthogonality residuals: (y−p)−(y−q)=q−p.', 'Lấy hiệu hai phần dư trực giao: (y−p)−(y−q)=q−p.'], ['Each residual is in S⊥, so their difference q−p is in S⊥; because p,q∈S it is also in S.', 'Mỗi phần dư thuộc S⊥ nên hiệu q−p thuộc S⊥; do p,q∈S nên hiệu cũng thuộc S.'], ['The only vector in S∩S⊥ is zero, hence q−p=0 and p=q.', 'Vector duy nhất thuộc S∩S⊥ là 0, nên q−p=0 và p=q.']],
  ),
  'f-w016-e7': lesson(
    ['A positive-definite Hessian at a stationary point gives positive curvature in every nonzero direction and a strict local minimum.', 'Hessian xác định dương tại điểm dừng cho độ cong dương theo mọi hướng khác 0 và cực tiểu địa phương nghiêm ngặt.'],
    ['For f=x²−2xy+3y², H=[[2,−2],[−2,6]], with 2>0 and det(H)=8>0, hence H is positive definite.', 'Với f=x²−2xy+3y², H=[[2,−2],[−2,6]], có 2>0 và det(H)=8>0, nên H xác định dương.'],
    [['The origin is stationary because both first partial derivatives vanish there.', 'Gốc là điểm dừng vì cả hai đạo hàm riêng bậc nhất đều bằng 0 tại đó.'], ['Compute the constant Hessian and verify its first leading principal minor and determinant are positive.', 'Tính Hessian hằng và xác minh định thức con chính đầu cùng định thức đều dương.'], ['The Hessian test yields a strict local minimum; here the quadratic form is positive for every nonzero (x,y).', 'Phép thử Hessian cho cực tiểu địa phương nghiêm ngặt; dạng toàn phương dương với mọi (x,y) khác 0.']],
  ),
  'f-w016-e8': lesson(
    ['A continuous image preserves compactness because convergent subsequences in the domain remain convergent after applying the function.', 'Ảnh liên tục bảo toàn compact vì dãy con hội tụ trong miền vẫn hội tụ sau khi áp dụng hàm.'],
    ['For each sequence yₙ∈f(K), select xₙ∈K with f(xₙ)=yₙ; compactness and continuity yield a subsequence converging inside f(K).', 'Với mỗi dãy yₙ∈f(K), chọn xₙ∈K sao cho f(xₙ)=yₙ; tính compact và liên tục cho dãy con hội tụ bên trong f(K).'],
    [['Lift the sequence by choosing a preimage xₙ for each yₙ.', 'Nâng dãy bằng cách chọn một tiền ảnh xₙ cho mỗi yₙ.'], ['Use compactness of K to get xₙₖ→x∈K.', 'Dùng tính compact của K để có xₙₖ→x∈K.'], ['Continuity implies yₙₖ=f(xₙₖ)→f(x) with f(x)∈f(K), proving sequential compactness of the image.', 'Tính liên tục cho yₙₖ=f(xₙₖ)→f(x) với f(x)∈f(K), chứng minh ảnh compact dãy.']],
  ),
  'f-w016-e9': lesson(
    ['A fixed gap between arbitrarily late terms violates the Cauchy condition and demonstrates oscillation.', 'Khoảng cách cố định giữa các số hạng tùy ý xa vi phạm điều kiện Cauchy và biểu lộ dao động.'],
    ['For aₙ=1−(−1)ⁿ/2, odd terms are 3/2 and even terms are 1/2; choose ε₀=1.', 'Với aₙ=1−(−1)ⁿ/2, số hạng lẻ bằng 3/2 và chẵn bằng 1/2; chọn ε₀=1.'],
    [['Set ε₀=1; for any N choose an odd m≥N and an even n≥N.', 'Đặt ε₀=1; với mọi N chọn m lẻ≥N và n chẵn≥N.'], ['The corresponding terms differ by |3/2−1/2|=1, which is at least ε₀.', 'Hai số hạng chênh |3/2−1/2|=1, ít nhất bằng ε₀.'], ['Because such a pair exists beyond every cutoff N, the sequence is not Cauchy.', 'Vì luôn có cặp như vậy sau mọi cutoff N, dãy không Cauchy.']],
  ),
  'f-w016-e10': lesson(
    ['Taylor predictions separate the linear and quadratic effects; the exact increment reveals the higher-order remainder.', 'Dự đoán Taylor tách ảnh hưởng tuyến tính và bậc hai; gia số chính xác cho thấy phần dư bậc cao.'],
    ['For f(x)=x³, Δf=3x²h+3xh²+h³; at x=2,h=0.1 the linear term is 1.2, quadratic term 0.06, and remainder 0.001.', 'Với f(x)=x³, Δf=3x²h+3xh²+h³; tại x=2,h=0,1, số hạng tuyến tính 1,2, bậc hai 0,06 và phần dư 0,001.'],
    [['Compute exact change: 2.1³−2³=9.261−8=1.261.', 'Tính gia số chính xác: 2,1³−2³=9,261−8=1,261.'], ['First-order Taylor uses f′(2)h=12(0.1)=1.2; second-order adds ½f″(2)h²=6(0.01)=0.06.', 'Taylor bậc nhất dùng f′(2)h=12(0,1)=1,2; bậc hai cộng ½f″(2)h²=6(0,01)=0,06.'], ['Subtract the quadratic prediction 1.26 from the exact increment to obtain remainder 0.001=h³.', 'Trừ dự đoán bậc hai 1,26 khỏi gia số chính xác để được phần dư 0,001=h³.']],
  ),
  'f-w017-e1': lesson(
    ['In a survey, adding category counts double-counts people in the overlap; inclusion–exclusion corrects that duplication.', 'Trong khảo sát, cộng số người theo nhóm đếm trùng phần giao; công thức bao hàm–loại trừ điều chỉnh phần trùng đó.'],
    ['|P∪R|=|P|+|R|−|P∩R|; neither = total−|P∪R|.', '|P∪R|=|P|+|R|−|P∩R|; không thuộc nhóm nào = tổng−|P∪R|.'],
    [['Count the union as 22+18−10=30, subtracting the 10 people counted twice.', 'Tính hợp bằng 22+18−10=30, trừ 10 người bị đếm hai lần.'], ['Subtract 30 from the total 40 to get 10 knowing neither language.', 'Lấy tổng 40 trừ 30 để được 10 người không biết ngôn ngữ nào.'], ['Check that the result is consistent with the overlap being no larger than either group.', 'Kiểm tra kết quả phù hợp vì phần giao không lớn hơn mỗi nhóm.']],
  ),
  'f-w017-e2': lesson(
    ['Probability weights outcomes by their actual chances; counting is valid only when all elementary outcomes are equally likely.', 'Xác suất gán trọng số theo cơ hội thực tế; đếm trực tiếp chỉ đúng khi các kết quả sơ cấp đồng khả năng.'],
    ['For disjoint sectors A and B, P(A∪B)=P(A)+P(B)=0.5+0.3=0.8.', 'Với hai cung A,B rời nhau, P(A∪B)=P(A)+P(B)=0,5+0,3=0,8.'],
    [['The spinner has probabilities .5,.3,.2, so the three sectors are not equally likely.', 'Vòng quay có xác suất .5,.3,.2 nên ba cung không đồng khả năng.'], ['Since A and B are disjoint, add their given probabilities to obtain .8.', 'Vì A và B rời nhau, cộng xác suất đã cho để được .8.'], ['Counting two sectors as 2/3 would silently replace the stated distribution by a uniform one.', 'Đếm hai cung thành 2/3 sẽ ngầm thay phân phối đã nêu bằng phân phối đều.']],
  ),
  'f-w017-e3': lesson(
    ['The complement identity follows by partitioning the sample space into an event and everything outside it.', 'Đẳng thức biến cố đối lập suy ra từ phân hoạch không gian mẫu thành biến cố và phần bên ngoài.'],
    ['A and Aᶜ are disjoint and A∪Aᶜ=Ω; finite additivity gives 1=P(Ω)=P(A)+P(Aᶜ).', 'A và Aᶜ rời nhau, A∪Aᶜ=Ω; tính cộng hữu hạn cho 1=P(Ω)=P(A)+P(Aᶜ).'],
    [['State that A∩Aᶜ=∅, so finite additivity applies to the union.', 'Nêu A∩Aᶜ=∅ nên áp dụng tính cộng hữu hạn cho hợp.'], ['Use exhaustiveness A∪Aᶜ=Ω and the probability axiom P(Ω)=1.', 'Dùng tính đầy đủ A∪Aᶜ=Ω và tiên đề P(Ω)=1.'], ['Rearrange to P(Aᶜ)=1−P(A).', 'Chuyển vế được P(Aᶜ)=1−P(A).']],
  ),
  'f-w017-e4': lesson(
    ['Combinations count unordered hands, while the favorable count fixes how many cards come from each category.', 'Tổ hợp đếm các tay bài không thứ tự, còn số trường hợp thuận lợi cố định số lá từ từng nhóm.'],
    ['In a uniform sample of n items without replacement from N items, K marked, the marked count R is hypergeometric: P(R=r)=C(K,r)C(N−K,n−r)/C(N,n), for integer r with max(0,n−(N−K))≤r≤min(n,K). For a five-card hand from a standard 52-card deck, P(exactly 2 aces)=C(4,2)C(48,3)/C(52,5).', 'Trong mẫu đều gồm n vật lấy không hoàn lại từ N vật, trong đó K vật được đánh dấu, số vật được đánh dấu R có phân phối siêu bội: P(R=r)=C(K,r)C(N−K,n−r)/C(N,n), với r nguyên thỏa max(0,n−(N−K))≤r≤min(n,K). Với tay năm lá từ bộ bài chuẩn 52 lá, P(đúng 2 lá ách)=C(4,2)C(48,3)/C(52,5).'],
    [['Choose 2 of the 4 aces: C(4,2) ways.', 'Chọn 2 trong 4 lá ách: có C(4,2) cách.'], ['Choose the remaining 3 cards from 48 non-aces: C(48,3) ways; multiply the independent choices.', 'Chọn 3 lá còn lại trong 48 lá khác ách: C(48,3) cách; nhân số lựa chọn.'], ['Divide by all unordered five-card hands C(52,5); no ordering factor is needed.', 'Chia cho mọi tay bài năm lá không thứ tự C(52,5); không cần hệ số thứ tự.']],
  ),
  'f-w017-e5': lesson(
    ['A union bound gives a conservative risk ceiling even when dependence among failure events is unknown.', 'Cận hợp cho trần rủi ro bảo thủ ngay cả khi chưa biết phụ thuộc giữa các sự cố.'],
    ['P(⋃ᵢAᵢ)≤ΣᵢP(Aᵢ)≤0.02; independence is unnecessary, while exact probability needs joint-overlap information.', 'P(⋃ᵢAᵢ)≤ΣᵢP(Aᵢ)≤0,02; không cần độc lập, còn xác suất chính xác cần thông tin về giao chung.'],
    [['Apply the union bound to the three events and add .02+.03+.01=.06.', 'Áp dụng cận hợp cho ba biến cố và cộng .02+.03+.01=.06.'], ['This upper bound is valid whether events overlap or not; no independence assumption enters.', 'Cận trên đúng dù các biến cố giao nhau hay không; không cần giả thiết độc lập.'], ['To compute the exact union probability, know intersections such as pairwise and triple overlap, or the full joint law.', 'Để tính xác suất hợp chính xác, cần biết giao như từng cặp và giao ba, hoặc phân phối chung đầy đủ.']],
  ),
  'f-w018-e1': lesson(
    ['An alarm’s meaning depends on both sensor reliability and the rarity of faults among all monitored units.', 'Ý nghĩa cảnh báo phụ thuộc cả độ tin cậy cảm biến và mức hiếm lỗi trong mọi thiết bị được theo dõi.'],
    ['P(F|A)=P(A|F)P(F)/[P(A|F)P(F)+P(A|Fᶜ)P(Fᶜ)]; here 0.024/0.0434≈0.553.', 'P(F|A)=P(A|F)P(F)/[P(A|F)P(F)+P(A|Fᶜ)P(Fᶜ)]; ở đây 0,024/0,0434≈0,553.'],
    [['Compute the joint faulty-and-alarm probability: .03·.8=.024.', 'Tính xác suất đồng thời hỏng và báo động: .03·.8=.024.'], ['Add alarm probability from nonfaulty devices: .97·.02=.0194, so total alarm probability is .0434.', 'Cộng xác suất báo động từ thiết bị tốt: .97·.02=.0194, nên tổng xác suất báo động là .0434.'], ['Divide .024 by .0434 to obtain about .553; the posterior denominator includes both alarm sources.', 'Chia .024 cho .0434 được khoảng .553; mẫu số hậu nghiệm gồm cả hai nguồn báo động.']],
  ),
  'f-w018-e2': lesson(
    ['Independence means conditioning on one event does not change the probability of the other; for events it is checked by a product identity.', 'Độc lập nghĩa là điều kiện hóa theo biến cố này không đổi xác suất biến cố kia; với biến cố, kiểm tra bằng đẳng thức tích.'],
    ['A and B are independent iff P(A∩B)=P(A)P(B); here .12=.3·.4.', 'A và B độc lập khi và chỉ khi P(A∩B)=P(A)P(B); ở đây .12=.3·.4.'],
    [['Multiply the marginal probabilities: P(A)P(B)=.3·.4=.12.', 'Nhân xác suất biên: P(A)P(B)=.3·.4=.12.'], ['Compare this product with the given intersection probability .12.', 'So sánh tích đó với xác suất giao đã cho .12.'], ['Equality verifies independence by its definition; if P(B)>0, this also gives P(A|B)=P(A).', 'Đẳng thức xác nhận độc lập theo định nghĩa; vì P(B)>0, cũng có P(A|B)=P(A).']],
  ),
  'f-w018-e3': lesson(
    ['Conditioning changes probability when the information event selects a subset with a different event frequency.', 'Điều kiện hóa làm đổi xác suất khi thông tin chọn một tập con có tần suất biến cố khác.'],
    ['For equally likely outcomes, P(A|B)=|A∩B|/|B| when P(B)>0, while P(A)=|A|/|Ω|.', 'Với kết quả đồng khả năng, P(A|B)=|A∩B|/|B| khi P(B)>0, còn P(A)=|A|/|Ω|.'],
    [['Use Ω={1,2,3,4}, A={1,2}, and B={1,2,3}; then P(A)=2/4=1/2.', 'Dùng Ω={1,2,3,4}, A={1,2}, B={1,2,3}; khi đó P(A)=2/4=1/2.'], ['The intersection is {1,2}, so P(A∩B)=2/4 and P(B)=3/4.', 'Giao là {1,2}, nên P(A∩B)=2/4 và P(B)=3/4.'], ['Thus P(A|B)=(1/2)/(3/4)=2/3, different from the marginal probability 1/2.', 'Vậy P(A|B)=(1/2)/(3/4)=2/3, khác xác suất biên 1/2.']],
  ),
  'f-w018-e4': lesson(
    ['A partition decomposes an event into disjoint pieces, allowing its probability to be assembled from conditional probabilities within each case.', 'Một phân hoạch chia biến cố thành các phần rời nhau, cho phép ghép xác suất từ xác suất có điều kiện trong từng trường hợp.'],
    ['If {Bᵢ} is a finite partition with P(Bᵢ)>0, then P(A)=ΣᵢP(A|Bᵢ)P(Bᵢ).', 'Nếu {Bᵢ} là phân hoạch hữu hạn với P(Bᵢ)>0 thì P(A)=ΣᵢP(A|Bᵢ)P(Bᵢ).'],
    [['Use exhaustiveness: A=A∩Ω=⋃ᵢ(A∩Bᵢ).', 'Dùng tính phủ hết: A=A∩Ω=⋃ᵢ(A∩Bᵢ).'], ['The pieces A∩Bᵢ are disjoint, so finite additivity gives P(A)=ΣP(A∩Bᵢ).', 'Các phần A∩Bᵢ rời nhau nên tính cộng hữu hạn cho P(A)=ΣP(A∩Bᵢ).'], ['For positive-mass cells, substitute P(A∩Bᵢ)=P(A|Bᵢ)P(Bᵢ); null cells contribute zero and may be omitted.', 'Với ô có xác suất dương, thay P(A∩Bᵢ)=P(A|Bᵢ)P(Bᵢ); ô xác suất 0 đóng góp 0 và có thể bỏ.']],
  ),
  'f-w018-e5': lesson(
    ['Independence requires a nonzero intersection matching the product of marginals; mutual exclusion forces that intersection to zero.', 'Độc lập yêu cầu xác suất giao bằng tích xác suất biên; loại trừ nhau buộc xác suất giao bằng 0.'],
    ['Independence would require P(A∩B)=.1·.1=.01, while mutual exclusion requires P(A∩B)=0; both cannot hold.', 'Độc lập đòi P(A∩B)=.1·.1=.01, còn loại trừ nhau đòi P(A∩B)=0; không thể đồng thời đúng.'],
    [['Write the independence product .1·.1=.01.', 'Viết tích độc lập .1·.1=.01.'], ['Write the mutually exclusive intersection probability 0.', 'Viết xác suất giao khi loại trừ nhau bằng 0.'], ['Since these required values conflict, no such pair of events exists.', 'Vì hai giá trị bắt buộc mâu thuẫn, không tồn tại cặp biến cố như vậy.']],
  ),
  'f-w019-e1': lesson(
    ['Expectation summarizes the average transformed outcome, while variance measures spread around that mean.', 'Kỳ vọng tóm tắt trung bình của đại lượng biến đổi, còn phương sai đo độ phân tán quanh trung bình.'],
    ['E[g(X)]=Σg(x)p(x), Var(X)=E[X²]−(EX)². Here EX=.4, E[X²]=1.4, Var=1.24, E|X|=.8.', 'E[g(X)]=Σg(x)p(x), Var(X)=E[X²]−(EX)². Ở đây EX=.4, E[X²]=1.4, Var=1.24, E|X|=.8.'],
    [['Compute EX=(−1)(.2)+0(.5)+2(.3)=.4.', 'Tính EX=(−1)(.2)+0(.5)+2(.3)=.4.'], ['Compute E[X²]=1(.2)+0+4(.3)=1.4, so variance is 1.4−.4²=1.24.', 'Tính E[X²]=1(.2)+0+4(.3)=1.4, nên phương sai là 1.4−.4²=1.24.'], ['Compute E|X|=1(.2)+0+2(.3)=.8; keep the transformed value inside each probability-weighted sum.', 'Tính E|X|=1(.2)+0+2(.3)=.8; giữ phép biến đổi bên trong từng tổng có trọng số xác suất.']],
  ),
  'f-w019-e2': lesson(
    ['Linearity of expectation is an algebraic property of finite sums and does not require independent variables.', 'Tính tuyến tính của kỳ vọng là tính chất đại số của tổng hữu hạn và không cần biến độc lập.'],
    ['For finite-valued X,Y, E[X+Y]=Σω(X(ω)+Y(ω))P(ω)=EX+EY.', 'Với X,Y nhận hữu hạn giá trị, E[X+Y]=Σω(X(ω)+Y(ω))P(ω)=EX+EY.'],
    [['Write the expectation as a sum over the common sample space, weighting each outcome by its probability.', 'Viết kỳ vọng thành tổng trên không gian mẫu chung, gán trọng số xác suất cho mỗi kết quả.'], ['Distribute the finite sum across X(ω)+Y(ω).', 'Phân phối tổng hữu hạn qua X(ω)+Y(ω).'], ['Recognize the two resulting sums as EX and EY; no factorization or independence is used.', 'Nhận ra hai tổng là EX và EY; không dùng phân tích tích hay tính độc lập.']],
  ),
  'f-w019-e3': lesson(
    ['Covariance records how two random quantities co-vary and contributes a signed cross term to the variance of a linear combination.', 'Hiệp phương sai ghi nhận hai đại lượng biến thiên cùng nhau thế nào và tạo số hạng chéo có dấu trong phương sai tổ hợp tuyến tính.'],
    ['Var(aX+bY)=a²Var(X)+b²Var(Y)+2abCov(X,Y); for 2X−Y the value is 16+9+8=33.', 'Var(aX+bY)=a²Var(X)+b²Var(Y)+2abCov(X,Y); với 2X−Y, giá trị là 16+9+8=33.'],
    [['Substitute a=2 and b=−1 into the variance identity.', 'Thay a=2 và b=−1 vào đồng nhất thức phương sai.'], ['Compute 4·4+1·9+2·2·(−1)·(−2)=16+9+8.', 'Tính 4·4+1·9+2·2·(−1)·(−2)=16+9+8.'], ['Add to get 33; the negative coefficient and negative covariance make the cross contribution positive.', 'Cộng được 33; hệ số âm và hiệp phương sai âm làm số hạng chéo dương.']],
  ),
  'f-w019-e4': lesson(
    ['Zero covariance only rules out linear association; a nonlinear deterministic relationship can still make variables dependent.', 'Hiệp phương sai bằng 0 chỉ loại liên hệ tuyến tính; quan hệ tất định phi tuyến vẫn có thể làm biến phụ thuộc.'],
    ['For X uniform on {−1,0,1}, Y=X², EX=0, EY=2/3, E[XY]=E[X³]=0, so Cov(X,Y)=0.', 'Với X đều trên {−1,0,1}, Y=X², EX=0, EY=2/3, E[XY]=E[X³]=0 nên Cov(X,Y)=0.'],
    [['Compute EX=0 and EY=(1+0+1)/3=2/3.', 'Tính EX=0 và EY=(1+0+1)/3=2/3.'], ['Since XY=X³ and the symmetric values cancel, E[XY]=0; covariance is 0−0·(2/3)=0.', 'Vì XY=X³ và các giá trị đối xứng triệt tiêu, E[XY]=0; hiệp phương sai là 0−0·(2/3)=0.'], ['Yet Y is exactly X²; events {X=0} and {Y=0} coincide with probability 1/3, not the product 1/9.', 'Nhưng Y đúng bằng X²; biến cố {X=0} và {Y=0} trùng nhau với xác suất 1/3, khác tích 1/9.']],
  ),
  'f-w019-e5': lesson(
    ['Indicator variables turn a count into a sum of zero-one terms, making its expectation easy even when events depend.', 'Biến chỉ báo biến số đếm thành tổng các số hạng 0-1, giúp tính kỳ vọng dễ dàng kể cả khi biến cố phụ thuộc.'],
    ['If N=Σᵢ1_{Aᵢ}, then EN=ΣᵢE[1_{Aᵢ}]=ΣᵢP(Aᵢ); for three devices the expected failure count is .6.', 'Nếu N=Σᵢ1_{Aᵢ} thì EN=ΣᵢE[1_{Aᵢ}]=ΣᵢP(Aᵢ); với ba thiết bị, số lỗi kỳ vọng là .6.'],
    [['Represent each device failure by indicator Iᵢ, so the total count is N=I₁+I₂+I₃.', 'Biểu diễn lỗi mỗi thiết bị bằng chỉ báo Iᵢ, nên tổng số lỗi N=I₁+I₂+I₃.'], ['Use E[Iᵢ]=P(Aᵢ) and linearity to sum the event probabilities.', 'Dùng E[Iᵢ]=P(Aᵢ) và tính tuyến tính để cộng xác suất biến cố.'], ['Compute .1+.2+.3=.6 expected failures; this conclusion does not require independence.', 'Tính .1+.2+.3=.6 lỗi kỳ vọng; kết luận này không cần độc lập.']],
  ),
  'f-w020-e1': lesson(
    ['A density constant is determined by total probability one; event probabilities are then areas under the normalized density.', 'Hằng số mật độ được xác định bởi tổng xác suất bằng một; xác suất biến cố là diện tích dưới mật độ đã chuẩn hóa.'],
    ['∫₀²cx dx=1 gives c=1/2; P(X>1)=∫₁²x/2 dx=3/4.', '∫₀²cx dx=1 cho c=1/2; P(X>1)=∫₁²x/2 dx=3/4.'],
    [['Integrate cx on the support: c[x²/2]₀²=2c; set this equal to one.', 'Tích phân cx trên miền: c[x²/2]₀²=2c; đặt bằng một.'], ['Solve c=1/2 to normalize the density.', 'Giải được c=1/2 để chuẩn hóa mật độ.'], ['Integrate x/2 from 1 to 2, obtaining (4−1)/4=3/4.', 'Tích phân x/2 từ 1 đến 2, được (4−1)/4=3/4.']],
  ),
  'f-w020-e2': lesson(
    ['Marginal densities integrate out the other variable; factorization into marginals is the test for independence.', 'Mật độ biên tích phân theo biến còn lại; phân tích thành tích mật độ biên là phép thử độc lập.'],
    ['For f(x,y)=2 on 0<x<y<1, f_X(x)=2(1−x), f_Y(y)=2y on (0,1); the joint is not their product.', 'Với f(x,y)=2 trên 0<x<y<1, f_X(x)=2(1−x), f_Y(y)=2y trên (0,1); mật độ chung không bằng tích hai biên.'],
    [['For fixed x, integrate y from x to 1 to get f_X(x)=∫ₓ¹2dy=2(1−x).', 'Với x cố định, tích phân y từ x đến 1 được f_X(x)=∫ₓ¹2dy=2(1−x).'], ['For fixed y, integrate x from 0 to y to get f_Y(y)=∫₀ʸ2dx=2y.', 'Với y cố định, tích phân x từ 0 đến y được f_Y(y)=∫₀ʸ2dx=2y.'], ['The joint support excludes x≥y while both marginals have support throughout (0,1); factorization fails, so X,Y are dependent.', 'Miền chung loại x≥y trong khi cả hai biên có giá trên (0,1); không phân tích thành tích được nên X,Y phụ thuộc.']],
  ),
  'f-w020-e3': lesson(
    ['A monotone transformation changes density by the inverse map’s derivative magnitude and also changes the support.', 'Phép biến đổi đơn điệu đổi mật độ theo trị tuyệt đối đạo hàm của hàm ngược và cũng đổi miền giá trị.'],
    ['If Y=g(X), g is strictly monotone and differentiable with g′(x)≠0 on X’s support, and g⁻¹ is differentiable on the transformed support, then f_Y(y)=f_X(g⁻¹(y))|(g⁻¹)′(y)| there (zero outside). For Y=−ln X with X∼Uniform(0,1), x=e⁻ʸ, |dx/dy|=e⁻ʸ, so f_Y(y)=e⁻ʸ for y>0.', 'Nếu Y=g(X), g đơn điệu nghiêm ngặt và khả vi với g′(x)≠0 trên miền hỗ trợ của X, còn g⁻¹ khả vi trên miền hỗ trợ sau biến đổi, thì f_Y(y)=f_X(g⁻¹(y))|(g⁻¹)′(y)| tại đó (bằng 0 bên ngoài). Với Y=−ln X và X∼Uniform(0,1), x=e⁻ʸ, |dx/dy|=e⁻ʸ, nên f_Y(y)=e⁻ʸ khi y>0.'],
    [['Since 0<X<1, the transformed support is Y>0.', 'Vì 0<X<1 nên miền giá trị sau biến đổi là Y>0.'], ['Invert the map: x=e⁻ʸ, with absolute derivative e⁻ʸ.', 'Đảo hàm: x=e⁻ʸ, có đạo hàm tuyệt đối e⁻ʸ.'], ['Multiply the uniform density 1 by this Jacobian factor to get the exponential density.', 'Nhân mật độ đều 1 với hệ số Jacobian này để được mật độ mũ.']],
  ),
  'f-w020-e4': lesson(
    ['A conditional density renormalizes the joint density along a fixed value of the conditioning variable.', 'Mật độ có điều kiện chuẩn hóa lại mật độ chung khi cố định biến điều kiện.'],
    ['For 0<y<1 and 0<x<y, f_{X|Y}(x|y)=f(x,y)/f_Y(y)=2/(2y)=1/y.', 'Với 0<y<1 và 0<x<y, f_{X|Y}(x|y)=f(x,y)/f_Y(y)=2/(2y)=1/y.'],
    [['Use the marginal f_Y(y)=2y derived by integrating x over 0<x<y.', 'Dùng mật độ biên f_Y(y)=2y, suy ra bằng tích phân x trên 0<x<y.'], ['Divide the joint density 2 by the marginal for y>0.', 'Chia mật độ chung 2 cho mật độ biên khi y>0.'], ['State the conditional support 0<x<y and check normalization: ∫₀ʸ(1/y)dx=1.', 'Nêu miền có điều kiện 0<x<y và kiểm tra chuẩn hóa: ∫₀ʸ(1/y)dx=1.']],
  ),
  'f-w020-e5': lesson(
    ['Symmetry can cancel covariance while a deterministic nonlinear transformation still reveals complete dependence.', 'Đối xứng có thể triệt tiêu hiệp phương sai trong khi phép biến đổi phi tuyến tất định vẫn cho thấy phụ thuộc hoàn toàn.'],
    ['For symmetric X on [−1,1], EX=0 and E[X³]=0; with Y=X², Cov(X,Y)=E[X³]−EX·EY=0.', 'Với X đối xứng trên [−1,1], EX=0 và E[X³]=0; với Y=X², Cov(X,Y)=E[X³]−EX·EY=0.'],
    [['Symmetry makes the odd moments EX and E[X³] zero; EY is finite.', 'Tính đối xứng làm các moment lẻ EX và E[X³] bằng 0; EY hữu hạn.'], ['Use XY=X³ in the covariance formula to conclude covariance zero.', 'Dùng XY=X³ trong công thức hiệp phương sai để kết luận bằng 0.'], ['To prove dependence, note events {|X|≤1/2} and {Y≤1/4} coincide and each has probability 1/2, so their intersection is 1/2 rather than 1/4.', 'Để chứng minh phụ thuộc, nhận thấy {|X|≤1/2} và {Y≤1/4} trùng nhau, mỗi biến cố xác suất 1/2 nên giao 1/2 thay vì 1/4.']],
  ),
  'f-w021-e1': lesson(
    ['Markov’s inequality converts a nonnegative quantity’s mean into a guaranteed upper bound on a large-value event.', 'Bất đẳng thức Markov chuyển kỳ vọng đại lượng không âm thành cận trên chắc chắn cho biến cố giá trị lớn.'],
    ['For X≥0 and t>0, P(X≥t)≤EX/t; here P(X≥20)≤5/20=1/4.', 'Với X≥0 và t>0, P(X≥t)≤EX/t; ở đây P(X≥20)≤5/20=1/4.'],
    [['Use X≥20·1_{X≥20} pointwise.', 'Dùng bất đẳng thức điểm X≥20·1_{X≥20}.'], ['Take expectations to get 5=EX≥20P(X≥20).', 'Lấy kỳ vọng được 5=EX≥20P(X≥20).'], ['Divide to obtain 1/4; equality is possible when X equals 20 on an event of probability 1/4 and zero otherwise.', 'Chia để được 1/4; đẳng thức có thể xảy ra khi X bằng 20 với xác suất 1/4 và 0 nếu không.']],
  ),
  'f-w021-e2': lesson(
    ['Chebyshev’s inequality gives a conservative sample-size guarantee from variance alone, without specifying the full distribution.', 'Bất đẳng thức Chebyshev cho bảo đảm cỡ mẫu bảo thủ chỉ từ phương sai, không cần nêu toàn bộ phân phối.'],
    ['For IID variance σ², P(|X̄−μ|≥ε)≤σ²/(nε²); require 16/(n·0.2²)≤0.01, hence n≥40,000.', 'Với phương sai IID σ², P(|X̄−μ|≥ε)≤σ²/(nε²); cần 16/(n·0,2²)≤0,01, nên n≥40.000.'],
    [['Independence gives Var(X̄)=16/n.', 'Tính độc lập cho Var(X̄)=16/n.'], ['Apply Chebyshev with ε=.2: the upper bound is (16/n)/.04=400/n.', 'Áp dụng Chebyshev với ε=.2: cận trên là (16/n)/.04=400/n.'], ['Set 400/n≤.01 and solve for n to obtain at least 40,000 observations.', 'Đặt 400/n≤.01 và giải theo n để cần ít nhất 40.000 quan sát.']],
  ),
  'f-w021-e3': lesson(
    ['A valid concentration bound can be loose; compare it with the exact event probability before interpreting it as an estimate.', 'Cận tập trung hợp lệ có thể lỏng; hãy so với xác suất biến cố chính xác trước khi xem nó là ước lượng.'],
    ['For any X with finite mean μ and variance σ², and t>0, Chebyshev gives P(|X−μ|≥t)≤min(1,σ²/t²). For Bernoulli(.5), the exact probability at t=.5 is 1 and the raw bound is .25/.25=1; at t=.4 the exact probability is still 1 but the raw bound is .25/.16=1.5625, so after capping at 1 it is a vacuous bound.', 'Với X có kỳ vọng μ và phương sai σ² hữu hạn, t>0, bất đẳng thức Chebyshev cho P(|X−μ|≥t)≤min(1,σ²/t²). Với Bernoulli(.5), xác suất chính xác tại t=.5 là 1 và chặn thô là .25/.25=1; tại t=.4 xác suất vẫn là 1 nhưng chặn thô là .25/.16=1.5625, nên sau khi chặn trên bởi 1 thì đó là một cận vô ích.'],
    [['The variable takes only 0 and 1, both exactly .5 away from its mean .5, so the event has probability one.', 'Biến chỉ nhận 0 và 1, cả hai cách trung bình .5 đúng .5, nên biến cố có xác suất 1.'], ['Compute the variance .25 and apply Chebyshev: .25/(.5)²=1.', 'Tính phương sai .25 và áp dụng Chebyshev: .25/(.5)²=1.'], ['Here the bound happens to be exact; in general it is an upper bound, not a model-based probability estimate.', 'Ở đây cận tình cờ chính xác; nói chung nó là cận trên, không phải ước lượng xác suất theo mô hình.']],
  ),
  'f-w021-e4': lesson(
    ['Applying Markov to squared deviation yields Chebyshev and requires a finite second central moment.', 'Áp dụng Markov cho bình phương độ lệch cho Chebyshev và cần moment trung tâm bậc hai hữu hạn.'],
    ['For t>0, P(|X−μ|≥t)=P((X−μ)²≥t²)≤E[(X−μ)²]/t²=Var(X)/t², assuming finite variance.', 'Với t>0, P(|X−μ|≥t)=P((X−μ)²≥t²)≤E[(X−μ)²]/t²=Var(X)/t², giả sử phương sai hữu hạn.'],
    [['Square both sides of the event threshold; because t>0, absolute deviation at least t is equivalent to squared deviation at least t².', 'Bình phương ngưỡng biến cố; vì t>0, độ lệch tuyệt đối ít nhất t tương đương bình phương độ lệch ít nhất t².'], ['The random variable (X−μ)² is nonnegative, so apply Markov at threshold t².', 'Biến ngẫu nhiên (X−μ)² không âm nên áp dụng Markov với ngưỡng t².'], ['Its expectation is Var(X); this must be finite for the stated finite bound.', 'Kỳ vọng của nó là Var(X); đại lượng này phải hữu hạn để có cận hữu hạn đã nêu.']],
  ),
  'f-w021-e5': lesson(
    ['The union bound controls the chance that any model component fails by adding the individual worst-case risks.', 'Cận hợp kiểm soát xác suất bất kỳ thành phần mô hình nào lỗi bằng cách cộng các rủi ro riêng lớn nhất.'],
    ['P(⋃ᵢ₌₁⁵Aᵢ)≤Σᵢ₌₁⁵P(Aᵢ)≤5(.004)=.02, regardless of independence.', 'P(⋃ᵢ₌₁⁵Aᵢ)≤Σᵢ₌₁⁵P(Aᵢ)≤5(.004)=.02, không phụ thuộc tính độc lập.'],
    [['Represent “any failure” as the union of the five events.', 'Biểu diễn “có lỗi bất kỳ” bằng hợp của năm biến cố.'], ['Apply the union bound and insert each upper bound .004.', 'Áp dụng cận hợp và thay từng cận trên .004.'], ['Add to .02; dependence changes the exact union probability but is not needed for this bound.', 'Cộng được .02; phụ thuộc làm đổi xác suất hợp chính xác nhưng không cần cho cận này.']],
  ),
  'f-w022-e1': lesson(
    ['The weak law bound gives a finite-sample guarantee that the sample average stays near its mean under IID finite variance.', 'Cận luật số lớn yếu bảo đảm hữu hạn mẫu rằng trung bình mẫu gần kỳ vọng dưới giả thiết IID và phương sai hữu hạn.'],
    ['For IID with mean μ and variance σ²<∞, Var(X̄ₙ)=σ²/n and Chebyshev gives P(|X̄ₙ−μ|≥ε)≤σ²/(nε²).', 'Với IID có trung bình μ và phương sai σ²<∞, Var(X̄ₙ)=σ²/n và Chebyshev cho P(|X̄ₙ−μ|≥ε)≤σ²/(nε²).'],
    [['Use independence to add variances: Var(ΣXᵢ)=nσ², then divide by n² for X̄ₙ.', 'Dùng độc lập để cộng phương sai: Var(ΣXᵢ)=nσ², rồi chia n² cho X̄ₙ.'], ['Apply Chebyshev to X̄ₙ with deviation threshold ε.', 'Áp dụng Chebyshev cho X̄ₙ với ngưỡng lệch ε.'], ['Substitute Var(X̄ₙ)=σ²/n to obtain the stated probability bound; finite variance is essential here.', 'Thay Var(X̄ₙ)=σ²/n để được cận xác suất; phương sai hữu hạn là điều kiện thiết yếu.']],
  ),
  'f-w022-e2': lesson(
    ['The central limit theorem approximates a binomial tail by a normal tail; a continuity correction aligns discrete and continuous boundaries.', 'Định lý giới hạn trung tâm xấp xỉ đuôi nhị thức bằng đuôi chuẩn; hiệu chỉnh liên tục căn chỉnh biên rời rạc và liên tục.'],
    ['For S∼Binomial(100,.3), mean 30 and SD √21; P(S≥35)≈1−Φ((34.5−30)/√21)≈0.164.', 'Với S∼Binomial(100,.3), trung bình 30 và độ lệch chuẩn √21; P(S≥35)≈1−Φ((34,5−30)/√21)≈0,164.'],
    [['Compute mean np=30 and variance np(1−p)=21, so the normal SD is √21≈4.583.', 'Tính trung bình np=30 và phương sai np(1−p)=21, nên độ lệch chuẩn chuẩn xấp xỉ 4,583.'], ['For S≥35, use boundary 34.5 in the continuous approximation.', 'Với S≥35, dùng biên 34,5 trong xấp xỉ liên tục.'], ['Standardize to z≈4.5/4.583≈0.982; the upper normal tail is about 0.164.', 'Chuẩn hóa được z≈4,5/4,583≈0,982; đuôi chuẩn phía trên khoảng 0,164.']],
  ),
  'f-w022-e3': lesson(
    ['Perfect dependence prevents averaging from reducing uncertainty because every observation repeats the same random value.', 'Phụ thuộc hoàn hảo ngăn trung bình giảm bất định vì mọi quan sát lặp lại cùng một giá trị ngẫu nhiên.'],
    ['If Xᵢ=Z for every i, then X̄ₙ=Z and Var(X̄ₙ)=1, while the IID formula would incorrectly give 1/n.', 'Nếu Xᵢ=Z với mọi i thì X̄ₙ=Z và Var(X̄ₙ)=1, còn công thức IID sẽ cho sai 1/n.'],
    [['Substitute Xᵢ=Z into the average: n identical terms divided by n reduce to Z.', 'Thay Xᵢ=Z vào trung bình: n số hạng giống nhau chia n rút gọn thành Z.'], ['Therefore Var(X̄ₙ)=Var(Z)=1 for every n.', 'Do đó Var(X̄ₙ)=Var(Z)=1 với mọi n.'], ['The formula σ²/n assumes independent summands; here covariance terms persist and cancel the apparent averaging gain.', 'Công thức σ²/n giả định các số hạng độc lập; ở đây các số hạng hiệp phương sai còn nguyên và triệt tiêu lợi ích trung bình tưởng có.']],
  ),
  'f-w022-e4': lesson(
    ['Standard error describes the sampling spread of an average, which shrinks with sample size relative to individual observations.', 'Sai số chuẩn mô tả độ phân tán lấy mẫu của trung bình, giảm theo cỡ mẫu so với từng quan sát.'],
    ['For IID observations with SD σ, SD(X̄)=σ/√n; here 6/√36=1.', 'Với quan sát IID có độ lệch chuẩn σ, SD(X̄)=σ/√n; ở đây 6/√36=1.'],
    [['Use the given σ=6 and n=36.', 'Dùng σ=6 và n=36 đã cho.'], ['Divide the individual spread by √n=6 to obtain SD(X̄)=1.', 'Chia độ phân tán cá thể cho √n=6 để được SD(X̄)=1.'], ['Contrast the average’s sampling spread 1 with one observation’s SD 6; independence underlies the scaling.', 'So sánh độ phân tán lấy mẫu của trung bình là 1 với SD cá thể 6; tính độc lập là cơ sở của tỷ lệ này.']],
  ),
  'f-w022-e5': lesson(
    ['The classical IID finite-variance CLT has explicit assumptions; a large sample size does not repair infinite variance.', 'CLT cổ điển IID phương sai hữu hạn có giả thiết tường minh; cỡ mẫu lớn không khắc phục phương sai vô hạn.'],
    ['The classical normalization √n(X̄−μ)/σ⇒N(0,1) requires IID observations with 0<σ²<∞; it cannot be invoked as stated here.', 'Chuẩn hóa cổ điển √n(X̄−μ)/σ⇒N(0,1) cần quan sát IID có 0<σ²<∞; không thể viện dẫn nguyên dạng ở đây.'],
    [['Check the assumptions: the prompt specifies heavy tails and infinite variance, so finite σ² is absent.', 'Kiểm tra giả thiết: đề cho đuôi nặng và phương sai vô hạn, nên thiếu σ² hữu hạn.'], ['A sample size of 10,000 does not establish the classical theorem’s hypothesis.', 'Cỡ mẫu 10.000 không thiết lập giả thiết của định lý cổ điển.'], ['Analyze tail behavior and the relevant domain of attraction, or use an appropriate robust method with its own assumptions.', 'Phân tích hành vi đuôi và miền hút phù hợp, hoặc dùng phương pháp vững với giả thiết riêng.']],
  ),
  'f-w023-e1': lesson(
    ['An invariant distribution describes long-run state proportions; for a two-state chain it is found by balancing probability flow.', 'Phân phối bất biến mô tả tỷ lệ trạng thái dài hạn; với chuỗi hai trạng thái, tìm bằng cân bằng dòng xác suất.'],
    ['Solve πP=π with π₁+π₂=1. For P=[[.9,.1],[.2,.8]], the solution is π=(2/3,1/3).', 'Giải πP=π với π₁+π₂=1. Với P=[[.9,.1],[.2,.8]], nghiệm là π=(2/3,1/3).'],
    [['Write the first coordinate equation π₁=.9π₁+.2π₂, so .1π₁=.2π₂ and π₁=2π₂.', 'Viết phương trình tọa độ đầu π₁=.9π₁+.2π₂, suy ra .1π₁=.2π₂ và π₁=2π₂.'], ['Combine with π₁+π₂=1 to obtain π₂=1/3 and π₁=2/3.', 'Kết hợp với π₁+π₂=1 để được π₂=1/3 và π₁=2/3.'], ['Multiply the candidate by P and verify πP=(2/3,1/3).', 'Nhân ứng viên với P và kiểm tra πP=(2/3,1/3).']],
  ),
  'f-w023-e2': lesson(
    ['Detailed balance is a pairwise flow symmetry that implies stationarity after summing over incoming states.', 'Cân bằng chi tiết là đối xứng dòng theo từng cặp, suy ra dừng sau khi cộng các trạng thái đi vào.'],
    ['If πᵢPᵢⱼ=πⱼPⱼᵢ for all i,j and P is row-stochastic, then (πP)ⱼ=ΣᵢπᵢPᵢⱼ=πⱼΣᵢPⱼᵢ=πⱼ.', 'Nếu πᵢPᵢⱼ=πⱼPⱼᵢ với mọi i,j và P stochastic theo hàng thì (πP)ⱼ=ΣᵢπᵢPᵢⱼ=πⱼΣᵢPⱼᵢ=πⱼ.'],
    [['Fix a destination state j and write its stationary incoming mass (πP)ⱼ=ΣᵢπᵢPᵢⱼ.', 'Cố định trạng thái đích j và viết khối lượng đi vào dừng (πP)ⱼ=ΣᵢπᵢPᵢⱼ.'], ['Apply detailed balance term by term to replace πᵢPᵢⱼ with πⱼPⱼᵢ.', 'Áp dụng cân bằng chi tiết từng số hạng để thay πᵢPᵢⱼ bằng πⱼPⱼᵢ.'], ['Factor πⱼ and use row j summing to one, yielding (πP)ⱼ=πⱼ.', 'Đặt nhân tử πⱼ và dùng tổng hàng j bằng một, được (πP)ⱼ=πⱼ.']],
  ),
  'f-w023-e3': lesson(
    ['An invariant distribution need not imply convergence from every start; periodic transitions can keep the distribution oscillating.', 'Phân phối bất biến không bảo đảm hội tụ từ mọi trạng thái đầu; chuyển tiếp tuần hoàn có thể làm phân phối dao động.'],
    ['For P=[[0,1],[1,0]], π=(1/2,1/2) satisfies πP=π, but δ₁Pⁿ alternates between δ₁ and δ₂.', 'Với P=[[0,1],[1,0]], π=(1/2,1/2) thỏa πP=π, nhưng δ₁Pⁿ luân phiên giữa δ₁ và δ₂.'],
    [['Check the uniform vector: multiplying by the swap matrix leaves it unchanged.', 'Kiểm tra vector đều: nhân với ma trận đổi chỗ giữ nguyên nó.'], ['Starting at state 1 gives probability vector (1,0) at even times and (0,1) at odd times.', 'Bắt đầu ở trạng thái 1 cho vector xác suất (1,0) tại thời điểm chẵn và (0,1) tại thời điểm lẻ.'], ['The two subsequential distributions differ, so the sequence of distributions does not converge despite irreducibility.', 'Hai phân phối dãy con khác nhau nên dãy phân phối không hội tụ dù chuỗi bất khả quy.']],
  ),
  'f-w023-e4': lesson(
    ['For a symmetric stochastic matrix, column sums equal row sums, making the uniform distribution stationary.', 'Với ma trận stochastic đối xứng, tổng cột bằng tổng hàng nên phân phối đều là dừng.'],
    ['If Pᵢⱼ=Pⱼᵢ and each row sums to 1, then each column sums to 1 and πᵢ=1/3 gives (πP)ⱼ=1/3.', 'Nếu Pᵢⱼ=Pⱼᵢ và tổng mỗi hàng bằng 1 thì tổng mỗi cột bằng 1; πᵢ=1/3 cho (πP)ⱼ=1/3.'],
    [['Fill diagonal entries to make rows sum to one: P₁₁=.85, P₂₂=.7, P₃₃=.75.', 'Điền đường chéo để tổng hàng bằng một: P₁₁=.85, P₂₂=.7, P₃₃=.75.'], ['The off-diagonal entries are symmetric by assumption, and diagonal entries preserve symmetry.', 'Các phần tử ngoài đường chéo đối xứng theo giả thiết, các phần tử đường chéo cũng giữ tính đối xứng.'], ['Thus every column also sums to one; multiplying by the uniform row vector leaves each coordinate at 1/3.', 'Vì vậy mỗi cột cũng có tổng một; nhân vector hàng đều cho từng tọa độ bằng 1/3.']],
  ),
  'f-w023-e5': lesson(
    ['Under stationarity, each time marginal is π, so expected visit counts add the same state probability over time.', 'Dưới trạng thái dừng, phân phối biên mỗi thời điểm là π, nên số lần ghé kỳ vọng cộng cùng xác suất trạng thái theo thời gian.'],
    ['If X₀∼π and πP=π, then P(Xₙ=j)=πⱼ for every n; E[Σₙ₌₁ᵀ1{Xₙ=j}]=Tπⱼ.', 'Nếu X₀∼π và πP=π thì P(Xₙ=j)=πⱼ với mọi n; E[Σₙ₌₁ᵀ1{Xₙ=j}]=Tπⱼ.'],
    [['Use stationarity inductively: the law of X₁ is π, and applying P preserves π at each later step.', 'Dùng tính dừng quy nạp: luật của X₁ là π, và mỗi lần áp dụng P giữ nguyên π.'], ['The indicator of visiting j has expectation P(Xₙ=j)=πⱼ at each time n.', 'Chỉ báo ghé j có kỳ vọng P(Xₙ=j)=πⱼ tại mỗi thời điểm n.'], ['Sum expectations for times 1 through T by linearity, obtaining Tπⱼ without needing independent visits.', 'Cộng kỳ vọng từ thời điểm 1 đến T theo tính tuyến tính, được Tπⱼ mà không cần các lượt ghé độc lập.']],
  ),
  'f-w024-e1': lesson(
    ['Mean squared error separates random spread from systematic displacement of an estimator’s mean.', 'Sai số bình phương trung bình tách độ phân tán ngẫu nhiên khỏi độ lệch hệ thống của kỳ vọng ước lượng.'],
    ['MSE(θ̂)=E[(θ̂−θ)²]=Var(θ̂)+(Eθ̂−θ)².', 'MSE(θ̂)=E[(θ̂−θ)²]=Var(θ̂)+(Eθ̂−θ)².'],
    [['Add and subtract Eθ̂ inside θ̂−θ: (θ̂−Eθ̂)+(Eθ̂−θ).', 'Cộng rồi trừ Eθ̂ trong θ̂−θ: (θ̂−Eθ̂)+(Eθ̂−θ).'], ['Square and take expectations; the cross term vanishes because E[θ̂−Eθ̂]=0.', 'Bình phương rồi lấy kỳ vọng; số hạng chéo mất vì E[θ̂−Eθ̂]=0.'], ['The remaining terms are Var(θ̂) and squared bias (Eθ̂−θ)².', 'Các số hạng còn lại là Var(θ̂) và bình phương độ chệch (Eθ̂−θ)².']],
  ),
  'f-w024-e2': lesson(
    ['A known-standard-deviation interval centers the estimate and extends by a normal quantile times its standard error.', 'Khoảng với độ lệch chuẩn đã biết đặt tâm tại ước lượng và mở rộng theo phân vị chuẩn nhân sai số chuẩn.'],
    ['If Xᵢ are IID N(μ,σ²) and σ is known, the exact 95% confidence interval is X̄±1.96σ/√n. For IID observations with finite variance and sufficiently large n, the same z interval is a CLT approximation. Here SE=4/8=.5 and interval=[9.02,10.98].', 'Nếu Xᵢ IID N(μ,σ²) và biết σ, khoảng tin cậy 95% chính xác là X̄±1.96σ/√n. Với quan sát IID có phương sai hữu hạn và n đủ lớn, cùng khoảng z là xấp xỉ theo định lý giới hạn trung tâm. Ở đây SE=4/8=.5 và khoảng=[9,02;10,98].'],
    [['Compute SE=σ/√n=4/√64=0.5.', 'Tính SE=σ/√n=4/√64=0,5.'], ['Multiply by 1.96 to get margin 0.98.', 'Nhân 1,96 để được biên sai số 0,98.'], ['Add and subtract from 10 to report [9.02,10.98], under the normal sampling model.', 'Cộng và trừ từ 10 để báo [9,02;10,98], theo mô hình lấy mẫu chuẩn.']],
  ),
  'f-w024-e3': lesson(
    ['Predicting a future observation includes both uncertainty in the sample mean and the new observation’s own noise.', 'Dự đoán quan sát tương lai gồm cả bất định của trung bình mẫu và nhiễu riêng của quan sát mới.'],
    ['For independent IID N(μ,σ²) data, Var(Xₙ₊₁−X̄)=σ²+σ²/n=σ²(1+1/n).', 'Với dữ liệu IID N(μ,σ²) độc lập, Var(Xₙ₊₁−X̄)=σ²+σ²/n=σ²(1+1/n).'],
    [['Write the prediction error as (Xₙ₊₁−μ)−(X̄−μ).', 'Viết sai số dự đoán thành (Xₙ₊₁−μ)−(X̄−μ).'], ['The new observation is independent of the training sample, so variances add: σ²+σ²/n.', 'Quan sát mới độc lập với mẫu huấn luyện nên phương sai cộng: σ²+σ²/n.'], ['Take the square root for the standard error σ√(1+1/n), larger than σ/√n for estimating μ.', 'Lấy căn để được sai số chuẩn σ√(1+1/n), lớn hơn σ/√n khi ước lượng μ.']],
  ),
  'f-w024-e4': lesson(
    ['Bias and variance can trade off: an unbiased estimator may have the same or worse MSE than a biased lower-variance option.', 'Độ chệch và phương sai có thể đánh đổi: ước lượng không chệch có thể cùng hoặc kém MSE so với lựa chọn chệch nhưng phương sai thấp.'],
    ['MSE=variance+bias². A has MSE=4 and RMSE=2; B has MSE=1+1²=2 and RMSE=√2.', 'MSE=phương sai+độ chệch². A có MSE=4 và RMSE=2; B có MSE=1+1²=2 và RMSE=√2.'],
    [['For A, add variance 4 and squared bias 0 to obtain MSE 4.', 'Với A, cộng phương sai 4 và bình phương độ chệch 0 để được MSE 4.'], ['For B, add variance 1 and squared bias 1 to obtain MSE 2.', 'Với B, cộng phương sai 1 và bình phương độ chệch 1 để được MSE 2.'], ['Take square roots: A RMSE=2, B RMSE=√2≈1.414; B has lower MSE despite its bias.', 'Lấy căn: RMSE_A=2, RMSE_B=√2≈1,414; B có MSE thấp hơn dù bị chệch.']],
  ),
  'f-w024-e5': lesson(
    ['Frequentist coverage is the long-run fraction of intervals from a procedure that contain the fixed parameter.', 'Độ phủ tần suất là tỷ lệ dài hạn các khoảng do thủ tục tạo ra chứa tham số cố định.'],
    ['Empirical coverage=918/1000=0.918=91.8%; nominal 95% describes repeated-sampling behavior, not a posterior probability for one interval.', 'Độ phủ thực nghiệm=918/1000=0,918=91,8%; mức danh nghĩa 95% mô tả hành vi lặp mẫu, không phải xác suất hậu nghiệm của một khoảng.'],
    [['Divide the number of covering intervals by all repetitions: 918/1000=.918.', 'Chia số khoảng bao phủ cho tổng lần lặp: 918/1000=.918.'], ['Convert to a percentage, 91.8%, and compare with the nominal 95%.', 'Đổi thành phần trăm 91,8% và so với mức danh nghĩa 95%.'], ['After one interval is observed, μ is fixed in the frequentist model; the 95% statement concerns the procedure over repeated samples.', 'Sau khi quan sát một khoảng, μ cố định trong mô hình tần suất; phát biểu 95% nói về thủ tục qua nhiều mẫu lặp.']],
  ),
  'f-w025-e1': lesson(
    ['Maximum likelihood chooses the rate parameter that makes the observed nonnegative sample most plausible under the exponential model.', 'Ước lượng hợp lý cực đại chọn tham số tốc độ khiến mẫu không âm quan sát được có khả năng lớn nhất theo mô hình mũ.'],
    ['For IID Exp(λ), ℓ(λ)=n logλ−λΣxᵢ; setting ℓ′=n/λ−Σxᵢ=0 gives λ̂=n/Σxᵢ=1/X̄.', 'Với IID Exp(λ), ℓ(λ)=n logλ−λΣxᵢ; đặt ℓ′=n/λ−Σxᵢ=0 được λ̂=n/Σxᵢ=1/X̄.'],
    [['Write the joint likelihood ∏λe⁻λˣⁱ=λⁿe⁻λΣxᵢ for λ>0 and xᵢ≥0.', 'Viết hợp lý chung ∏λe⁻λˣⁱ=λⁿe⁻λΣxᵢ với λ>0 và xᵢ≥0.'], ['Take logs and differentiate: n/λ−Σxᵢ.', 'Lấy log và đạo hàm: n/λ−Σxᵢ.'], ['Solve the score equation and confirm the log-likelihood is concave; for a nonzero sample sum, λ̂=n/Σxᵢ.', 'Giải phương trình score và xác nhận log-hợp lý lõm; nếu tổng mẫu khác 0 thì λ̂=n/Σxᵢ.']],
  ),
  'f-w025-e2': lesson(
    ['Boundary likelihoods can maximize at an endpoint of the parameter space even when an interior score equation has no solution.', 'Hợp lý tại biên có thể đạt cực đại ở đầu mút miền tham số dù phương trình score nội không có nghiệm.'],
    ['With S=0, L(p)=p^S(1−p)ⁿ⁻ˢ=(1−p)ⁿ on [0,1], maximized at p̂=0.', 'Với S=0, L(p)=p^S(1−p)ⁿ⁻ˢ=(1−p)ⁿ trên [0,1], đạt cực đại tại p̂=0.'],
    [['Substitute S=0 into the likelihood to obtain (1−p)ⁿ.', 'Thay S=0 vào hàm hợp lý để được (1−p)ⁿ.'], ['For n>0 this quantity decreases as p increases from 0 to 1.', 'Với n>0, biểu thức giảm khi p tăng từ 0 đến 1.'], ['The maximum over the closed parameter interval is at p=0; retain the boundary in the optimization.', 'Cực đại trên khoảng tham số đóng nằm tại p=0; cần giữ biên khi tối ưu.']],
  ),
  'f-w025-e3': lesson(
    ['Likelihood compares data plausibility across parameter values; it is not a probability distribution for the parameter.', 'Hàm hợp lý so sánh mức phù hợp dữ liệu giữa các tham số; nó không phải phân phối xác suất của tham số.'],
    ['For one Bernoulli observation x=1, L(p)=p on [0,1]; its integral is 1/2, not 1, and no density is defined without a parameter measure/prior.', 'Với một quan sát Bernoulli x=1, L(p)=p trên [0,1]; tích phân bằng 1/2, không phải 1, và chưa có mật độ nếu thiếu độ đo/tiên nghiệm cho tham số.'],
    [['Insert x=1 into pˣ(1−p)¹⁻ˣ to obtain L(p)=p.', 'Thay x=1 vào pˣ(1−p)¹⁻ˣ để được L(p)=p.'], ['Observe that p is an argument indexing data likelihood, with data held fixed.', 'Nhận thấy p là biến đối số lập chỉ số hợp lý dữ liệu, còn dữ liệu được giữ cố định.'], ['Integrating gives 1/2; a Bayesian posterior would require a prior and normalization over parameter space.', 'Tích phân cho 1/2; hậu nghiệm Bayes cần tiên nghiệm và chuẩn hóa trên miền tham số.']],
  ),
  'f-w025-e4': lesson(
    ['Nonidentifiability occurs when different parameter values produce the same distribution, so data cannot distinguish them.', 'Không nhận diện được xảy ra khi nhiều giá trị tham số tạo cùng phân phối, khiến dữ liệu không phân biệt được.'],
    ['Bernoulli(θ²) has the same law at θ and −θ; for observed proportion p̂, the MLE set is {−√p̂,+√p̂}, with one value at p̂=0.', 'Bernoulli(θ²) có cùng luật tại θ và −θ; với tỷ lệ mẫu p̂, tập MLE là {−√p̂,+√p̂}, chỉ một giá trị khi p̂=0.'],
    [['Compare θ and −θ: both give success probability θ², so the parameter map is not injective.', 'So sánh θ và −θ: cả hai cho xác suất thành công θ² nên ánh xạ tham số không đơn ánh.'], ['The likelihood depends on θ only through q=θ²; its maximum over q∈[0,1] is at q=p̂.', 'Hợp lý chỉ phụ thuộc θ qua q=θ²; cực đại theo q∈[0,1] đạt tại q=p̂.'], ['Solve θ²=p̂ under θ∈[−1,1], yielding both signs except when the root is zero.', 'Giải θ²=p̂ với θ∈[−1,1], được cả hai dấu trừ khi căn bằng 0.']],
  ),
  'f-w025-e5': lesson(
    ['A one-to-one reparameterization preserves the set of likelihood maximizers; many-to-one maps can merge distinct parameter values.', 'Tham số hóa một-một bảo toàn tập cực đại hợp lý; ánh xạ nhiều-một có thể gộp các giá trị tham số khác nhau.'],
    ['If g is one-to-one on Θ, L̃(η)=L(g⁻¹(η)) is defined on g(Θ) and has maximizers g(argmaxΘ L); if g is many-to-one, the inverse is set-valued.', 'Nếu g đơn ánh trên Θ thì L̃(η)=L(g⁻¹(η)) xác định trên g(Θ) và có cực đại g(argmaxΘ L); nếu g nhiều-một thì nghịch đảo là tập giá trị.'],
    [['An injective map pairs every θ with exactly one η and preserves likelihood values on its image.', 'Ánh xạ đơn ánh ghép mỗi θ với đúng một η và giữ nguyên giá trị hợp lý trên ảnh của nó.'], ['Thus maximizing over θ or the corresponding image g(Θ) selects corresponding maximizers.', 'Vì vậy tối đa hóa theo θ hoặc ảnh tương ứng g(Θ) chọn các cực đại tương ứng.'], ['With a many-to-one map, distinct θ share η and L(g⁻¹(η)) is not a single value unless one defines a profile over the fiber.', 'Với ánh xạ nhiều-một, nhiều θ chung η và L(g⁻¹(η)) không phải một giá trị nếu chưa định nghĩa profile trên thớ tiền ảnh.']],
  ),
  'f-w026-e1': lesson(
    ['A sufficient statistic retains all parameter information in the sample likelihood through a factorization.', 'Thống kê đủ giữ toàn bộ thông tin tham số của hợp lý mẫu qua một phép phân tích nhân tử.'],
    ['For IID Bernoulli(p), p(x₁,…,xₙ)=pˢ(1−p)ⁿ⁻ˢ·1, where S=Σxᵢ; the sample depends on p through S.', 'Với Bernoulli(p) IID, p(x₁,…,xₙ)=pˢ(1−p)ⁿ⁻ˢ·1, với S=Σxᵢ; mẫu phụ thuộc p qua S.'],
    [['Write the joint PMF as ∏ᵢpˣⁱ(1−p)¹⁻ˣⁱ.', 'Viết PMF chung thành ∏ᵢpˣⁱ(1−p)¹⁻ˣⁱ.'], ['Collect exponents into S=Σxᵢ and n−S to get pˢ(1−p)ⁿ⁻ˢ.', 'Gom số mũ thành S=Σxᵢ và n−S để được pˢ(1−p)ⁿ⁻ˢ.'], ['The remaining factor is h(x)=1 independent of p, so the factorization criterion shows S is sufficient.', 'Thừa số còn lại h(x)=1 không phụ thuộc p, nên tiêu chuẩn phân tích nhân tử cho thấy S là thống kê đủ.']],
  ),
  'f-w026-e2': lesson(
    ['Rao–Blackwellization replaces an estimator by its conditional mean given a sufficient statistic, reducing variance.', 'Rao–Blackwell thay ước lượng bằng kỳ vọng có điều kiện theo thống kê đủ, làm giảm phương sai.'],
    ['E[X₁|S]=0,1/2,1 for S=0,1,2; its variance is p(1−p)/2 for two IID Bernoulli(p) observations.', 'E[X₁|S]=0,1/2,1 khi S=0,1,2; phương sai là p(1−p)/2 với hai quan sát Bernoulli(p) IID.'],
    [['Given S=0 or 2, X₁ is forced to 0 or 1; given S=1, symmetry makes its conditional mean 1/2.', 'Khi S=0 hoặc 2, X₁ buộc bằng 0 hoặc 1; khi S=1, đối xứng cho kỳ vọng có điều kiện 1/2.'], ['The conditional estimator takes values 0,1/2,1 with probabilities (1−p)²,2p(1−p),p².', 'Ước lượng có điều kiện nhận 0,1/2,1 với xác suất (1−p)²,2p(1−p),p².'], ['Its mean is p and its second moment is p(1+p)/2, so variance is p(1−p)/2.', 'Kỳ vọng là p và moment bậc hai là p(1+p)/2, nên phương sai bằng p(1−p)/2.']],
  ),
  'f-w026-e3': lesson(
    ['The law of total variance separates average within-group uncertainty from between-group movement of conditional means.', 'Công thức phương sai toàn phần tách bất định trung bình trong nhóm khỏi biến thiên giữa các kỳ vọng nhóm.'],
    ['Var(X)=E[Var(X|T)]+Var(E[X|T]) for finite joint distributions.', 'Var(X)=E[Var(X|T)]+Var(E[X|T]) với phân phối chung hữu hạn.'],
    [['Use Var(X)=E[X²]−(EX)² and condition the first moment: EX=E[E(X|T)].', 'Dùng Var(X)=E[X²]−(EX)² và điều kiện hóa moment đầu: EX=E[E(X|T)].'], ['Expand E[Var(X|T)]=E[E(X²|T)−E(X|T)²].', 'Khai triển E[Var(X|T)]=E[E(X²|T)−E(X|T)²].'], ['Add Var(E[X|T])=E[E(X|T)²]−(EX)²; the middle terms cancel to leave Var(X).', 'Cộng Var(E[X|T])=E[E(X|T)²]−(EX)²; các số hạng giữa triệt tiêu còn Var(X).']],
  ),
  'f-w026-e4': lesson(
    ['Completeness is a separate property from sufficiency: one example can be checked directly but does not prove a universal implication.', 'Tính đầy đủ là thuộc tính riêng với tính đủ: có thể kiểm tra trực tiếp một ví dụ nhưng không chứng minh hệ quả phổ quát.'],
    ['If Eₚ[g(X)]=p g(1)+(1−p)g(0)=0 for every p∈(0,1), the affine function is identically zero, forcing g(0)=g(1)=0.', 'Nếu Eₚ[g(X)]=p g(1)+(1−p)g(0)=0 với mọi p∈(0,1), hàm affine đồng nhất 0, buộc g(0)=g(1)=0.'],
    [['Write the expectation equation for all p in the open interval (0,1).', 'Viết phương trình kỳ vọng với mọi p trong khoảng mở (0,1).'], ['Evaluate the affine expression at two distinct p values, or match its constant and p coefficients to zero.', 'Tính biểu thức affine tại hai p khác nhau hoặc cho hệ số hằng và p bằng 0.'], ['Conclude g vanishes on the support, establishing completeness here; a single model’s verification cannot establish a general theorem that sufficiency implies completeness.', 'Kết luận g bằng 0 trên miền giá trị, chứng minh đủ đầy ở đây; kiểm tra một mô hình không thể chứng minh định lý tổng quát rằng đủ kéo theo đầy đủ.']],
  ),
  'f-w026-e5': lesson(
    ['Conditioning on a partition assigns each cell its conditional mean; unbiasedness still depends on the model’s cell probabilities and target.', 'Điều kiện hóa theo phân hoạch gán kỳ vọng có điều kiện cho mỗi ô; tính không chệch vẫn phụ thuộc xác suất ô theo mô hình và tham số mục tiêu.'],
    ['If the five elementary outcomes are equiprobable, P(C₁)=2/5,P(C₂)=3/5 and Eδ=8/5; in general Eδ=P(C₁)+2P(C₂).', 'Nếu năm kết quả sơ cấp đồng khả năng thì P(C₁)=2/5,P(C₂)=3/5 và Eδ=8/5; tổng quát Eδ=P(C₁)+2P(C₂).'],
    [['The Rao–Blackwell estimator E[δ|T] is 1 on the first cell and 2 on the second.', 'Ước lượng Rao–Blackwell E[δ|T] bằng 1 trên ô thứ nhất và 2 trên ô thứ hai.'], ['If all five elementary outcomes are equally likely, weight by 2/5 and 3/5 to get 8/5; without that assumption, cell sizes alone do not determine the expectation.', 'Nếu cả năm kết quả sơ cấp đồng khả năng, gán trọng số 2/5 và 3/5 để được 8/5; nếu thiếu giả thiết đó, riêng kích thước ô không xác định kỳ vọng.'], ['To check unbiasedness for target θ, one needs the parameterized sampling law, cell probabilities and conditional means as functions of θ, plus the target function.', 'Để kiểm tra không chệch cho mục tiêu θ, cần luật lấy mẫu theo tham số, xác suất ô và kỳ vọng có điều kiện theo θ, cùng hàm mục tiêu.']],
  ),
  'f-w027-e1': lesson(
    ['A likelihood ratio compares how strongly an observation favors a specified alternative over a null model.', 'Tỷ số hợp lý so sánh mức độ một quan sát ủng hộ phương án thay thế xác định so với mô hình không.'],
    ['For X∼N(μ,1), L(2)/L(0)=exp(2x−2), increasing in x; reject H₀ for sufficiently large x at a calibrated threshold.', 'Với X∼N(μ,1), L(2)/L(0)=exp(2x−2), tăng theo x; bác bỏ H₀ khi x đủ lớn theo ngưỡng đã hiệu chỉnh.'],
    [['Write the two densities proportional to exp(−(x−2)²/2) and exp(−x²/2).', 'Viết hai mật độ tỷ lệ với exp(−(x−2)²/2) và exp(−x²/2).'], ['Divide and simplify the exponent: [x²−(x−2)²]/2=2x−2.', 'Chia và rút gọn số mũ: [x²−(x−2)²]/2=2x−2.'], ['The ratio increases with x, so evidence for μ=2 lies in the upper tail; the cutoff depends on the chosen size α.', 'Tỷ số tăng theo x nên bằng chứng cho μ=2 nằm ở đuôi trên; ngưỡng phụ thuộc mức α đã chọn.']],
  ),
  'f-w027-e2': lesson(
    ['A p-value conditions on the null model and the observed test statistic; a posterior probability conditions on data and needs prior odds.', 'p-value điều kiện theo mô hình không và thống kê quan sát; xác suất hậu nghiệm điều kiện theo dữ liệu và cần odds tiên nghiệm.'],
    ['p-value=P(T≥t_obs|H₀) is not P(H₀|data); Bayes requires P(H₀), P(H₁), and the likelihood under each.', 'p-value=P(T≥t_obs|H₀) không phải P(H₀|data); Bayes cần P(H₀), P(H₁) và hợp lý dưới mỗi giả thuyết.'],
    [['Identify the p-value event as a tail event for hypothetical repeated data assuming H₀.', 'Nhận diện biến cố p-value là biến cố đuôi của dữ liệu giả định lặp lại dưới H₀.'], ['A posterior reverses the conditioning direction, from data given H₀ to H₀ given the observed data.', 'Hậu nghiệm đảo chiều điều kiện hóa, từ dữ liệu khi biết H₀ sang H₀ khi biết dữ liệu.'], ['Bayes’ rule needs prior probabilities and likelihoods under competing hypotheses; a tail area alone supplies neither posterior odds nor P(H₀|data).', 'Quy tắc Bayes cần xác suất tiên nghiệm và hợp lý dưới các giả thuyết cạnh tranh; riêng diện tích đuôi không cho odds hậu nghiệm hay P(H₀|data).']],
  ),
  'f-w027-e3': lesson(
    ['Testing many true nulls increases the chance of at least one false rejection, even when each individual test has controlled size.', 'Kiểm định nhiều giả thuyết không đúng làm tăng xác suất có ít nhất một bác bỏ sai, dù từng kiểm định có mức được kiểm soát.'],
    ['For 20 independent tests at α=.05, P(any false rejection)=1−(1−.05)²⁰≈.642; Bonferroni uses .05/20=.0025 per test.', 'Với 20 kiểm định độc lập mức α=.05, P(có bác bỏ sai)=1−(1−.05)²⁰≈.642; Bonferroni dùng .05/20=.0025 mỗi kiểm định.'],
    [['Under each true null, probability of no false rejection is .95.', 'Dưới mỗi giả thuyết không đúng, xác suất không bác bỏ sai là .95.'], ['Independence gives probability of no false rejections across all tests as .95²⁰; subtract from one to get about .642.', 'Tính độc lập cho xác suất không có bác bỏ sai là .95²⁰; lấy 1 trừ đi được khoảng .642.'], ['Bonferroni sets each level to α/20=.0025, guaranteeing familywise error at most .05 without needing independence.', 'Bonferroni đặt mỗi mức bằng α/20=.0025, bảo đảm lỗi toàn họ không quá .05 mà không cần độc lập.']],
  ),
  'f-w027-e4': lesson(
    ['The likelihood-ratio test is most powerful because it chooses rejection exactly where the alternative density is large relative to the null density.', 'Kiểm định tỷ số hợp lý mạnh nhất vì chọn bác bỏ đúng nơi mật độ phương án thay thế lớn tương đối so với mật độ không.'],
    ['Let p₀ and p₁ be densities under simple H₀ and H₁ with respect to the same dominating measure, and let a test φ take values in [0,1]. Choose k≥0 so φ*=1 where p₁−kp₀>0 and φ*=0 where it is <0, randomizing on equality if needed to attain size α. Then for any competing test φ with size at most α, (φ−φ*)(p₁−kp₀)≤0 pointwise and E₁φ≤E₁φ*.', 'Cho p₀ và p₁ là mật độ dưới H₀ và H₁ đơn theo cùng một độ đo trội, và kiểm định φ nhận giá trị trong [0,1]. Chọn k≥0 để φ*=1 tại nơi p₁−kp₀>0 và φ*=0 tại nơi nó <0, ngẫu nhiên hóa tại điểm bằng nhau nếu cần để đạt mức α. Khi đó với mọi kiểm định φ cạnh tranh có mức không quá α, (φ−φ*)(p₁−kp₀)≤0 tại từng điểm và E₁φ≤E₁φ*.'],
    [['Where p₁−kp₀>0, φ*=1, so φ−φ*≤0 and their product is nonpositive.', 'Nơi p₁−kp₀>0, φ*=1 nên φ−φ*≤0 và tích không dương.'], ['Where p₁−kp₀<0, φ*=0, so φ−φ*≥0 while the second factor is negative.', 'Nơi p₁−kp₀<0, φ*=0 nên φ−φ*≥0 trong khi thừa số thứ hai âm.'], ['At equality the product is zero; integrating the pointwise inequality and using equal size yields no greater power for φ.', 'Tại điểm bằng nhau tích bằng 0; tích phân bất đẳng thức điểm và dùng cùng mức kiểm định cho thấy φ không có lực mạnh hơn.']],
  ),
  'f-w027-e5': lesson(
    ['A predeclared directional alternative determines the test tail; choosing a tail after seeing data changes the error calibration.', 'Phương án thay thế có hướng được định trước xác định đuôi kiểm định; chọn đuôi sau khi xem dữ liệu làm đổi hiệu chỉnh sai số.'],
    ['For known σ and n IID observations, Z=(X̄−μ₀)/(σ/√n); for H₁:μ>μ₀, reject for large positive Z at the prespecified α quantile.', 'Với σ đã biết và n quan sát IID, Z=(X̄−μ₀)/(σ/√n); với H₁:μ>μ₀, bác bỏ khi Z dương lớn theo phân vị α định trước.'],
    [['Choose a statistic increasing with μ, such as the standardized sample mean under a known-variance normal model.', 'Chọn thống kê tăng theo μ, chẳng hạn trung bình mẫu chuẩn hóa trong mô hình phương sai đã biết.'], ['Because the alternative predicts larger means, place the rejection region in the upper tail.', 'Vì phương án thay thế dự đoán trung bình lớn hơn, đặt miền bác bỏ ở đuôi trên.'], ['Switching to either tail after observing the sign uses the data twice and generally inflates type-I error unless recalibrated.', 'Đổi đuôi sau khi thấy dấu dùng dữ liệu hai lần và thường làm tăng lỗi loại I nếu không hiệu chỉnh lại.']],
  ),
  'f-w028-e1': lesson(
    ['The empirical bootstrap treats observed values as the population and enumerates all resamples to expose the statistic’s resampling distribution.', 'Bootstrap thực nghiệm xem các giá trị quan sát là quần thể rồi liệt kê mọi mẫu lại để biểu lộ phân phối lấy mẫu lại của thống kê.'],
    ['Two draws from {0,2} have four ordered resamples: means 0,1,1,2, with probabilities 1/4,1/2,1/4.', 'Hai lần rút từ {0,2} có bốn mẫu lại có thứ tự: trung bình 0,1,1,2 với xác suất 1/4,1/2,1/4.'],
    [['List ordered draws (0,0),(0,2),(2,0),(2,2); each has probability (1/2)²=1/4.', 'Liệt kê các lượt rút có thứ tự (0,0),(0,2),(2,0),(2,2); mỗi mẫu xác suất (1/2)²=1/4.'], ['Compute the mean of each pair: 0,1,1,2.', 'Tính trung bình mỗi cặp: 0,1,1,2.'], ['Combine repeated means: probability 1/4 at 0, 1/2 at 1, and 1/4 at 2.', 'Gộp các trung bình trùng: xác suất 1/4 tại 0, 1/2 tại 1 và 1/4 tại 2.']],
  ),
  'f-w028-e2': lesson(
    ['A permutation test holds pooled observations fixed and enumerates relabelings allowed by the null exchangeability assumption.', 'Kiểm định hoán vị giữ dữ liệu gộp cố định và liệt kê cách gán nhãn được phép theo giả thiết hoán đổi của giả thuyết không.'],
    ['For each 2-element subset A of {1,2,4,5}, compute D=mean(A)−mean(Aᶜ); the six values are −3,−1,0,0,1,3.', 'Với mỗi tập con A gồm 2 phần tử của {1,2,4,5}, tính D=mean(A)−mean(Aᶜ); sáu giá trị là −3,−1,0,0,1,3.'],
    [['Pool the four observations and choose which two occupy the first group; there are C(4,2)=6 labelings.', 'Gộp bốn quan sát rồi chọn hai quan sát vào nhóm đầu; có C(4,2)=6 cách gán nhãn.'], ['For A={1,2},{1,4},{1,5},{2,4},{2,5},{4,5}, subtract the complementary group mean.', 'Với A={1,2},{1,4},{1,5},{2,4},{2,5},{4,5}, trừ trung bình nhóm bổ sung.'], ['The resulting differences in that order are −3,−1,0,0,1,3; the observed assignment A={1,4} has difference −1.', 'Các hiệu theo thứ tự là −3,−1,0,0,1,3; cách gán quan sát A={1,4} có hiệu −1.']],
  ),
  'f-w028-e3': lesson(
    ['Permutation validity comes from symmetry under the null: conditional on an orbit, the observed labeling has a calibrated rank.', 'Tính hợp lệ hoán vị đến từ đối xứng dưới giả thuyết không: khi điều kiện theo quỹ đạo, nhãn quan sát có thứ hạng được hiệu chỉnh.'],
    ['Under invariance and a finite permutation group, randomized tie-aware rank is uniform on its attainable ranks; rejecting the top α fraction gives conditional size α.', 'Dưới tính bất biến và nhóm hoán vị hữu hạn, hạng có xử lý hòa ngẫu nhiên là đều trên các hạng đạt được; bác bỏ α phần trên cho mức có điều kiện α.'],
    [['Condition on the orbit of the observed data; null invariance makes the observed labeling exchangeable with the group-generated alternatives.', 'Điều kiện theo quỹ đạo dữ liệu quan sát; tính bất biến null làm nhãn quan sát hoán đổi được với các nhãn do nhóm sinh ra.'], ['With randomization at ties, every attainable rank has equal probability, so the rejection rank set has probability α on each orbit.', 'Ngẫu nhiên hóa tại điểm hòa làm mọi hạng đạt được có xác suất bằng nhau, nên tập hạng bác bỏ có xác suất α trên mỗi quỹ đạo.'], ['Average the conditional rejection probability over all orbits to get unconditional size α; without boundary randomization, exact α may be unattainable.', 'Lấy trung bình xác suất bác bỏ có điều kiện trên mọi quỹ đạo để được mức vô điều kiện α; không ngẫu nhiên hóa biên thì có thể không đạt đúng α.']],
  ),
  'f-w028-e4': lesson(
    ['IID resampling from a marginal distribution removes serial covariance, so it can understate or overstate uncertainty in a dependent series.', 'Lấy mẫu IID từ phân phối biên loại bỏ hiệp phương sai chuỗi, nên có thể đánh giá thấp hoặc cao bất định của chuỗi phụ thuộc.'],
    ['For a stationary pair with Var(Xᵢ)=γ₀ and Cov(X₁,X₂)=γ₁, Var((X₁+X₂)/2)=(γ₀+γ₁)/2; IID resampling gives γ₀/2.', 'Với cặp dừng có Var(Xᵢ)=γ₀ và Cov(X₁,X₂)=γ₁, Var((X₁+X₂)/2)=(γ₀+γ₁)/2; lấy mẫu IID cho γ₀/2.'],
    [['Expand the variance of the average: one quarter times Var(X₁)+Var(X₂)+2Cov(X₁,X₂).', 'Khai triển phương sai trung bình: một phần tư nhân Var(X₁)+Var(X₂)+2Cov(X₁,X₂).'], ['Stationarity makes both variances γ₀ and lag-one covariance γ₁, yielding (2γ₀+2γ₁)/4.', 'Tính dừng cho hai phương sai γ₀ và hiệp phương sai trễ một γ₁, được (2γ₀+2γ₁)/4.'], ['Independent marginal draws set covariance to zero, giving γ₀/2; the discrepancy is γ₁/2.', 'Rút độc lập từ biên đặt hiệp phương sai bằng 0, cho γ₀/2; chênh lệch là γ₁/2.']],
  ),
  'f-w028-e5': lesson(
    ['Nearest-rank quantiles use empirical order statistics, but a tiny bootstrap sample gives coarse and unstable interval endpoints.', 'Phân vị hạng gần nhất dùng thống kê thứ tự thực nghiệm, nhưng mẫu bootstrap rất nhỏ cho đầu mút thô và thiếu ổn định.'],
    ['For sorted bootstrap values x₍₁₎≤…≤x₍₅₎, nearest rank is x₍ceil(np)₎; ranks are 1 at 20% and 4 at 80%.', 'Với giá trị bootstrap đã sắp xếp x₍₁₎≤…≤x₍₅₎, hạng gần nhất là x₍ceil(np)₎; hạng là 1 tại 20% và 4 tại 80%.'],
    [['The sample is already ordered: .1,.2,.2,.3,.5.', 'Mẫu đã có thứ tự: .1,.2,.2,.3,.5.'], ['Compute ceil(5·.2)=1 and ceil(5·.8)=4, selecting .1 and .3.', 'Tính ceil(5·.2)=1 và ceil(5·.8)=4, chọn .1 và .3.'], ['Report percentile endpoints [.1,.3] and note five replicates make quantiles coarse with substantial Monte Carlo uncertainty.', 'Báo đầu mút percentile [.1,.3] và lưu ý năm lần lặp khiến phân vị thô, có bất định Monte Carlo đáng kể.']],
  ),
};

export default teaching;
