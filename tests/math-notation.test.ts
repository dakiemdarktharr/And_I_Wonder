import {test} from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {normalizeMathNotation,unicodeToTex} from '../lib/math-notation';
test('legacy notation preserves matrix, null space, transpose, and set semantics',()=>{
 const source='A=[[1,2],[2,4]], N(A)=span{(−2,1)}, rank(A)=1; cᵀβ and cᵀh=0 for h∈N(A).';
 const out=normalizeMathNotation(source);
 assert.match(out,/\\begin\{bmatrix\}1 & 2 \\\\ 2 & 4\\end\{bmatrix\}/);
 assert.match(out,/span\}\\\{/);
 assert.match(out,/c\^\{\\mathsf\{T\}\}\\beta/);
 assert.match(out,/h\\in N\(A\)/);
 assert.doesNotMatch(out,/mathbb\{N\}/);
 for(const m of out.matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>katex.renderToString(m[1],{throwOnError:true}));
});
test('authored TeX, source code, URLs and Vietnamese words remain intact',()=>{
 const text='Đạo hàm riêng, kỳ vọng; $\\frac{a}{b}$; `x_i = a + b`; [Read](https://example.org/a_b?q=x+y)\n```python\nx = 1 + 2\n```';
 assert.equal(normalizeMathNotation(text),text);
 assert.equal(normalizeMathNotation('Học bài mới. Bốn bài tập. P01 · CSV.'),'Học bài mới. Bốn bài tập. P01 · CSV.');
});
test('normalization is idempotent and mathematical sets have visible braces',()=>{
 const result=normalizeMathNotation('N(A)={x∈R^n:Ax=0}, β₁+2β₂=0.');
 assert.equal(normalizeMathNotation(result),result);
 assert.match(result,/\\\{x\\in \\mathbb\{R\}/);
 assert.match(unicodeToTex('β₁+2β₂=0'),/\\beta _\{1\}/);
});
test('markdown table delimiters, emphasis and existing math in cells survive',()=>{
 const out=normalizeMathNotation('**β₁=2**\n\n| Quantity | Value |\n| --- | --- |\n| $|x|$ | σ²=4 |');
 assert.ok(out.startsWith('**$\\beta _{1}=2$**'));
 assert.ok(out.includes('| --- | --- |'));
 assert.ok(out.includes('| $|x|$ | $\\sigma ^{2}=4$ |'));
});
test('nested indicator indices and Unicode letter subscripts retain their scope',()=>{
 const formula=unicodeToTex('1_Aₙ, σᵢ(X)², e^ℓ');
 assert.match(formula,/1_\{A_\{n\}\}/);
 assert.match(formula,/\\sigma _\{i\}\(X\)\^\{2\}/);
 assert.match(formula,/e\^\\ell/);
 assert.doesNotThrow(()=>katex.renderToString(formula,{throwOnError:true}));
 const words=normalizeMathNotation('R_ứng_viên(s)−R_đối_chứng(s)');
 assert.match(words,/\\text\{ứng viên\}/);
 for(const m of words.matchAll(/\$([^$]+)\$/g))assert.doesNotThrow(()=>katex.renderToString(m[1],{throwOnError:true,strict:'ignore'}));
});
