import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const sourceFiles = [
  'lessons-01-35.json',
  'lessons-36-70.json',
  'lessons-71-86.json',
  'lessons-87-93.json',
  'lessons-94-99.json',
  'lessons-100-105.json',
];

const numericChecks = {
  '1-0-w01-d1-gradient': [
    { id: 'derivative-at-one', question: { en: "What is f′(1)?", vi: 'Giá trị f′(1) bằng bao nhiêu?' }, expected: -9, target: { en: '−9', vi: '−9' }, absoluteTolerance: 1e-9 },
    { id: 'forward-difference', question: { en: 'What forward-difference estimate does h = 0.01 produce?', vi: 'Sai phân tiến với h = 0,01 cho ước lượng nào?' }, expected: -8.955, target: { en: '−8.955', vi: '−8.955' }, absoluteTolerance: 1e-9 },
    { id: 'absolute-error', question: { en: 'What is the absolute error of that estimate?', vi: 'Sai số tuyệt đối của ước lượng đó là bao nhiêu?' }, expected: 0.045, target: { en: '0.045', vi: '0,045' }, absoluteTolerance: 1e-9 },
  ],
  '1-1-w01-d2-rank': [
    { id: 'slope', question: { en: 'What is the fitted slope before duplicating x?', vi: 'Hệ số góc của đường hồi quy trước khi lặp cột x là bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 1e-12 },
    { id: 'intercept', question: { en: 'What is the fitted intercept?', vi: 'Hệ số chặn bằng bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 1e-12 },
  ],
  '1-2-w01-d3-bayes': [
    { id: 'true-positives', question: { en: 'How many expected true positives are there?', vi: 'Số ca dương tính thật kỳ vọng là bao nhiêu?' }, expected: 18, target: { en: '18', vi: '18' }, absoluteTolerance: 1e-12 },
    { id: 'false-positives', question: { en: 'How many expected false positives are there?', vi: 'Số ca dương tính giả kỳ vọng là bao nhiêu?' }, expected: 49, target: { en: '49', vi: '49' }, absoluteTolerance: 1e-12 },
    { id: 'posterior', question: { en: 'What is P(condition | positive)? Enter a decimal or 18/67.', vi: 'P(có bệnh | dương tính) bằng bao nhiêu? Nhập số thập phân hoặc 18/67.' }, expected: 18 / 67, target: { en: '18/67 ≈ 0.2687', vi: '18/67 ≈ 0,2687' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '2-1-w02d2': [
    { id: 'residual-norm-squared', question: { en: 'What is the squared residual norm?', vi: 'Bình phương chuẩn của phần dư bằng bao nhiêu?' }, expected: 6, target: { en: '6', vi: '6' }, absoluteTolerance: 1e-12 },
  ],
  '2-2-w02d3': [
    { id: 'union-probability', question: { en: 'What is P(A ∪ B)? Enter 7/12 or a decimal.', vi: 'P(A ∪ B) bằng bao nhiêu? Nhập 7/12 hoặc số thập phân.' }, expected: 7 / 12, target: { en: '7/12 ≈ 0.5833', vi: '7/12 ≈ 0,5833' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '2-3-w02d4': [
    { id: 'success-probability', question: { en: 'What is the total success probability?', vi: 'Tổng xác suất thành công là bao nhiêu?' }, expected: 0.38, target: { en: '0.38', vi: '0,38' }, absoluteTolerance: 1e-12 },
  ],
  '2-4-w02d5': [
    { id: 'even-probability', question: { en: 'What is P(even)? Enter 4/7 or a decimal.', vi: 'P(ra số chẵn) bằng bao nhiêu? Nhập 4/7 hoặc số thập phân.' }, expected: 4 / 7, target: { en: '4/7 ≈ 0.5714', vi: '4/7 ≈ 0,5714' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
    { id: 'standard-error', question: { en: 'What is the standard error for N = 600?', vi: 'Sai số chuẩn với N = 600 là bao nhiêu?' }, expected: Math.sqrt(12 / 29400), target: { en: '≈ 0.02020', vi: '≈ 0,02020' }, absoluteTolerance: 0.00005, relativeTolerance: 0 },
  ],
  '14-4-w14d5': [
    { id: 'compounded-return', question: { en: 'What is the two-period compounded asset return?', vi: 'Lợi suất tài sản gộp qua hai kỳ là bao nhiêu?' }, expected: -0.0025, target: { en: '−0.0025 (−0.25%)', vi: '−0,0025 (−0,25%)' }, absoluteTolerance: 1e-8 },
  ],
  '14-1-w14d2': [
    { id: 'five-day-risk-free-return', question: { en: 'What is the 5-day risk-free return at a 4% effective annual rate over 252 periods?', vi: 'Lợi suất phi rủi ro 5 ngày là bao nhiêu với lãi suất hiệu dụng năm 4% qua 252 kỳ?' }, expected: 0.0007784916204665038, target: { en: '≈ 0.000778492 (0.0778492%)', vi: '≈ 0,000778492 (0,0778492%)' }, absoluteTolerance: 1e-8, relativeTolerance: 0 },
    { id: 'simple-excess-return', question: { en: 'What is the simple excess return over the 5-day period?', vi: 'Lợi suất vượt trội đơn trong 5 ngày bằng bao nhiêu?' }, expected: 0.005221508379533496, target: { en: '≈ 0.005221508 (0.5221508%)', vi: '≈ 0,005221508 (0,5221508%)' }, absoluteTolerance: 1e-8, relativeTolerance: 0 },
  ],
  '20-1-w20d2': [
    { id: 'hc0-variance', question: { en: 'What is the HC0 slope variance?', vi: 'Phương sai hệ số góc HC0 bằng bao nhiêu?' }, expected: 0.1, target: { en: '0.10', vi: '0,10' }, absoluteTolerance: 1e-12 },
    { id: 'classical-variance', question: { en: 'What is the homoskedastic slope variance?', vi: 'Phương sai hệ số góc đồng phương sai bằng bao nhiêu?' }, expected: 0.2, target: { en: '0.20', vi: '0,20' }, absoluteTolerance: 1e-12 },
  ],
  '37-0-w37d1': [
    { id: 'constrained-optimum', question: { en: 'What is the constrained minimizer x*?', vi: 'Nghiệm cực tiểu có ràng buộc x* là bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 1e-12 },
    { id: 'kkt-multiplier', question: { en: 'What KKT multiplier λ satisfies stationarity?', vi: 'Nhân tử KKT λ nào thỏa mãn điều kiện dừng?' }, expected: 4, target: { en: '4', vi: '4' }, absoluteTolerance: 1e-12 },
  ],
  '37-4-w37d5': [
    { id: 'dual-violation', question: { en: 'What is the dual-feasibility violation max(0, −λ)?', vi: 'Mức vi phạm khả thi đối ngẫu max(0, −λ) bằng bao nhiêu?' }, expected: 0.000003, target: { en: '3 × 10⁻⁶', vi: '3 × 10⁻⁶' }, absoluteTolerance: 1e-10 },
  ],
  '69-4-w69d5': [
    { id: 'lasso-small-penalty', question: { en: 'What is the minimizer for λ = 0.5?', vi: 'Nghiệm cực tiểu khi λ = 0,5 là bao nhiêu?' }, expected: 2.5, target: { en: '2.5', vi: '2,5' }, absoluteTolerance: 1e-12 },
    { id: 'lasso-large-penalty', question: { en: 'What is the minimizer for λ = 4?', vi: 'Nghiệm cực tiểu khi λ = 4 là bao nhiêu?' }, expected: 0, target: { en: '0', vi: '0' }, absoluteTolerance: 1e-12 },
  ],
  '103-0-w103d1': [
    { id: 'success-probability', question: { en: 'What is P(S)?', vi: 'P(S) bằng bao nhiêu?' }, expected: 0.24, target: { en: '0.24', vi: '0,24' }, absoluteTolerance: 1e-12 },
    { id: 'posterior', question: { en: 'What is P(H | S)? Enter 2/3 or a decimal.', vi: 'P(H | S) bằng bao nhiêu? Nhập 2/3 hoặc số thập phân.' }, expected: 2 / 3, target: { en: '2/3 ≈ 0.6667', vi: '2/3 ≈ 0,6667' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '103-2-w103d3': [
    { id: 'optimum', question: { en: 'What is x*?', vi: 'x* bằng bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 1e-12 },
    { id: 'objective', question: { en: 'What is the objective value at x*?', vi: 'Giá trị hàm mục tiêu tại x* bằng bao nhiêu?' }, expected: 9, target: { en: '9', vi: '9' }, absoluteTolerance: 1e-12 },
    { id: 'kkt-multiplier', question: { en: 'What is the KKT multiplier λ?', vi: 'Nhân tử KKT λ bằng bao nhiêu?' }, expected: 6, target: { en: '6', vi: '6' }, absoluteTolerance: 1e-12 },
  ],
  // Each entry below was selected from the exact prompt and its target recomputed by hand.
  '3-2-w03d3': [
    { id: 'condition-number', question: { en: 'What is κ₂(A) for A = diag(1, 0.02)?', vi: 'κ₂(A) bằng bao nhiêu với A = diag(1, 0,02)?' }, expected: 50, target: { en: '50', vi: '50' }, absoluteTolerance: 1e-12 },
  ],
  '4-0-w04d1': [
    { id: 'exact-change', question: { en: 'What is the exact change f(2.03, −0.98) − f(2, −1)?', vi: 'Độ biến thiên chính xác f(2,03, −0,98) − f(2, −1) bằng bao nhiêu?' }, expected: 0.079134, target: { en: '0.079134', vi: '0,079134' }, absoluteTolerance: 1e-9 },
  ],
  '5-2-w05d3': [
    { id: 'binomial-two', question: { en: 'What is P(S = 2) for S ~ Binomial(8, 0.3)?', vi: 'P(S = 2) với S ~ Binomial(8, 0,3) bằng bao nhiêu?' }, expected: 0.29647548, target: { en: '0.29647548', vi: '0,29647548' }, absoluteTolerance: 1e-8 },
  ],
  '6-2-w06d3': [
    { id: 'exponential-survival', question: { en: 'What is P(T > 4) when λ = 0.25 per day?', vi: 'P(T > 4) bằng bao nhiêu khi λ = 0,25 mỗi ngày?' }, expected: Math.exp(-1), target: { en: 'e⁻¹ ≈ 0.3679', vi: 'e⁻¹ ≈ 0,3679' }, absoluteTolerance: 0.00005, relativeTolerance: 0 },
  ],
  '7-1-w07d2': [
    { id: 'retained-energy', question: { en: 'What fraction of squared singular-value energy is retained by k = 2?', vi: 'Tỷ lệ năng lượng bình phương giá trị kỳ dị được giữ lại khi k = 2 là bao nhiêu?' }, expected: 80 / 81.25, target: { en: '80/81.25 ≈ 0.984615', vi: '80/81,25 ≈ 0,984615' }, absoluteTolerance: 0.00001, relativeTolerance: 0 },
  ],
  '8-4-w08d5': [
    { id: 'leading-axis-retained-fraction', question: { en: 'What fraction of total variance is retained by projection onto the leading principal axis?', vi: 'Chiếu lên trục thành phần chính lớn nhất giữ lại tỷ lệ phương sai tổng bằng bao nhiêu?' }, expected: 0.9, target: { en: '9/10 = 0.9 (90%)', vi: '9/10 = 0,9 (90%)' }, absoluteTolerance: 1e-12 },
    { id: 'discarded-variance', question: { en: 'What variance is discarded by that projection?', vi: 'Phép chiếu đó loại bỏ phương sai bằng bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 1e-12 },
  ],
  '8-2-w08d3': [
    { id: 'square-event-probability', question: { en: 'What is P(Y ≤ 1) when X is uniform on [−2, 2] and Y = X²?', vi: 'P(Y ≤ 1) bằng bao nhiêu khi X phân bố đều trên [−2, 2] và Y = X²?' }, expected: 0.5, target: { en: '1/2', vi: '1/2' }, absoluteTolerance: 1e-12 },
  ],
  '9-2-w09d3': [
    { id: 'epsilon-index', question: { en: 'What is the smallest integer N that guarantees (3/4)ⁿ < 0.01 for every n ≥ N?', vi: 'Số nguyên N nhỏ nhất bảo đảm (3/4)ⁿ < 0,01 với mọi n ≥ N là bao nhiêu?' }, expected: 17, target: { en: '17', vi: '17' }, absoluteTolerance: 0 },
  ],
  '10-0-w10d1': [
    { id: 'standard-error-n100', question: { en: 'What is SD(X̄) at n = 100 when σ = 5?', vi: 'SD(X̄) tại n = 100 bằng bao nhiêu khi σ = 5?' }, expected: 0.5, target: { en: '0.5', vi: '0,5' }, absoluteTolerance: 1e-12 },
  ],
  '11-4-w11d5': [
    { id: 'antithetic-average-variance', question: { en: 'What is the variance of the antithetic average using 1,000 independent pairs?', vi: 'Phương sai trung bình đối ngẫu với 1.000 cặp độc lập là bao nhiêu?' }, expected: 0.005556 / 1000, target: { en: '≈ 0.000005556', vi: '≈ 0,000005556' }, absoluteTolerance: 1e-8, relativeTolerance: 0 },
  ],
  '12-4-w12d5': [
    { id: 'seeded-monte-carlo-estimate', question: { en: 'What estimate does the stated PCG64 experiment produce for ∫₀¹x²dx?', vi: 'Thí nghiệm PCG64 được nêu cho ước lượng nào của ∫₀¹x²dx?' }, expected: 0.3316900016029092, target: { en: '0.3316900016029092', vi: '0,3316900016029092' }, absoluteTolerance: 1e-12, relativeTolerance: 0 },
    { id: 'seeded-monte-carlo-error', question: { en: 'What is the absolute error from the exact value 1/3?', vi: 'Sai số tuyệt đối so với giá trị chính xác 1/3 bằng bao nhiêu?' }, expected: 0.0016433317304241357, target: { en: '0.0016433317304241357', vi: '0,0016433317304241357' }, absoluteTolerance: 1e-12, relativeTolerance: 0 },
    { id: 'seeded-monte-carlo-standard-error', question: { en: 'What sample standard error is reported for this estimate?', vi: 'Sai số chuẩn mẫu được báo cáo cho ước lượng này bằng bao nhiêu?' }, expected: 0.0009408689208152271, target: { en: '0.0009408689208152271', vi: '0,0009408689208152271' }, absoluteTolerance: 1e-12, relativeTolerance: 0 },
  ],
  '12-1-w12d2': [
    { id: 'stable-expression-value', question: { en: 'What is the stable expression’s value at x = 10⁶ to three significant digits?', vi: 'Giá trị biểu thức ổn định tại x = 10⁶ với ba chữ số có nghĩa là bao nhiêu?' }, expected: 4.5e-6, target: { en: '4.50 × 10⁻⁶', vi: '4,50 × 10⁻⁶' }, absoluteTolerance: 1e-8, relativeTolerance: 0 },
  ],
  '13-1-w13d2': [
    { id: 'normal-interval-lower', question: { en: 'What is the lower endpoint of the approximate 95% interval?', vi: 'Cận dưới của khoảng tin cậy xấp xỉ 95% là bao nhiêu?' }, expected: 0.432, target: { en: '0.432', vi: '0,432' }, absoluteTolerance: 0.001, relativeTolerance: 0 },
  ],
  '15-1-w15d2': [
    { id: 'regression-slope', question: { en: 'What is the fitted slope β?', vi: 'Hệ số góc hồi quy β bằng bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 1e-12 },
  ],
  '15-2-w15d3': [
    { id: 'mechanical-pair-count', question: { en: 'How many mechanical one-month-ahead feature-target pairs can be formed from the supplied Jan–May data?', vi: 'Có thể tạo bao nhiêu cặp đặc trưng-mục tiêu dịch trước một tháng từ dữ liệu tháng 1–5 đã cho?' }, expected: 4, target: { en: '4 pairs', vi: '4 cặp' }, absoluteTolerance: 0 },
  ],
  '16-4-w16d5': [
    { id: 'estimator-b-mse', question: { en: 'What is estimator B’s MSE?', vi: 'MSE của ước lượng B bằng bao nhiêu?' }, expected: 1.16, target: { en: '1.16', vi: '1,16' }, absoluteTolerance: 1e-12 },
  ],
  '16-0-w16d1': [
    { id: 'estimator-mean', question: { en: 'What is the estimator mean?', vi: 'Kỳ vọng của ước lượng bằng bao nhiêu?' }, expected: 10.5, target: { en: '10.5', vi: '10,5' }, absoluteTolerance: 1e-12 },
    { id: 'estimator-variance', question: { en: 'What is the variance around the estimator mean?', vi: 'Phương sai quanh kỳ vọng của ước lượng bằng bao nhiêu?' }, expected: 4.75, target: { en: '4.75', vi: '4,75' }, absoluteTolerance: 1e-12 },
    { id: 'exact-estimation-probability', question: { en: 'What is the probability of estimating θ exactly?', vi: 'Xác suất ước lượng θ chính xác bằng bao nhiêu?' }, expected: 0.5, target: { en: '0.5', vi: '0,5' }, absoluteTolerance: 1e-12 },
  ],
  '17-0-w17d1': [
    { id: 'sample-size', question: { en: 'What is the smallest integer sample size that attains half-width at most 0.3?', vi: 'Cỡ mẫu nguyên nhỏ nhất để nửa độ rộng không quá 0,3 là bao nhiêu?' }, expected: 385, target: { en: '385', vi: '385' }, absoluteTolerance: 0 },
  ],
  '18-4-w18d5': [
    { id: 'familywise-error', question: { en: 'Under 40 independent null tests at α = 0.05, what is the chance of at least one false positive?', vi: 'Với 40 phép kiểm định độc lập dưới các giả thuyết không, xác suất có ít nhất một dương tính giả là bao nhiêu?' }, expected: 0.8714878434, target: { en: '≈ 0.8715', vi: '≈ 0,8715' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '19-0-w19d1': [
    { id: 'bootstrap-variance', question: { en: 'What is the exact variance of the bootstrap sample mean?', vi: 'Phương sai chính xác của trung bình mẫu bootstrap bằng bao nhiêu?' }, expected: 2 / 27, target: { en: '2/27 ≈ 0.07407', vi: '2/27 ≈ 0,07407' }, absoluteTolerance: 0.00001, relativeTolerance: 0 },
  ],
  '21-0-w21d1': [
    { id: 'ridge-first-coefficient', question: { en: 'What is the first ridge coefficient?', vi: 'Hệ số ridge thứ nhất bằng bao nhiêu?' }, expected: 1.2, target: { en: '1.2', vi: '1,2' }, absoluteTolerance: 1e-12 },
  ],
  '22-4-w22d5': [
    { id: 'deployment-weighted-b', question: { en: 'What is method B’s score when post-change observations receive 80% weight?', vi: 'Điểm của phương pháp B khi giai đoạn sau thay đổi chiếm 80% trọng số là bao nhiêu?' }, expected: 0.96, target: { en: '0.96', vi: '0,96' }, absoluteTolerance: 1e-12 },
  ],
  '22-2-w22d3': [
    { id: 'persistence-mae', question: { en: 'What is the one-step persistence MAE for y = (5, 6, 4, 4, 7), using targets y₂ through y₅?', vi: 'MAE dự báo persistence một bước là bao nhiêu với y = (5, 6, 4, 4, 7), dùng các mục tiêu y₂ đến y₅?' }, expected: 1.5, target: { en: '1.5', vi: '1,5' }, absoluteTolerance: 1e-12 },
  ],
  '23-4-w23d5': [
    { id: 'signal-rank-spread', question: { en: 'What is the top-minus-bottom return spread by signal rank?', vi: 'Chênh lệch lợi suất nhóm hạng tín hiệu cao trừ nhóm thấp bằng bao nhiêu?' }, expected: 0.03, target: { en: '0.03 (3 percentage points)', vi: '0,03 (3 điểm phần trăm)' }, absoluteTolerance: 1e-12 },
  ],
  '24-2-w24d3': [
    { id: 'hac-lower-endpoint', question: { en: 'What is the lower endpoint of the HAC(3) normal 95% interval, in percentage points?', vi: 'Cận dưới khoảng tin cậy chuẩn 95% HAC(3), tính theo điểm phần trăm, là bao nhiêu?' }, expected: -0.0528, target: { en: '≈ −0.053%', vi: '≈ −0,053%' }, absoluteTolerance: 0.0005, relativeTolerance: 0 },
  ],
  '26-1-w26d2': [
    { id: 'regression-slope', question: { en: 'What is the OLS slope?', vi: 'Hệ số góc OLS bằng bao nhiêu?' }, expected: 1.8, target: { en: '1.8', vi: '1,8' }, absoluteTolerance: 1e-12 },
  ],
  '27-0-w27d1': [
    { id: 'safe-training-origin-count', question: { en: 'How many origins have fully observed labels by cutoff t = 8?', vi: 'Có bao nhiêu thời điểm gốc đã có nhãn quan sát đầy đủ tại mốc t = 8?' }, expected: 5, target: { en: '5 (origins 1–5)', vi: '5 (các gốc 1–5)' }, absoluteTolerance: 0 },
  ],
  '28-0-w28d1': [
    { id: 'second-simple-return', question: { en: 'What is the simple return from price 51 to 49.98?', vi: 'Lợi suất đơn từ giá 51 xuống 49,98 bằng bao nhiêu?' }, expected: -0.02, target: { en: '−0.02 (−2%)', vi: '−0,02 (−2%)' }, absoluteTolerance: 1e-12 },
  ],
  '29-4-w29d5': [
    { id: 'mean-paired-improvement', question: { en: 'What is the mean baseline-minus-model improvement?', vi: 'Mức cải thiện trung bình (tổn thất cơ sở trừ mô hình) bằng bao nhiêu?' }, expected: 0.006, target: { en: '0.006', vi: '0,006' }, absoluteTolerance: 1e-12 },
  ],
  '30-0-w30d1': [
    { id: 'lag-zero-covariance', question: { en: 'What is γ̂(0) using denominator n?', vi: 'γ̂(0) bằng bao nhiêu khi mẫu số là n?' }, expected: 0.5, target: { en: '0.5', vi: '0,5' }, absoluteTolerance: 1e-12 },
  ],
  '31-2-w31d3': [
    { id: 'horizon-two-forecast', question: { en: 'What is the conditional mean forecast at horizon 2?', vi: 'Dự báo trung bình có điều kiện tại chân trời 2 bằng bao nhiêu?' }, expected: 2.44, target: { en: '2.44', vi: '2,44' }, absoluteTolerance: 0.001, relativeTolerance: 0 },
  ],
  '32-2-w32d3': [
    { id: 'second-variance-update', question: { en: 'What is v₂ after the second return?', vi: 'v₂ sau lợi suất thứ hai bằng bao nhiêu?' }, expected: 0.0011, target: { en: '0.0011', vi: '0,0011' }, absoluteTolerance: 1e-10 },
  ],
  '33-1-w33d2': [
    { id: 'updated-mean', question: { en: 'What is the updated state mean?', vi: 'Trung bình trạng thái sau cập nhật bằng bao nhiêu?' }, expected: 20 + (2 / 3) * 4, target: { en: '22⅔ ≈ 22.667', vi: '22⅔ ≈ 22,667' }, absoluteTolerance: 0.001, relativeTolerance: 0 },
  ],
  '34-0-w34d1': [
    { id: 'posterior-variance', question: { en: 'What is the posterior variance?', vi: 'Phương sai hậu nghiệm bằng bao nhiêu?' }, expected: 2.25, target: { en: '2.25', vi: '2,25' }, absoluteTolerance: 1e-12 },
  ],
  '35-0-w35d1': [
    { id: 'largest-standardized-magnitude', question: { en: 'What is the largest absolute standardized error among the three rows?', vi: 'Trị tuyệt đối sai số chuẩn hóa lớn nhất trong ba dòng là bao nhiêu?' }, expected: 2, target: { en: '2 (a tie)', vi: '2 (đồng hạng)' }, absoluteTolerance: 1e-12 },
  ],
  '36-3-w36d4': [
    { id: 'weighted-portfolio-variance', question: { en: 'What is the portfolio variance at weights (0.75, 0.25)?', vi: 'Phương sai danh mục tại trọng số (0,75; 0,25) bằng bao nhiêu?' }, expected: 1.125, target: { en: '1.125', vi: '1,125' }, absoluteTolerance: 1e-12 },
  ],
  '38-2-w38d3': [
    { id: 'second-gradient-iterate', question: { en: 'What is x₂ after two gradient steps?', vi: 'x₂ sau hai bước gradient bằng bao nhiêu?' }, expected: 0.04, target: { en: '0.04', vi: '0,04' }, absoluteTolerance: 1e-12 },
  ],
  '39-2-w39d3': [
    { id: 'appended-window-mean', question: { en: 'What is the trailing width-2 mean at row 5 after appending 1000?', vi: 'Trung bình cửa sổ cuối độ rộng 2 tại dòng 5 sau khi thêm 1000 là bao nhiêu?' }, expected: 550, target: { en: '550', vi: '550' }, absoluteTolerance: 1e-12 },
  ],
  '40-3-w40d4': [
    { id: 'pooled-mae', question: { en: 'What is pooled MAE across both folds?', vi: 'MAE gộp trên cả hai fold bằng bao nhiêu?' }, expected: 3, target: { en: '3', vi: '3' }, absoluteTolerance: 1e-12 },
  ],
  '41-1-w41d2': [
    { id: 'eligible-row-count', question: { en: 'What is the maximum number of rows eligible to enter folds?', vi: 'Số dòng tối đa đủ điều kiện đưa vào các fold là bao nhiêu?' }, expected: 740, target: { en: '740', vi: '740' }, absoluteTolerance: 0 },
  ],
  '42-0-w42d1': [
    { id: 'first-leaf-prediction', question: { en: 'What prediction does the first leaf have after one update?', vi: 'Dự báo của lá thứ nhất sau một lần cập nhật là bao nhiêu?' }, expected: 2.5, target: { en: '2.5', vi: '2,5' }, absoluteTolerance: 1e-12 },
  ],
  '43-0-w43d1': [
    { id: 'mean-interval-width', question: { en: 'What is the mean interval width?', vi: 'Độ rộng khoảng dự báo trung bình bằng bao nhiêu?' }, expected: 2.5, target: { en: '2.5', vi: '2,5' }, absoluteTolerance: 1e-12 },
  ],
  '44-3-w44d4': [
    { id: 'familywise-alarm-probability', question: { en: 'Under 20 independent looks, what is the chance of at least one false alarm?', vi: 'Với 20 lần xem độc lập, xác suất có ít nhất một báo động giả là bao nhiêu?' }, expected: 1 - 0.95 ** 20, target: { en: '≈ 0.6415', vi: '≈ 0,6415' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '45-1-w45d2': [
    { id: 'updated-weight', question: { en: 'What is the next weight w⁺?', vi: 'Trọng số tiếp theo w⁺ bằng bao nhiêu?' }, expected: 0.3, target: { en: '0.3', vi: '0,3' }, absoluteTolerance: 1e-12 },
  ],
  '46-1-w46d2': [
    { id: 'transaction-cost', question: { en: 'What cost fraction results from 0.2 turnover at c = 2%?', vi: 'Chi phí tỷ lệ là bao nhiêu với turnover 0,2 và c = 2%?' }, expected: 0.004, target: { en: '0.004 (0.4%)', vi: '0,004 (0,4%)' }, absoluteTolerance: 1e-12 },
  ],
  '48-3-w48d4': [
    { id: 'claim-recall', question: { en: 'What is recall when 5 of 12 gold claims are missed?', vi: 'Recall bằng bao nhiêu khi bỏ sót 5 trong 12 mệnh đề chuẩn?' }, expected: 7 / 12, target: { en: '7/12 ≈ 0.5833', vi: '7/12 ≈ 0,5833' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '51-0-w51d1': [
    { id: 'automation-time-saved', question: { en: 'How many minutes are saved by halving load and report time?', vi: 'Tiết kiệm được bao nhiêu phút khi giảm một nửa thời gian tải và báo cáo?' }, expected: 21.5, target: { en: '21.5 minutes', vi: '21,5 phút' }, absoluteTolerance: 1e-12 },
  ],
  '52-1-w52d2': [
    { id: 'equal-series-model-mae', question: { en: 'What is the equal-series mean MAE for the model?', vi: 'MAE trung bình theo trọng số đều giữa các chuỗi của mô hình bằng bao nhiêu?' }, expected: 5, target: { en: '5', vi: '5' }, absoluteTolerance: 1e-12 },
  ],
  '53-2-w53d3': [
    { id: 'variance', question: { en: 'What is Var(X)?', vi: 'Var(X) bằng bao nhiêu?' }, expected: 1.56, target: { en: '1.56', vi: '1,56' }, absoluteTolerance: 1e-12 },
  ],
  '54-0-w54d1': [
    { id: 'spike-expectation', question: { en: 'What is E[Xₙ] for each n?', vi: 'E[Xₙ] bằng bao nhiêu với mọi n?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 1e-12 },
  ],
  '55-2-w55d3': [
    { id: 'mse-optimal-constant', question: { en: 'What constant forecast minimizes MSE?', vi: 'Dự báo hằng số nào tối thiểu hóa MSE?' }, expected: 4, target: { en: '4', vi: '4' }, absoluteTolerance: 1e-12 },
  ],
  '56-2-w56d3': [
    { id: 'l2-norm-at-100', question: { en: 'What is ||X₁₀₀||₂ under the Uniform[0, 1] setup?', vi: '||X₁₀₀||₂ bằng bao nhiêu trong thiết lập Uniform[0, 1]?' }, expected: 0.1, target: { en: '0.1', vi: '0,1' }, absoluteTolerance: 1e-12 },
  ],
  '57-1-w57d2': [
    { id: 'hoeffding-sample-size', question: { en: 'What smallest integer n makes the stated two-sided Hoeffding bound at most 0.05?', vi: 'Số nguyên n nhỏ nhất để cận Hoeffding hai phía không quá 0,05 là bao nhiêu?' }, expected: 185, target: { en: '185', vi: '185' }, absoluteTolerance: 0 },
  ],
  '58-2-w58d3': [
    { id: 'standard-error', question: { en: 'What is the standard error for n = 100 and s = 2?', vi: 'Sai số chuẩn với n = 100 và s = 2 bằng bao nhiêu?' }, expected: 0.2, target: { en: '0.2', vi: '0,2' }, absoluteTolerance: 1e-12 },
  ],
  '59-2-w59d3': [
    { id: 'fisher-information', question: { en: 'What is the Fisher information for n = 100 and p = 0.5?', vi: 'Thông tin Fisher với n = 100 và p = 0,5 bằng bao nhiêu?' }, expected: 400, target: { en: '400', vi: '400' }, absoluteTolerance: 0 },
  ],
  '60-0-w60d1': [
    { id: 'log-likelihood-mle', question: { en: 'What is the natural-log likelihood at p = 0.7?', vi: 'Log-likelihood tự nhiên tại p = 0,7 bằng bao nhiêu?' }, expected: 7 * Math.log(0.7) + 3 * Math.log(0.3), target: { en: '≈ −6.1086', vi: '≈ −6,1086' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '61-2-w61d3': [
    { id: 'inverse-information', question: { en: 'What is Iₙ⁻¹ for n = 50 and p = 0.2?', vi: 'Iₙ⁻¹ với n = 50 và p = 0,2 bằng bao nhiêu?' }, expected: 0.0032, target: { en: '0.0032', vi: '0,0032' }, absoluteTolerance: 1e-12 },
  ],
  '62-1-w62d2': [
    { id: 'delta-variance', question: { en: 'What is the delta-method variance?', vi: 'Phương sai theo phương pháp delta bằng bao nhiêu?' }, expected: 0.09375, target: { en: '0.09375', vi: '0,09375' }, absoluteTolerance: 1e-12 },
  ],
  '63-1-w63d2': [
    { id: 'likelihood-ratio-statistic', question: { en: 'What is the likelihood-ratio statistic D?', vi: 'Thống kê tỷ số hợp lý D bằng bao nhiêu?' }, expected: 4, target: { en: '4', vi: '4' }, absoluteTolerance: 1e-12 },
  ],
  '64-0-w64d1': [
    { id: 'posterior-mean', question: { en: 'What is the posterior mean under Beta(9, 5)?', vi: 'Trung bình hậu nghiệm theo Beta(9, 5) bằng bao nhiêu?' }, expected: 9 / 14, target: { en: '9/14 ≈ 0.6429', vi: '9/14 ≈ 0,6429' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '65-4-w65d5': [
    { id: 'risk-gap', question: { en: 'What is the estimated population-risk minus training-risk gap?', vi: 'Chênh lệch rủi ro ước lượng ngoài tổng thể trừ rủi ro huấn luyện là bao nhiêu?' }, expected: 0.19, target: { en: '0.19', vi: '0,19' }, absoluteTolerance: 1e-12 },
  ],
  '66-0-w66d1': [
    { id: 'erm-risk', question: { en: 'What is the empirical risk of the ERM-selected model?', vi: 'Rủi ro thực nghiệm của mô hình ERM được chọn bằng bao nhiêu?' }, expected: 0.4, target: { en: '0.4', vi: '0,4' }, absoluteTolerance: 1e-12 },
  ],
  '67-0-w67d1': [
    { id: 'union-bound', question: { en: 'What union-bound upper limit applies to the chance that any of five models fails?', vi: 'Cận trên hợp của xác suất có mô hình nào trong năm mô hình thất bại là bao nhiêu?' }, expected: 0.1, target: { en: '0.10', vi: '0,10' }, absoluteTolerance: 1e-12 },
  ],
  '68-0-w68d1': [
    { id: 'empirical-cdf', question: { en: 'What is F̂ₙ(2) for [1, 2, 2, 4]?', vi: 'F̂ₙ(2) bằng bao nhiêu với mẫu [1, 2, 2, 4]?' }, expected: 0.75, target: { en: '3/4', vi: '3/4' }, absoluteTolerance: 1e-12 },
  ],
  '70-1-w70d2': [
    { id: 'large-batch-sd', question: { en: 'What is the SD of the batch-average noise for b = 16?', vi: 'Độ lệch chuẩn nhiễu trung bình theo batch với b = 16 bằng bao nhiêu?' }, expected: 0.25, target: { en: '0.25', vi: '0,25' }, absoluteTolerance: 1e-12 },
  ],
  '71-0-w71-d1-prequential': [
    { id: 'cumulative-loss', question: { en: 'What is the cumulative squared loss?', vi: 'Tổng tổn thất bình phương bằng bao nhiêu?' }, expected: 9, target: { en: '9', vi: '9' }, absoluteTolerance: 0 },
  ],
  '72-3-w72-d4-smooth': [
    { id: 'smoothed-d-probability', question: { en: 'Using the same transition matrix and signal likelihoods as the worked example, what is P(D₁ | y₁, y₂)?', vi: 'Dùng cùng ma trận chuyển tiếp và khả năng tín hiệu như ví dụ mẫu, P(D₁ | y₁, y₂) bằng bao nhiêu?' }, expected: 36.48 / 41.61, target: { en: '36.48/41.61 ≈ 0.8767', vi: '36,48/41,61 ≈ 0,8767' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '73-3-w73-d4-pilot': [
    { id: 'eligible-rows', question: { en: 'How many rows are eligible after excluding the missing targets?', vi: 'Có bao nhiêu dòng đủ điều kiện sau khi loại các nhãn bị thiếu?' }, expected: 18, target: { en: '18', vi: '18' }, absoluteTolerance: 0 },
  ],
  '74-2-w74-d3-metric': [
    { id: 'paired-mean-difference', question: { en: 'What is the paired mean method-minus-baseline loss difference?', vi: 'Chênh lệch tổn thất trung bình theo cặp (phương pháp trừ cơ sở) bằng bao nhiêu?' }, expected: 0, target: { en: '0 (tie)', vi: '0 (hòa)' }, absoluteTolerance: 0 },
  ],
  '75-1-w75-d2-vector': [
    { id: 'updated-first-weight', question: { en: 'What is the first component of the updated weight vector?', vi: 'Thành phần thứ nhất của vector trọng số đã cập nhật bằng bao nhiêu?' }, expected: 1.3, target: { en: '1.3', vi: '1,3' }, absoluteTolerance: 1e-12 },
  ],
  '76-0-w76-d1-walk': [
    { id: 'total-test-loss', question: { en: 'What is the total squared test loss?', vi: 'Tổng tổn thất kiểm tra bình phương bằng bao nhiêu?' }, expected: 20, target: { en: '20', vi: '20' }, absoluteTolerance: 0 },
  ],
  '77-4-77.5-—-factorial-interaction-qualifies-a-component-effect': [
    { id: 'factorial-interaction', question: { en: 'What is the A×B interaction effect?', vi: 'Hiệu ứng tương tác A×B bằng bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 0 },
  ],
  '78-3-78.4-—-cost-a-bounded-extension-before-coding': [
    { id: 'total-runtime', question: { en: 'What is the total estimated runtime in minutes?', vi: 'Tổng thời gian chạy ước tính bằng bao nhiêu phút?' }, expected: 210, target: { en: '210 minutes', vi: '210 phút' }, absoluteTolerance: 0 },
  ],
  '79-2-79.3-—-define-the-measurement-before-collecting-it': [
    { id: 'mean-squared-error', question: { en: 'What is the mean squared error?', vi: 'Sai số bình phương trung bình bằng bao nhiêu?' }, expected: 3, target: { en: '3', vi: '3' }, absoluteTolerance: 1e-12 },
  ],
  '80-4-80.5-—-validate-generator-moments-and-factorial-cells': [
    { id: 'population-variance', question: { en: 'What is the population variance of these four errors?', vi: 'Phương sai tổng thể của bốn sai số này bằng bao nhiêu?' }, expected: 2, target: { en: '2', vi: '2' }, absoluteTolerance: 1e-12 },
  ],
  '81-3-81.4-—-paired-comparisons-remove-shared-difficulty': [
    { id: 'paired-mean', question: { en: 'What is mean D for D = A − B?', vi: 'Trung bình D bằng bao nhiêu với D = A − B?' }, expected: -1 / 3, target: { en: '−1/3 ≈ −0.3333', vi: '−1/3 ≈ −0,3333' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '82-0-82.1-—-derive-the-one-row-gradient-update': [
    { id: 'updated-weight', question: { en: 'What is the updated weight w?', vi: 'Trọng số w sau cập nhật bằng bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 1e-12 },
  ],
  '83-2-83.3-—-residual-quantiles-construct-a-conformal-interval': [
    { id: 'conformal-radius', question: { en: 'What is the conformal radius q?', vi: 'Bán kính conformal q bằng bao nhiêu?' }, expected: 3, target: { en: '3', vi: '3' }, absoluteTolerance: 0 },
  ],
  '84-3-84.4-—-multiple-looks-change-the-error-rate': [
    { id: 'bonferroni-threshold', question: { en: 'What is the Bonferroni per-test threshold?', vi: 'Ngưỡng Bonferroni cho mỗi phép kiểm định bằng bao nhiêu?' }, expected: 0.0125, target: { en: '0.0125', vi: '0,0125' }, absoluteTolerance: 1e-12 },
  ],
  '85-1-85.2-—-estimate-runtime-from-measured-pilot-runs': [
    { id: 'serial-runtime', question: { en: 'What is the estimated total serial runtime in minutes?', vi: 'Tổng thời gian chạy tuần tự ước tính bằng bao nhiêu phút?' }, expected: 81, target: { en: '81 minutes', vi: '81 phút' }, absoluteTolerance: 0 },
  ],
  '86-0-86.1-—-seeds-estimate-monte-carlo-variability': [
    { id: 'monte-carlo-standard-error', question: { en: 'What is the Monte Carlo standard error across 25 seeds?', vi: 'Sai số chuẩn Monte Carlo trên 25 seed bằng bao nhiêu?' }, expected: 0.1, target: { en: '0.1', vi: '0,1' }, absoluteTolerance: 1e-12 },
  ],
  '87-3-check': [
    { id: 'macro-contrast', question: { en: 'What is the equally weighted macro contrast?', vi: 'Chênh lệch macro với trọng số đều bằng bao nhiêu?' }, expected: -0.1, target: { en: '−0.1', vi: '−0,1' }, absoluteTolerance: 1e-12 },
  ],
  '88-2-check': [
    { id: 'aligned-mse-difference', question: { en: 'What is candidate MSE minus baseline MSE?', vi: 'MSE của ứng viên trừ MSE cơ sở bằng bao nhiêu?' }, expected: 0, target: { en: '0 (tie)', vi: '0 (hòa)' }, absoluteTolerance: 1e-12 },
  ],
  '89-2-check': [
    { id: 'second-smoothed-state', question: { en: 'What is m₂ after two updates with α = 0.25 and y = 6?', vi: 'm₂ sau hai lần cập nhật với α = 0,25 và y = 6 bằng bao nhiêu?' }, expected: 3.75, target: { en: '3.75', vi: '3,75' }, absoluteTolerance: 1e-12 },
  ],
  '90-3-check': [
    { id: 'observed-coverage', question: { en: 'What is the observed coverage fraction for 18 hits in 30 cases?', vi: 'Tỷ lệ bao phủ quan sát được với 18/30 trường hợp là bao nhiêu?' }, expected: 0.6, target: { en: '0.6 (60%)', vi: '0,6 (60%)' }, absoluteTolerance: 1e-12 },
  ],
  '91-2-check': [
    { id: 'factor-interaction', question: { en: 'What is the interaction I?', vi: 'Tương tác I bằng bao nhiêu?' }, expected: -0.1, target: { en: '−0.1', vi: '−0,1' }, absoluteTolerance: 1e-12 },
  ],
  '92-2-check': [
    { id: 'mean-window-contrast', question: { en: 'What is the mean of the three window contrasts?', vi: 'Trung bình của ba chênh lệch theo cửa sổ bằng bao nhiêu?' }, expected: -1 / 15, target: { en: '−1/15 ≈ −0.0667', vi: '−1/15 ≈ −0,0667' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '93-1-check': [
    { id: 'effective-sample-size', question: { en: 'What effective sample size does the stated approximation give?', vi: 'Cỡ mẫu hiệu dụng theo xấp xỉ đã cho bằng bao nhiêu?' }, expected: 200 / 3, target: { en: '≈ 66.67', vi: '≈ 66,67' }, absoluteTolerance: 0.01, relativeTolerance: 0 },
  ],
  '94-1-turnover-turns-fees-into-drag': [
    { id: 'break-even-cost-rate', question: { en: 'Under the solution’s full-L1 turnover convention, what cost rate per turnover unit makes net return zero?', vi: 'Theo quy ước turnover L1 đầy đủ trong lời giải, mức phí mỗi đơn vị turnover để lợi suất ròng bằng 0 là bao nhiêu?' }, expected: 2.5, target: { en: '2.5 bp per turnover unit', vi: '2,5 bp mỗi đơn vị turnover' }, absoluteTolerance: 1e-12 },
  ],
  '95-1-paired-differences-retain-the-comparison': [
    { id: 'mean-paired-difference', question: { en: 'What is mean A − B?', vi: 'Trung bình A − B bằng bao nhiêu?' }, expected: 2, target: { en: '2', vi: '2' }, absoluteTolerance: 1e-12 },
  ],
  '96-2-results-text-must-agree-with-tables': [
    { id: 'relative-mae-reduction', question: { en: 'What is the relative MAE reduction from 0.8 to 0.7?', vi: 'Mức giảm MAE tương đối từ 0,8 xuống 0,7 là bao nhiêu?' }, expected: 0.125, target: { en: '12.5%', vi: '12,5%' }, absoluteTolerance: 1e-12 },
  ],
  '97-3-a-metric-implementation-can-change-the-answer': [
    { id: 'root-mean-squared-error', question: { en: 'What is RMSE for errors −1 and 3?', vi: 'RMSE của sai số −1 và 3 bằng bao nhiêu?' }, expected: Math.sqrt(5), target: { en: '√5 ≈ 2.236', vi: '√5 ≈ 2,236' }, absoluteTolerance: 0.001, relativeTolerance: 0 },
  ],
  '98-2-report-before-and-after-honestly': [
    { id: 'corrected-score-difference', question: { en: 'What is the corrected difference A − B?', vi: 'Chênh lệch đã sửa A − B bằng bao nhiêu?' }, expected: 0.5, target: { en: '0.5', vi: '0,5' }, absoluteTolerance: 1e-12 },
  ],
  '99-2-trace-a-figure-back-to-a-command': [
    { id: 'relative-reduction', question: { en: 'What is the correct relative reduction from baseline 4 to model 3.2?', vi: 'Mức giảm tương đối đúng từ cơ sở 4 xuống mô hình 3,2 là bao nhiêu?' }, expected: 0.2, target: { en: '20%', vi: '20%' }, absoluteTolerance: 1e-12 },
  ],
  '100-1-w100d2': [
    { id: 'interval-lower-endpoint', question: { en: 'What is the lower endpoint of the 95% interval?', vi: 'Cận dưới khoảng 95% bằng bao nhiêu?' }, expected: -0.00194, target: { en: '−0.00194', vi: '−0,00194' }, absoluteTolerance: 0.00001, relativeTolerance: 0 },
  ],
  '101-3-w101d4': [
    { id: 'mean-return', question: { en: 'What is the sample mean of the three returns?', vi: 'Trung bình mẫu của ba lợi suất bằng bao nhiêu?' }, expected: 0.02 / 3, target: { en: '≈ 0.00667', vi: '≈ 0,00667' }, absoluteTolerance: 0.00001, relativeTolerance: 0 },
  ],
  '102-2-w102d3': [
    { id: 'river-score', question: { en: 'What is River’s weighted total score?', vi: 'Tổng điểm có trọng số của River bằng bao nhiêu?' }, expected: 4.5, target: { en: '4.50', vi: '4,50' }, absoluteTolerance: 1e-12 },
  ],
  '3-4-w03d5': [
    { id: 'relative-solution-change', question: { en: 'What is the relative change in x₂ after b₂ rises by 3%?', vi: 'Độ biến thiên tương đối của x₂ là bao nhiêu khi b₂ tăng 3%?' }, expected: 0.03, target: { en: '3%', vi: '3%' }, absoluteTolerance: 1e-12 },
  ],
  '4-4-w04d5': [
    { id: 'higher-prevalence-posterior', question: { en: 'What is P(disease | positive) when prevalence rises to 10%?', vi: 'P(có bệnh | dương tính) bằng bao nhiêu khi tỷ lệ hiện mắc tăng lên 10%?' }, expected: 2 / 3, target: { en: '2/3 ≈ 0.6667', vi: '2/3 ≈ 0,6667' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '5-4-w05d5': [
    { id: 'proportion-standard-error', question: { en: 'What is the standard error of the observed proportion for n = 100 and p = 0.2?', vi: 'Sai số chuẩn của tỷ lệ mẫu với n = 100 và p = 0,2 bằng bao nhiêu?' }, expected: 0.04, target: { en: '0.04', vi: '0,04' }, absoluteTolerance: 1e-12 },
  ],
  '6-4-w06d5': [
    { id: 'exponential-95th-percentile', question: { en: 'What is the 95th percentile of the waiting time when λ = 0.5?', vi: 'Phân vị 95% của thời gian chờ khi λ = 0,5 bằng bao nhiêu?' }, expected: -Math.log(0.05) / 0.5, target: { en: '≈ 5.9915 time units', vi: '≈ 5,9915 đơn vị thời gian' }, absoluteTolerance: 0.0002, relativeTolerance: 0 },
  ],
  '7-3-w07d4': [
    { id: 'zero-covariance', question: { en: 'What is Cov(X, Y) for Y = X²?', vi: 'Cov(X, Y) bằng bao nhiêu với Y = X²?' }, expected: 0, target: { en: '0', vi: '0' }, absoluteTolerance: 0 },
  ],
  '8-3-w08d4': [
    { id: 'disk-radius-probability', question: { en: 'What is P(R ≤ 1.5) in a disk of radius 3?', vi: 'P(R ≤ 1,5) bằng bao nhiêu trong hình tròn bán kính 3?' }, expected: 0.25, target: { en: '0.25', vi: '0,25' }, absoluteTolerance: 1e-12 },
  ],
  '9-3-w09d4': [
    { id: 'chebyshev-bound-n100', question: { en: 'What Chebyshev upper bound applies at n = 100?', vi: 'Cận trên Chebyshev tại n = 100 bằng bao nhiêu?' }, expected: 0.64, target: { en: '0.64', vi: '0,64' }, absoluteTolerance: 1e-12 },
  ],
  '10-3-w10d4': [
    { id: 'dependent-mean-variance', question: { en: 'What is Var of the sample mean at n = 5?', vi: 'Phương sai của trung bình mẫu tại n = 5 bằng bao nhiêu?' }, expected: 1.24, target: { en: '1.24', vi: '1,24' }, absoluteTolerance: 1e-12 },
  ],
  '11-2-w11d3': [
    { id: 'independent-pair-variance', question: { en: 'What is the variance of the average of two independent Uniform(0, 1) draws?', vi: 'Phương sai trung bình của hai lần rút Uniform(0, 1) độc lập bằng bao nhiêu?' }, expected: 1 / 24, target: { en: '1/24 ≈ 0.04167', vi: '1/24 ≈ 0,04167' }, absoluteTolerance: 0.00001, relativeTolerance: 0 },
  ],
  '12-2-w12d3': [
    { id: 'binary64-naive-sum', question: { en: 'What does the specified binary64 left-to-right sum return?', vi: 'Tổng trái sang phải binary64 đã nêu trả về bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 0 },
  ],
  '13-2-w13d3': [
    { id: 'estimated-face-probability', question: { en: 'What is the observed estimate p̂ from 170 sixes in 900 rolls?', vi: 'Ước lượng p̂ từ 170 lần ra mặt 6 trong 900 lượt là bao nhiêu?' }, expected: 170 / 900, target: { en: '17/90 ≈ 0.18889', vi: '17/90 ≈ 0,18889' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '14-0-w14d1': [
    { id: 'total-simple-return', question: { en: 'What is the total simple return from 80 → 100 → 90?', vi: 'Tổng lợi suất đơn từ 80 → 100 → 90 bằng bao nhiêu?' }, expected: 0.125, target: { en: '0.125 (12.5%)', vi: '0,125 (12,5%)' }, absoluteTolerance: 1e-12 },
  ],
  '15-0-w15d1': [
    { id: 'intercept-only-estimate', question: { en: 'What is β̂ for the intercept-only fit?', vi: 'β̂ của mô hình chỉ có hệ số chặn bằng bao nhiêu?' }, expected: 4, target: { en: '4', vi: '4' }, absoluteTolerance: 1e-12 },
  ],
  '16-2-w16d3': [
    { id: 'unbiased-sample-variance', question: { en: 'What variance results when the squared deviations are divided by n − 1?', vi: 'Phương sai bằng bao nhiêu khi tổng bình phương độ lệch được chia cho n − 1?' }, expected: 12, target: { en: '12', vi: '12' }, absoluteTolerance: 1e-12 },
  ],
  '17-2-w17d3': [
    { id: 'empirical-coverage', question: { en: 'What is the empirical coverage fraction from 1,860 of 2,000 simulations?', vi: 'Tỷ lệ bao phủ thực nghiệm từ 1.860/2.000 lần mô phỏng bằng bao nhiêu?' }, expected: 0.93, target: { en: '0.93 (93%)', vi: '0,93 (93%)' }, absoluteTolerance: 1e-12 },
  ],
  '18-3-w18d4': [
    { id: 'ten-test-fwer', question: { en: 'What is the family-wise false-positive probability for 10 independent null tests?', vi: 'Xác suất dương tính giả toàn họ với 10 kiểm định không độc lập là bao nhiêu?' }, expected: 1 - 0.95 ** 10, target: { en: '≈ 0.4013', vi: '≈ 0,4013' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '19-1-w19d2': [
    { id: 'bootstrap-90th-percentile', question: { en: 'What is the nearest-rank 90th percentile?', vi: 'Phân vị 90% theo thứ hạng gần nhất bằng bao nhiêu?' }, expected: 8, target: { en: '8', vi: '8' }, absoluteTolerance: 0 },
  ],
  '21-2-w21d3': [
    { id: 'lambda-one-fold-mean', question: { en: 'What is mean validation MSE for λ = 1?', vi: 'MSE kiểm định trung bình với λ = 1 bằng bao nhiêu?' }, expected: 1.2, target: { en: '1.2', vi: '1,2' }, absoluteTolerance: 1e-12 },
  ],
  '22-2-w22d3': [
    { id: 'persistence-mae', question: { en: 'What is the one-step persistence MAE on the observed transitions?', vi: 'MAE của dự báo persistence một bước trên các chuyển tiếp quan sát được bằng bao nhiêu?' }, expected: 1.5, target: { en: '1.5', vi: '1,5' }, absoluteTolerance: 1e-12 },
  ],
  '24-0-w24d1': [
    { id: 'first-period-upper-endpoint', question: { en: 'What is the upper endpoint of the first period’s approximate 95% interval, in percentage points?', vi: 'Cận trên khoảng 95% xấp xỉ của giai đoạn đầu, theo điểm phần trăm, bằng bao nhiêu?' }, expected: 0.694, target: { en: '0.694%', vi: '0,694%' }, absoluteTolerance: 0.001, relativeTolerance: 0 },
  ],
  '27-1-w27d2': [
    { id: 'train-mean', question: { en: 'What is the mean used to standardize the three training features?', vi: 'Trung bình dùng để chuẩn hóa ba đặc trưng huấn luyện bằng bao nhiêu?' }, expected: 4, target: { en: '4', vi: '4' }, absoluteTolerance: 1e-12 },
  ],
  '28-2-w28d3': [
    { id: 'may-cutoff-vintage', question: { en: 'Which numeric vintage is admissible at the May 20 cutoff?', vi: 'Phiên bản số nào được phép dùng tại mốc 20 tháng 5?' }, expected: 7, target: { en: '7', vi: '7' }, absoluteTolerance: 0 },
  ],
  '29-0-w29d1': [
    { id: 'candidate-mse', question: { en: 'What is model B’s MSE?', vi: 'MSE của mô hình B bằng bao nhiêu?' }, expected: 0.0001, target: { en: '0.0001', vi: '0,0001' }, absoluteTolerance: 1e-12 },
  ],
  '29-3-w29d4': [
    { id: 'seasonal-naive-mae', question: { en: 'What is MAE for the seasonal-naive forecasts of months 4–7?', vi: 'MAE của dự báo seasonal-naive cho tháng 4–7 bằng bao nhiêu?' }, expected: 2.75, target: { en: '2.75', vi: '2,75' }, absoluteTolerance: 1e-12 },
  ],
  '30-3-w30d4': [
    { id: 'seasonal-difference', question: { en: 'What value does each lag-2 seasonal difference have?', vi: 'Mỗi sai phân mùa vụ trễ 2 có giá trị bằng bao nhiêu?' }, expected: 0, target: { en: '0', vi: '0' }, absoluteTolerance: 0 },
  ],
  '31-1-w31d2': [
    { id: 'ar-slope', question: { en: 'What is the OLS AR(1) slope?', vi: 'Hệ số góc OLS của AR(1) bằng bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 1e-12 },
  ],
  '35-1-w35d2': [
    { id: 'innovation-log-likelihood', question: { en: 'What is the log-likelihood contribution for e = 1 and S = 2?', vi: 'Đóng góp log-likelihood với e = 1 và S = 2 bằng bao nhiêu?' }, expected: -0.5 * (Math.log(2 * Math.PI) + Math.log(2) + 0.5), target: { en: '≈ −1.516', vi: '≈ −1,516' }, absoluteTolerance: 0.001, relativeTolerance: 0 },
  ],
  '36-0-w36d1': [
    { id: 'quadrant-objective', question: { en: 'What is the objective value at the constrained minimizer?', vi: 'Giá trị hàm mục tiêu tại nghiệm cực tiểu có ràng buộc bằng bao nhiêu?' }, expected: 1, target: { en: '1', vi: '1' }, absoluteTolerance: 0 },
  ],
  '36-1-w36d2': [
    { id: 'equality-constrained-minimum', question: { en: 'What is the minimum value under x + y = 3?', vi: 'Giá trị nhỏ nhất với ràng buộc x + y = 3 bằng bao nhiêu?' }, expected: 6, target: { en: '6', vi: '6' }, absoluteTolerance: 1e-12 },
  ],
  '36-2-w36d3': [
    { id: 'bound-constrained-minimum', question: { en: 'What is the minimum objective value for x ≤ 2?', vi: 'Giá trị nhỏ nhất của hàm mục tiêu với x ≤ 2 bằng bao nhiêu?' }, expected: -8, target: { en: '−8', vi: '−8' }, absoluteTolerance: 1e-12 },
  ],
  '37-1-w37d2': [
    { id: 'equality-constrained-x', question: { en: 'What is x at the constrained minimizer?', vi: 'x tại nghiệm cực tiểu có ràng buộc bằng bao nhiêu?' }, expected: 1.6, target: { en: '1.6', vi: '1,6' }, absoluteTolerance: 1e-12 },
  ],
  '38-0-w38d1': [
    { id: 'dual-value-lambda-two', question: { en: 'What is the dual value q(2)?', vi: 'Giá trị đối ngẫu q(2) bằng bao nhiêu?' }, expected: 3, target: { en: '3', vi: '3' }, absoluteTolerance: 1e-12 },
  ],
  '38-1-w38d2': [
    { id: 'suboptimality-certificate', question: { en: 'What is the maximum primal suboptimality certified by the bounds?', vi: 'Mức chưa tối ưu cực đại của nghiệm nguyên thủy được chứng nhận là bao nhiêu?' }, expected: 0.5, target: { en: '0.5', vi: '0,5' }, absoluteTolerance: 1e-12 },
  ],
  '38-4-w38d5': [
    { id: 'solver-primal-dual-gap', question: { en: 'What is the reported primal-minus-dual gap?', vi: 'Độ lệch giá trị nguyên thủy trừ cận đối ngẫu được báo cáo bằng bao nhiêu?' }, expected: 0.004, target: { en: '0.004', vi: '0,004' }, absoluteTolerance: 1e-12 },
  ],
  '39-3-w39d4': [
    { id: 'training-mean', question: { en: 'What mean is used to standardize the training data?', vi: 'Trung bình nào được dùng để chuẩn hóa dữ liệu huấn luyện?' }, expected: 4, target: { en: '4', vi: '4' }, absoluteTolerance: 1e-12 },
  ],
  '40-0-w40d1': [
    { id: 'second-return', question: { en: 'What is the simple return from 51 to 49?', vi: 'Lợi suất đơn từ 51 xuống 49 bằng bao nhiêu?' }, expected: 49 / 51 - 1, target: { en: '−2/51 ≈ −0.03922', vi: '−2/51 ≈ −0,03922' }, absoluteTolerance: 0.0001, relativeTolerance: 0 },
  ],
  '42-1-w42d2': [
    { id: 'small-learning-rate-update', question: { en: 'What updated prediction results at ν = 0.05?', vi: 'Dự báo sau cập nhật tại ν = 0,05 bằng bao nhiêu?' }, expected: 0.32, target: { en: '0.32', vi: '0,32' }, absoluteTolerance: 1e-12 },
  ],
  '42-3-w42d4': [
    { id: 'best-boosting-round', question: { en: 'Which round has the best validation MAE before early stopping?', vi: 'Vòng nào có MAE kiểm định tốt nhất trước khi dừng sớm?' }, expected: 4, target: { en: 'Round 4', vi: 'Vòng 4' }, absoluteTolerance: 0 },
  ],
  '43-1-w43d2': [
    { id: 'calibration-quantile', question: { en: 'What residual quantile q is selected by the specified nearest-rank rule?', vi: 'Phân vị phần dư q nào được chọn theo quy tắc nearest-rank đã nêu?' }, expected: 4, target: { en: '4', vi: '4' }, absoluteTolerance: 0 },
  ],
  '43-2-w43d3': [
    { id: 'pooled-coverage', question: { en: 'What is pooled interval coverage across both groups?', vi: 'Độ bao phủ khoảng gộp trên cả hai nhóm bằng bao nhiêu?' }, expected: 0.75, target: { en: '0.75 (75%)', vi: '0,75 (75%)' }, absoluteTolerance: 1e-12 },
  ],
  '44-2-w44d3': [
    { id: 'rolling-mean-at-t110', question: { en: 'What is the rolling mean at t = 110?', vi: 'Trung bình trượt tại t = 110 bằng bao nhiêu?' }, expected: 0.5, target: { en: '0.5', vi: '0,5' }, absoluteTolerance: 1e-12 },
  ],
  '45-2-w45d3': [
    { id: 'stable-step-count', question: { en: 'How many of the three proposed learning rates satisfy |1 − ηa| < 1?', vi: 'Có bao nhiêu trong ba tốc độ học thỏa |1 − ηa| < 1?' }, expected: 2, target: { en: '2', vi: '2' }, absoluteTolerance: 0 },
  ],
  '46-0-w46d1': [
    { id: 'next-period-gross-pnl', question: { en: 'What is gross P&L for unit position +1 at the next-period return?', vi: 'Lãi/lỗ gộp với vị thế +1 tại lợi suất kỳ sau bằng bao nhiêu?' }, expected: 0.03, target: { en: '0.03 (3%)', vi: '0,03 (3%)' }, absoluteTolerance: 1e-12 },
  ],
  '46-2-w46d3': [
    { id: 'gross-portfolio-return', question: { en: 'What is gross portfolio return?', vi: 'Lợi suất danh mục gộp bằng bao nhiêu?' }, expected: -0.048, target: { en: '−0.048 (−4.8%)', vi: '−0,048 (−4,8%)' }, absoluteTolerance: 1e-12 },
  ],
  '51-2-w51d3': [
    { id: 'median-time-delta', question: { en: 'What is the median paired time delta (agent minus manual), in minutes?', vi: 'Trung vị chênh lệch thời gian theo cặp (agent trừ thủ công), tính bằng phút, là bao nhiêu?' }, expected: -5, target: { en: '−5 minutes', vi: '−5 phút' }, absoluteTolerance: 0 },
  ],
  '51-3-w51d4': [
    { id: 'smoke-fixture-mae', question: { en: 'What is the fixture MAE?', vi: 'MAE của bộ dữ liệu kiểm tra nhanh bằng bao nhiêu?' }, expected: 0, target: { en: '0', vi: '0' }, absoluteTolerance: 0 },
  ],
  '52-0-w52d1': [
    { id: 'test-relative-reduction', question: { en: 'What is the relative MAE reduction from 5.0 to 4.8?', vi: 'Mức giảm MAE tương đối từ 5,0 xuống 4,8 bằng bao nhiêu?' }, expected: 0.04, target: { en: '4%', vi: '4%' }, absoluteTolerance: 1e-12 },
  ],
  '53-3-w53d4': [
    { id: 'markov-bound', question: { en: 'What Markov upper bound applies to P(L ≥ 10)?', vi: 'Cận trên Markov nào áp dụng cho P(L ≥ 10)?' }, expected: 0.28, target: { en: '0.28', vi: '0,28' }, absoluteTolerance: 1e-12 },
  ],
  '54-4-w54d5': [
    { id: 'geometric-mean', question: { en: 'What is E[X] for P(X = k) = 2⁻ᵏ, k ≥ 1?', vi: 'E[X] bằng bao nhiêu với P(X = k) = 2⁻ᵏ, k ≥ 1?' }, expected: 2, target: { en: '2', vi: '2' }, absoluteTolerance: 1e-12 },
  ],
  '55-3-w55d4': [
    { id: 'unconditional-return-mean', question: { en: 'What is the unconditional mean E[R]?', vi: 'Trung bình vô điều kiện E[R] bằng bao nhiêu?' }, expected: 0.018, target: { en: '1.8%', vi: '1,8%' }, absoluteTolerance: 1e-12 },
  ],
  '57-0-w57d1': [
    { id: 'chebyshev-tail-bound', question: { en: 'What Chebyshev upper bound applies to P(|X − 5| ≥ 6)?', vi: 'Cận trên Chebyshev nào áp dụng cho P(|X − 5| ≥ 6)?' }, expected: 0.25, target: { en: '0.25', vi: '0,25' }, absoluteTolerance: 1e-12 },
  ],
  '58-0-w58d1': [
    { id: 'finite-sample-chebyshev-bound', question: { en: 'What Chebyshev upper bound applies at n = 100?', vi: 'Cận trên Chebyshev tại n = 100 bằng bao nhiêu?' }, expected: 0.21, target: { en: '0.21', vi: '0,21' }, absoluteTolerance: 1e-12 },
  ],
  '58-1-w58d2': [
    { id: 'clt-tail-probability', question: { en: 'What CLT probability approximation is supplied by Φ(2.18)?', vi: 'Xấp xỉ xác suất CLT theo Φ(2,18) đã cho bằng bao nhiêu?' }, expected: 0.9854, target: { en: '0.9854', vi: '0,9854' }, absoluteTolerance: 1e-12 },
  ],
};

function splitStages(value) {
  const text = String(value ?? '').replace(/\r\n/g, '\n').trim();
  const numbered = [...text.matchAll(/^\s*\d+[.)]\s+/gm)];
  if (numbered.length > 1) {
    return numbered.map((match, index) => text.slice(match.index, numbered[index + 1]?.index ?? text.length).trim());
  }
  const paragraphs = text.split(/\n\s*\n/).map(part => part.trim()).filter(Boolean);
  if (paragraphs.length > 1) return paragraphs;
  const sentences = text.split(/(?<=[.!?])\s+(?=\p{Lu}|[“"(])/u).map(part => part.trim()).filter(Boolean);
  return sentences.length > 1 ? sentences : [text];
}

function combineToCount(parts, target) {
  const groups = [];
  let cursor = 0;
  for (let index = 0; index < target; index += 1) {
    const remaining = parts.length - cursor;
    const groupsLeft = target - index;
    const take = Math.ceil(remaining / groupsLeft);
    groups.push(parts.slice(cursor, cursor + take).join('\n\n'));
    cursor += take;
  }
  return groups;
}

const modules = [];
for (const file of sourceFiles) {
  modules.push(...JSON.parse(await readFile(resolve(root, 'data', file), 'utf8')));
}

const exercises = {};
for (const module of modules) {
  module.sessions.forEach((session, dayIndex) => {
    for (const exercise of session.exercises) {
      const key = `${module.week}-${dayIndex}-${exercise.id}`;
      const en = splitStages(exercise.answer.en);
      const vi = splitStages(exercise.answer.vi);
      const count = Math.min(en.length, vi.length);
      const stages = Array.from({ length: count }, (_, index) => ({
        en: combineToCount(en, count)[index],
        vi: combineToCount(vi, count)[index],
      }));
      exercises[key] = {
        exerciseId: exercise.id,
        week: module.week,
        dayIndex,
        mode: 'solution-stage-comparison',
        stageSource: 'exact segments from this exercise’s bilingual model answer',
        stages,
        ...(numericChecks[key] ? { numericChecks: numericChecks[key] } : {}),
      };
    }
  });
}

const keys = Object.keys(exercises);
const missingNumericExerciseKeys = Object.keys(numericChecks).filter(key => !Object.hasOwn(exercises, key));
if (missingNumericExerciseKeys.length > 0) {
  throw new Error(`Numeric checkpoint keys do not match source exercises: ${missingNumericExerciseKeys.join(', ')}`);
}
for (const [key, checks] of Object.entries(numericChecks)) {
  const ids = checks.map(check => check.id);
  if (new Set(ids).size !== ids.length) throw new Error(`Duplicate numeric checkpoint id in ${key}`);
  if (checks.some(check => !Number.isFinite(check.expected) || !check.question.en || !check.question.vi || !check.target.en || !check.target.vi)) {
    throw new Error(`Incomplete numeric checkpoint in ${key}`);
  }
}
const curatedNumericWeekCount = new Set(Object.keys(numericChecks).map(key => exercises[key].week)).size;
const curatedNumericCheckCount = Object.values(numericChecks).reduce((total, checks) => total + checks.length, 0);
const result = {
  schemaVersion: 1,
  coverage: {
    exercises: keys.length,
    compositeKeys: keys.length,
    rawIds: new Set(Object.values(exercises).map(item => item.exerciseId)).size,
    stageOnlyExercises: keys.length - Object.keys(numericChecks).length,
    curatedNumericExercises: Object.keys(numericChecks).length,
    curatedNumericChecks: curatedNumericCheckCount,
    curatedNumericWeeks: curatedNumericWeekCount,
    solutionStages: Object.values(exercises).reduce((total, item) => total + item.stages.length, 0),
    oneStageExercises: Object.values(exercises).filter(item => item.stages.length === 1).length,
  },
  exercises,
};
await writeFile(resolve(root, 'data', 'exercise-checkpoints.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(result.coverage));
