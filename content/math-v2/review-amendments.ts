import type {Bilingual} from '../../lib/lesson-types';
import type {MathExercise} from '../../lib/math-curriculum-types';
const b=(en:string,vi:string):Bilingual=>({en,vi});
type Amendment={reason:string;prompt?:Bilingual;formula?:Bilingual;application?:Bilingual;commonErrors?:Bilingual[];rubric?:MathExercise['rubric'];solution:Bilingual[]};
/** Editorial source applied before practice generation and semantic hashing. */
export const reviewAmendments:Record<string,Amendment>={
 'f-w001-e1':{reason:'Explain the chain factor and secant error explicitly.',solution:[
  b('Set $u=3x-2$. The derivative of the outer function $u^2/2$ with respect to $u$ is $u$, while the inner derivative is $3$.','Đặt $u=3x-2$. Đạo hàm của hàm ngoài $u^2/2$ theo $u$ là $u$, còn đạo hàm của hàm trong bằng $3$.'),
  b('The chain rule multiplies these rates: $f\'(x)=3(3x-2)=9x-6$. Expanding the square first gives the same result.','Quy tắc dây chuyền nhân hai tốc độ: $f\'(x)=3(3x-2)=9x-6$. Khai triển bình phương trước cũng cho cùng kết quả.'),
  b('At $x=1$, the height is $f(1)=1/2$, while the tangent slope is $f\'(1)=3$. These are different quantities.','Tại $x=1$, độ cao là $f(1)=1/2$, còn độ dốc tiếp tuyến là $f\'(1)=3$. Đây là hai đại lượng khác nhau.'),
  b('Expand $f(1+h)=1/2+3h+9h^2/2$. For $h\\ne0$, subtract $f(1)$ and divide by $h$: the secant slope is $3+9h/2$. Cancelling is legal only while $h$ is nonzero.','Khai triển $f(1+h)=1/2+3h+9h^2/2$. Với $h\\ne0$, trừ $f(1)$ rồi chia cho $h$, độ dốc dây cung là $3+9h/2$. Chỉ khử được khi $h$ khác không.'),
  b('At $h=0.1$, the slope is $3.45$ and the signed error is $0.45$. As $h\\to0$, this slope tends to $3$; a finite increment is not the limit itself.','Tại $h=0.1$, độ dốc là $3.45$, sai số có dấu là $0.45$. Khi $h\\to0$, độ dốc tiến về $3$; bước hữu hạn không phải chính giới hạn.')]},
 'f-w007-e2':{reason:'Real symmetry is required for Rayleigh bounds.',
  prompt:b('Let $A$ be real symmetric with eigenvalues $1,4,7$. Prove $1\\le x^TAx/\\|x\\|^2\\le7$ for $x\\ne0$ and characterize equality. Show why symmetry is needed.','Cho $A$ thực đối xứng có trị riêng $1,4,7$. Chứng minh $1\\le x^TAx/\\|x\\|^2\\le7$ với $x\\ne0$ và nêu điều kiện đẳng thức. Giải thích vì sao cần đối xứng.'),
  solution:[b('Symmetry gives an orthonormal eigenbasis $q_i$. Write $x=\\sum_i c_iq_i$, so $\\|x\\|^2=\\sum_i c_i^2>0$.','Đối xứng cho cơ sở riêng trực chuẩn $q_i$. Viết $x=\\sum_i c_iq_i$, nên $\\|x\\|^2=\\sum_i c_i^2>0$.'),
   b('The quotient is a weighted average of the eigenvalues with weights $w_i=c_i^2/\\sum_jc_j^2$. Nonnegative weights summing to one keep it between $1$ and $7$.','Thương là trung bình có trọng số của các trị riêng, với $w_i=c_i^2/\\sum_jc_j^2$. Trọng số không âm, tổng bằng một, nên thương nằm giữa $1$ và $7$.'),
   b('Equality at an endpoint requires all nonzero coefficients to lie in its eigenspace.','Đẳng thức tại mỗi đầu mút đòi hỏi mọi hệ số khác không thuộc không gian riêng tương ứng.'),
   b('Without symmetry, $A=\\begin{pmatrix}1&10&0\\\\0&4&0\\\\0&0&7\\end{pmatrix}$ has the same eigenvalues, but $x=(1,1,0)^T$ gives $15/2>7$.','Nếu thiếu đối xứng, $A=\\begin{pmatrix}1&10&0\\\\0&4&0\\\\0&0&7\\end{pmatrix}$ có cùng trị riêng nhưng $x=(1,1,0)^T$ cho $15/2>7$.')]},
 'f-w009-e3':{reason:'The standalone exercise must state the function.',
  prompt:b('Set $f(0,0)=0$ and $f(x,y)=x^2y/(x^4+y^2)$ elsewhere. Compute both partial derivatives at the origin; test continuity along $y=x^2$.','Đặt $f(0,0)=0$, $f(x,y)=x^2y/(x^4+y^2)$ ở điểm khác. Tính hai đạo hàm riêng tại gốc; kiểm tra liên tục theo $y=x^2$.'),
  solution:[b('On either coordinate axis the numerator is zero, so $f(h,0)=f(0,h)=0$. Both partial difference quotients are zero for nonzero $h$.','Trên mỗi trục tọa độ, tử số bằng không nên $f(h,0)=f(0,h)=0$. Hai thương sai phân riêng bằng không khi $h$ khác không.'),
   b('Thus $\\partial_xf(0,0)=\\partial_yf(0,0)=0$. This tests only two directions of approach.','Vậy $\\partial_xf(0,0)=\\partial_yf(0,0)=0$. Điều này chỉ kiểm tra hai hướng tiến đến gốc.'),
   b('On $(t,t^2)$ with $t\\ne0$, $f(t,t^2)=t^4/(2t^4)=1/2$. The limit differs from $f(0,0)=0$, so continuity fails.','Theo $(t,t^2)$ với $t\\ne0$, $f(t,t^2)=t^4/(2t^4)=1/2$. Giới hạn khác $f(0,0)=0$, nên không liên tục.'),
   b('Differentiability implies continuity. Hence the function is not differentiable despite having both partial derivatives.','Khả vi kéo theo liên tục. Vì vậy hàm không khả vi dù có cả hai đạo hàm riêng.')]},
 'f-w010-e5':{reason:'The step must stay inside the Hessian-controlled ball.',solution:[
  b('Let $g=\\nabla f(x)\\ne0$ and let the Hessian bound hold on a ball of radius $r>0$. Require $\\alpha\\|g\\|<r$ so the entire step stays in that ball.','Đặt $g=\\nabla f(x)\\ne0$, giả sử cận Hessian đúng trên quả cầu bán kính $r>0$. Cần $\\alpha\\|g\\|<r$ để toàn bộ bước nằm trong quả cầu.'),
  b('Taylor gives $f(x-\\alpha g)-f(x)\\le-\\alpha\\|g\\|^2+(M/2)\\alpha^2\\|g\\|^2=-\\alpha(1-M\\alpha/2)\\|g\\|^2$.','Taylor cho $f(x-\\alpha g)-f(x)\\le-\\alpha\\|g\\|^2+(M/2)\\alpha^2\\|g\\|^2=-\\alpha(1-M\\alpha/2)\\|g\\|^2$.'),
  b('For $M>0$, choose $0<\\alpha<\\min\\{2/M,r/\\|g\\|\\}$ to make this negative. If $M=0$, only the radius constraint is needed.','Với $M>0$, chọn $0<\\alpha<\\min\\{2/M,r/\\|g\\|\\}$ để biểu thức âm. Nếu $M=0$, chỉ cần ràng buộc bán kính.')]},
 'f-w012-e1':{reason:'Avoid using convergence to prove the requested convergence.',solution:[
  b('Subtract terms: $a_{n+1}-a_n=1/((n+1)(n+2))>0$, so the sequence increases.','Trừ hai số hạng: $a_{n+1}-a_n=1/((n+1)(n+2))>0$, nên dãy tăng.'),
  b('Every term is below $1$, so $1$ is an upper bound. To show it is the least upper bound, take any $b<1$.','Mọi số hạng nhỏ hơn $1$, nên $1$ là cận trên. Để chứng minh đó là cận trên nhỏ nhất, lấy $b<1$ bất kỳ.'),
  b('Choose an integer $n$ with $n+1>1/(1-b)$. Then $a_n>b$, so $b$ is not an upper bound. Thus $\\sup_n a_n=1$.','Chọn số nguyên $n$ với $n+1>1/(1-b)$. Khi đó $a_n>b$, nên $b$ không phải cận trên. Vậy $\\sup_n a_n=1$.'),
  b('The monotone convergence theorem now gives $a_n\\to\\sup_n a_n=1$. We did not assume the limit while finding the supremum.','Lúc này định lý hội tụ đơn điệu cho $a_n\\to\\sup_n a_n=1$. Ta không giả sử giới hạn khi tìm supremum.')]},
 'f-w014-e2':{reason:'The supremum is not the error at x=1.',solution:[
  b('For each fixed $x\\in[0,1)$, $x^n\\to0$. At $x=1$, all terms equal $1$. Thus $f(x)=0$ for $x<1$ and $f(1)=1$.','Với mỗi $x\\in[0,1)$ cố định, $x^n\\to0$. Tại $x=1$, mọi số hạng bằng $1$. Vậy $f(x)=0$ khi $x<1$, còn $f(1)=1$.'),
  b('For fixed $n$, the error equals $x^n$ on $[0,1)$ and equals zero at $1$. Its supremum is $1$, approached as $x\\to1^-$ but never attained.','Với $n$ cố định, sai số bằng $x^n$ trên $[0,1)$ và bằng không tại $1$. Supremum là $1$, được tiến gần khi $x\\to1^-$ nhưng không đạt được.'),
  b('An explicit witness is $x_n=2^{-1/n}<1$: $|f_n(x_n)-f(x_n)|=1/2$ for every $n$. Thus tolerance $1/4$ is violated however large $n$ becomes.','Điểm kiểm tra tường minh là $x_n=2^{-1/n}<1$: $|f_n(x_n)-f(x_n)|=1/2$ với mọi $n$. Vì vậy mức sai số $1/4$ luôn bị vi phạm dù $n$ lớn đến đâu.'),
  b('Uniform convergence requires $\\sup_x|f_n(x)-f(x)|\\to0$. It stays $1$, so convergence is not uniform. The moving witness is different from fixing one $x$ before taking a limit.','Hội tụ đều cần $\\sup_x|f_n(x)-f(x)|\\to0$. Nó luôn bằng $1$, nên không hội tụ đều. Điểm kiểm tra thay đổi khác với việc cố định một $x$ trước khi lấy giới hạn.')]},
 'f-w014-e4':{reason:'One bounded early term does not imply a bounded uniform limit.',
  prompt:b('Suppose $f_n\\to f$ uniformly on $D$ and every $f_n$ is bounded (bounds may depend on $n$). Prove $f$ is bounded using tolerance $1$. Explain why one bounded early term is insufficient.','Giả sử $f_n\\to f$ đều trên $D$ và mỗi $f_n$ bị chặn (cận có thể phụ thuộc $n$). Chứng minh $f$ bị chặn với mức sai số $1$. Vì sao một số hạng đầu bị chặn là chưa đủ?'),
  formula:b('$\\|f-f_N\\|_\\infty<1,\\quad M_N=\\|f_N\\|_\\infty<\\infty\\ \\Longrightarrow\\ \\|f\\|_\\infty\\le M_N+1.$','$\\|f-f_N\\|_\\infty<1,\\quad M_N=\\|f_N\\|_\\infty<\\infty\\ \\Longrightarrow\\ \\|f\\|_\\infty\\le M_N+1.$'),
  solution:[b('Uniform convergence supplies one index $N$ with $|f(x)-f_N(x)|<1$ for every $x\\in D$. The same $N$ works throughout the domain.','Hội tụ đều cho một chỉ số $N$ với $|f(x)-f_N(x)|<1$ cho mọi $x\\in D$. Một $N$ dùng được trên toàn miền.'),
   b('Because every term is bounded, this particular $f_N$ has a finite bound $M_N$. Triangle inequality gives $|f(x)|\\le|f(x)-f_N(x)|+|f_N(x)|\\le1+M_N$.','Vì mọi số hạng đều bị chặn, chính $f_N$ này có cận hữu hạn $M_N$. Bất đẳng thức tam giác cho $|f(x)|\\le|f(x)-f_N(x)|+|f_N(x)|\\le1+M_N$.'),
   b('The resulting bound is independent of $x$. A common bound for all $f_n$ was not needed.','Cận thu được không phụ thuộc $x$. Không cần một cận chung cho toàn bộ các $f_n$.'),
   b('For the weaker premise, take $f_1=0$ and $f_n(x)=x$ for $n\\ge2$ on $\\mathbb R$. Tail errors from $f(x)=x$ are zero, so convergence is uniform, yet the limit is unbounded.','Với giả thiết yếu hơn, lấy $f_1=0$, $f_n(x)=x$ khi $n\\ge2$ trên $\\mathbb R$. Sai số ở đuôi so với $f(x)=x$ bằng không nên hội tụ đều, nhưng giới hạn không bị chặn.')]},
 'f-w015-e4':{reason:'Actually answer the requested derivative at the endpoint.',solution:[
  b('For $n\\ge2$, $f_n\'(x)=nx^{n-1}$, giving right derivative $f_n\'(0)=0$. Therefore its limit is $0$.','Với $n\\ge2$, $f_n\'(x)=nx^{n-1}$, cho đạo hàm phải $f_n\'(0)=0$. Do đó giới hạn bằng $0$.'),
  b('The limit function is zero on $[0,1)$ and one at $1$. It is constant near $0$ on the right, so its right derivative there is also $0$. The two derivatives agree at this endpoint.','Hàm giới hạn bằng không trên $[0,1)$ và bằng một tại $1$. Nó là hằng gần $0$ về bên phải, nên đạo hàm phải cũng bằng $0$. Hai đạo hàm trùng nhau tại đầu mút này.'),
  b('This local agreement does not justify interchange on the whole interval: the limit is discontinuous at $1$ and $f_n\'(1)=n$ diverges. A failed theorem premise does not force its conclusion to fail at every point.','Sự trùng nhau cục bộ không cho phép đổi thứ tự trên toàn đoạn: giới hạn không liên tục tại $1$, còn $f_n\'(1)=n$ phân kỳ. Thiếu giả thiết không có nghĩa kết luận của định lý phải sai tại mọi điểm.')]},
 'f-w018-e3':{reason:'Define events and remove the abandoned failed counterexample.',solution:[
  b('Roll a fair die. Let $A=\\{2,4,6\\}$ and $B=\\{1,2,3\\}$ in $\\Omega=\\{1,2,3,4,5,6\\}$.','Gieo xúc xắc cân đối. Đặt $A=\\{2,4,6\\}$, $B=\\{1,2,3\\}$ trên $\\Omega=\\{1,2,3,4,5,6\\}$.'),
  b('Three of six outcomes belong to $A$, so $P(A)=1/2$. Conditioning on $B$ leaves three equally likely outcomes, of which only $2$ belongs to $A$.','Ba trong sáu kết quả thuộc $A$, nên $P(A)=1/2$. Điều kiện $B$ giữ lại ba kết quả đồng xác suất, trong đó chỉ có $2$ thuộc $A$.'),
  b('$P(A\\mid B)=P(A\\cap B)/P(B)=(1/6)/(3/6)=1/3\\ne1/2$. The denominator changed because the available information changed.','$P(A\\mid B)=P(A\\cap B)/P(B)=(1/6)/(3/6)=1/3\\ne1/2$. Mẫu số thay đổi vì thông tin thay đổi.')]},
 'f-w025-e1':{reason:'Handle the all-zero sample before division.',solution:[
  b('Write $S=\\sum_i x_i\\ge0$. For $n\\ge1$, the likelihood is $L(\\lambda)=\\lambda^n e^{-\\lambda S}$ and its log is $n\\log\\lambda-\\lambda S$.','Đặt $S=\\sum_i x_i\\ge0$. Với $n\\ge1$, likelihood là $L(\\lambda)=\\lambda^n e^{-\\lambda S}$, log-likelihood là $n\\log\\lambda-\\lambda S$.'),
  b('If $S>0$, solving $n/\\lambda-S=0$ gives $\\hat\\lambda=n/S$. The second derivative $-n/\\lambda^2<0$ proves strict concavity and the unique maximum.','Nếu $S>0$, giải $n/\\lambda-S=0$ được $\\hat\\lambda=n/S$. Đạo hàm bậc hai $-n/\\lambda^2<0$ chứng minh lõm nghiêm ngặt và cực đại duy nhất.'),
  b('If $S=0$, $L(\\lambda)=\\lambda^n$ grows without bound, so there is no finite MLE. This sample has probability zero under the continuous model but is allowed by the stated data condition.','Nếu $S=0$, $L(\\lambda)=\\lambda^n$ tăng vô hạn nên không có MLE hữu hạn. Mẫu này có xác suất không trong mô hình liên tục nhưng được điều kiện dữ liệu trong đề cho phép.')]},
 'm2-w032-e3':{reason:'Give an explicit double-series counterexample instead of a vague rearrangement.',solution:[
  b('For $i,j\\ge1$, set $a_{ij}=1$ if $j=i$, $a_{ij}=-1$ if $j=i+1$, and zero otherwise. Each row contains one $1$ and one $-1$.','Với $i,j\\ge1$, đặt $a_{ij}=1$ nếu $j=i$, $a_{ij}=-1$ nếu $j=i+1$, bằng không ở vị trí khác. Mỗi hàng có một số $1$ và một số $-1$.'),
  b('Every row sums to zero: $\\sum_i(\\sum_j a_{ij})=0$. Column one sums to $1$, while later columns sum to zero, giving $\\sum_j(\\sum_i a_{ij})=1$.','Mỗi hàng có tổng không: $\\sum_i(\\sum_j a_{ij})=0$. Cột đầu có tổng $1$, các cột sau có tổng không, nên $\\sum_j(\\sum_i a_{ij})=1$.'),
  b('Here $\\sum_{i,j}|a_{ij}|=\\infty$. Absolute summability would license interchange and exclude this example.','Ở đây $\\sum_{i,j}|a_{ij}|=\\infty$. Tổng tuyệt đối hữu hạn mới cho phép đổi thứ tự và loại ví dụ này.'),
  b('For sigma-finite product measures, the analogous sufficient condition is $\\int |f|\\,d(\\mu\\otimes\\nu)<\\infty$. Fubini then equates the iterated integrals.','Với độ đo tích sigma-hữu hạn, điều kiện đủ tương ứng là $\\int |f|\\,d(\\mu\\otimes\\nu)<\\infty$. Khi đó Fubini cho hai tích phân lặp bằng nhau.')]},
 'm2-w035-e4':{reason:'Ambient measurability does not imply G-measurability.',
  prompt:b('On $[0,1]$ with Lebesgue probability, let $\\mathcal G=\\{\\varnothing,\\{0\\},(0,1],[0,1]\\}$ and $X=0$. Show $Z=0$ and $W=\\mathbf1_{\\{0\\}}$ are two versions of $E[X\\mid\\mathcal G]$. Why does $W$ fail for the trivial sigma-field?','Trên $[0,1]$ với xác suất Lebesgue, đặt $\\mathcal G=\\{\\varnothing,\\{0\\},(0,1],[0,1]\\}$, $X=0$. Chứng minh $Z=0$, $W=\\mathbf1_{\\{0\\}}$ là hai phiên bản của $E[X\\mid\\mathcal G]$. Vì sao $W$ không hợp lệ với sigma-đại số tầm thường?'),
  formula:b('A conditional expectation is $\\mathcal G$-measurable, integrable, and satisfies $\\int_A Z\\,dP=\\int_A X\\,dP$ for every $A\\in\\mathcal G$.','Kỳ vọng có điều kiện phải đo được theo $\\mathcal G$, khả tích, và thỏa $\\int_A Z\\,dP=\\int_A X\\,dP$ với mọi $A\\in\\mathcal G$.'),
  solution:[b('The specified four sets form a sigma-field. Both $\\{W=1\\}=\\{0\\}$ and $\\{W=0\\}=(0,1]$ belong to it, so $W$ is $\\mathcal G$-measurable. The constant $Z$ is measurable too.','Bốn tập đã cho tạo thành sigma-đại số. Cả $\\{W=1\\}=\\{0\\}$ và $\\{W=0\\}=(0,1]$ đều thuộc nó, nên $W$ đo được theo $\\mathcal G$. Hằng $Z$ cũng đo được.'),
   b('The singleton has probability zero, so $E|W|=0$. The integral of $W$ over every $A\\in\\mathcal G$ is zero, matching $X$ and $Z$. All definition conditions hold.','Tập đơn có xác suất không nên $E|W|=0$. Tích phân của $W$ trên mọi $A\\in\\mathcal G$ bằng không, giống $X$ và $Z$. Mọi điều kiện định nghĩa đều đúng.'),
   b('Although $W(0)=1\\ne Z(0)$, they agree almost surely. Uniqueness is therefore only almost sure.','Dù $W(0)=1\\ne Z(0)$, hai biến bằng nhau hầu chắc chắn. Tính duy nhất vì thế chỉ là hầu chắc chắn.'),
   b('For $\\mathcal G_0=\\{\\varnothing,[0,1]\\}$, the event $\\{W>1/2\\}=\\{0\\}$ is absent. Thus $W$ is not $\\mathcal G_0$-measurable even though its integrals match.','Với $\\mathcal G_0=\\{\\varnothing,[0,1]\\}$, tập $\\{W>1/2\\}=\\{0\\}$ không thuộc sigma-đại số. Do đó $W$ không đo được theo $\\mathcal G_0$ dù các tích phân trùng nhau.')]},
 'm2-w049-e5':{reason:'Require IID sampling and distinguish the constrained estimator.',
  prompt:b('Let $Z_i$ be IID integrable real variables of mean $\\theta_0\\in[a,b]$. Prove consistency of $\\bar Z_n$ and the maximizer of $M_n(\\theta)=-(\\bar Z_n-\\theta)^2$ on $[a,b]$. Can they differ in a finite sample?','Cho $Z_i$ thực IID, khả tích, có trung bình $\\theta_0\\in[a,b]$. Chứng minh tính nhất quán của $\\bar Z_n$ và nghiệm cực đại $M_n(\\theta)=-(\\bar Z_n-\\theta)^2$ trên $[a,b]$. Chúng có thể khác nhau trên mẫu hữu hạn không?'),
  solution:[b('The IID law of large numbers gives $\\bar Z_n\\to\\theta_0$ in probability. Integrability and the sampling structure are needed; a shared mean alone is insufficient.','Luật số lớn IID cho $\\bar Z_n\\to\\theta_0$ theo xác suất. Cần khả tích và cấu trúc lấy mẫu; chỉ cùng trung bình là chưa đủ.'),
   b('Maximizing the negative squared distance chooses the nearest feasible point: $\\hat\\theta_n=\\min\\{b,\\max\\{a,\\bar Z_n\\}\\}$. This differs from the sample mean when the mean is outside the interval.','Cực đại âm khoảng cách bình phương chọn điểm khả thi gần nhất: $\\hat\\theta_n=\\min\\{b,\\max\\{a,\\bar Z_n\\}\\}$. Nó khác trung bình mẫu khi trung bình ở ngoài đoạn.'),
   b('Because $\\theta_0\\in[a,b]$, $|\\hat\\theta_n-\\theta_0|\\le|\\bar Z_n-\\theta_0|\\to0$. This also handles a true parameter at the boundary.','Vì $\\theta_0\\in[a,b]$, $|\\hat\\theta_n-\\theta_0|\\le|\\bar Z_n-\\theta_0|\\to0$. Điều này cũng đúng khi tham số thật nằm ở biên.'),
   b('Writing $d_n=\\bar Z_n-\\theta_0$, uniform criterion error is at most $|d_n|(2(b-a)+|d_n|)\\to0$. The population criterion $-(\\theta_0-\\theta)^2$ has unique maximizer $\\theta_0$.','Đặt $d_n=\\bar Z_n-\\theta_0$, sai số đều của tiêu chuẩn không quá $|d_n|(2(b-a)+|d_n|)\\to0$. Tiêu chuẩn tổng thể $-(\\theta_0-\\theta)^2$ có cực đại duy nhất $\\theta_0$.')]},
 'm2-w077-e2':{reason:'Carry 1/n through the entire Bartlett derivation.',solution:[
  b('Zero-pad $u_t$ outside $1\\le t\\le n$. Define $\\hat\\gamma_h=n^{-1}\\sum_tu_tu_{t-h}$ and $B_s=\\sum_{j=0}^b u_{s-j}$ for $1\\le s\\le n+b$.','Đệm $u_t$ bằng không ngoài $1\\le t\\le n$. Đặt $\\hat\\gamma_h=n^{-1}\\sum_tu_tu_{t-h}$, $B_s=\\sum_{j=0}^b u_{s-j}$ với $1\\le s\\le n+b$.'),
  b('Expand $\\sum_s B_s^2$. For lag $h=j-k$, exactly $b+1-|h|$ pairs occur when $|h|\\le b$.','Khai triển $\\sum_s B_s^2$. Với độ trễ $h=j-k$, có đúng $b+1-|h|$ cặp khi $|h|\\le b$.'),
  b('Reindexing gives $\\sum_s B_s^2=n\\sum_{h=-b}^b(b+1-|h|)\\hat\\gamma_h$. Divide by $n(b+1)$, not only $b+1$.','Đổi chỉ số cho $\\sum_s B_s^2=n\\sum_{h=-b}^b(b+1-|h|)\\hat\\gamma_h$. Chia cho $n(b+1)$, không chỉ $b+1$.'),
  b('Thus $\\hat\\Omega_b=\\sum_{h=-b}^b(1-|h|/(b+1))\\hat\\gamma_h=\\sum_sB_s^2/[n(b+1)]\\ge0$. Squares establish the sign without relying on a numerical plot.','Vậy $\\hat\\Omega_b=\\sum_{h=-b}^b(1-|h|/(b+1))\\hat\\gamma_h=\\sum_sB_s^2/[n(b+1)]\\ge0$. Tổng bình phương xác lập dấu mà không dựa vào đồ thị số.')]},
 'm2-w087-e3':{reason:'Centering preserves excess risk, not each individual deviation.',solution:[
  b('Set $\\psi_y(u)=(u-y)^2-y^2$. Subtracting $y^2$ preserves the empirical minimizer and excess population risk because the offset is independent of the candidate. Each separate empirical-population deviation changes by $(P-P_n)y^2$.','Đặt $\\psi_y(u)=(u-y)^2-y^2$. Trừ $y^2$ giữ nguyên nghiệm thực nghiệm và excess risk tổng thể vì phần trừ không phụ thuộc ứng viên. Nhưng từng độ lệch riêng giữa tổng thể và thực nghiệm thay đổi một lượng $(P-P_n)y^2$.'),
  b('Now $\\psi_y(0)=0$ and $|\\psi_y\'(u)|\\le2(BR+Y)=L$ on $|u|\\le BR$. Apply contraction to this centered class.','Lúc này $\\psi_y(0)=0$, $|\\psi_y\'(u)|\\le2(BR+Y)=L$ khi $|u|\\le BR$. Áp dụng bất đẳng thức co cho chính lớp đã định tâm này.'),
  b('The expected ERM excess bound contributes factor $4$; absolute contraction contributes $2L$; the linear-class bound is $BR/\\sqrt n$.','Cận kỳ vọng excess risk ERM đóng góp hệ số $4$; bất đẳng thức co tuyệt đối đóng góp $2L$; cận lớp tuyến tính là $BR/\\sqrt n$.'),
  b('Multiplication gives $8LBR/\\sqrt n=16BR(BR+Y)/\\sqrt n$, a loose expectation bound under the stated IID and boundedness assumptions.','Nhân lại được $8LBR/\\sqrt n=16BR(BR+Y)/\\sqrt n$, là cận kỳ vọng khá lỏng dưới giả thiết IID và bị chặn đã nêu.')]},
 'm2-w088-e3':{reason:'Fix the population comparator and the sign of in-class estimation error.',solution:[
  b('Let $J_{\\rm all}^*$ be the infimum on a stated larger reference class. Add and subtract $J(f^*)$ and $J(\\hat f)$ to obtain the three terms: class approximation, in-class estimation, and returned-iterate difference.','Gọi $J_{\\rm all}^*$ là infimum trên lớp tham chiếu lớn hơn đã xác định. Thêm bớt $J(f^*)$, $J(\\hat f)$ được ba số hạng: xấp xỉ do lớp, ước lượng trong lớp, và hiệu do nghiệm trả về.'),
  b('$J(\\tilde f)-J_{\\rm all}^*=[J(f^*)-J_{\\rm all}^*]+[J(\\hat f)-J(f^*)]+[J(\\tilde f)-J(\\hat f)]$. The first two terms are nonnegative; the last is signed. If the reference is $F$ itself, the first is zero.','$J(\\tilde f)-J_{\\rm all}^*=[J(f^*)-J_{\\rm all}^*]+[J(\\hat f)-J(f^*)]+[J(\\tilde f)-J(\\hat f)]$. Hai số hạng đầu không âm; số hạng cuối có thể mang hai dấu. Nếu tham chiếu chính là $F$, số hạng đầu bằng không.'),
  b('Put $\\Delta=\\sup_F|R-\\hat R|=\\sup_F|J-\\hat J|$. Then $J(\\tilde f)\\le\\hat J(\\tilde f)+\\Delta\\le\\hat J(\\hat f)+\\varepsilon_{\\rm opt}+\\Delta$.','Đặt $\\Delta=\\sup_F|R-\\hat R|=\\sup_F|J-\\hat J|$. Khi đó $J(\\tilde f)\\le\\hat J(\\tilde f)+\\Delta\\le\\hat J(\\hat f)+\\varepsilon_{\\rm opt}+\\Delta$.'),
  b('Empirical optimality gives $\\hat J(\\hat f)\\le\\hat J(f^*)$. Therefore $J(\\tilde f)\\le\\hat J(f^*)+\\varepsilon_{\\rm opt}+\\Delta\\le J(f^*)+\\varepsilon_{\\rm opt}+2\\Delta$.','Tối ưu thực nghiệm cho $\\hat J(\\hat f)\\le\\hat J(f^*)$. Do đó $J(\\tilde f)\\le\\hat J(f^*)+\\varepsilon_{\\rm opt}+\\Delta\\le J(f^*)+\\varepsilon_{\\rm opt}+2\\Delta$.'),
  b('Subtract $J(f^*)$. Comparing only with $J(\\hat f)$ would bound the wrong population difference; the intervening empirical-optimality step is essential.','Trừ $J(f^*)$. Chỉ so với $J(\\hat f)$ sẽ chặn nhầm hiệu tổng thể; bước tối ưu thực nghiệm ở giữa là thiết yếu.')]},
};
reviewAmendments['f-w006-e4']={reason:'Symmetry alone is not a projection certificate.',solution:[
 b('Full column rank makes $X^TX$ invertible. Since it is symmetric, its inverse is symmetric too, so transposing the product gives $P^T=P$.','Hạng cột đầy đủ làm $X^TX$ khả nghịch. Nó đối xứng nên nghịch đảo cũng đối xứng; chuyển vị tích cho $P^T=P$.'),
 b('Multiply two copies: $P^2=X(X^TX)^{-1}(X^TX)(X^TX)^{-1}X^T=P$. This means points in the image stay fixed when projected again.','Nhân hai bản: $P^2=X(X^TX)^{-1}(X^TX)(X^TX)^{-1}X^T=P$. Nghĩa là điểm trong ảnh không đổi khi được chiếu lại.'),
 b('For a vector in the image, $v=Pu$, and a residual $r=(I-P)y$, $v^Tr=u^TP^T(I-P)y=u^T(P-P^2)y=0$. Symmetry together with idempotence makes the projection orthogonal.','Với vector trong ảnh $v=Pu$ và phần dư $r=(I-P)y$, $v^Tr=u^TP^T(I-P)y=u^T(P-P^2)y=0$. Đối xứng kết hợp lũy đẳng mới tạo phép chiếu trực giao.'),
 b('Symmetry alone would not suffice: $2I$ is symmetric but $(2I)^2\\ne2I$, so it is not a projection.','Chỉ đối xứng là chưa đủ: $2I$ đối xứng nhưng $(2I)^2\\ne2I$, nên không phải phép chiếu.')]};
reviewAmendments['m2-w047-e4']={reason:'Symmetry does not generally provide a two-sided UMP test.',solution:[
 b('Neyman–Pearson compares one simple null with one simple alternative at a fixed level. A two-sided alternative contains many competing alternatives.','Neyman–Pearson so một giả thuyết không đơn với một giả thuyết thay thế đơn ở mức cố định. Giả thuyết hai phía chứa nhiều hướng thay thế cạnh tranh.'),
 b('For a normal mean with known variance, testing zero against a positive mean favors the upper tail; against a negative mean it favors the lower tail. One test cannot generally be most powerful for both.','Với trung bình chuẩn và phương sai đã biết, kiểm định 0 so với trung bình dương ưu tiên đuôi trên; so với trung bình âm ưu tiên đuôi dưới. Một kiểm định nói chung không tối ưu cho cả hai.'),
 b('A monotone likelihood ratio can support a one-sided UMP theorem under its hypotheses. Symmetry may motivate a two-sided test, but it does not prove UMP over all level-constrained tests; unbiased or invariant optimality is a different claim.','Tỷ số likelihood đơn điệu có thể hỗ trợ định lý UMP một phía dưới đúng giả thiết. Đối xứng có thể gợi ý kiểm định hai phía nhưng không chứng minh UMP trên mọi kiểm định cùng mức; tối ưu trong lớp không chệch hoặc bất biến là tuyên bố khác.')]};
reviewAmendments['m2-w049-e2']={reason:'Boundary samples still give a strictly concave Bernoulli log likelihood on the interior.',
 solution:[b('For $0<a<1/2$, the constrained maximizer is $\\hat p_n=\\min\\{1-a,\\max\\{a,\\bar Z_n\\}\\}$. A sample mean outside the interval must be clipped to its nearest endpoint.','Với $0<a<1/2$, nghiệm cực đại có ràng buộc là $\\hat p_n=\\min\\{1-a,\\max\\{a,\\bar Z_n\\}\\}$. Trung bình mẫu ngoài đoạn phải được đưa về đầu mút gần nhất.'),
 b('The average log likelihood has second derivative $-\\bar Z_n/p^2-(1-\\bar Z_n)/(1-p)^2<0$ for $0<p<1$. This remains strictly negative for all-zero and all-one samples.','Log-likelihood trung bình có đạo hàm bậc hai $-\\bar Z_n/p^2-(1-\\bar Z_n)/(1-p)^2<0$ với $0<p<1$. Nó vẫn âm nghiêm ngặt khi mẫu toàn 0 hoặc toàn 1.'),
 b('The IID law of large numbers gives $\\bar Z_n\\to p_0$. Since $p_0\\in(a,1-a)$, the probability of an active constraint tends to zero. Thus $\\hat p_n\\to p_0$ in probability.','Luật số lớn IID cho $\\bar Z_n\\to p_0$. Vì $p_0\\in(a,1-a)$, xác suất ràng buộc hoạt động tiến về không. Do đó $\\hat p_n\\to p_0$ theo xác suất.')]};
reviewAmendments['m2-w075-e5']={reason:'Summable covariances are sufficient for the Fourier formula, not necessary for every spectral density.',
 formula:b('Weak stationarity requires time-invariant mean and lag-only covariance. Absolute covariance summability is sufficient for $f(\\omega)=(2\\pi)^{-1}\\sum_h\\gamma(h)e^{-ih\\omega}$. White noise has $f=\\sigma^2/(2\\pi)$.','Dừng yếu cần trung bình không đổi theo thời gian và covariance chỉ phụ thuộc lag. Covariance khả tổng tuyệt đối là điều kiện đủ cho $f(\\omega)=(2\\pi)^{-1}\\sum_h\\gamma(h)e^{-ih\\omega}$. Nhiễu trắng có $f=\\sigma^2/(2\\pi)$.'),
 solution:[b('With fixed $X_0=0$, independent centered innovations of variance $\\sigma^2>0$ give $X_t=\\sum_{j=1}^t\\epsilon_j$ and $\\operatorname{Var}(X_t)=t\\sigma^2$.','Với $X_0=0$ cố định, nhiễu độc lập trung bình không có phương sai $\\sigma^2>0$ cho $X_t=\\sum_{j=1}^t\\epsilon_j$ và $\\operatorname{Var}(X_t)=t\\sigma^2$.'),
 b('For $s,t\\ge0$, covariance is $\\sigma^2\\min(s,t)$, not a function only of $t-s$. Weak stationarity fails before any Fourier summability question arises.','Với $s,t\\ge0$, covariance bằng $\\sigma^2\\min(s,t)$, không chỉ là hàm của $t-s$. Tính dừng yếu đã sai trước khi xét khả tổng Fourier.'),
 b('The increment $\\Delta X_t=\\epsilon_t$ is stationary white noise and has constant density $\\sigma^2/(2\\pi)$. This describes increments, not levels.','Sai phân $\\Delta X_t=\\epsilon_t$ là nhiễu trắng dừng, có mật độ hằng $\\sigma^2/(2\\pi)$. Đây là phổ của sai phân, không phải mức.')]};
reviewAmendments['m2-w089-e3']={reason:'The pathwise static bound holds simultaneously for all constant comparators, including hindsight choices.',solution:[
 b('Put $a_t=\\|x_t-u\\|^2$. Projection and convexity give $f_t(x_t)-f_t(u)\\le(a_t-a_{t+1})/(2\\eta)+\\eta\\|g_t\\|^2/2$.','Đặt $a_t=\\|x_t-u\\|^2$. Phép chiếu và tính lồi cho $f_t(x_t)-f_t(u)\\le(a_t-a_{t+1})/(2\\eta)+\\eta\\|g_t\\|^2/2$.'),
 b('Sum from $1$ to $T$. Intermediate distances cancel, leaving $(a_1-a_{T+1})/(2\\eta)+\\eta\\sum_t\\|g_t\\|^2/2$.','Cộng từ $1$ đến $T$. Các khoảng cách trung gian triệt tiêu, còn $(a_1-a_{T+1})/(2\\eta)+\\eta\\sum_t\\|g_t\\|^2/2$.'),
 b('Use $a_1\\le D^2$, $a_{T+1}\\ge0$, and $\\|g_t\\|\\le G$: regret is at most $D^2/(2\\eta)+\\eta G^2T/2$. For $D,G>0$, differentiating gives $\\eta=D/(G\\sqrt T)$ and bound $DG\\sqrt T$.','Dùng $a_1\\le D^2$, $a_{T+1}\\ge0$, $\\|g_t\\|\\le G$: regret không quá $D^2/(2\\eta)+\\eta G^2T/2$. Khi $D,G>0$, lấy đạo hàm được $\\eta=D/(G\\sqrt T)$ và cận $DG\\sqrt T$.'),
 b('The argument holds for every fixed-in-time $u\\in K$ on the same realized loss sequence. It therefore includes the best constant comparator selected in hindsight. It does not compare with a changing path $u_t$.','Lập luận đúng với mọi $u\\in K$ không đổi theo thời gian trên cùng chuỗi loss đã xảy ra. Do đó nó bao gồm đối chứng hằng tốt nhất được chọn sau khi xem dữ liệu. Nó không so với đường đi thay đổi $u_t$.')]};
reviewAmendments['f-w016-e5']={...reviewAmendments['f-w009-e3'],reason:'State the explicit function in the later transfer problem too.'};
export function amendExercise(e:MathExercise){
 const a=reviewAmendments[e.id];if(!a)return;
 if(a.prompt)e.prompt=a.prompt;
 if(a.commonErrors)e.commonErrors=a.commonErrors;
 if(a.rubric)e.rubric=a.rubric;
 e.solution=a.solution;
 if(e.teaching)e.teaching={...e.teaching,steps:a.solution,solution:a.solution,...(a.formula?{formula:a.formula}:{}),...(a.application?{application:a.application}:{})};
}
reviewAmendments['f-w025-e1'].formula=b(
 '$S=\\sum_i x_i>0:\\ \\hat\\lambda=n/S$. If $S=0$, the likelihood has no finite maximizer.',
 '$S=\\sum_i x_i>0:\\ \\hat\\lambda=n/S$. Nếu $S=0$, likelihood không có nghiệm cực đại hữu hạn.');
reviewAmendments['m2-w032-e3'].prompt=b(
 'Construct a real double array whose two iterated sums exist and disagree when absolute summability is absent. State the absolute-summability condition that guarantees equality and its integral analogue.',
 'Dựng mảng kép thực có hai tổng lặp đều tồn tại nhưng khác nhau khi thiếu khả tổng tuyệt đối. Nêu điều kiện khả tổng tuyệt đối bảo đảm bằng nhau và điều kiện tích phân tương ứng.');
reviewAmendments['m2-w032-e3'].application=b(
 'Changing the order of two infinite sums can change the answer. Checking absolute summability gives a sufficient justification before rearranging.',
 'Đổi thứ tự hai tổng vô hạn có thể làm đổi kết quả. Kiểm tra khả tổng tuyệt đối cho một điều kiện đủ để biện minh trước khi đổi thứ tự.');
reviewAmendments['m2-w032-e3'].rubric=[
 {points:2,criterion:b('Constructs an explicit array and computes both different iterated sums.','Dựng mảng tường minh và tính hai tổng lặp khác nhau.')},
 {points:2,criterion:b('States absolute summability and the sigma-finite Fubini condition.','Nêu khả tổng tuyệt đối và điều kiện Fubini trên độ đo sigma-hữu hạn.')}];
reviewAmendments['m2-w049-e2'].formula=b(
 '$\\hat p_n=\\min\\{1-a,\\max\\{a,\\bar Z_n\\}\\}\\xrightarrow{P}p_0$, for IID Bernoulli data with $0<a<1/2$ and $p_0\\in(a,1-a)$.',
 '$\\hat p_n=\\min\\{1-a,\\max\\{a,\\bar Z_n\\}\\}\\xrightarrow{P}p_0$, với dữ liệu Bernoulli IID, $0<a<1/2$, $p_0\\in(a,1-a)$.');
reviewAmendments['m2-w049-e2'].application=b(
 'A probability estimate with a prescribed admissible interval must respect that interval, even when the observed sample proportion is outside it.',
 'Ước lượng xác suất có miền giá trị cho phép phải nằm trong miền đó, kể cả khi tỷ lệ trong mẫu nằm ngoài.');
reviewAmendments['m2-w049-e5'].formula=b(
 '$\\hat\\theta_n=\\Pi_{[a,b]}(\\bar Z_n)$ and $|\\hat\\theta_n-\\theta_0|\\le|\\bar Z_n-\\theta_0|$ when $\\theta_0\\in[a,b]$.',
 '$\\hat\\theta_n=\\Pi_{[a,b]}(\\bar Z_n)$ và $|\\hat\\theta_n-\\theta_0|\\le|\\bar Z_n-\\theta_0|$ khi $\\theta_0\\in[a,b]$.');
reviewAmendments['m2-w049-e5'].application=b(
 'Projection enforces parameter constraints without increasing estimation error when the true parameter is feasible.',
 'Phép chiếu bảo đảm ràng buộc tham số mà không tăng sai số ước lượng khi tham số thật thuộc miền cho phép.');
reviewAmendments['m2-w035-e4'].application=b(
 'Two conditional expectations can differ on a null set, provided both versions remain measurable with respect to the conditioning sigma-field.',
 'Hai kỳ vọng có điều kiện có thể khác trên tập xác suất không, miễn cả hai vẫn đo được theo sigma-đại số dùng để điều kiện hóa.');
reviewAmendments['m2-w035-e4'].commonErrors=[b(
 'Checking integrals but forgetting measurability with respect to the conditioning sigma-field.',
 'Kiểm tra tích phân nhưng quên tính đo được theo sigma-đại số điều kiện.')];
reviewAmendments['m2-w035-e4'].rubric=[
 {points:2,criterion:b('Checks measurability for the specified sigma-field and its failure for the trivial one.','Kiểm tra tính đo được theo sigma-đại số đã cho và sự thất bại với sigma-đại số tầm thường.')},
 {points:2,criterion:b('Checks integrability, defining integrals, and equality almost surely.','Kiểm tra khả tích, tích phân định nghĩa và bằng nhau hầu chắc chắn.')}];
reviewAmendments['m2-w088-e3'].formula=b(
 '$J(\\tilde f)-J_{\\rm all}^*=[J(f^*)-J_{\\rm all}^*]+[J(\\hat f)-J(f^*)]+[J(\\tilde f)-J(\\hat f)]$. Also $J(\\tilde f)-J(f^*)\\le2\\sup_F|R-\\hat R|+\\varepsilon_{\\rm opt}$.',
 '$J(\\tilde f)-J_{\\rm all}^*=[J(f^*)-J_{\\rm all}^*]+[J(\\hat f)-J(f^*)]+[J(\\tilde f)-J(\\hat f)]$. Đồng thời $J(\\tilde f)-J(f^*)\\le2\\sup_F|R-\\hat R|+\\varepsilon_{\\rm opt}$.');
reviewAmendments['m2-w051-e2']={reason:'Define the log statistic on finite samples with a nonpositive sample mean.',solution:[
 b('The given central limit theorem implies $\\bar X_n\\to\\mu>0$ in probability. Thus $P(\\bar X_n>\\mu/2)\\to1$, but positivity need not hold on every finite sample.',
 'Định lý giới hạn trung tâm đã cho kéo theo $\\bar X_n\\to\\mu>0$ theo xác suất. Vì vậy $P(\\bar X_n>\\mu/2)\\to1$, nhưng không bảo đảm mọi mẫu hữu hạn đều có trung bình dương.'),
 b('Define $T_n=\\log\\bar X_n$ when $\\bar X_n>0$, and $T_n=0$ otherwise. The arbitrary fallback only affects an event whose probability tends to zero. Near $\\mu$, the function is differentiable with $g\\prime(\\mu)=1/\\mu$.',
 'Đặt $T_n=\\log\\bar X_n$ khi $\\bar X_n>0$, và $T_n=0$ ở trường hợp còn lại. Giá trị quy ước chỉ tác động trên biến cố có xác suất tiến về không. Gần $\\mu$, hàm khả vi với $g\\prime(\\mu)=1/\\mu$.'),
 b('The delta method gives $\\sqrt n(T_n-\\log\\mu)\\Rightarrow N(0,\\sigma^2/\\mu^2)$. This is a limiting distribution, not an exact finite-sample normal law.',
 'Phương pháp delta cho $\\sqrt n(T_n-\\log\\mu)\\Rightarrow N(0,\\sigma^2/\\mu^2)$. Đây là phân phối giới hạn, không phải phân phối chuẩn chính xác trên mẫu hữu hạn.'),
 b('If $s_n^2\\to\\sigma^2$ in probability, the plug-in standard error is $s_n/(\\sqrt n\\bar X_n)$ on positive samples. For dependent data, $s_n^2$ must estimate the variance in the stated CLT; the ordinary sample variance need not do so.',
 'Nếu $s_n^2\\to\\sigma^2$ theo xác suất, sai số chuẩn thế số là $s_n/(\\sqrt n\\bar X_n)$ trên mẫu có trung bình dương. Với dữ liệu phụ thuộc, $s_n^2$ phải ước lượng phương sai trong CLT đã cho; phương sai mẫu thông thường chưa chắc đúng.')]};
reviewAmendments['m2-w059-e4']={reason:'Distinguish the rounded 1.96 cutoff from the exact normal quantile.',
 formula:b('$P(\\text{coverage})=[2\\Phi(1.96)-1]^2\\approx0.902508$. With $z_{0.975}$ in place of $1.96$, it is exactly $0.95^2=0.9025$.',
 '$P(\\text{phủ})=[2\\Phi(1.96)-1]^2\\approx0.902508$. Thay $1.96$ bằng $z_{0.975}$ thì đúng bằng $0.95^2=0.9025$.'),
 solution:[
 b('Let $J$ select the estimate with largest absolute value. The reported interval contains zero exactly when $|Z_J|\\le1.96$, or equivalently $\\max(|Z_1|,|Z_2|)\\le1.96$.',
 'Gọi $J$ là chỉ số của ước lượng có trị tuyệt đối lớn nhất. Khoảng được báo cáo chứa không khi và chỉ khi $|Z_J|\\le1.96$, tương đương $\\max(|Z_1|,|Z_2|)\\le1.96$.'),
 b('Both events must hold. Independence gives $P(|Z_1|\\le c,|Z_2|\\le c)=[2\\Phi(c)-1]^2$, where $\\Phi$ is the standard normal CDF.',
 'Cả hai biến cố phải đồng thời đúng. Độc lập cho $P(|Z_1|\\le c,|Z_2|\\le c)=[2\\Phi(c)-1]^2$, với $\\Phi$ là hàm phân phối chuẩn tắc.'),
 b('At $c=1.96$, this is approximately $0.902508$. Since $1.96$ rounds $z_{0.975}$, writing exactly $0.9025$ would silently change the cutoff.',
 'Tại $c=1.96$, kết quả xấp xỉ $0.902508$. Vì $1.96$ là giá trị làm tròn của $z_{0.975}$, viết đúng bằng $0.9025$ sẽ ngầm thay đổi ngưỡng.'),
 b('Selection lowers coverage from about $95\\%$ to about $90.25\\%$. A fixed, preselected estimate does not have this selection penalty; simultaneous or selection-aware inference must account for it.',
 'Việc chọn theo dữ liệu làm độ phủ giảm từ khoảng $95\\%$ xuống khoảng $90.25\\%$. Ước lượng cố định từ trước không chịu tác động lựa chọn này; suy luận đồng thời hoặc có điều chỉnh lựa chọn phải tính đến nó.')]};
reviewAmendments['m2-w048-e4']={reason:'Derive maximum-order-statistic moments and specify the likelihood endpoint convention.',
 prompt:b('For IID $X_i\\sim\\operatorname{Uniform}(0,\\theta)$, $\\theta>0$, use density $\\theta^{-1}\\mathbf1_{[0,\\theta]}(x)$. Find the MLE and its variance. Which regularity condition behind the usual Cramér–Rao derivation fails?',
 'Với $X_i\\sim\\operatorname{Uniform}(0,\\theta)$ IID, $\\theta>0$, dùng mật độ $\\theta^{-1}\\mathbf1_{[0,\\theta]}(x)$. Tìm MLE và phương sai. Điều kiện chính quy nào của cách suy ra Cramér–Rao thông thường bị vi phạm?'),
 solution:[
 b('Let $M=\\max_iX_i>0$, an event of probability one. The specified likelihood is $L(\\theta)=\\theta^{-n}\\mathbf1_{\\{\\theta\\ge M\\}}$. It decreases on its feasible domain, so $\\hat\\theta=M$.',
 'Đặt $M=\\max_iX_i>0$, biến cố có xác suất một. Likelihood theo quy ước đề bài là $L(\\theta)=\\theta^{-n}\\mathbf1_{\\{\\theta\\ge M\\}}$. Nó giảm trên miền cho phép, nên $\\hat\\theta=M$.'),
 b('Independence gives $P(M\\le x)=(x/\\theta)^n$ for $0\\le x\\le\\theta$. Differentiation gives density $nx^{n-1}/\\theta^n$.',
 'Độc lập cho $P(M\\le x)=(x/\\theta)^n$ khi $0\\le x\\le\\theta$. Lấy đạo hàm được mật độ $nx^{n-1}/\\theta^n$.'),
 b('Integrating $x^k$ against this density gives $E[M^k]=n\\theta^k/(n+k)$ for $k>0$. Thus $E[M]=n\\theta/(n+1)$ and $E[M^2]=n\\theta^2/(n+2)$.',
 'Tích phân $x^k$ theo mật độ này cho $E[M^k]=n\\theta^k/(n+k)$ với $k>0$. Do đó $E[M]=n\\theta/(n+1)$, $E[M^2]=n\\theta^2/(n+2)$.'),
 b('Subtract the squared mean: $\\operatorname{Var}(M)=n\\theta^2/((n+1)^2(n+2))$. The estimator is biased, and its variance is of order $n^{-2}$.',
 'Trừ bình phương trung bình: $\\operatorname{Var}(M)=n\\theta^2/((n+1)^2(n+2))$. Ước lượng có chệch và phương sai có bậc $n^{-2}$.'),
 b('The support depends on $\\theta$. Ignoring its moving boundary gives score $-n/\\theta$ with nonzero expectation, breaking the regular score identity. An open-endpoint density gives the same probability model but only a likelihood supremum as $\\theta\\downarrow M$, which is why the endpoint convention was stated.',
 'Miền hỗ trợ phụ thuộc $\\theta$. Bỏ qua biên chuyển động cho score $-n/\\theta$ có kỳ vọng khác không, phá vỡ đẳng thức score chính quy. Mật độ loại đầu mút cho cùng mô hình xác suất nhưng chỉ có supremum likelihood khi $\\theta\\downarrow M$; vì thế đề đã nêu quy ước đầu mút.')]};
