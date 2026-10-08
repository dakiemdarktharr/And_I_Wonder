"""Attach hand-specified exact-example figures to lessons 14-35."""
import json
from pathlib import Path

ROOT = Path(__file__).absolute().parent.parent
LESSONS = ROOT / "data" / "lessons-01-35.json"

# Each entry is keyed by (week, chronological session index). Values below are
# the exact numeric example from that session; procedural/proof examples use
# an explicit sequence of reasoning steps instead of invented curves.
V = {}

def cap(en, vi): return {"en": en, "vi": vi}

def bars(w, d, x, y, values, en, vi):
    V[(w,d)] = {"kind":"bars", "xLabel":cap(*x), "yLabel":cap(*y),
        "values":[{"label":cap(a,b),"value":n} for a,b,n in values],
        "caption":cap(en,vi)}

def xy(w, d, x, y, series, en, vi):
    V[(w,d)] = {"kind":"xy", "xLabel":cap(*x), "yLabel":cap(*y),
        "series":[{"name":cap(n,v),"mode":mode,"points":pts} for n,v,mode,pts in series],
        "caption":cap(en,vi)}

def matrix(w,d,rows,cols,values,en,vi):
    V[(w,d)]={"kind":"matrix","rows":rows,"columns":cols,"values":values,
        "caption":cap(en,vi)}

def steps(w,d,items,en,vi):
    normalized=[]
    for item in items:
        if len(item)==2 and not (" / " in item[0] and " / " in item[1]):
            normalized.append(cap(item[0],item[1]))
        else:
            for phrase in item:
                if " / " in phrase:
                    a,b=phrase.split(" / ",1)
                    normalized.append(cap(a,b))
                else:
                    normalized.append(cap(phrase,phrase))
    V[(w,d)]={"kind":"steps","steps":normalized,"caption":cap(en,vi)}

# W14 — financial returns and data contracts
xy(14,0,('Session','Phiên'),('Adjusted close','Giá điều chỉnh'),[
 ('Prices / Giá','Giá','line',[[1,100],[2,110],[3,99]])],
 'The path 100→110→99 gives +10% then −10%; compounded wealth ends at 99, or −1%.',
 'Đường 100→110→99 cho +10% rồi −10%; tài sản kép kết thúc 99, tức −1%.')
bars(14,1,('Daily return component','Thành phần lợi suất ngày'),('Rate','Lợi suất'),[
 ('Asset','Tài sản',.004),('Risk-free','Phi rủi ro',.0001),('Excess','Vượt trội',.0039)],
 'Same-interval rates: .004−.0001=.0039. The annual effective 3.65% convention gives about .0000983 per day.',
 'Lợi suất cùng kỳ: .004−.0001=.0039. Quy ước lãi hiệu dụng năm 3,65% cho khoảng .0000983 mỗi ngày.')
steps(14,2,[('Signal period ends Jun 30 / Kỳ tín hiệu kết thúc 30-6','Published Jul 5 / Công bố 5-7'),
 ('Jun 30 close decision predates release / Quyết định lúc đóng cửa 30-6 có trước công bố','Reject same-period join / Từ chối join cùng kỳ'),
 ('First conservative decision: Jul 6 / Quyết định thận trọng đầu tiên: 6-7','Availability follows release time / Khả dụng theo giờ công bố')],
 'The June 30 label cannot override the July 5 release timestamp.',
 'Nhãn 30-6 không thể thay thế timestamp công bố 5-7.')
xy(14,3,('Session','Phiên'),('Adjusted close','Giá điều chỉnh'),[
 ('Price / Giá','Giá','line',[[1,50],[2,52],[3,49.4]])],
 'Adjusted closes 50,52,49.4 imply returns .04,−.05; excess returns are .0399,−.0501 at rf=.0001.',
 'Giá 50,52,49,4 cho lợi suất .04,−.05; excess là .0399,−.0501 khi rf=.0001.')
xy(14,4,('End of interval','Cuối kỳ'),('Wealth from 1','Tài sản từ 1'),[
 ('Compounded asset / Tài sản kép','Tài sản kép','line',[[0,1],[1,1.05],[2,.9975]])],
 'Returns +5%,−5% compound to .9975, a loss of .25%; simple returns do not add.',
 'Lợi suất +5%,−5% kép thành .9975, lỗ .25%; lợi suất đơn không cộng trực tiếp.')

# W15 — likelihood and factor regressions
matrix(15,0,['row 1','row 2','row 3'],['y','fitted mean','residual'],
 [[1,1.6666667,-.6666667],[2,1.6666667,.3333333],[2,1.6666667,.3333333]],
 'Intercept-only fit to y=(1,2,2): β̂=5/3, SSE=2/3; MLE variance 2/9 differs from unbiased 1/3.',
 'Fit chỉ hằng số cho y=(1,2,2): β̂=5/3, SSE=2/3; variance MLE 2/9 khác 1/3 không chệch.')
xy(15,1,('Factor return','Lợi suất nhân tố'),('Asset return','Lợi suất tài sản'),[
 ('Observed / Quan sát','Quan sát','scatter',[[-.01,-.01],[0,.01],[.01,.02]]),
 ('OLS fitted / OLS khớp','OLS khớp','line',[[-.01,-.0083333],[0,.0066667],[.01,.0216667]])],
 'Points f=(.01,0,−.01), y=(.02,.01,−.01) give slope 1.5 and intercept .006667.',
 'Điểm f=(.01,0,−.01), y=(.02,.01,−.01) cho slope 1,5, intercept .006667.')
steps(15,2,[('Contemporaneous: pair f[t] with y[t] / Đồng thời: ghép f[t] với y[t]', 'Forecast: pair f[t] with y[t+1] / Dự báo: ghép f[t] với y[t+1]'),
 ('Feature release must precede decision / Công bố đặc trưng phải trước quyết định','Target interval follows origin / Khoảng mục tiêu sau mốc')],
 'The index shift alone does not guarantee the signal was available at execution.',
 'Chỉ dịch chỉ số chưa đảm bảo tín hiệu khả dụng khi thực thi.')
matrix(15,3,['row 1','row 2','row 3'],['intercept','factor 1','factor 2'],
 [[1,1,1],[1,2,2],[1,3,3]],
 'The two factor columns are identical, so the design is rank-deficient and separate exposures are unidentified.',
 'Hai cột nhân tố giống nhau nên thiết kế thiếu hạng, không định danh riêng từng exposure.')
steps(15,4,[('Generate 24 monthly rows from y=.002+1.2f₁−.4f₂+ε / Sinh 24 tháng từ công thức đã nêu', 'Use ε~N(0,.01²) / Dùng ε~N(0,.01²)'),
 ('Fit OLS and Gaussian likelihood; compare coefficients / Fit OLS và likelihood Gaussian; so hệ số','Delay f₂ release by one month / Trễ công bố f₂ một tháng'),
 ('Audit how a future-unsafe join changes the fit','Kiểm ảnh hưởng join không an toàn thời gian')],
 'The 24-row example has a known data-generating equation; shifting release time changes admissible information.',
 'Ví dụ 24 hàng có phương trình sinh dữ liệu đã biết; dịch thời điểm công bố làm đổi thông tin hợp lệ.')

# W16 — estimator bias and variance
bars(16,0,('Estimator value','Giá trị estimator'),('Probability','Xác suất'),[
 ('0','0',.2),('1','1',.5),('2','2',.3)],
 'E[estimator]=0(.2)+1(.5)+2(.3)=1.1; target=1, so bias=.1.',
 'E[estimator]=0(.2)+1(.5)+2(.3)=1,1; mục tiêu=1 nên bias=.1.')
bars(16,1,('Estimator','Estimator'),('MSE','MSE'),[
 ('A: bias 0, variance 4','A: bias 0, variance 4',4),('B: bias 1, variance 1','B: bias 1, variance 1',2)],
 'MSE=bias²+variance: A=4; B=1+1=2.',
 'MSE=bias²+variance: A=4; B=1+1=2.')
bars(16,2,('Variance convention','Quy ước phương sai'),('Estimate','Ước lượng'),[
 ('Divide by n','Chia n',8/3),('Unbiased: divide n−1','Không chệch: chia n−1',4)],
 'For (1,3,5), mean=3 and squared-deviation sum=8.',
 'Với (1,3,5), trung bình=3, tổng bình phương độ lệch=8.')
bars(16,3,('Estimator','Estimator'),('MSE / risk','MSE / rủi ro'),[
 ('Raw: a=1','Thô: a=1',4),('Shrink: a=.5','Co: a=.5',2)],
 'When μ=2, μ₀=0, σ²/n=4: shrinkage bias is −1, variance 1, total MSE 2.',
 'Khi μ=2, μ₀=0, σ²/n=4: bias shrinkage −1, variance 1, MSE tổng 2.')
bars(16,4,('Estimator','Estimator'),('Risk','Rủi ro'),[
 ('Raw mean','Trung bình thô',4),('a=.5 shrinkage','Co a=.5',2)],
 'Across common draws, compare paired risk differences; the example risks are 4 versus 2.',
 'Qua các lần rút chung, so chênh rủi ro ghép cặp; ví dụ có rủi ro 4 so với 2.')

# W17 — confidence and prediction intervals
xy(17,0,('Mean parameter value','Giá trị tham số trung bình'),('Interval marker','Mốc khoảng'),[
 ('95% CI: σ=4,n=64','CI 95%: σ=4,n=64','scatter',[[11.02,0],[12,0],[12.98,0]])],
 'X̄=12, SE=4/√64=.5; endpoints are 12±1.96(.5). Individual observations still have SD 4.',
 'X̄=12, SE=4/√64=.5; hai đầu là 12±1.96(.5). Quan sát riêng lẻ vẫn có SD 4.')
bars(17,1,('Interval target','Mục tiêu khoảng'),('Half-width','Nửa độ rộng'),[
 ('Mean CI','CI trung bình',2.306),('New observation PI','PI quan sát mới',7.29)],
 'For n=9, mean=10,s=3,t=2.306: mean CI [7.694,12.306], prediction interval is much wider.',
 'Với n=9, mean=10,s=3,t=2.306: CI trung bình [7.694;12.306], PI rộng hơn nhiều.')
bars(17,2,('Coverage quantity','Đại lượng coverage'),('Coverage fraction','Tỷ lệ coverage'),[
 ('Nominal c','Danh nghĩa c',.95),('Observed','Quan sát',.938)],
 'With 1,000 repetitions, .938 is about 1.74 Monte Carlo SE below .95.',
 'Với 1.000 lần lặp, .938 thấp hơn .95 khoảng 1,74 SE Monte Carlo.')
bars(17,3,('Interval target','Mục tiêu khoảng'),('Half-width','Nửa độ rộng'),[
 ('Mean CI, n=16','CI mean, n=16',2.131),('Prediction interval','Khoảng dự báo',8.79)],
 'Both intervals center at X̄ but their targets and widths differ.',
 'Cả hai khoảng tâm tại X̄ nhưng khác mục tiêu và độ rộng.')
bars(17,4,('Quantity','Đại lượng'),('Value','Giá trị'),[
 ('Mean CI half-width','Nửa rộng CI mean',2.306),('Prediction half-width','Nửa rộng prediction',7.29)],
 'Nominal 95% coverage varies by about .0049 from Monte Carlo error alone at 2,000 replications.',
 'Coverage 95% danh nghĩa dao động khoảng .0049 chỉ do sai số Monte Carlo ở 2.000 lần lặp.')

# W18 — testing, power, multiplicity
bars(18,0,('Test quantity','Đại lượng kiểm định'),('Statistic','Thống kê'),[
 ('Observed z','z quan sát',2.4),('Two-sided critical','Ngưỡng hai phía',1.96)],
 'With μ₀=10, x̄=11.2, σ=3,n=36, SE=.5; one- and two-sided alternatives differ.',
 'Với μ₀=10, x̄=11,2, σ=3,n=36, SE=.5; giả thuyết một/hai phía khác nhau.')
xy(18,1,('Effect δ','Hiệu ứng δ'),('Interval marker','Mốc khoảng'),[
 ('95% CI, SE=.08','CI 95%, SE=.08','scatter',[[.0432,0],[.20,0],[.3568,0]])],
 'Estimate .20 and SE .08 give z=2.5 and interval [.0432,.3568].',
 'Ước lượng .20, SE .08 cho z=2,5, khoảng [.0432;.3568].')
bars(18,2,('True effect','Hiệu ứng thật'),('Approximate power','Power xấp xỉ'),[
 ('Δ=.5,n=25','Δ=.5,n=25',.804),('Δ=.2,n=25','Δ=.2,n=25',.259)],
 'One-sided α=.05, σ=1; smaller effect has lower detection probability at the same n.',
 'Một phía α=.05, σ=1; hiệu ứng nhỏ có xác suất phát hiện thấp hơn cùng n.')
bars(18,3,('Procedure','Thủ tục'),('Family-wise error','Sai số family-wise'),[
 ('20 tests, α=.05 each','20 test, α=.05 mỗi test',.6415),('Bonferroni upper bound','Cận trên Bonferroni',.05)],
 'Independent-null family error is 1−.95²⁰≈.6415; per-test Bonferroni level is .0025.',
 'Sai số họ dưới null độc lập là 1−.95²⁰≈.6415; mức Bonferroni mỗi test=.0025.')
steps(18,4,[('Search 100 null signals / Tìm 100 tín hiệu null','About 5 false rejections expected / Kỳ vọng khoảng 5 bác bỏ giả'),
 ('P(at least one)≈.994 under independence / P(ít nhất một)≈.994 nếu độc lập','A discovered p=.03 is exploratory / p=.03 tìm sau là khám phá'),
 ('Report full search or untouched validation','Báo toàn bộ lượt tìm hoặc validation chưa dùng')],
 'A post-search p-value is not confirmatory evidence by itself.',
 'P-value sau tìm kiếm không tự nó là bằng chứng xác nhận.')

# W19 — bootstrap and dependence
bars(19,0,('Mean value','Giá trị trung bình'),('Mean','Trung bình'),[
 ('Original (2,4,8)','Gốc (2,4,8)',14/3),('Draw (2,2,8)','Mẫu (2,2,8)',4),('Draw (4,8,8)','Mẫu (4,8,8)',20/3)],
 'The empirical bootstrap resamples each observed value with probability 1/3; draws vary around the original mean 14/3.',
 'Bootstrap thực nghiệm rút mỗi giá trị với xác suất 1/3; trung bình mẫu dao động quanh 14/3.')
bars(19,1,('Bootstrap summary','Tóm tắt bootstrap'),('Value','Giá trị'),[
 ('2.5th percentile','Phân vị 2,5%',1.75),('Mean estimate','Ước lượng mean',2.1),('Bootstrap SD','SD bootstrap',.18),('97.5th percentile','Phân vị 97,5%',2.45)],
 'B=2,000 means from n=30; the percentile interval is conditional on the observed sample.',
 'B=2.000 mean từ n=30; khoảng percentile có điều kiện theo mẫu quan sát.')
steps(19,2,[('Series (1,2,3,4,5,6) has upward runs / Chuỗi (1,2,3,4,5,6) tăng liên tiếp','IID draw (1,6,2,5,3,4) scrambles them / Mẫu IID phá vỡ thứ tự'),
 ('Length-2 blocks retain adjacent pairs / Block dài 2 giữ cặp kề','Blocks preserve local dependence, not all long-range structure / Block giữ phụ thuộc cục bộ, không giữ mọi cấu trúc dài')],
 'The example contrasts a scrambled IID sample with adjacent blocks from the observed sequence.',
 'Ví dụ đối chiếu mẫu IID xáo với block kề từ chuỗi quan sát.')
bars(19,3,('Block length L','Độ dài block L'),('Approx. block units n/L','Số block xấp xỉ n/L'),[
 ('L=4','L=4',30),('L=24','L=24',5)],
 'For n=120, longer blocks retain longer dependence but offer fewer block units.',
 'Với n=120, block dài giữ phụ thuộc lâu hơn nhưng số block ít hơn.')
steps(19,4,[('IID mean SE benchmark: s/√n / Benchmark SE mean IID: s/√n','Positive autocorrelation can raise block-bootstrap SE / Tự tương quan dương có thể tăng SE block'),
 ('Compare block lengths and known AR truth / So độ dài block và sự thật AR đã biết','Difference reflects dependence assumptions / Khác biệt phản ánh giả định phụ thuộc')],
 'An SE gap is diagnostic of assumptions, not proof one resampling method is correct.',
 'Chênh SE giúp chẩn đoán giả định, không chứng minh phương pháp nào đúng.')

# W20 — residuals and robust errors
xy(20,0,('x','x'),('y','y'),[
 ('Observed, last y changed to 8','Quan sát, y cuối đổi thành 8','scatter',[[0,1],[1,2],[2,3],[3,8]]),
 ('OLS fit: α=.2, β=2.2','Fit OLS: α=.2, β=2.2','line',[[0,.2],[3,6.8]])],
 'The first three points lie on y=1+x; replacing the last value by 8 changes the fitted line and leaves an outlier residual.',
 'Ba điểm đầu nằm trên y=1+x; đổi điểm cuối thành 8 làm đổi đường fit và để lại residual ngoại lệ.')
steps(20,1,[('OLS slope stays fixed','Hệ số OLS giữ nguyên'),('HC0 uses Σxᵢ²eᵢ²/(Σxᵢ²)²','HC0 dùng công thức sandwich Σxᵢ²eᵢ²/(Σxᵢ²)²'),('Heteroskedasticity changes uncertainty, not the fitted coefficient','Heteroskedasticity đổi bất định, không đổi hệ số fit')],
 'The worked example gives the exact HC0 sandwich expression for centered x.',
 'Ví dụ nêu biểu thức sandwich HC0 chính xác cho x đã trừ trung bình.')
bars(20,2,('Variance estimate','Ước lượng phương sai'),('Long-run variance','Phương sai dài hạn'),[
 ('Ignore lag 1: γ₀','Bỏ trễ 1: γ₀',1),('Bartlett L=1','Bartlett L=1',1.5)],
 'γ₀=1,γ₁=.5 gives 1+2(1−1/2)(.5)=1.5.',
 'γ₀=1,γ₁=.5 cho 1+2(1−1/2)(.5)=1,5.')
steps(20,3,[('True relation y=x²+ε','Quan hệ thật y=x²+ε'),('Fit linear α+βx leaves curvature','Fit tuyến tính α+βx còn độ cong'),('HC3 adjusts uncertainty but does not repair the mean model','HC3 chỉnh bất định, không sửa mô hình mean')],
 'Robust covariance does not turn a linear conditional mean into the correct quadratic model.',
 'Covariance robust không biến mean tuyến tính thành mô hình bậc hai đúng.')
xy(20,4,('Coefficient estimate','Ước lượng hệ số'),('Interval endpoint','Đầu mút khoảng'),[
 ('Classical 95%','95% thường','line',[[.10,0],[.20,0]]),
 ('HAC 95%','95% HAC','line',[[.02,1],[.28,1]])],
 'The point estimate is unchanged while HAC widens the interval from [.10,.20] to [.02,.28].',
 'Ước lượng điểm không đổi, HAC mở rộng khoảng từ [.10;.20] thành [.02;.28].')

# W21 — regularization and covariance
bars(21,0,('Coefficient','Hệ số'),('Estimate','Ước lượng'),[
 ('OLS β₁','OLS β₁',4),('Ridge β₁, λ=2','Ridge β₁, λ=2',4/3),('OLS β₂','OLS β₂',2),('Ridge β₂, λ=2','Ridge β₂, λ=2',2/3)],
 'For X=I₂, y=(4,2), ridge shrinks each coefficient by 1/3 at λ=2.',
 'Với X=I₂,y=(4,2), ridge co mỗi hệ số còn 1/3 khi λ=2.')
steps(21,1,[('Original: y≈2+3x','Gốc: y≈2+3x'),('Rescale x′=1000x','Đổi thang x′=1000x'),('Equivalent slope becomes .003','Hệ số tương đương thành .003'),('Standardize before applying a scale-sensitive penalty','Chuẩn hóa trước penalty phụ thuộc thang')],
 'Predictions stay the same, but the raw coefficient penalty changes with units.',
 'Dự báo giữ nguyên nhưng penalty hệ số thô đổi theo đơn vị.')
bars(21,2,('λ','λ'),('Validation MSE','MSE validation'),[
 ('0','0',1.20),('.1','.1',1.08),('1','1',1.04),('10','10',1.10)],
 'One validation split prefers λ=1; rolling estimates are needed to assess selection uncertainty.',
 'Một split validation ưu tiên λ=1; cần ước lượng rolling để đánh giá bất định chọn.')
matrix(21,3,['original row 1','original row 2','shrunk row 1','shrunk row 2'],['col 1','col 2'],
 [[1,.9],[.9,1],[1,.45],[.45,1]],
 'Shrinking halfway to I changes eigenvalues from (1.9,.1) to (1.45,.55) and condition number 19→2.64.',
 'Co nửa về I đổi eigenvalue (1.9;.1) thành (1.45;.55), condition number 19→2,64.')
steps(21,4,[('Near-collinearity makes OLS coefficients unstable','Gần đồng tuyến làm hệ số OLS bất ổn'),('Ridge stabilizes by shrinking β','Ridge ổn định bằng co β'),('Covariance shrinkage lowers κ','Co covariance hạ κ'),('Both add bias; evaluate against known truth and held-out data','Cả hai thêm bias; đánh giá với truth và holdout')],
 'Coefficient regularization and covariance regularization solve different numerical problems.',
 'Regularize hệ số và covariance giải quyết bài toán số khác nhau.')

# W22 — rolling/expanding estimation
steps(22,0,[('Rolling W=3 at origins 4…8: {2,3,4}→…→{6,7,8} / Rolling W=3: {2,3,4}→…→{6,7,8}',
 'Expanding: {1…4}→…→{1…8} / Mở rộng: {1…4}→…→{1…8}',
 'Forecast target is next observation, outside the fit window / Mục tiêu dự báo là quan sát kế, ngoài cửa sổ fit')],
 'The example uses observations 1…8 and a three-observation rolling window.',
 'Ví dụ dùng quan sát 1…8 với cửa sổ rolling ba điểm.')
steps(22,1,[('Before t=50: target level 0 / Trước t=50: mức đích 0','After t=50: target level 2 / Sau t=50: mức đích 2','W=10 adapts faster; W=40 and expanding retain more old zeros / W=10 thích nghi nhanh; W=40/mở rộng giữ nhiều số 0 cũ')],
 'The specified level shift is 0→2 at t=50; noise SD=1.',
 'Dịch mức đã nêu là 0→2 tại t=50; SD nhiễu=1.')
# corrected input series and forecasts are tied exactly to the six values in the lesson
xy(22,2,('Target index','Chỉ số mục tiêu'),('y','y'),[
 ('Observed targets y₂…y₆','Mục tiêu quan sát y₂…y₆','line',[[2,2],[3,2],[4,4],[5,3],[6,5]]),
 ('Persistence forecasts y₁…y₅','Dự báo persistence y₁…y₅','line',[[2,1],[3,2],[4,2],[5,4],[6,3]])],
 'For y=(1,2,2,4,3,5), persistence errors y[t]−y[t−1] are (1,0,2,−1,2), MAE=1.2.',
 'Với y=(1,2,2,4,3,5), sai số persistence y[t]−y[t−1]=(1,0,2,−1,2), MAE=1,2.')
xy(22,3,('Forecast origin','Mốc dự báo'),('Slope','Hệ số góc'),[
 ('Rolling','Rolling','line',[[1,.8],[2,.9],[3,1],[4,1.8],[5,1.9],[6,2]]),
 ('Expanding','Mở rộng','line',[[1,1],[2,1],[3,1],[4,1.2],[5,1.3],[6,1.4]])],
 'The six supplied rolling and expanding slopes separate sharply after origin 3; this alone does not establish a true break.',
 'Sáu slope rolling/mở rộng tách rõ sau mốc 3; riêng điều này chưa chứng minh gãy thật.')
steps(22,4,[('Mean break at origin 60 / Gãy mean tại mốc 60','Rolling W=10: lower post-break MAE, higher pre-break variance / Rolling W=10: MAE sau gãy thấp, variance trước gãy cao','Report both segments and aggregate weights / Báo hai đoạn và trọng số tổng hợp')],
 'The simulation comparison is qualitative unless the generated path and metric values are reported.',
 'So sánh mô phỏng chỉ định tính nếu chưa báo đường sinh và giá trị metric.')

# W23 — replication protocol
steps(23,0,[('Universe: 20 assets × 120 months / Vũ trụ: 20 tài sản × 120 tháng','Sort signal into quintiles at t / Xếp tín hiệu thành quintile tại t','Measure next-month excess return with one-month lag / Đo excess tháng sau, trễ một tháng','Estimand: mean top-quintile excess return vs zero / Estimand: mean excess top-quintile so với 0')],
 'The question fixes universe, horizon, weighting, lag, and benchmark before analysis.',
 'Câu hỏi khóa vũ trụ, chân trời, weighting, lag và benchmark trước phân tích.')
steps(23,1,[('Future-end-date membership omits delisted assets / Membership cuối tương lai bỏ cổ phiếu hủy niêm yết','Point-in-time membership uses eligibility at each month / Membership point-in-time dùng tư cách mỗi tháng','Different universe rules answer different questions / Quy tắc vũ trụ khác trả lời câu hỏi khác')],
 'A Dec 2020 survivor universe differs from the historical eligible universe for 2010–2020.',
 'Vũ trụ còn sống đến 12-2020 khác vũ trụ đủ điều kiện lịch sử 2010–2020.')
steps(23,2,[('Freeze primary spread and HAC lag 3 / Khóa spread chính và HAC lag 3','Benchmark against zero / So với 0','Predeclare lags 1,6 and weighting checks / Định trước lag 1,6 và kiểm tra trọng số','Report secondary results as robustness / Báo kết quả phụ là robustness')],
 'The primary estimate stays distinct from secondary specifications.',
 'Ước lượng chính được tách khỏi đặc tả phụ.')
bars(23,3,('Study','Nghiên cứu'),('Monthly spread','Spread tháng'),[
 ('Original result','Kết quả gốc',.42),('Conceptual replication','Tái lập khái niệm',.31)],
 'The substitute-data result is close but not exact replication; it has a wider interval.',
 'Kết quả dữ liệu thay thế gần nhưng không tái lập chính xác; khoảng rộng hơn.')
steps(23,4,[('Fixture: 3 assets × 12 months / Fixture: 3 tài sản × 12 tháng','Test sorter, lag, and HAC call / Kiểm sorter, lag, lời gọi HAC','Software dry-run only / Chỉ chạy thử phần mềm','No market representativeness claim / Không tuyên bố đại diện thị trường')],
 'A small synthetic fixture validates code paths, not economic significance or external validity.',
 'Fixture tổng hợp nhỏ xác thực luồng mã, không xác thực ý nghĩa kinh tế hay ngoại suy.')

# W24 — factor sensitivity and manuscript
bars(24,0,('Sample period','Giai đoạn mẫu'),('Spread (% monthly)','Spread (%/tháng)'),[
 ('2000–2020','2000–2020',.30),('2000–2009','2000–2009',.55),('2010–2020','2010–2020',.08)],
 'The pooled .30% masks the lower later-period spread .08%.',
 'Mức gộp .30% che spread .08% thấp hơn ở giai đoạn sau.')
bars(24,1,('Signal rank','Hạng tín hiệu'),('Next return (%)','Lợi suất kế (%)'),[
 ('A: bottom','A: thấp nhất',10),('B: middle','B: giữa',0),('C: top','C: cao nhất',-5)],
 'Top-minus-bottom is C−A=−5%−10%=−15%; rank direction and weighting are part of the target.',
 'Top trừ bottom là C−A=−5%−10%=−15%; chiều xếp hạng/trọng số thuộc định nghĩa mục tiêu.')
bars(24,2,('Uncertainty estimator','Ước lượng bất định'),('SE (% monthly)','SE (%/tháng)'),[
 ('Conventional','Thông thường',.10),('HC','HC',.12),('HAC(3)','HAC(3)',.18)],
 'The estimate remains .30%; HAC 95% interval is [−.053,.653]%, which includes zero.',
 'Ước lượng vẫn .30%; khoảng 95% HAC là [−.053;.653]%, chứa 0.')
xy(24,3,('Monthly spread (%)','Spread tháng (%)'),('Density reference','Mốc mật độ'),[
 ('HAC interval and estimate','Khoảng HAC và ước lượng','scatter',[[-.05,0],[.30,0],[.65,0]])],
 'The manuscript example labels .30% with HAC interval [−.05,.65]% and zero reference.',
 'Ví dụ bản thảo ghi .30%, khoảng HAC [−.05;.65]% và mốc 0.')
bars(24,4,('Predeclared specification','Đặc tả định trước'),('Spread (% monthly)','Spread (%/tháng)'),[
 ('1','1',.30),('2','2',.28),('3','3',.31),('4','4',.08),('5','5',-.02)],
 'The first three variants align; alternate universe/weighting attenuate or reverse the result.',
 'Ba biến thể đầu gần nhau; vũ trụ/trọng số thay thế làm yếu hoặc đảo kết quả.')

# W25 — external review and release
steps(25,0,[('Table regenerates from current configuration / Bảng sinh lại theo cấu hình hiện tại','Figure came from stale cached CSV / Hình lấy CSV cache cũ','Checksum/regeneration exposes mismatch / Hash/tái sinh phát hiện lệch','Rebuild all artifacts together / Sinh lại mọi artifact cùng lúc')],
 'One frozen command should generate both the coefficient table and its figure.',
 'Một lệnh cấu hình khóa cần sinh cả bảng hệ số và hình.')
bars(25,1,('Evaluation setup','Thiết lập đánh giá'),('Test MAE','MAE test'),[
 ('Global scaler','Scaler toàn cục',.12),('Train-only fold scaler','Scaler chỉ train từng fold',.15)],
 'Fold-local preprocessing changes MAE from .12 to .15 after leakage correction.',
 'Tiền xử lý fold-local đổi MAE .12 thành .15 sau khi sửa rò rỉ.')
steps(25,2,[('Terms: academic use allowed / Điều khoản: cho dùng học thuật','Raw redistribution forbidden / Cấm phát tán dữ liệu thô','Keep source citation and downloader / Giữ trích dẫn nguồn/trình tải','Commit only synthetic fixture / Chỉ commit fixture tổng hợp')],
 'Access permission does not imply the repository may redistribute the downloaded file.',
 'Quyền truy cập không đồng nghĩa repo được phát tán file đã tải.')
steps(25,3,[('Reviewer changes return lag / Reviewer đổi return lag','Recompute coefficients and intervals / Tính lại hệ số/khoảng','Regenerate figure, abstract, and README / Sinh lại hình, abstract, README','Trace every result from raw fixture / Truy mọi kết quả về fixture')],
 'A lag correction propagates through every derived artifact; do not patch one caption only.',
 'Sửa lag lan đến mọi artifact phát sinh; không chỉ sửa một chú thích hình.')
steps(25,4,[('Primary: no winsorization / Chính: không winsorize','Sensitivity: predeclared 1% cap / Độ nhạy: ngưỡng 1% định trước','Count altered observations / Đếm quan sát bị đổi','Label post hoc checks exploratory / Gắn kiểm hậu nghiệm là khám phá')],
 'The example gives a 1% sensitivity rule but no invented spread value.',
 'Ví dụ nêu quy tắc nhạy 1% nhưng không bịa giá trị spread.')

# W26 — release and transition
steps(26,0,[('120-month synthetic panel / Panel tổng hợp 120 tháng','12-month signal, skip one month / Tín hiệu 12 tháng, bỏ qua một tháng','Sort quintiles at t; target return t+1 / Xếp quintile tại t; mục tiêu return t+1','Estimate mean spread, HAC(3), assert timing / Ước lượng spread mean, HAC(3), assertion thời gian')],
 'The pipeline asserts every feature timestamp precedes the target interval.',
 'Pipeline assertion timestamp đặc trưng có trước khoảng mục tiêu.')
xy(26,1,('Slope estimate','Ước lượng slope'),('Interval marker','Mốc khoảng'),[
 ('95% normal interval','Khoảng chuẩn 95%','scatter',[[-.09,0],[.40,0],[.89,0]])],
 'Slope=.4, SE=.25; interval [−.09,.89] includes zero and many positive effects.',
 'Slope=.4, SE=.25; khoảng [−.09;.89] chứa 0 và nhiều hiệu ứng dương.')
steps(26,2,[('Can derive QR/OLS and test orthogonality / Biết suy ra QR/OLS, test trực giao','Has not implemented panel HAC / Chưa cài HAC panel','Has not evaluated real point-in-time factor data / Chưa đánh giá factor point-in-time thật','List next falsifiable skill gaps / Nêu khoảng trống kỹ năng kiểm chứng kế')],
 'A precise skill audit is more informative than a generic “advanced” label.',
 'Kiểm kê kỹ năng cụ thể hữu ích hơn nhãn chung “nâng cao”.')
steps(26,3,[('Question and estimand / Câu hỏi và estimand','Timeline and universe / Timeline và vũ trụ','Estimate with HAC interval and zero line / Ước lượng với khoảng HAC/mốc 0','Robustness, reproducibility, limits, next test / Robustness, tái lập, giới hạn, test kế')],
 'The five-slide structure keeps every reported number traceable to the release.',
 'Cấu trúc năm slide giúp truy từng số báo cáo về bản phát hành.')
steps(26,4,[('Signal known at close t predicts return t+1 / Tín hiệu biết lúc đóng t dự báo return t+1','Random split may place future targets in train / Chia ngẫu nhiên có thể đưa đích tương lai vào train','Rolling split respects origin / Rolling giữ đúng mốc','Compare complexity with zero/persistence / So độ phức tạp với 0/persistence')],
 'Chronological evaluation protects future information and retains a meaningful baseline.',
 'Đánh giá thời gian bảo vệ thông tin tương lai và giữ benchmark có ý nghĩa.')

# W27 — chronological ML evaluation
steps(27,0,[('Train labels end by date 6 / Nhãn train kết thúc đến ngày 6','Validation targets 7–8 / Mục tiêu validation 7–8','Test targets 9–10 / Mục tiêu test 9–10','Two-step label at origin 5 ends at 7: purge / Nhãn hai bước ở mốc 5 kết thúc ngày 7: purge')],
 'Train, validation, and test are chronological; labels must be fully observed at cutoff.',
 'Train, validation, test theo thời gian; nhãn train phải biết đủ tại cutoff.')
bars(27,1,('Feature value','Giá trị đặc trưng'),('Raw value','Giá trị thô'),[
 ('Train 1','Train 1',0),('Train 2','Train 2',2),('Future test','Test tương lai',100)],
 'Train-only mean=1, SD=1 gives test z=99; global scaling uses the future extreme.',
 'Mean train-only=1, SD=1 cho z test=99; scale toàn cục dùng cực trị tương lai.')
steps(27,2,[('Two assets share dates 1…6 / Hai tài sản chung ngày 1…6','Origin date 4 labels dates 5–6 / Mốc ngày 4 gắn nhãn ngày 5–6','Test starts at 5 / Test bắt đầu ngày 5','Purge the overlapping training row / Purge hàng train có nhãn giao')],
 'Date-level grouping and target-window overlap—not just feature date—determine legality.',
 'Nhóm theo ngày và giao cửa sổ đích—không chỉ ngày đặc trưng—quyết định hợp lệ.')
steps(27,3,[('Outer origin 100 / Mốc outer 100','Inner origins 60,70,80 choose λ=1 / Inner 60,70,80 chọn λ=1','Test 101–110 remains untouched / Test 101–110 giữ nguyên','Repeat at 110,120 for distribution / Lặp ở 110,120 để có phân phối')],
 'Tuning on targets 101–110 and reporting the same block is leakage.',
 'Tuning bằng đích 101–110 rồi báo chính block ấy là rò rỉ.')
steps(27,4,[('Global scaler + random split gives optimistic R² / Scaler toàn cục + chia ngẫu nhiên cho R² lạc quan','Fit transforms inside each chronological fold / Fit biến đổi trong từng fold thời gian','Purge overlapping targets / Purge nhãn giao','Recompare baselines on identical origins / So benchmark lại cùng mốc')],
 'A lower corrected score can be the more credible estimate, not a broken model.',
 'Điểm sau sửa thấp hơn có thể đáng tin hơn, không đồng nghĩa mô hình hỏng.')

# W28 — target and data selection
steps(28,0,[('At close t: P[t]=100 / Đóng cửa t: P[t]=100','Next close=102, target +2% / Đóng cửa kế=102, mục tiêu +2%','Cutoff=16:00; release=16:05 / Hạn=16:00; công bố=16:05','Exclude late feature / Loại đặc trưng trễ')],
 'Target interval is (t,t+1]; the post-cutoff feature is unavailable even if dated t.',
 'Khoảng mục tiêu (t,t+1]; đặc trưng sau cutoff chưa khả dụng dù mang ngày t.')
bars(28,1,('Candidate source','Nguồn ứng viên'),('Screening score','Điểm sàng lọc'),[
 ('A: 2+0+2','A: 2+0+2',4),('B: 1+2+1','B: 1+2+1',4),('C: 2+2+2','C: 2+2+2',6)],
 'Scores combine license clarity, point-in-time history, and reproducibility; C ranks highest but still requires license review.',
 'Điểm gồm độ rõ giấy phép, lịch sử point-in-time, tái lập; C cao nhất nhưng vẫn cần rà giấy phép.')
steps(28,2,[('Q1 first release 5.0 on Apr 20 / Q1 công bố 5,0 ngày 20-4','Apr 30 cutoff admits 5.0 / Hạn 30-4 nhận 5,0','Revision 5.4 released May 10 / Bản sửa 5,4 ngày 10-5','May 15 cutoff admits 5.4 / Hạn 15-5 nhận 5,4')],
 'The period label is unchanged; admissibility follows release timestamp.',
 'Nhãn kỳ không đổi; tính hợp lệ theo timestamp công bố.')
steps(28,3,[('Panel key: (asset_id,date) / Khóa panel: (asset_id,date)','Delisted A has no later row, not zero return / A hủy niêm yết không có hàng sau, không phải return 0','Resolve B signal revisions by as-of time / Chọn bản sửa tín hiệu B theo as-of','Assert unique keys and join count / Assertion khóa duy nhất/số hàng join')],
 'The toy panel has two assets × three dates; missingness has a documented cause.',
 'Panel giả lập có 2 tài sản × 3 ngày; thiếu dữ liệu có nguyên nhân ghi rõ.')
steps(28,4,[('20 assets × 12 months = 240 rows / 20 tài sản × 12 tháng = 240 hàng','Universe selected on end-of-period survival / Vũ trụ chọn theo sống đến cuối kỳ','Disclose survivorship and no raw redistribution / Công bố survivorship, không phát tán dữ liệu thô','Commit code, metadata, synthetic fixture / Commit mã, metadata, fixture tổng hợp')],
 'The source permits academic access but forbids redistribution; a hash does not grant rights.',
 'Nguồn cho truy cập học thuật nhưng cấm phân phối lại; hash không cấp quyền.')

# W29 — baselines and scoring
bars(29,0,('Forecast method','Phương pháp dự báo'),('MSE','MSE'),[
 ('Zero baseline','Benchmark 0',.00045),('Forecast B','Dự báo B',.0001)],
 'For the four stated targets, B has MAE=.01 and skill 1−.0001/.00045≈.778 versus zero.',
 'Với bốn mục tiêu đã nêu, B có MAE=.01, skill 1−.0001/.00045≈.778 so với 0.')
xy(29,1,('Forecast origin','Mốc dự báo'),('Return forecast','Dự báo lợi suất'),[
 ('Expanding mean','Mean mở rộng','line',[[4,.0033333],[5,.01]]),
 ('Rolling W=2','Rolling W=2','line',[[5,.01]])],
 'At origin 3 mean of returns 1–3 is .003333; at origin 4 expanding and W=2 forecasts are .01 for return 5.',
 'Mốc 3 mean lợi suất 1–3 là .003333; mốc 4 mean mở rộng và W=2 đều dự báo .01 cho return 5.')
xy(29,2,('Price index','Chỉ số phiên'),('Price','Giá'),[
 ('Observed price','Giá quan sát','line',[[0,50],[1,55],[2,52.25],[3,57.475]]),
 ('Persistence forecast','Dự báo persistence','scatter',[[1,50],[2,55],[3,52.25]])],
 'Zero-return prediction is the current price; realized returns are +10%,−5%,+10%.',
 'Dự báo return 0 bằng giá hiện tại; lợi suất thực +10%,−5%,+10%.')
bars(29,3,('Month','Tháng'),('Seasonal-naive forecast','Dự báo seasonal-naive'),[
 ('4 ← 1','4 ← 1',4),('5 ← 2','5 ← 2',7),('6 ← 3','6 ← 3',5),('7 ← 4','7 ← 4',6)],
 'With seasonal period s=3, copied values (4,7,5,6) produce errors (2,3,3,3), MAE=2.75.',
 'Chu kỳ s=3 chép (4,7,5,6), sai số (2,3,3,3), MAE=2,75.')
bars(29,4,('Origin','Mốc'),('Paired improvement','Cải thiện ghép'),[
 ('1','1',.01),('2','2',-.01),('3','3',.02),('4','4',0),('5','5',.01)],
 'Baseline minus model loss is (.01,−.01,.02,0,.01), mean=.006; wins 3, tie 1, loss 1.',
 'Loss benchmark trừ mô hình là (.01,−.01,.02,0,.01), mean=.006; thắng 3, hòa 1, thua 1.')

# W30 — ACF and stationarity
bars(30,0,('Quantity','Đại lượng'),('Value','Giá trị'),[
 ('γ̂(0)','γ̂(0)',1.25),('γ̂(1)','γ̂(1)',.5),('ρ̂(1)','ρ̂(1)',.4)],
 'For x=(1,2,3,4), n-denominator estimates give γ̂(0)=1.25, γ̂(1)=.3125, ρ̂(1)=.25.',
 'Với x=(1,2,3,4), dùng mẫu số n cho γ̂(0)=1,25, γ̂(1)=.3125, ρ̂(1)=.25.')
xy(30,1,('Time','Thời gian'),('Level / difference','Mức / sai phân'),[
 ('Random-walk level','Mức random walk','line',[[0,10],[1,11],[2,9],[3,10]]),
 ('Innovation Δy','Nhiễu Δy','scatter',[[1,1],[2,-2],[3,1]])],
 'Starting at 10, innovations (+1,−2,+1) yield levels (10,11,9,10) and differences (+1,−2,+1).',
 'Bắt đầu 10, nhiễu (+1,−2,+1) cho mức (10,11,9,10), sai phân (+1,−2,+1).')
bars(30,2,('ADF specification','Đặc tả ADF'),('p-value','p-value'),[
 ('Constant','Hằng số',.18),('Constant + trend','Hằng số + trend',.07),('5% threshold','Ngưỡng 5%',.05)],
 'Both reported p-values exceed .05; non-rejection does not prove a unit root.',
 'Cả hai p-value lớn hơn .05; không bác bỏ không chứng minh unit root.')
xy(30,3,('Index t','Chỉ số t'),('x[t]','x[t]'),[
 ('Observed sequence','Chuỗi quan sát','line',[[1,2],[2,5],[3,2],[4,5],[5,2],[6,5],[7,2]])],
 'At lag 2 seasonal differences are all zero; ordinary differences alternate +3,−3.',
 'Sai phân mùa trễ 2 đều bằng 0; sai phân thường luân phiên +3,−3.')
bars(30,4,('Window endpoint t','Cuối cửa sổ t'),('Trailing W=3 mean','Mean lùi W=3'),[
 ('t=3','t=3',2),('t=4','t=4',4),('t=5','t=5',4),('t=6','t=6',4)],
 'For (2,2,2,8,2,2), the isolated 8 remains in three successive windows.',
 'Với (2,2,2,8,2,2), số 8 đơn lẻ nằm trong ba cửa sổ liên tiếp.')

# W31 — autoregressive models
bars(31,0,('Quantity','Đại lượng'),('Value','Giá trị'),[
 ('Forecast','Dự báo',.8),('Realized if ε=−.3','Thực nếu ε=−.3',.5)],
 'With c=.2,φ=.6,y[t]=1, forecast=.8; innovation −.3 makes realization .5.',
 'Với c=.2,φ=.6,y[t]=1, dự báo=.8; nhiễu −.3 cho thực tế .5.')
xy(31,1,('Lag y[t−1]','Lag y[t−1]'),('Target y[t]','Đích y[t]'),[
 ('Pairs (0,1),(1,1),(1,3)','Cặp (0,1),(1,1),(1,3)','scatter',[[0,1],[1,1],[1,3]]),
 ('OLS: intercept 1,slope 1','OLS: intercept 1,slope 1','line',[[0,1],[1,2]])],
 'For y=(0,1,1,3), the corrected OLS slope is 1 and intercept 1; residuals are (0,−1,1).',
 'Với y=(0,1,1,3), OLS đúng có slope 1, intercept 1; residual (0,−1,1).')
xy(31,2,('Horizon h','Chân trời h'),('Expected deviation','Độ lệch kỳ vọng'),[
 ('φ=.8, deviation starts at 5','φ=.8, lệch đầu=5','line',[[0,5],[1,4],[2,3.2],[3,2.56]])],
 'Mean reversion multiplies the current deviation by .8 each step; half-life is about 3.11.',
 'Hồi quy mean nhân độ lệch hiện tại .8 mỗi bước; bán rã khoảng 3,11.')
xy(31,3,('Horizon h','Chân trời h'),('Forecast level','Mức dự báo'),[
 ('Conditional mean','Mean có điều kiện','line',[[1,4],[2,3],[3,2.5],[4,2.25]]),
 ('Upper 95% bound','Cận trên 95%','line',[[1,5.176],[2,4.314],[3,3.847],[4,3.605]])],
 'For c=1,φ=.5,y=6, means are 4,3,2.5,2.25; h=4 forecast SE≈.6915.',
 'Với c=1,φ=.5,y=6, mean 4,3,2,5,2,25; SE h=4≈.6915.')
steps(31,4,[('Residual ACF(1)=.52, ACF(2)=.08 / ACF residual trễ 1=.52, trễ 2=.08','Validation MAE p=1,2,3: .9,.92,1.1 / MAE validation p=1,2,3: .9,.92,1.1','Keep p=1 or investigate within validation / Giữ p=1 hoặc điều tra trong validation','Do not open final test / Không mở test cuối')],
 'Residual correlation is a diagnostic; validation does not show higher order forecast gains.',
 'Tương quan residual là chẩn đoán; validation không cho thấy bậc cao dự báo tốt hơn.')

# W32 — volatility and EWMA
bars(32,0,('Return observation','Lợi suất'),('Squared return','Lợi suất bình phương'),[
 ('+.02','+.02',.0004),('−.04','−.04',.0016),('+.01','+.01',.0001)],
 'The squared-return sequence removes sign and retains shock magnitude.',
 'Chuỗi bình phương bỏ dấu, giữ độ lớn cú sốc.')
bars(32,1,('Estimator','Estimator'),('Variance proxy','Proxy phương sai'),[
 ('W=2 mean square','Mean square W=2',.001),('W=3 mean square','Mean square W=3',.0008),('Unbiased sample variance','Phương sai mẫu không chệch',.0009333)],
 'For returns (.02,−.02,.04), rolling mean-square and sample variance use different centering/denominators.',
 'Với lợi suất (.02,−.02,.04), mean-square rolling và phương sai mẫu khác phép trừ trung bình/mẫu số.')
bars(32,2,('Update state','Trạng thái cập nhật'),('Variance','Phương sai'),[
 ('Before shock v₀','Trước cú sốc v₀',.001),('After r=.05, v₁','Sau r=.05, v₁',.0013)],
 'λ=.8: v₁=.8(.001)+.2(.05²)=.0013; weight half-life≈3.11.',
 'λ=.8: v₁=.8(.001)+.2(.05²)=.0013; bán rã trọng số≈3,11.')
bars(32,3,('Variance forecast','Dự báo phương sai'),('QLIKE contribution','Đóng góp QLIKE'),[
 ('v=.001, RV=.002','v=.001, RV=.002',.30685),('v=.004, RV=.002','v=.004, RV=.002',.19315)],
 'Using QLIKE=RV/v−ln(RV/v)−1, lower loss favors v=.004 for this one realized variance.',
 'Dùng QLIKE=RV/v−ln(RV/v)−1, loss thấp hơn ưu tiên v=.004 ở realized variance đơn này.')
bars(32,4,('Forecast volatility σ̂','Biến động dự báo σ̂'),('Position scale min(1,.01/σ̂)','Scale min(1,.01/σ̂)'),[
 ('σ̂=.01','σ̂=.01',1),('σ̂=.02','σ̂=.02',.5),('σ̂=.04','σ̂=.04',.25)],
 'Scaling targets daily volatility .01 under a cap; it does not assert expected return or alpha.',
 'Scale nhắm biến động ngày .01 theo trần; không khẳng định lợi suất kỳ vọng hay alpha.')

# W33 — state-space models
bars(33,0,('Quantity','Đại lượng'),('Value','Giá trị'),[
 ('Latent state x','Trạng thái ẩn x',10),('Observation y=x+v','Quan sát y=x+v',12)],
 'With H=1 and measurement noise realization v=2, the observation exceeds the latent state by 2.',
 'Với H=1, nhiễu đo v=2, quan sát cao hơn trạng thái ẩn 2.')
bars(33,1,('State estimate','Ước lượng trạng thái'),('Mean','Mean'),[
 ('Prior','Tiên nghiệm',10),('Observation','Quan sát',14),('Filtered','Filtered',12.222)],
 'P=4,Q=1,R=4 gives K=5/9 and posterior mean 10+(5/9)(14−10)=12.222.',
 'P=4,Q=1,R=4 cho K=5/9, mean hậu nghiệm 10+(5/9)(14−10)=12,222.')
matrix(33,2,['predicted state 1','predicted state 2'],['state 1','state 2'],
 [[5,.5],[.5,.75]],
 'From F=diag(1,.5), prior P=[[4,1],[1,2]], Q=diag(1,.25), Ppred=[[5,.5],[.5,.75]].',
 'Với F=diag(1,.5), P trước=[[4,1],[1,2]], Q=diag(1,.25), P dự báo=[[5,.5],[.5,.75]].')
steps(33,3,[('Filtered x[t|t] uses observations through t / Filtered x[t|t] dùng đến t','Predicted x[t+1|t] uses the same prefix / Predicted x[t+1|t] dùng cùng prefix','Smoothed x[t|T] also uses future observations / Smoothed x[t|T] dùng cả quan sát tương lai','Only filtered state is real-time admissible / Chỉ trạng thái filtered hợp lệ thời gian thực')],
 'The three estimates differ by their conditioning information set.',
 'Ba ước lượng khác nhau ở tập thông tin điều kiện.')
xy(33,4,('Time','Thời gian'),('Latent level','Mức ẩn'),[
 ('Deterministic transition','Chuyển tất định','line',[[0,10],[1,12]])],
 'For state (level,slope)=(10,2), F=[[1,1],[0,1]] predicts state (12,2), observation 12.',
 'Trạng thái (mức,dốc)=(10,2), F=[[1,1],[0,1]] dự báo (12,2), quan sát 12.')

# W34 — Kalman filtering
bars(34,0,('Estimate stage','Giai đoạn ước lượng'),('State mean','Mean trạng thái'),[
 ('Prior','Tiên nghiệm',3),('Observation','Quan sát',7),('Posterior','Hậu nghiệm',6)],
 'Ppred=9,R=3 yields K=.75; the posterior moves three-quarters of the 4-unit innovation.',
 'Ppred=9,R=3 cho K=.75; hậu nghiệm dịch ba phần tư innovation 4 đơn vị.')
matrix(34,1,['posterior state 1','posterior state 2'],['state 1','state 2'],
 [[4/3,2/3],[2/3,7/3]],
 'For the stated correlated two-state update, posterior covariance is [[4/3,2/3],[2/3,7/3]].',
 'Cập nhật hai trạng thái tương quan đã nêu cho covariance hậu nghiệm [[4/3,2/3],[2/3,7/3]].')
bars(34,2,('Process noise Q','Nhiễu quá trình Q'),('Posterior mean','Mean hậu nghiệm'),[
 ('Q=.5','Q=.5',6.333),('Q=3','Q=3',7.286)],
 'With prior mean 5,P=1,R=3,y=9, higher Q raises the gain and tracks the observation more.',
 'Với mean trước 5,P=1,R=3,y=9, Q lớn tăng gain và bám phép đo hơn.')
bars(34,3,('Handling next measurement','Xử lý phép đo kế'),('State mean','Mean trạng thái'),[
 ('Correct: missing, skip update','Đúng: thiếu, bỏ cập nhật',2),('Incorrect: impute zero','Sai: điền 0',.286)],
 'With P=4,Q=2, missing observation keeps predicted mean 2; fake y=0 pulls it to 2/7.',
 'Với P=4,Q=2, quan sát thiếu giữ mean dự báo 2; y=0 giả kéo xuống 2/7.')
xy(34,4,('Observation index','Chỉ số quan sát'),('Filtered mean','Mean filtered'),[
 ('Filtered means','Mean filtered','line',[[1,10],[2,11.2],[3,11.1]])],
 'The reported means are (10,11.2,11.1) and standard errors (1,.8,.7); later data must not change a filtered prefix.',
 'Mean báo cáo (10;11,2;11,1), SE (1;.8;.7); dữ liệu sau không được đổi prefix filtered.')

# W35 — diagnostics and estimation
xy(35,0,('Observation index','Chỉ số quan sát'),('Standardized innovation z','Innovation chuẩn hóa z'),[
 ('z values','Giá trị z','scatter',[[1,2],[2,-2],[3,1]])],
 'For (ŷ,S,y)=(10,4,14),(8,1,6),(5,9,8), standardized innovations are 2,−2,1.',
 'Với (ŷ,S,y)=(10,4,14),(8,1,6),(5,9,8), innovation chuẩn hóa là 2,−2,1.')
bars(35,1,('Innovation (e,S)','Innovation (e,S)'),('Log-likelihood contribution','Đóng góp log-likelihood'),[
 ('e=1,S=2','e=1,S=2',-1.516),('e=0,S=2','e=0,S=2',-1.266)],
 'The nonzero innovation lowers the scalar Gaussian log-density by .25 at the same S.',
 'Innovation khác 0 làm log-density Gaussian thấp hơn .25 khi S giữ nguyên.')
xy(35,2,('Observation value','Giá trị quan sát'),('Predictive density','Mật độ dự báo'),[
 ('95% interval','Khoảng 95%','scatter',[[-1.88,0],[4,0],[9.88,0]])],
 'Predicted mean 4 and predictive variance 5+4=9 give SD 3 and interval 4±1.96×3.',
 'Mean dự báo 4, variance dự báo 5+4=9 cho SD 3, khoảng 4±1,96×3.')
steps(35,3,[('Fit Q=.1,R=1 on first 80 / Fit Q=.1,R=1 trên 80 điểm đầu','Level jumps +5 at t=81 / Mức nhảy +5 tại t=81','Innovation spikes under fixed filter / Innovation tăng ở filter khóa','Keep test frozen; report the break / Giữ test khóa; báo điểm gãy')],
 'The example treats the jump as evidence about the fixed filter, not permission to retune on test.',
 'Ví dụ xem cú nhảy là bằng chứng về filter cố định, không phải quyền tuning test.')
xy(35,4,('Timestamp index','Chỉ số thời gian'),('Standardized innovation z','Innovation chuẩn hóa z'),[
 ('Observed z','z quan sát','line',[[1,.4],[2,-1.1],[3,2.3],[4,-2.6],[5,.2]]),
 ('Threshold +2','Ngưỡng +2','line',[[1,2],[5,2]]),
 ('Threshold −2','Ngưỡng −2','line',[[1,-2],[5,-2]])],
 'The prespecified |z|>2 rule flags indices 3 and 4: 2/5=.40 in this tiny sequence.',
 'Quy tắc định trước |z|>2 gắn cờ chỉ số 3,4: 2/5=.40 trong chuỗi nhỏ này.')

# Final reconciliation: these figures are derived from each session's canonical workedExample.
# Keep this override block near main() so stale early drafts cannot reintroduce mismatched data.
xy(14,4,('Period','Kỳ'),('Wealth from 1','Tài sản từ 1'),[
 ('Compounded asset / Tài sản kép','Tài sản kép','line',[[0,1],[1,1.05],[2,1.0185]])],
 'Returns +5%,−3% compound to 1.0185, a gain of 1.85%.',
 'Lợi suất +5%,−3% kép thành 1,0185, tức tăng 1,85%.')
bars(29,0,('Forecast','Dự báo'),('MSE','MSE'),[
 ('Zero baseline','Benchmark 0',.0004667),('Forecast B','Dự báo B',.0001)],
 'MSE from the worked example: zero forecast .0004667; forecast B .0001.',
 'MSE theo ví dụ: dự báo 0 là 0,0004667; dự báo B là 0,0001.')
xy(29,1,('Forecast origin','Mốc dự báo'),('Forecast return','Lợi suất dự báo'),[
 ('Expanding mean','Mean mở rộng','line',[[3,.0066667],[4,0]])],
 'The expanding forecast is .006667 after the first three observations and 0 after the fourth return −.02 arrives.',
 'Dự báo expanding là 0,006667 sau ba quan sát đầu và bằng 0 sau khi lợi suất thứ tư −0,02 xuất hiện.')
xy(29,2,('Date','Ngày'),('Price','Giá'),[
 ('Observed price','Giá quan sát','line',[[1,100],[2,102],[3,101]]),
 ('Persistence forecast for P3','Dự báo persistence cho P3','scatter',[[3,102]])],
 'Observed prices are 100,102,101; persistence forecasts P3=102, so the level error is −1.',
 'Giá quan sát là 100,102,101; persistence dự báo P3=102 nên sai số mức là −1.')
bars(29,3,('Target month','Tháng mục tiêu'),('Absolute forecast error','Sai số dự báo tuyệt đối'),[
 ('Month 4','Tháng 4',5),('Month 5','Tháng 5',1),('Month 6','Tháng 6',3)],
 'Seasonal-period-3 forecasts for months 4–6 are 10,12,11; absolute errors are 5,1,3.',
 'Dự báo chu kỳ mùa vụ 3 cho tháng 4–6 là 10,12,11; sai số tuyệt đối là 5,1,3.')
bars(29,4,('Date','Ngày'),('Baseline loss − model loss','Loss benchmark − loss mô hình'),[
 ('1','1',.01),('2','2',-.01),('3','3',.01),('4','4',.01)],
 'Paired loss improvements are .01,−.01,.01,.01; their mean is .005.',
 'Mức cải thiện loss theo cặp là 0,01;−0,01;0,01;0,01; trung bình là 0,005.')
bars(30,0,('Lag','Độ trễ'),('Autocovariance / correlation','Tự hiệp phương sai / tương quan'),[
 ('γ̂(0)','γ̂(0)',1.25),('γ̂(1)','γ̂(1)',.3125),('ρ̂(1)','ρ̂(1)',.25)],
 'For x=(1,2,3,4), γ̂(0)=1.25, γ̂(1)=.3125, and ρ̂(1)=.25 using denominator n.',
 'Với x=(1,2,3,4), γ̂(0)=1,25, γ̂(1)=0,3125 và ρ̂(1)=0,25 khi chia cho n.')
xy(30,2,('Observation','Quan sát'),('Level mean','Mean mức'),[
 ('Level with one break','Mức có một điểm gãy','line',[[1,10],[2,10],[3,10],[4,20],[5,20],[6,20]])],
 'The example level path is 10,10,10,20,20,20, with one mean break.',
 'Đường mức trong ví dụ là 10,10,10,20,20,20, có một lần gãy mean.')
xy(30,3,('Time','Thời gian'),('Observed value','Giá trị quan sát'),[
 ('Observed sequence','Chuỗi quan sát','line',[[1,1],[2,3],[3,1],[4,3],[5,1],[6,3]])],
 'The repeated sequence (1,3,1,3,1,3) has zero seasonal difference at lag 2.',
 'Chuỗi lặp (1,3,1,3,1,3) có sai phân mùa vụ bằng 0 ở độ trễ 2.')
xy(31,1,('Previous value x','Giá trị trước x'),('Next value y','Giá trị kế y'),[
 ('Training pairs','Cặp huấn luyện','scatter',[[1,2],[2,2],[2,4]]),
 ('OLS fitted: y=1+x','OLS khớp: y=1+x','line',[[1,2],[2,3]])],
 'Pairs are (1,2),(2,2),(2,4); OLS gives intercept 1 and slope 1, with fitted values 2,3,3.',
 'Các cặp là (1,2),(2,2),(2,4); OLS cho hệ số chặn 1, hệ số góc 1, giá trị khớp 2,3,3.')
xy(31,3,('Forecast horizon','Chân trời dự báo'),('Conditional mean','Mean có điều kiện'),[
 ('AR(1) forecast','Dự báo AR(1)','line',[[1,1.2],[2,.8],[3,.6]]),
 ('Long-run mean μ=.4','Mean dài hạn μ=.4','line',[[1,.4],[3,.4]])],
 'For c=.2, φ=.5, and y[t]=2, forecasts are 1.2,.8,.6 and approach μ=.4.',
 'Với c=.2, φ=.5, y[t]=2, dự báo là 1.2,.8,.6 và tiến gần μ=.4.')
bars(32,1,('Estimator','Ước lượng'),('Variance estimate','Ước lượng phương sai'),[
 ('Known zero-mean: divide by 3','Biết mean 0: chia 3',.0004667),
 ('Unbiased sample variance: divide by 2','Phương sai mẫu không chệch: chia 2',.0007)],
 'Squared returns sum to .0014. Dividing by 3 gives .0004667; the unbiased sample variance divides by 2 and is .0007.',
 'Tổng bình phương lợi suất là 0,0014. Chia 3 được 0,0004667; phương sai mẫu không chệch chia 2 và bằng 0,0007.')
bars(34,0,('Estimate stage','Giai đoạn ước lượng'),('State mean','Mean trạng thái'),[
 ('Prior mean','Mean trước',10),('Observation','Quan sát',14),('Posterior mean','Mean sau',12)],
 'Prior mean 10 and observation 14 with equal variances update to posterior mean 12.',
 'Mean trước 10 và quan sát 14 với phương sai bằng nhau cho mean hậu nghiệm 12.')
matrix(34,1,['posterior state 1','posterior state 2'],['state 1','state 2'],
 [[.5,.25],[.25,.875]],
 'For the worked correlated two-state update, posterior covariance is [[.5,.25],[.25,.875]].',
 'Trong cập nhật hai trạng thái tương quan của ví dụ, covariance hậu nghiệm là [[.5,.25],[.25,.875]].')
bars(34,2,('Process noise Q','Nhiễu quá trình Q'),('Posterior mean','Mean hậu nghiệm'),[
 ('Q=.1','Q=.1',1.537),('Q=2','Q=2',2)],
 'With prior P=2,R=2, innovation 3, Q=.1 gives posterior mean 1.537; Q=2 gives 2.',
 'Với P=2,R=2, innovation 3, Q=.1 cho mean hậu nghiệm 1,537; Q=2 cho 2.')
bars(34,3,('Missing-data handling','Xử lý dữ liệu thiếu'),('State mean','Mean trạng thái'),[
 ('Missing: skip update','Thiếu: bỏ cập nhật',5),('Incorrectly impute y=20','Điền sai y=20',16.25)],
 'Prediction retains mean 5 when observation is missing; treating y=20 as real moves the mean to 16.25.',
 'Dự báo giữ mean 5 khi thiếu quan sát; coi y=20 là thật kéo mean lên 16,25.')
xy(35,0,('Observation','Quan sát'),('Standardized innovation z','Innovation chuẩn hóa z'),[
 ('Worked-example z','z trong ví dụ','scatter',[[1,2],[2,-2]])],
 'The two standardized innovations in the example are 2 and −2.',
 'Hai innovation chuẩn hóa trong ví dụ là 2 và −2.')
bars(35,1,('Innovation (e,S)','Innovation (e,S)'),('Log-density','Log-density'),[
 ('e=2,S=4','e=2,S=4',-2.112),('e=0,S=1','e=0,S=1',-.919)],
 'Gaussian log-density contributions are approximately −2.112 for (e=2,S=4) and −.919 for (e=0,S=1).',
 'Đóng góp log-density Gaussian xấp xỉ −2,112 với (e=2,S=4) và −0,919 với (e=0,S=1).')
xy(35,2,('Observation value','Giá trị quan sát'),('Predictive density','Mật độ dự báo'),[
 ('90% interval','Khoảng 90%','scatter',[[6.71,0],[10,0],[13.29,0]])],
 'Predictive mean 10 and variance 4 give SD 2 and approximate 90% interval [6.71,13.29].',
 'Mean dự báo 10, variance 4 cho SD 2 và khoảng 90% xấp xỉ [6,71;13,29].')
xy(35,4,('Timestamp index','Chỉ số thời gian'),('Standardized innovation z','Innovation chuẩn hóa z'),[
 ('Observed z at t=7','z quan sát tại t=7','scatter',[[7,2.3]]),
 ('Threshold +2','Ngưỡng +2','line',[[6,2],[8,2]]),
 ('Threshold −2','Ngưỡng −2','line',[[6,-2],[8,-2]])],
 'The single worked-example innovation z=2.3 at t=7 exceeds the prespecified threshold |z|>2.',
 'Innovation z=2,3 tại t=7 trong ví dụ vượt ngưỡng định trước |z|>2.')

def main():
    data=json.loads(LESSONS.read_text(encoding='utf-8'))
    assert len(V)==110, f"expected 110 visuals, got {len(V)}"
    target_weeks={m['week'] for m in data if 14<=m['week']<=35}
    assert target_weeks==set(range(14,36)), f"unexpected lesson coverage: {sorted(target_weeks)}"
    for m in data:
        if not 14<=m['week']<=35:
            continue
        for d,s in enumerate(m['sessions']):
            key=(m['week'],d)
            spec=V[key]
            s['visual']={"kind":spec['kind'],"title":s['title'],"caption":spec['caption'],
                **{k:v for k,v in spec.items() if k not in ('kind','caption')}}
    LESSONS.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f"attached {len(V)} exact visuals")

if __name__=='__main__': main()
