import type {MathExercise} from '../../lib/math-curriculum-types';
import type {Bilingual} from '../../lib/lesson-types';
const b=(en:string,vi:string):Bilingual=>({en,vi});
type Question={prompt:Bilingual;solution:Bilingual[]};
/** Independent introductory fixtures; later questions use their own canonical mathematical context. */
export const introductoryPractice:Record<string,[Question,Question,Question]>={
 'f-w001-e1':[
  {prompt:b('For f(x)=x², derive f′(a) from the limit definition. Why can h be cancelled but not set to zero in the original quotient?','Với f(x)=x², suy f′(a) từ định nghĩa giới hạn. Vì sao được khử h nhưng không được thay h=0 vào thương ban đầu?'),
   solution:[b('(a+h)²−a²=2ah+h².','(a+h)²−a²=2ah+h².'),b('For h≠0 the quotient is 2a+h, which tends to 2a. Thus f′(a)=2a.','Với h≠0, thương là 2a+h, tiến về 2a. Vậy f′(a)=2a.'),b('A limit uses nonzero h approaching zero; substituting zero first creates 0/0.','Giới hạn dùng h khác 0 tiến về 0; thay 0 trước tạo 0/0.')]},
  {prompt:b('For g(x)=½(2x+1)², derive g′(x) by expansion and by the chain rule.','Với g(x)=½(2x+1)², suy g′(x) bằng khai triển và bằng quy tắc dây chuyền.'),
   solution:[b('g=2x²+2x+½, hence g′=4x+2.','g=2x²+2x+½ nên g′=4x+2.'),b('Set u=2x+1; d(½u²)/du=u and u′=2, giving 2(2x+1).','Đặt u=2x+1; d(½u²)/du=u, u′=2, cho 2(2x+1).'),b('Both agree for every real x; the inner factor 2 is necessary.','Hai cách đúng với mọi x thực; hệ số đạo hàm trong 2 là bắt buộc.')]},
  {prompt:b('For f(x)=x² at x=1, a solver calls the forward difference with h=.2 the exact derivative. Compute both slopes and repair the claim.','Với f(x)=x² tại x=1, người giải gọi sai phân tiến h=0,2 là đạo hàm chính xác. Tính hai độ dốc và sửa kết luận.'),
   solution:[b('The exact derivative is 2.','Đạo hàm chính xác là 2.'),b('The secant slope is (1.2²−1)/.2=2.2; error=.2.','Độ dốc dây cung (1,2²−1)/0,2=2,2; sai số=0,2.'),b('For nonzero h the slope is 2+h. It approaches 2, but is not equal to it here.','Với h khác 0, độ dốc là 2+h. Nó tiến về 2 nhưng ở đây chưa bằng 2.')]}
 ],
 'f-w001-e2':[
  {prompt:b('A map R³→R² has rank 2. Find its nullity. Is Ax=b uniquely solvable for every b∈R²?','Ánh xạ R³→R² có hạng 2. Tìm nullity. Ax=b có nghiệm duy nhất với mọi b∈R² không?'),
   solution:[b('Nullity=3−2=1 by rank-nullity.','Nullity=3−2=1 theo rank-nullity.'),b('Rank equals codomain dimension, so every b is attainable.','Hạng bằng chiều đối miền, nên mọi b đều đạt được.'),b('The nonzero kernel direction gives infinitely many solutions for each b.','Hướng kernel khác 0 cho vô số nghiệm với mỗi b.')]},
  {prompt:b('A=[[2,1],[4,2]]. Find bases for its column space and kernel by solving Ax=0.','A=[[2,1],[4,2]]. Tìm cơ sở không gian cột và kernel bằng cách giải Ax=0.'),
   solution:[b('Column two is half column one; {(2,4)} is a column-space basis.','Cột hai bằng nửa cột một; {(2,4)} là cơ sở không gian cột.'),b('Ax=0 reduces to 2x₁+x₂=0, so x=t(1,−2).','Ax=0 rút về 2x₁+x₂=0, nên x=t(1,−2).'),b('A kernel basis is {(1,−2)}; rank and nullity are both one.','Cơ sở kernel là {(1,−2)}; hạng và nullity đều bằng một.')]},
  {prompt:b('For A=[[1,0,0],[0,1,0]], a solver says full row rank ensures uniqueness. Exhibit two solutions to Ax=(2,3) and identify the missing condition.','Với A=[[1,0,0],[0,1,0]], người giải nói hạng hàng đầy đủ bảo đảm duy nhất. Cho hai nghiệm Ax=(2,3), nêu điều kiện còn thiếu.'),
   solution:[b('(2,3,0) and (2,3,1) both work.','(2,3,0) và (2,3,1) đều đúng.'),b('Their difference (0,0,1) is in the kernel.','Hiệu (0,0,1) thuộc kernel.'),b('Uniqueness needs zero kernel, or full column rank, not just full row rank.','Duy nhất cần kernel bằng 0, tức hạng cột đầy đủ, không chỉ hạng hàng đầy đủ.')]}
 ],
 'f-w001-e3':[
  {prompt:b('Prevalence=.02, sensitivity=.9, false-positive rate=.05. In 10,000 people, count true and false positives and derive P(disease|positive).','Tỷ lệ nền=0,02, sensitivity=0,9, dương giả=0,05. Trong 10.000 người, đếm dương thật, dương giả rồi suy P(bệnh|dương).'),
   solution:[b('200 are diseased; 180 test positive.','200 có bệnh; 180 dương tính.'),b('9,800 are healthy; 490 test positive.','9.800 không bệnh; 490 dương tính.'),b('Posterior=180/670=18/67≈.268657.','Hậu nghiệm=180/670=18/67≈0,268657.')]},
  {prompt:b('Fix sensitivity .9 and false-positive rate .05. Express positive predictive value as a function of prevalence p∈(0,1), and prove it increases.','Giữ sensitivity 0,9, dương giả 0,05. Viết xác suất có bệnh khi dương theo tỷ lệ nền p∈(0,1), chứng minh tăng.'),
   solution:[b('q(p)=.9p/[.9p+.05(1−p)]=.9p/(.05+.85p).','q(p)=0,9p/[0,9p+0,05(1−p)]=0,9p/(0,05+0,85p).'),b('q′(p)=.045/(.05+.85p)².','q′(p)=0,045/(0,05+0,85p)².'),b('The derivative is positive on (0,1), proving the claim.','Đạo hàm dương trên (0,1), chứng minh kết luận.')]},
  {prompt:b('Sensitivity=.95 and prevalence=.01. Someone concludes P(disease|positive)=.95. Give two false-positive rates with different posterior probabilities.','Sensitivity=0,95, tỷ lệ nền=0,01. Người giải kết luận P(bệnh|dương)=0,95. Cho hai tỷ lệ dương giả có hậu nghiệm khác nhau.'),
   solution:[b('False-positive rate is missing, so the posterior is undetermined.','Thiếu tỷ lệ dương giả, hậu nghiệm chưa xác định.'),b('At rate zero, every positive is diseased and posterior=1.','Tỷ lệ 0: mọi dương tính đều có bệnh, hậu nghiệm=1.'),b('At rate .1, posterior=.0095/(.0095+.099)=19/217≈.087558, not .95.','Tỷ lệ 0,1: hậu nghiệm=0,0095/(0,0095+0,099)=19/217≈0,087558, không phải 0,95.')]}
 ],
 'f-w001-e4':[
  {prompt:b('Negate “∀x∈R ∃y∈R: y>x.” Preserve order and decide if the original claim is true.','Phủ định “∀x∈R ∃y∈R: y>x.” Giữ thứ tự, xét mệnh đề gốc đúng không.'),
   solution:[b('Negation: ∃x∈R ∀y∈R: y≤x.','Phủ định: ∃x∈R ∀y∈R: y≤x.'),b('The original is true by choosing y=x+1.','Mệnh đề gốc đúng khi chọn y=x+1.'),b('The negation is false: no real number bounds all real numbers above.','Phủ định sai: không có số thực chặn trên mọi số thực.')]},
  {prompt:b('Prove ∀x∈R ∃y∈R: x+y=0. Does ∃y∈R ∀x∈R: x+y=0 hold?','Chứng minh ∀x∈R ∃y∈R: x+y=0. ∃y∈R ∀x∈R: x+y=0 đúng không?'),
   solution:[b('For fixed x choose y=−x.','Với x cố định chọn y=−x.'),b('A single y cannot work: x=0 needs y=0 while x=1 needs y=−1.','Một y không dùng chung được: x=0 cần y=0, x=1 cần y=−1.'),b('The witness in the first claim may depend on x; quantifier order changes its meaning.','Nhân chứng ở mệnh đề đầu có thể phụ thuộc x; thứ tự lượng từ làm đổi ý nghĩa.')]},
  {prompt:b('A solver checks x²≥x at x=0,1,2 and claims it for every real x. Refute or repair the claim and give its exact domain.','Người giải kiểm x²≥x tại x=0,1,2 rồi nói đúng với mọi x thực. Bác bỏ hoặc sửa, tìm miền đúng chính xác.'),
   solution:[b('At x=½, x²=¼<½: a counterexample.','Tại x=½, x²=¼<½: đây là phản ví dụ.'),b('x(x−1)≥0 exactly when x≤0 or x≥1.','x(x−1)≥0 đúng khi và chỉ khi x≤0 hoặc x≥1.'),b('Finite checks cannot establish a universal real-variable claim.','Kiểm hữu hạn không chứng minh mệnh đề phổ quát theo biến thực.')]}
 ],
 'f-w001-e5':[
  {prompt:b('For 25 independent Bernoulli(.4) draws, compute the sum’s mean and variance and the average’s variance.','Với 25 lượt Bernoulli(0,4) độc lập, tính trung bình, phương sai tổng và phương sai trung bình.'),
   solution:[b('Each draw has mean .4 and variance .24.','Mỗi lượt có trung bình 0,4, phương sai 0,24.'),b('Sum: mean 10, variance 6.','Tổng: trung bình 10, phương sai 6.'),b('Average variance=6/25²=.0096.','Phương sai trung bình=6/25²=0,0096.')]},
  {prompt:b('An average of n independent draws has variance σ²/n. Derive its standard error and how to halve it when σ>0.','Trung bình n lượt độc lập có phương sai σ²/n. Suy sai số chuẩn và cách giảm nó một nửa khi σ>0.'),
   solution:[b('Standard error is σ/√n.','Sai số chuẩn là σ/√n.'),b('Require σ/√nnew=σ/(2√n).','Yêu cầu σ/√nnew=σ/(2√n).'),b('Then nnew=4n, not 2n.','Suy nnew=4n, không phải 2n.')]},
  {prompt:b('All n Bernoulli(p) readings copy one single draw. A solver reports average variance p(1−p)/n. Find and justify the true variance.','Cả n quan sát Bernoulli(p) sao cùng một lượt. Người giải báo phương sai trung bình p(1−p)/n. Tìm và biện minh phương sai thật.'),
   solution:[b('The average equals the original Bernoulli draw.','Trung bình bằng đúng lượt Bernoulli ban đầu.'),b('Its variance is p(1−p), independent of n.','Phương sai là p(1−p), không phụ thuộc n.'),b('Every cross-covariance is p(1−p); omitting them falsely assumes independence.','Mọi covariance chéo là p(1−p); bỏ chúng là giả sử độc lập sai.')]}
 ],
};
/** Complementary tasks on today's object, not old spaced-review clones. */
export function conceptPractice(primary:MathExercise):[MathExercise,MathExercise,MathExercise,MathExercise]{
 const teaching=primary.teaching!;
 const make=(role:MathExercise['practiceRole'],index:number,title:Bilingual,q:Question):MathExercise=>({
  id:primary.id+'-practice-'+index,revision:primary.revision,title,practiceRole:role,relatedExerciseId:primary.id,
  skills:role==='concept'?['derivation']:role==='error analysis'?['transfer']:['derivation'],
  teaching,prompt:q.prompt,solution:q.solution,hints:[],rubric:primary.rubric,commonErrors:[],remediation:primary.remediation,
 });
 const error=primary.commonErrors[0];
 if(!error)throw Error('Missing specific error '+primary.id);
 const fallback:[Question,Question,Question]=[
  {prompt:b('Interpret this relationship for '+primary.title.en+'. Explain the quantity it determines and the conditions needed to apply it.\n\n'+teaching.formula.en,
    'Diễn giải quan hệ này trong '+primary.title.vi+'. Nêu đại lượng nó xác định và điều kiện cần để áp dụng.\n\n'+teaching.formula.vi),
   solution:[teaching.application,teaching.formula,...teaching.steps]},
  {prompt:b('Justify this first step in '+primary.title.en+', then derive the remaining steps for the given problem.\n\n'+teaching.steps[0].en+'\n\n'+primary.prompt.en,
    'Biện minh bước đầu này trong '+primary.title.vi+', rồi dẫn xuất các bước tiếp cho bài toán đã cho.\n\n'+teaching.steps[0].vi+'\n\n'+primary.prompt.vi),
   solution:[...teaching.steps,...primary.solution]},
  {prompt:b('A solution to the problem below makes this mistake: “'+error.en+'” Explain why it is invalid and replace it with a correct derivation.\n\n'+primary.prompt.en,
    'Lời giải của bài dưới mắc lỗi: “'+error.vi+'” Giải thích vì sao không hợp lệ và thay bằng lập luận đúng.\n\n'+primary.prompt.vi),
   solution:[b('Replace the quoted step using the valid relationship below.','Thay bước nêu trong đề bằng quan hệ hợp lệ dưới đây.'),teaching.formula,...teaching.steps,...primary.solution]},
 ];
 const [concept,derivation,repair]=introductoryPractice[primary.id]??fallback;
 return [
  make('concept',1,b('Understand the relationship','Hiểu quan hệ'),concept),
  make('derivation',2,b('Derive and justify','Dẫn xuất và biện minh'),derivation),
  {...primary,practiceRole:'application'},
  make('error analysis',4,b('Repair an incorrect solution','Sửa lời giải sai'),repair),
 ];
}
