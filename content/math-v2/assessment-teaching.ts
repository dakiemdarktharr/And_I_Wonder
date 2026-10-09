import type { Bilingual } from '../../lib/lesson-types';
import assessmentAuthor from './assessment';

type TeachingEntry = {
  application: Bilingual;
  formula: Bilingual;
  steps: [Bilingual, Bilingual, Bilingual];
};
type Pair = [string, string];
const B = (en: string, vi: string): Bilingual => ({ en, vi });
const F = (math: string): Bilingual => B(math, math);
const L = (application: Pair, formula: string, steps: [Pair, Pair, Pair]): TeachingEntry => ({
  application: B(...application),
  formula: F(formula),
  steps: [B(...steps[0]), B(...steps[1]), B(...steps[2])],
});

// These original exercise IDs own the authored explanations. Scheduled
// reconstructions below reuse the exact entry named by practiceOrigin.
const lessons: Record<string, TeachingEntry> = {
  'm2-w097-e1': L(
    ['A one-row sensor observes a weighted combination of two uncertain state coordinates; the Kalman update reallocates uncertainty using signal-to-noise.', 'Cảm biến một hàng quan sát tổ hợp có trọng số của hai tọa độ trạng thái bất định; cập nhật Kalman phân bổ lại bất định theo tỷ lệ tín hiệu/nhiễu.'],
    '$S=HPH^T+R=4,\\;K=PH^TS^{-1}=(1/2,-1/4)^T,\\;a^+=a+K(y-Ha)=(1,-1/2)^T,\\;P^+=P-PH^TS^{-1}HP=\\begin{pmatrix}1&1/2\\\\1/2&3/4\\end{pmatrix}$',
    [
      ['Compute the scalar innovation variance from H=(1,−1): 2+1+1=4. Multiply PHᵀ and divide by 4 to get the two-coordinate gain.', 'Tính phương sai innovation vô hướng từ H=(1,−1): 2+1+1=4. Nhân PHᵀ rồi chia 4 để được gain hai tọa độ.'],
      ['The prior predicted observation is Ha=0, so the innovation is 2; apply K times this residual to obtain the posterior mean.', 'Dự đoán quan sát prior là Ha=0 nên innovation bằng 2; nhân K với phần dư để được trung bình hậu nghiệm.'],
      ['Update covariance by the rank-one reduction. For any v, vᵀP⁺v is the variance of vᵀ(x−Ky), hence nonnegative; do not infer matrix PSD from a grid.', 'Cập nhật hiệp phương sai bằng phép giảm hạng một. Với mọi v, vᵀP⁺v là phương sai của vᵀ(x−Ky), nên không âm; không suy luận PSD của ma trận từ lưới thử.'],
    ],
  ),
  'm2-w097-e2': L(
    ['Conditional expectation is the least-squares predictor using information in a sigma-field; the identity measures the extra risk from any other measurable prediction.', 'Kỳ vọng có điều kiện là dự đoán bình phương tối thiểu dùng thông tin trong sigma-field; đẳng thức đo phần rủi ro tăng thêm của dự đoán đo được khác.'],
    '$E\\|X-g\\|^2=E\\|X-m\\|^2+E\\|m-g\\|^2,\\quad m=E[X\\mid\\mathcal G],\\quad X\\in L^2,\\;g\\in L^2(\\mathcal G)$',
    [
      ['Use conditional Jensen to establish m∈L². The defining integral property gives E[(X−m)ᵀh]=0 first for bounded G-measurable simple h.', 'Dùng Jensen có điều kiện để suy ra m∈L². Tính chất tích phân định nghĩa cho E[(X−m)ᵀh]=0 trước hết với h đơn đo được G và bị chặn.'],
      ['Approximate h=m−g by bounded truncations in L²; Cauchy–Schwarz passes the orthogonality identity to this unbounded test.', 'Xấp xỉ h=m−g bằng phép cắt cụt bị chặn theo L²; Cauchy–Schwarz truyền đẳng thức trực giao sang hàm thử không bị chặn này.'],
      ['Expand X−g=(X−m)+(m−g); the cross term vanishes. Equality of risks forces E||m−g||²=0, so uniqueness is only almost surely.', 'Khai triển X−g=(X−m)+(m−g); số hạng chéo bằng 0. Rủi ro bằng nhau buộc E||m−g||²=0, nên tính duy nhất chỉ đúng hầu chắc chắn.'],
    ],
  ),
  'm2-w097-e3': L(
    ['Forecast errors formed after removing the previous-information conditional mean are orthogonal across time, a second-moment fact weaker than independence.', 'Sai số dự báo sau khi trừ trung bình có điều kiện theo thông tin quá khứ trực giao qua thời gian; đây là tính chất moment bậc hai yếu hơn độc lập.'],
    '$e_t=Y_t-E[Y_t\\mid\\mathcal F_{t-1}],\\quad s<t:\\ E[e_te_s]=0,\\quad E[e_t\\mid\\mathcal F_{t-1}]=0$',
    [
      ['Because the process is adapted, e_s is F_s-measurable, and F_s is contained in F_(t−1) when s<t.', 'Do quá trình thích nghi, e_s đo được theo F_s và F_s nằm trong F_(t−1) khi s<t.'],
      ['Condition on F_(t−1): pull out e_s and use the zero conditional mean of e_t; Cauchy–Schwarz ensures the product is integrable.', 'Điều kiện hóa theo F_(t−1): đưa e_s ra ngoài và dùng kỳ vọng có điều kiện của e_t bằng 0; Cauchy–Schwarz bảo đảm tích khả tích.'],
      ['To separate orthogonality from independence, take U uniform on {−2,−1,1,2}, an independent fair sign V, and set e₁=U,e₂=UV. Then E[e₂|U]=0 but |e₂|=|e₁|.', 'Để phân biệt trực giao với độc lập, lấy U đều trên {−2,−1,1,2}, dấu V công bằng độc lập, rồi đặt e₁=U,e₂=UV. Khi đó E[e₂|U]=0 nhưng |e₂|=|e₁|.'],
    ],
  ),
  'm2-w097-e4': L(
    ['A hidden coordinate that never enters the observation can retain or accumulate uncertainty no matter how many noisy measurements of another coordinate arrive.', 'Tọa độ ẩn không xuất hiện trong quan sát có thể giữ hoặc tích lũy bất định dù nhận bao nhiêu phép đo nhiễu về tọa độ khác.'],
    '$\\mathcal O_2(H)=\\begin{pmatrix}H\\\\HA\\end{pmatrix},\\quad H=(1,0):\\ \\operatorname{rank}\\mathcal O_2=1,\\quad H=(1,1):\\ \\mathcal O_2=\\begin{pmatrix}1&1\\\\0.8&1.1\\end{pmatrix},\\ \\det=0.3$',
    [
      ['With diagonal A, initial covariance and process noise, the second state remains uncorrelated with the first. H=(1,0) therefore gives gain component K₂=0 at each update.', 'Với A, covariance ban đầu và nhiễu quá trình đều chéo, trạng thái thứ hai vẫn không tương quan với thứ nhất. Vì vậy H=(1,0) cho thành phần gain K₂=0 ở mỗi lần cập nhật.'],
      ['Its variance follows p₂,t=1.1²p₂,t−1+q₂ with no measurement reduction; positive initial variance cannot be learned from y.', 'Phương sai tuân p₂,t=1,1²p₂,t−1+q₂ mà không giảm do đo lường; phương sai ban đầu dương không thể suy ra từ y.'],
      ['Compute the two observability matrices. For H=(1,1), determinant 1.1−0.8=0.3 gives rank two; this permits observability but noisy finite data do not reveal the state exactly.', 'Tính hai ma trận quan sát được. Với H=(1,1), định thức 1,1−0,8=0,3 cho hạng hai; điều này cho phép quan sát được nhưng dữ liệu hữu hạn nhiễu không xác định trạng thái chính xác.'],
    ],
  ),
  'm2-w097-e5': L(
    ['A forecast issued at time t may use only F_t information; a smoother conditioned on later targets leaks information into the prediction.', 'Dự báo phát hành ở thời điểm t chỉ được dùng thông tin F_t; bộ làm trơn điều kiện theo mục tiêu tương lai làm rò rỉ thông tin vào dự đoán.'],
    '$\\hat Y_{t+1\\mid t}=HA m_{t\\mid t},\\quad d_t=(Y_{t+1}-\\hat Y^{KF}_{t+1\\mid t})^2-(Y_{t+1}-\\hat Y^{base}_{t+1\\mid t})^2,\\quad \\mu_d=E[d_t]$',
    [
      ['A valid forecast must be F_t-measurable. A smoother using Y₁:T with T>t depends on future observations and generally is not measurable at the forecast origin.', 'Dự báo hợp lệ phải đo được theo F_t. Bộ làm trơn dùng Y₁:T với T>t phụ thuộc quan sát tương lai và nói chung không đo được tại thời điểm dự báo.'],
      ['Use the filtered state m_(t|t), then propagate one step and apply the observation map H; freeze parameter fitting to data available before the origin.', 'Dùng trạng thái lọc m_(t|t), truyền tiến một bước rồi áp ánh xạ quan sát H; cố định việc khớp tham số theo dữ liệu có trước thời điểm dự báo.'],
      ['Compare forecasts on identical origins through paired loss differences d_t. Target E[d_t] under a declared stationary regime, or the finite-period average if stationarity is unsupported; uncertainty must retain dependence.', 'So sánh dự báo trên cùng các thời điểm gốc bằng hiệu loss ghép cặp d_t. Mục tiêu là E[d_t] dưới chế độ dừng được nêu, hoặc trung bình giai đoạn hữu hạn nếu không có căn cứ dừng; bất định phải giữ phụ thuộc.'],
    ],
  ),
  'm2-w098-e1': L(
    ['Serial dependence changes average uncertainty: negative odd-lag covariance can offset same-direction variation and lower the long-run variance.', 'Phụ thuộc chuỗi làm đổi bất định của trung bình: hiệp phương sai trễ lẻ âm có thể triệt tiêu biến thiên cùng chiều và hạ phương sai dài hạn.'],
    '$\\gamma_h=\\frac{3(-1/2)^{|h|}}{1-(-1/2)^2}=4(-1/2)^{|h|},\\quad \\Omega=\\frac{3}{(1-\\rho)^2}=\\frac43,\\quad \\operatorname{Var}(\\bar X_3)=\\frac23$',
    [
      ['For |ρ|<1, write the stationary causal AR(1) as a geometric sum of innovations; independence gives γ₀=3/(1−ρ²) and γ_h=ρ^|h|γ₀.', 'Với |ρ|<1, viết AR(1) nhân quả dừng thành tổng hình học các innovation; tính độc lập cho γ₀=3/(1−ρ²) và γ_h=ρ^|h|γ₀.'],
      ['Substitute ρ=−1/2 and innovation variance 3 to obtain γ₀=4, γ₁=−2, γ₂=1, and Ω=γ₀+2Σ_(h≥1)γ_h=4/3.', 'Thay ρ=−1/2 và phương sai innovation 3 để được γ₀=4, γ₁=−2, γ₂=1, và Ω=γ₀+2Σ_(h≥1)γ_h=4/3.'],
      ['For n=3, use the finite covariance sum [3γ₀+2(2γ₁+γ₂)]/9=2/3. Do not replace this exact finite-n variance by Ω/3=4/9.', 'Với n=3, dùng tổng covariance hữu hạn [3γ₀+2(2γ₁+γ₂)]/9=2/3. Không thay phương sai hữu hạn chính xác này bằng Ω/3=4/9.'],
    ],
  ),
  'm2-w098-e2': L(
    ['Comparing two forecasting procedures on shared dates requires preserving their paired loss covariance; separate resampling fabricates independent comparisons.', 'So sánh hai quy trình dự báo trên cùng ngày cần bảo toàn hiệp phương sai loss ghép cặp; lấy mẫu riêng tạo ra so sánh độc lập giả tạo.'],
    '$D_t=A_t-B_t,\\quad \\gamma_D(h)=\\gamma_A(h)+\\gamma_B(h)-\\operatorname{Cov}(A_t,B_{t-h})-\\operatorname{Cov}(B_t,A_{t-h})$',
    [
      ['Expand Cov(A_t−B_t,A_(t−h)−B_(t−h)) into four terms; stationarity does not generally make the two cross-lag terms equal for positive h.', 'Khai triển Cov(A_t−B_t,A_(t−h)−B_(t−h)) thành bốn số hạng; tính dừng nói chung không làm hai hiệp phương sai chéo trễ bằng nhau khi h dương.'],
      ['Set A_t=B_t=Z_t² for IID standard-normal Z_t. Each stream has variance 2, but D_t=0 identically, so the paired target has no sampling variation.', 'Đặt A_t=B_t=Z_t² với Z_t chuẩn tắc IID. Mỗi chuỗi có phương sai 2 nhưng D_t=0 đồng nhất, nên mục tiêu ghép cặp không có biến thiên lấy mẫu.'],
      ['Independent resampling breaks equality and creates artificial positive variance. Resample aligned pairs, with time blocks if serial dependence is present, or analyze D directly under justified conditions.', 'Lấy mẫu độc lập phá vỡ sự bằng nhau và tạo phương sai dương giả. Lấy mẫu lại các cặp đồng bộ, dùng block thời gian nếu có phụ thuộc chuỗi, hoặc phân tích trực tiếp D dưới điều kiện được biện minh.'],
    ],
  ),
  'm2-w098-e3': L(
    ['A random walk is nonstationary: averaging levels repeatedly includes early shocks with growing multiplicity, so its mean uncertainty increases instead of shrinking.', 'Bước ngẫu nhiên không dừng: trung bình các mức lặp lại nhiều lần các cú sốc đầu với trọng số tăng, nên bất định trung bình tăng thay vì giảm.'],
    '$\\bar X_n=\\frac1n\\sum_{j=1}^n(n-j+1)\\epsilon_j,\\quad \\operatorname{Var}(\\bar X_n)=\\frac1{n^2}\\sum_{k=1}^nk^2=\\frac{(n+1)(2n+1)}{6n}\\sim\\frac n3$',
    [
      ['Swap the finite sums in Σ_(t=1)^n X_t: innovation ε_j appears in levels j through n, hence coefficient n−j+1.', 'Đổi thứ tự tổng hữu hạn trong Σ_(t=1)^n X_t: innovation ε_j xuất hiện ở các mức từ j đến n, nên hệ số là n−j+1.'],
      ['Use independence and unit innovation variance to sum squared coefficients; the sum of k² is n(n+1)(2n+1)/6.', 'Dùng tính độc lập và phương sai innovation bằng 1 để cộng bình phương hệ số; tổng k² bằng n(n+1)(2n+1)/6.'],
      ['The result grows like n/3 and Var(X_t)=t, so weak stationarity fails. A stationary HAC interval for a fixed mean has no applicable stationary-level premise.', 'Kết quả tăng như n/3 và Var(X_t)=t nên tính dừng yếu thất bại. Khoảng HAC dừng cho trung bình cố định không có giả thiết mức dừng để áp dụng.'],
    ],
  ),
  'm2-w098-e4': L(
    ['The Gaussian innovation likelihood scores each observation using a predictive distribution fixed before that observation arrives.', 'Hợp lý innovation Gaussian chấm mỗi quan sát theo phân phối dự báo đã cố định trước khi quan sát đó xuất hiện.'],
    '$\\ell(y_{1:T})=-\\frac12\\sum_{t=1}^T\\left[m\\log(2\\pi)+\\log\\det S_t+v_t^TS_t^{-1}v_t\\right],\\quad v_t=y_t-\\hat y_t$',
    [
      ['Apply the chain rule to factor the joint density into p(y_t|y₁:ₜ₋₁) terms; under the stated model each is Gaussian N(ŷ_t,S_t).', 'Dùng quy tắc dây chuyền phân tích mật độ chung thành các thừa số p(y_t|y₁:ₜ₋₁); theo mô hình đã nêu, mỗi thừa số là Gaussian N(ŷ_t,S_t).'],
      ['Take logs of each m-dimensional Gaussian density, retaining the log determinant and m log(2π) normalizer as well as the quadratic residual.', 'Lấy log từng mật độ Gaussian m chiều, giữ log định thức và hằng số chuẩn hóa m log(2π) cùng dạng toàn phương của residual.'],
      ['The conditional density must be normalized for each past history. If Q is selected using current v_t, S_t depends on y_t and the stated predictive density is no longer justified; update Q for the next score or specify another joint model.', 'Mật độ có điều kiện phải chuẩn hóa với mỗi lịch sử quá khứ. Nếu chọn Q bằng v_t hiện tại, S_t phụ thuộc y_t và mật độ dự báo đã nêu không còn được biện minh; cập nhật Q cho lần chấm tiếp theo hoặc nêu mô hình chung khác.'],
    ],
  ),
  'm2-w098-e5': L(
    ['The whitened innovation quadratic has mean equal to dimension under correct conditional first and second moments; this single moment does not establish Gaussian tails or useful forecasts.', 'Dạng toàn phương innovation đã làm trắng có kỳ vọng bằng số chiều dưới moment bậc nhất và hai có điều kiện đúng; riêng moment này không xác lập đuôi Gaussian hay dự báo hữu ích.'],
    '$E[v_t^TS_t^{-1}v_t\\mid\\mathcal F_{t-1}]=\\operatorname{tr}(S_t^{-1}E[v_tv_t^T\\mid\\mathcal F_{t-1}])=\\operatorname{tr}(I_m)=m$',
    [
      ['Condition on the past: the innovation has conditional mean zero and covariance S_t under the correctly specified model.', 'Điều kiện theo quá khứ: innovation có trung bình có điều kiện bằng 0 và covariance S_t theo mô hình đặc tả đúng.'],
      ['Use E[vᵀMv]=tr(ME[vvᵀ]) for fixed past-measurable M=S_t⁻¹, then simplify the trace to m.', 'Dùng E[vᵀMv]=tr(ME[vvᵀ]) với M=S_t⁻¹ đo được theo quá khứ, rồi rút gọn vết thành m.'],
      ['For m=1, v=±1 with equal probability and S=1 has the same expected square but a two-point tail law rather than χ²₁; report a moment diagnostic, not full calibration or profitability.', 'Với m=1, v=±1 đồng xác suất và S=1 có bình phương kỳ vọng bằng nhau nhưng luật đuôi hai điểm thay vì χ²₁; chỉ báo cáo chẩn đoán moment, không kết luận hiệu chuẩn đầy đủ hay sinh lời.'],
    ],
  ),
  'm2-w099-e1': L(
    ['Nested conditioning, squared prediction risk, and expectation limits are linked by orthogonality and uniform integrability; each conclusion requires its own measurability or moment condition.', 'Điều kiện hóa lồng, rủi ro dự đoán bình phương và giới hạn kỳ vọng liên hệ qua trực giao và khả tích đều; mỗi kết luận cần điều kiện đo được hoặc moment riêng.'],
    '$E[E[X\\mid\\mathcal H]\\mid\\mathcal G]=E[X\\mid\\mathcal G],\\quad R(\\mathcal G)-R(\\mathcal H)=E\\|m_H-m_G\\|^2,\\quad X_n=n\\mathbf1_{\\{U<1/n\\}}\\to0\\ \\mathrm{a.s.},\\ EX_n=1$',
    [
      ['For every A∈G, integrate the proposed nested conditional expectation over A twice and use G⊂H to recover E[1_A X]. Equality of defining integrals plus G-measurability gives uniqueness a.s.', 'Với mọi A∈G, tích phân kỳ vọng có điều kiện lồng trên A hai lần và dùng G⊂H để thu E[1_A X]. Tính đo được theo G cùng đẳng thức tích phân định nghĩa cho duy nhất hầu chắc chắn.'],
      ['Set m_G=E[X|G], m_H=E[X|H]. The difference m_H−m_G is H-measurable and orthogonal to X−m_H; expand both squared risks to get the nonnegative risk difference.', 'Đặt m_G=E[X|G], m_H=E[X|H]. Hiệu m_H−m_G đo được theo H và trực giao với X−m_H; khai triển hai rủi ro bình phương để được hiệu không âm.'],
      ['For U uniform(0,1), the shrinking events eventually exclude almost every U, while nP(U<1/n)=1. For the repair, a uniform L² bound gives uniform integrability; convergence in probability then implies L¹ and expectation convergence.', 'Với U đều trên (0,1), các biến cố co lại cuối cùng loại gần như mọi U, trong khi nP(U<1/n)=1. Để sửa, cận L² đều cho khả tích đều; hội tụ theo xác suất khi đó kéo theo hội tụ L¹ và hội tụ kỳ vọng.'],
    ],
  ),
  'm2-w099-e2': L(
    ['A weighted estimating equation is a ratio estimator: its uncertainty is the variance of the weighted score divided by squared mean weight, not the unweighted outcome variance.', 'Phương trình ước lượng có trọng số tạo ước lượng tỷ số: bất định là phương sai score có trọng số chia bình phương kỳ vọng trọng số, không phải phương sai đầu ra không trọng số.'],
    '$\\hat\\theta=\\frac{\\overline{WY}}{\\bar W},\\quad \\sqrt n(\\hat\\theta-\\theta_0)\\Rightarrow N(0,B/m^2),\\quad B=E[W^2(Y-\\theta_0)^2],\\quad \\hat V=\\frac{n^{-1}\\sum_iW_i^2(Y_i-\\hat\\theta)^2}{\\bar W^2}$',
    [
      ['Rewrite the estimating equation exactly as the ratio of sample means. LLN gives numerator and denominator limits; E[W]=m>0 makes division continuous.', 'Viết lại phương trình ước lượng chính xác thành tỷ số hai trung bình mẫu. LLN cho các giới hạn tử và mẫu; E[W]=m>0 khiến phép chia liên tục.'],
      ['Center the numerator at θ₀: √n(θ̂−θ₀) equals n⁻¹ᐟ²ΣWᵢ(Yᵢ−θ₀)/W̄. The summand has mean zero and finite variance B, so CLT and Slutsky give variance B/m².', 'Tâm hóa tử tại θ₀: √n(θ̂−θ₀) bằng n⁻¹ᐟ²ΣWᵢ(Yᵢ−θ₀)/W̄. Số hạng có kỳ vọng 0 và phương sai B hữu hạn, nên CLT và Slutsky cho phương sai B/m².'],
      ['Replace θ₀ and m by consistent sample quantities for the sandwich estimate. B=0 iff W(Y−θ₀)=0 a.s.; since W>0, this means Y is constant a.s., while generally weighted and unweighted variances differ.', 'Thay θ₀ và m bằng đại lượng mẫu nhất quán để có ước lượng sandwich. B=0 khi và chỉ khi W(Y−θ₀)=0 hầu chắc chắn; do W>0, điều này nghĩa là Y hằng hầu chắc chắn, còn phương sai có trọng số và không trọng số thường khác nhau.'],
    ],
  ),
  'm2-w099-e3': L(
    ['A full-row-rank equality constraint has a unique minimum-norm feasible point; smooth convex descent then converts gradient progress into a telescoping distance bound.', 'Ràng buộc đẳng thức hạng hàng đầy đủ có điểm khả thi chuẩn nhỏ nhất duy nhất; bước giảm lồi trơn biến tiến triển gradient thành cận khoảng cách dạng telescoping.'],
    '$g(\\lambda)=\\lambda^Tb-\\frac12\\|A^T\\lambda\\|^2,\\quad x^*=A^T(AA^T)^{-1}b,\\quad f(x_k)-f(x^*)\\le\\frac{L\\|x_0-x^*\\|^2}{2k},\\quad x_{k+1}=(1-\\eta L)x_k$',
    [
      ['Minimize the Lagrangian over x to obtain the dual function; full row rank makes AAᵀ positive definite. Solve AAᵀλ*=b and set x*=Aᵀλ* to construct a feasible primal-dual pair with equal values.', 'Cực tiểu Lagrangian theo x để được hàm dual; hạng hàng đầy đủ làm AAᵀ xác định dương. Giải AAᵀλ*=b rồi đặt x*=Aᵀλ* để dựng cặp primal-dual khả thi có giá trị bằng nhau.'],
      ['For any other feasible x, write x=x*+z with Az=0. Since x* lies in the row space, x*⊥z, so the squared norm increases by ||z||² and the minimizer is unique.', 'Với mọi x khả thi khác, viết x=x*+z với Az=0. Vì x* thuộc không gian hàng nên x*⊥z; bình phương chuẩn tăng thêm ||z||² và nghiệm cực tiểu duy nhất.'],
      ['For gradient descent, combine L-smooth decrease with convexity and telescope squared distances over k steps. For f(x)=Lx²/2, a step η>2/L has |1−ηL|>1 and diverges from nonzero x₀.', 'Với gradient descent, kết hợp mức giảm L-trơn với tính lồi rồi cộng khử khoảng cách bình phương qua k bước. Với f(x)=Lx²/2, bước η>2/L cho |1−ηL|>1 và phân kỳ nếu x₀ khác 0.'],
    ],
  ),
  'm2-w099-e4': L(
    ['Overlapping moving-average errors reuse innovations across adjacent times, inflating mean uncertainty relative to independent observations; Kalman conditioning has a separate timing requirement.', 'Sai số trung bình trượt chồng lấp dùng lại innovation ở các thời điểm kề nhau, làm tăng bất định trung bình so với quan sát độc lập; điều kiện hóa Kalman có yêu cầu thời điểm riêng.'],
    '$\\gamma_k=\\frac{\\sigma^2(h-|k|)}{h^2}\\ (|k|<h),\\quad \\Omega=\\sigma^2,\\quad \\Omega/\\gamma_0=h,\\quad \\operatorname{Var}(\\bar D_n)=\\frac1n\\left[\\gamma_0+2\\sum_{k=1}^{h-1}(1-k/n)\\gamma_k\\right],\\quad S=HPH^T+R,\\ K=PH^TS^{-1},\\quad m^+=m+K(y-Hm),\\quad P^+=P-PH^TS^{-1}HP$',
    [
      ['Two moving averages share h−|k| innovations when |k|<h and none otherwise; count shared terms to derive each covariance.', 'Hai trung bình trượt chia sẻ h−|k| innovation khi |k|<h và không chia sẻ nếu lớn hơn; đếm số hạng chung để suy ra từng covariance.'],
      ['Sum γ₀+2Σγₖ to get long-run variance σ², giving asymptotic variance inflation h versus IID variance σ²/h. For finite n retain the factors 1−k/n.', 'Cộng γ₀+2Σγₖ được phương sai dài hạn σ², tức lạm phát phương sai tiệm cận h lần so với σ²/h IID. Với n hữu hạn, giữ các hệ số 1−k/n.'],
      ['For the independent Gaussian prior/error update, form S, solve for K, and update mean and covariance. A smoothed state uses F_T with T>t, so correct covariance algebra does not make it a forecast-time F_t feature.', 'Với cập nhật prior/sai số Gaussian độc lập, lập S, giải K rồi cập nhật trung bình và covariance. Trạng thái làm trơn dùng F_T với T>t, nên đại số covariance đúng không biến nó thành đặc trưng dự báo F_t.'],
    ],
  ),
  'm2-w099-e5': L(
    ['Each invalid inference drops a distinct condition: expectation interchange needs uniform integrability, a stationary CLT needs dependence and moment controls, and KKT stationarity needs convex sufficiency conditions.', 'Mỗi suy luận sai bỏ một điều kiện khác: đổi giới hạn kỳ vọng cần khả tích đều, CLT dừng cần kiểm soát phụ thuộc và moment, còn KKT stationarity cần điều kiện đủ lồi.'],
    '$X_n=n\\mathbf1_{\\{U<1/n\\}}\\to0\\ \\mathrm{a.s.},\\ EX_n=1;\\quad D_t=Z\\Rightarrow\\bar D_n=Z;\\quad f(x)=(x^2-1)^2,\\ f^{\\prime}(0)=0,\\ f(0)>f(1)$',
    [
      ['Use the shrinking-spike sequence: it tends to zero almost surely but has expectation one. A dominator or uniform integrability repairs expectation convergence.', 'Dùng dãy gai co lại: nó tiến về 0 hầu chắc chắn nhưng kỳ vọng bằng một. Hàm trội khả tích hoặc tính khả tích đều sửa được đổi giới hạn kỳ vọng.'],
      ['Let D_t=Z for one non-Gaussian integrable random variable Z at every time. The sequence is stationary but its average remains Z; finite dependence, suitable moments, and positive long-run variance are possible CLT repairs.', 'Cho D_t=Z với cùng một biến ngẫu nhiên Z khả tích không Gaussian tại mọi thời điểm. Dãy dừng nhưng trung bình vẫn là Z; phụ thuộc hữu hạn, moment phù hợp và phương sai dài hạn dương có thể sửa điều kiện CLT.'],
      ['For f(x)=(x²−1)², x=0 is stationary but f(0)=1 exceeds f(±1)=0. Convexity plus feasible KKT conditions supplies a global certificate; stationarity alone does not.', 'Với f(x)=(x²−1)², x=0 là điểm dừng nhưng f(0)=1 lớn hơn f(±1)=0. Tính lồi cùng điều kiện KKT khả thi cho chứng chỉ toàn cục; riêng tính dừng không đủ.'],
    ],
  ),
  'm2-w101-e1': L(
    ['A martingale can stop at an integrable finite time yet violate optional stopping because the stopped sequence lacks uniform integrability.', 'Martingale có thể dừng tại thời điểm hữu hạn khả tích nhưng vi phạm optional stopping vì dãy dừng thiếu khả tích đều.'],
    '$M_n=\\mathbf1_{\\{T\\le n\\}}-(2^n-1)\\mathbf1_{\\{T>n\\}},\\quad E[M_n]=0,\\quad P(T>n)=2^{-n},\\quad M_T=1\\ \\mathrm{a.s.},\\quad M_{S}=M_0+\\sum_{k=1}^{N}\\mathbf1_{\\{S\\ge k\\}}(M_k-M_{k-1})\\ (S\\le N)$',
    [
      ['On survival through n, M_n=−(2ⁿ−1); after the next fair coin, average the head value 1 and tail value −(2ⁿ⁺¹−1) to recover the current value. This proves the martingale step.', 'Nếu còn sống qua n thì M_n=−(2ⁿ−1); sau đồng xu kế tiếp, lấy trung bình giá trị ngửa 1 và sấp −(2ⁿ⁺¹−1) để thu lại giá trị hiện tại. Điều này chứng minh bước martingale.'],
      ['The probability of no head by n is 2⁻ⁿ, so T<∞ a.s. Directly weight the stopped and surviving values to check E[M_n]=0; at T the value is 1.', 'Xác suất chưa có mặt ngửa đến n là 2⁻ⁿ nên T<∞ hầu chắc chắn. Cân trọng số trực tiếp giá trị đã dừng và còn sống để kiểm tra E[M_n]=0; tại T, giá trị bằng 1.'],
      ['For S≤N, expand M_S into bounded predictable indicators times martingale increments; every term has mean zero. That argument cannot pass to unbounded T without expectation convergence; the surviving tail retains order-one L¹ mass, proving non-UI.', 'Với S≤N, khai triển M_S thành tổng chỉ báo dự đoán được bị chặn nhân số gia martingale; mỗi số hạng có kỳ vọng 0. Lập luận không chuyển sang T không bị chặn nếu thiếu hội tụ kỳ vọng; phần đuôi sống sót giữ khối lượng L¹ cỡ một, chứng minh không UI.'],
    ],
  ),
  'm2-w101-e2': L(
    ['An endpoint-dependent uniform support creates a faster, nonnormal maximum-likelihood limit; a Poisson-shaped criterion under misspecification has sandwich variance determined by the actual data moments.', 'Miền hỗ trợ đều phụ thuộc đầu mút tạo giới hạn MLE nhanh hơn và không chuẩn; tiêu chuẩn dạng Poisson khi sai mô hình có phương sai sandwich do moment dữ liệu thật quyết định.'],
    '$L(\\theta)=\\theta^{-n}\\mathbf1_{\\{\\theta\\ge Y_{(n)}\\}},\\quad \\hat\\theta=Y_{(n)},\\quad P\\!\\left(n(\\theta-\\hat\\theta)/\\theta>z\\right)=(1-z/n)^n\\to e^{-z}\\ (0\\le z\\le n),\\quad \\ell_q(\\eta)=\\sum_i(Y_i\\eta-e^\\eta),\\quad \\hat\\eta=\\log\\bar Y\\ (\\bar Y>0),\\quad \\sqrt n(\\hat\\eta-\\log\\mu)\\Rightarrow N(0,\\sigma^2/\\mu^2)$',
    [
      ['For Uniform(0,θ), the likelihood is θ⁻ⁿ times the indicator θ≥Y_(n), so the MLE is the sample maximum. Compute the error CDF directly to obtain an Exp(1) limit after multiplying by n.', 'Với Uniform(0,θ), hợp lý là θ⁻ⁿ nhân chỉ báo θ≥Y_(n), nên MLE là maximum mẫu. Tính trực tiếp CDF sai số để được giới hạn Exp(1) sau khi nhân n.'],
      ['The support depends on θ, invalidating the usual score differentiation argument; the error order is 1/n, so a root-n Fisher interval is inappropriate.', 'Miền hỗ trợ phụ thuộc θ, làm mất lập luận vi phân score thông thường; sai số cỡ 1/n nên khoảng Fisher căn-n không phù hợp.'],
      ['Maximize the concave criterion at log Ȳ when Ȳ>0; LLN and the delta method give consistency and variance σ²/μ². The Poisson information gives 1/μ only when the true variance equals μ.', 'Cực đại tiêu chuẩn lõm tại log Ȳ khi Ȳ>0; LLN và delta method cho tính nhất quán cùng phương sai σ²/μ². Thông tin Poisson cho 1/μ chỉ khi phương sai thật bằng μ.'],
    ],
  ),
  'm2-w101-e3': L(
    ['Online regret compares sequential decisions to a fixed comparator on the observed path; an IID ERM guarantee is a separate sampling statement.', 'Regret trực tuyến so sánh quyết định tuần tự với đối chứng cố định trên đường quan sát; bảo đảm ERM IID là phát biểu lấy mẫu riêng.'],
    '$\\operatorname{Regret}_T(u)\\le\\frac{D^2}{2\\eta}+\\frac{\\eta G^2T}{2},\\quad \\eta=\\frac{D}{G\\sqrt T}\\Rightarrow DG\\sqrt T,\\quad R(\\hat h)-R(h^*)\\le2\\sqrt{\\frac{\\log(2N/\\delta)}{2n}}$',
    [
      ['Use nonexpansiveness of projection to compare the next iterate with any fixed u∈K, then rearrange to bound each loss regret by a difference of squared distances plus ηG²/2.', 'Dùng tính co không giãn của phép chiếu để so iterate sau với u∈K cố định, rồi sắp xếp lại để chặn regret từng vòng bằng hiệu khoảng cách bình phương cộng ηG²/2.'],
      ['Sum over t so distances telescope; substitute η=D/(G√T) to get DG√T, assuming D,G>0 and handling zero cases separately.', 'Cộng theo t để khoảng cách triệt tiêu; thế η=D/(G√T) được DG√T, với D,G>0 và xử lý riêng trường hợp bằng 0.'],
      ['For N fixed hypotheses, apply Hoeffding to each IID [0,1] loss estimate and union-bound the deviations; ERM then has excess risk at most twice the uniform deviation. This premise does not hold automatically for financial time series.', 'Với N giả thuyết cố định, áp Hoeffding cho từng ước lượng loss IID [0,1] rồi dùng cận hợp; ERM có excess risk không quá hai lần độ lệch đều. Giả thiết này không tự đúng cho chuỗi thời gian tài chính.'],
    ],
  ),
  'm2-w101-e4': L(
    ['A Rauch–Tung–Striebel smoother conditions a prior state on the next filtered state; a shared latent component in a stationary series can still prevent estimation consistency.', 'Bộ làm trơn Rauch–Tung–Striebel điều kiện trạng thái prior theo trạng thái đã lọc kế tiếp; thành phần ẩn chung trong chuỗi dừng vẫn có thể ngăn tính nhất quán.'],
    '$J=PA^T(P^-)^{-1},\\quad E[x_t\\mid x_{t+1},\\mathcal F_t]=m+J(x_{t+1}-Am),\\quad m_{t\\mid T}=m+J(m_{t+1\\mid T}-Am),\\quad P_{t\\mid T}=P+J(P_{t+1\\mid T}-P^-)J^T,\\quad D_t=Z+\\epsilon_t\\Rightarrow\\bar D_n\\to Z$',
    [
      ['Compute Cov(x_t,x_(t+1)|F_t)=PAᵀ and Var(x_(t+1)|F_t)=P⁻; Gaussian conditioning gives gain J and the backward conditional mean.', 'Tính Cov(x_t,x_(t+1)|F_t)=PAᵀ và Var(x_(t+1)|F_t)=P⁻; điều kiện hóa Gaussian cho gain J và trung bình có điều kiện lùi.'],
      ['Apply the Markov conditional-independence assumption and tower expectation to replace x_(t+1) by its smoothed conditional mean; use total covariance for the RTS covariance recursion.', 'Dùng giả thiết độc lập có điều kiện Markov và tower expectation để thay x_(t+1) bằng trung bình làm trơn có điều kiện; dùng covariance toàn phần cho truy hồi covariance RTS.'],
      ['The common Z makes D stationary but its average converges to Z, not zero when Var(Z)>0. Covariances do not decay, so stationarity alone lacks the mixing/summability premise needed for a stationary CLT.', 'Z chung làm D dừng nhưng trung bình hội tụ đến Z, không phải 0 khi Var(Z)>0. Covariance không suy giảm, nên tính dừng đơn thuần thiếu giả thiết trộn/tổng khả cộng cần cho CLT dừng.'],
    ],
  ),
  'm2-w101-e5': L(
    ['Projection onto a closed convex set is the unique nearest feasible point; its variational inequality makes it no farther from any feasible comparator than the original input.', 'Phép chiếu lên tập đóng lồi là điểm khả thi gần nhất duy nhất; bất đẳng thức biến phân khiến nó không xa comparator khả thi nào hơn điểm vào ban đầu.'],
    '$p=\\Pi_K(z),\\quad \\langle z-p,u-p\\rangle\\le0\\ (u\\in K),\\quad \\|p-u\\|^2\\le\\|z-u\\|^2$',
    [
      ['Choose any point in nonempty K; points sufficiently far from z cannot minimize distance. A closed bounded restriction is compact, so continuity gives a nearest point.', 'Chọn điểm bất kỳ trong K; điểm đủ xa z không thể tối thiểu khoảng cách. Giao đóng bị chặn là compact nên tính liên tục cho điểm gần nhất.'],
      ['If two minimizers existed, their midpoint is feasible and strict convexity of squared distance would make it strictly closer; hence the minimizer is unique.', 'Nếu có hai nghiệm cực tiểu, trung điểm khả thi và tính lồi nghiêm của bình phương khoảng cách khiến nó gần hơn nghiêm ngặt; vậy nghiệm duy nhất.'],
      ['Move from p a short distance toward any u∈K and differentiate squared distance at the endpoint to get the variational inequality. Expand ||z−u||² to obtain the stated bound; K={−1,1}, z=0 shows nonconvex uniqueness failure.', 'Đi từ p một đoạn ngắn về u∈K rồi lấy đạo hàm bình phương khoảng cách tại đầu mút để có bất đẳng thức biến phân. Khai triển ||z−u||² được cận đã nêu; K={−1,1}, z=0 cho thấy thất bại duy nhất khi không lồi.'],
    ],
  ),
  'm2-w102-e1': L(
    ['The Joseph form writes posterior covariance as a sum of propagated prior and observation-noise contributions, preserving positive semidefiniteness under any gain.', 'Dạng Joseph viết covariance hậu nghiệm thành tổng đóng góp từ prior và nhiễu quan sát, bảo toàn bán xác định dương với mọi gain.'],
    '$S=HPH^T+R,\\quad K=PH^TS^{-1},\\quad (I-KH)P(I-KH)^T+KRK^T=P-KSK^T$',
    [
      ['Expand the left side into P, two cross terms, and K(HPHᵀ+R)Kᵀ.', 'Khai triển vế trái thành P, hai số hạng chéo và K(HPHᵀ+R)Kᵀ.'],
      ['For the optimal gain, KS=PHᵀ and SKᵀ=HP; substitute these identities to combine the cross and quadratic terms into −KSKᵀ.', 'Với gain tối ưu, KS=PHᵀ và SKᵀ=HP; thay các đồng nhất thức này để gộp số hạng chéo và bậc hai thành −KSKᵀ.'],
      ['For arbitrary K, test the Joseph form on z: it is the sum of two squared norms using P¹ᐟ² and R¹ᐟ². This avoids cancellation numerically but cannot repair a wrong model or floating-point errors entirely.', 'Với K bất kỳ, thử dạng Joseph trên z: đó là tổng hai bình phương chuẩn dùng P¹ᐟ² và R¹ᐟ². Dạng này tránh triệt tiêu số học nhưng không thể sửa mô hình sai hay loại hết sai số dấu phẩy động.'],
    ],
  ),
  'm2-w102-e2': L(
    ['A correctly specified conditional Gaussian forecast makes each standardized innovation have the same fixed law independent of the entire past; plug-in estimation changes the claim.', 'Dự báo Gaussian có điều kiện đặc tả đúng làm mỗi innovation chuẩn hóa có cùng luật cố định và độc lập với toàn bộ quá khứ; ước lượng plug-in làm đổi kết luận.'],
    '$Y_t\\mid\\mathcal F_{t-1}\\sim N(m_t,S_t),\\quad Z_t=(Y_t-m_t)/\\sqrt{S_t},\\quad P(Z_t\\in B\\mid\\mathcal F_{t-1})=\\Phi(B),\\quad Z_t\\overset{iid}{\\sim}N(0,1)$',
    [
      ['Conditionally transform Y_t by its past-measurable mean and positive scale; the conditional law of Z_t is standard normal for every past realization.', 'Biến đổi Y_t có điều kiện bằng trung bình đo được theo quá khứ và tỷ lệ dương; luật có điều kiện của Z_t là chuẩn tắc với mọi lịch sử.'],
      ['A conditional probability that is the constant Φ(B) implies independence from every event in F_(t−1). Earlier Z values are past-measurable, so iterating the factorization gives IID standard normals.', 'Xác suất có điều kiện hằng Φ(B) suy ra độc lập với mọi biến cố trong F_(t−1). Các Z trước đo được theo quá khứ, nên lặp phép phân tích cho các chuẩn tắc IID.'],
      ['Estimated parameters may be past-only yet differ from true conditional moments; parameter uncertainty and adaptation can leave residual dependence or nonnormal tails. Do not claim exact IID without a predictive model that includes fitting uncertainty.', 'Tham số ước lượng có thể chỉ dùng quá khứ nhưng khác moment có điều kiện thật; bất định tham số và thích nghi có thể để lại phụ thuộc hoặc đuôi không chuẩn. Không khẳng định IID chính xác nếu mô hình dự báo chưa bao gồm bất định ước lượng.'],
    ],
  ),
  'm2-w102-e3': L(
    ['An incorrect observation-noise variance changes the gain and makes the reported posterior variance disagree with actual squared prediction error.', 'Phương sai nhiễu quan sát sai làm đổi gain và khiến phương sai hậu nghiệm báo cáo khác sai số dự đoán bình phương thực tế.'],
    '$\\operatorname{MSE}(k)=E[(x-ky)^2]=(1-k)^2+4k^2=1-2k+5k^2,\\quad k_{wrong}=1/2:\\ \\operatorname{MSE}=5/4,\\quad k^*=1/5:\\ \\operatorname{MSE}=4/5$',
    [
      ['Write y=x+v with independent centered x and v; the estimation error is (1−k)x−kv, so cross expectation vanishes.', 'Viết y=x+v với x,v độc lập và tâm hóa; sai số ước lượng là (1−k)x−kv nên kỳ vọng tích chéo bằng 0.'],
      ['Use Var(x)=1 and Var(v)=4 to get (1−k)²+4k². At the assumed gain 1/2 this is 1/4+1=5/4, not the reported 1/2.', 'Dùng Var(x)=1 và Var(v)=4 để được (1−k)²+4k². Tại gain giả định 1/2, giá trị là 1/4+1=5/4, không phải 1/2 đã báo.'],
      ['Complete the square or differentiate the quadratic: its minimum is at k=1/5 with value 4/5. The excess actual MSE is 5/4−4/5=9/20.', 'Hoàn thành bình phương hoặc lấy đạo hàm quadratic: cực tiểu tại k=1/5 với giá trị 4/5. MSE thực tăng thêm là 5/4−4/5=9/20.'],
    ],
  ),
  'm2-w102-e4': L(
    ['Selecting the smaller of two noisy validation estimates creates optimism even when each estimate is unbiased; reusing the same final period compounds selection bias.', 'Chọn ước lượng validation nhiễu nhỏ hơn tạo lạc quan ngay cả khi từng ước lượng không chệch; dùng lại giai đoạn cuối làm tăng thiên lệch lựa chọn.'],
    '$\\min(a,b)=\\frac{a+b-|a-b|}{2},\\quad E[\\min(\\mu+Z_1,\\mu+Z_2)]=\\mu-\\frac12E|Z_1-Z_2|<\\mu$',
    [
      ['Use the pointwise identity for the minimum and substitute a=μ+Z₁,b=μ+Z₂.', 'Dùng đồng nhất thức điểm cho minimum rồi thay a=μ+Z₁,b=μ+Z₂.'],
      ['Take expectations; centered integrable noises remove the linear terms and leave −E|Z₁−Z₂|/2.', 'Lấy kỳ vọng; nhiễu khả tích có tâm triệt tiêu các số hạng tuyến tính, còn −E|Z₁−Z₂|/2.'],
      ['Because the noises are not identical almost surely, their absolute difference is positive with positive probability and has positive expectation. Freeze choices before untouched paired evaluation; if the period was already used for selection, call the result exploratory.', 'Vì nhiễu không đồng nhất hầu chắc chắn, hiệu tuyệt đối dương với xác suất dương và kỳ vọng dương. Cố định lựa chọn trước đánh giá ghép cặp chưa dùng; nếu giai đoạn đã dùng để chọn, gọi kết quả là khám phá.'],
    ],
  ),
  'm2-w102-e5': L(
    ['A capstone acceptance check should bind a proved identity, an exact numerical fixture, a counterexample, and a dependent target into one falsifiable mathematical specification.', 'Kiểm tra chấp nhận capstone nên nối một đồng nhất thức đã chứng minh, fixture số chính xác, phản ví dụ và mục tiêu phụ thuộc thành đặc tả toán học có thể bác bỏ.'],
    '$P^+=(I-KH)P(I-KH)^T+KRK^T=P-KSK^T,\\quad \\operatorname{MSE}(k)=1-2k+5k^2,\\quad D_t=Z+\\epsilon_t,\\quad \\mu_D=E[(Y-\\hat Y_{adapt})^2-(Y-\\hat Y_{fixed})^2]$',
    [
      ['State the Joseph identity with P⪰0, R≻0, S=HPHᵀ+R and optimal K; include the algebraic expansion as the proof artifact.', 'Nêu đồng nhất thức Joseph với P⪰0, R≻0, S=HPHᵀ+R và K tối ưu; kèm khai triển đại số làm bằng chứng chứng minh.'],
      ['For the scalar fixture P=1,R_true=4,H=1, compute optimal K=1/5 and MSE=4/5; a filter assuming R=1 uses K=1/2 and actual MSE=5/4. Assert each rational value exactly.', 'Với fixture vô hướng P=1,R_true=4,H=1, tính K tối ưu=1/5 và MSE=4/5; bộ lọc giả sử R=1 dùng K=1/2 và MSE thật=5/4. Khẳng định chính xác từng giá trị hữu tỷ.'],
      ['Use shared latent Z in D_t=Z+ε_t to refute a stationarity-only consistency claim. Define μ_D and preserve cross-time covariance in uncertainty; a break or selection event needs its own declared target and assumptions.', 'Dùng biến ẩn chung Z trong D_t=Z+ε_t để bác bỏ khẳng định nhất quán chỉ dựa vào tính dừng. Định nghĩa μ_D và giữ covariance qua thời gian trong bất định; điểm gãy hoặc chọn mô hình cần mục tiêu cùng giả thiết riêng.'],
    ],
  ),
};

const reconstructions = assessmentAuthor.weeks.flatMap((week) =>
  week.exercises.filter((exercise) => exercise.practiceOrigin).map((exercise) => ({
    id: exercise.id,
    origin: exercise.practiceOrigin!,
  })),
);
for (const { id, origin } of reconstructions) {
  const source = lessons[origin];
  if (!source) throw new Error('Assessment teaching origin has no authored entry: ' + id + ' -> ' + origin);
  lessons[id] = source;
}

const canonicalIds = assessmentAuthor.weeks.flatMap((week) => week.exercises.map((exercise) => exercise.id));
const missing = canonicalIds.filter((id) => !(id in lessons));
const extra = Object.keys(lessons).filter((id) => !canonicalIds.includes(id));
if (missing.length || extra.length || canonicalIds.length !== Object.keys(lessons).length) {
  throw new Error('Assessment teaching coverage mismatch: missing=' + missing.join(',') + '; extra=' + extra.join(',') + '; exercises=' + canonicalIds.length + '; lessons=' + Object.keys(lessons).length);
}

export default lessons;
