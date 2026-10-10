/** Typeset legacy Unicode notation without touching authored TeX, code, or URLs. */
const symbols: Record<string,string> = {
 'ℓ':'\\ell','↑':'\\uparrow','↓':'\\downarrow','∼':'\\sim','∝':'\\propto','∧':'\\land','∨':'\\lor','¬':'\\neg','⊗':'\\otimes','η':'\\eta','κ':'\\kappa','ζ':'\\zeta','ξ':'\\xi','χ':'\\chi','ϕ':'\\phi','ϵ':'\\epsilon','±':'\\pm','α':'\\alpha','β':'\\beta','γ':'\\gamma','δ':'\\delta','ε':'\\varepsilon','θ':'\\theta','λ':'\\lambda','μ':'\\mu','ν':'\\nu','π':'\\pi','ρ':'\\rho','σ':'\\sigma','τ':'\\tau','φ':'\\varphi','ψ':'\\psi','ω':'\\omega',
 'Γ':'\\Gamma','Δ':'\\Delta','Θ':'\\Theta','Λ':'\\Lambda','Σ':'\\Sigma','Φ':'\\Phi','Ψ':'\\Psi','Ω':'\\Omega',
 '∈':'\\in','∉':'\\notin','≤':'\\le','≥':'\\ge','≠':'\\ne','≈':'\\approx','≡':'\\equiv','→':'\\to','⇒':'\\Rightarrow','⇔':'\\iff','↦':'\\mapsto','∞':'\\infty','∑':'\\sum','∏':'\\prod','∫':'\\int','∂':'\\partial','∇':'\\nabla','√':'\\sqrt{}','×':'\\times','·':'\\cdot','⊥':'\\perp','⊂':'\\subset','⊆':'\\subseteq','∪':'\\cup','∩':'\\cap','∅':'\\varnothing','∀':'\\forall','∃':'\\exists','ℝ':'\\mathbb{R}','ℕ':'\\mathbb{N}','ℤ':'\\mathbb{Z}','ℚ':'\\mathbb{Q}','ℂ':'\\mathbb{C}','ℙ':'\\mathbb{P}','𝔼':'\\mathbb{E}','−':'-','‖':'\\Vert','⟨':'\\langle','⟩':'\\rangle',
};
const subs:Record<string,string>=Object.fromEntries([...'₀₁₂₃₄₅₆₇₈₉ₐₑₒₓₕₖₗₘₙₚₛₜᵢⱼᵣᵤᵥ'].map((c,i)=>[c,[...'0123456789aeoxhklmnpstijruv'][i]]));
const supers:Record<string,string>=Object.fromEntries([...'⁰¹²³⁴⁵⁶⁷⁸⁹ⁿⁱᵏᶜʳ'].map((c,i)=>[c,[...'0123456789nikcr'][i]]));
export function unicodeToTex(value:string):string {
 let tex=value.replace(/([_^])\{([^{}]*)\}|[{}]/g,(m,op,sub)=>op?op+'{'+sub+'}':'\\'+m).replace(/\[\[([^\[\]]+)\](?:,\s*\[([^\[\]]+)\])+\]/g, matrix=>{
  const rows=[...matrix.matchAll(/\[([^\[\]]+)\]/g)].map(r=>r[1].split(',').join(' & '));
  return '\\begin{bmatrix}'+rows.join(' \\\\ ')+'\\end{bmatrix}';
 });
 tex=tex.replace(/_([a-z\u00c0-\u024f\u1e00-\u1eff]*[\u00c0-\u024f\u1e00-\u1eff][a-z\u00c0-\u024f\u1e00-\u1eff_]+)/g,(_,label)=>'_{\\text{'+label.replaceAll('_',' ')+'}}')
  .replace(/([A-Za-zα-ωΓΔΘΛΣΦΨΩ])([\u0302\u0303\u0304])/gu,(_,base,mark)=>'\\'+(mark==='̂'?'hat':mark==='̃'?'tilde':'bar')+'{'+base+'}')
  .replace(/√\(([^()]*)\)/g,'\\sqrt{$1}').replace(/√([0-9]+|[A-Za-zα-ω])/g,'\\sqrt{$1}')
  .replace(/[₀-₉ₐₑₒₓₕₖₗₘₙₚₛₜᵢⱼᵣᵤᵥ]+/g,s=>'_{'+[...s].map(c=>subs[c]).join('')+'}')
  .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿⁱᵏᶜʳ⁻⁺ᵀ]+/g,s=>'^{'+[...s].map(c=>c==='ᵀ'?'\\mathsf{T}':c==='⁻'?'-':c==='⁺'?'+':supers[c]).join('')+'}')
  .replace(/[α-ωΓΔΘΛΣΦΨΩ∈∉≤≥≠≈≡→⇒⇔↦∞∑∏∫∂∇√×·⊥⊂⊆∪∩∅∀∃ℝℕℤℚℂℙ𝔼ℓ↑↓∼∝∧∨¬⊗−‖⟨⟩±ϕϵ]/gu,c=>(symbols[c]??c)+' ')
  .replace(/\b(span|rank|dim|diag|tr|Var|Cov|Corr|argmin|argmax|KL|SE|MSE)(?![A-Za-z])/g,'\\operatorname{$1}')
  .replace(/\b(log|ln|exp|sin|cos|tan|min|max|sup|inf|lim|det)(?![A-Za-z])/g,'\\$1 ')
  .replace(/(\\in\s+)(R|N|Z|Q|C)\b(?!\s*\()/g,'$1\\mathbb{$2}')
  .replace(/([_^])(min|max|obs|eff|train|test|\d{2,})(?![a-z])/g,'$1{$2}')
  .replace(/([_^])(\\(?:hat|bar|tilde)\{[^{}]+\})/g,'$1{$2}')
  .replace(/_([A-Za-z])_\{([^{}]+)\}/g,'_{$1_{$2}}')
  .replace(/\|\|/g,'\\lVert ');
 return tex.trim();
}

// No prose words are admitted into a candidate, so Vietnamese accents stay in prose.
const token=/(?:_(?=[a-z\u00c0-\u024f\u1e00-\u1eff_]*[\u00c0-\u024f\u1e00-\u1eff])[a-z\u00c0-\u024f\u1e00-\u1eff]+(?:_[a-z\u00c0-\u024f\u1e00-\u1eff]+)*|[_^](?:\{[^{}\n]*\}|[A-Za-z0-9]+|[-+])|\b(?:span|rank|dim|diag|Var|Cov|Corr|argmin|argmax|log|ln|exp|sin|cos|tan|min|max|sup|inf|lim|det|tr|KL|SE|MSE)(?![A-Za-z])|\b(?:xy|xz|dx|dt|df|dW|dB|dP|dQ|Pf|Pg|SD)(?![A-Za-z])|(?:[A-Z]{1,4}[a-z]?|[A-Za-z])(?![A-Za-z\u00c0-\u024f\u1e00-\u1eff])|(?:\d+(?:\.\d+)?|\.\d+)|[α-ωΓΔΘΛΣΦΨΩℝℕℤℚℂℙ𝔼ℓ↑↓∼∝∧∨¬⊗]|[\u0302\u0303\u0304₀-₉ₐₑₒₓₕₖₗₘₙₚₛₜᵢⱼᵣᵤᵥ⁰¹²³⁴⁵⁶⁷⁸⁹ⁿⁱᵏᶜʳ⁻⁺ᵀ]|[=+*/^_<>|()[\]{},:!%′'−∈∉≤≥≠≈≡→⇒⇔↦∞∑∏∫∂∇√×·⊥⊂⊆∪∩∅∀∃‖⟨⟩±ϕϵ-])/uy;
const evidence=/[=+*/^_<>|α-ωΓΔΘΛΣΦΨΩ₀-₉ₐₑₒₓₕₖₗₘₙₚₛₜᵢⱼᵣᵤᵥ⁰¹²³⁴⁵⁶⁷⁸⁹ⁿⁱᵏᶜʳᵀ∈∉≤≥≠≈≡→⇒⇔↦∞∑∏∫∂∇√×⊥⊂⊆∪∩∅∀∃ℝℕℤℚℂℙ𝔼ℓ↑↓∼∝∧∨¬⊗‖⟨⟩]/u;
function typesetPlain(text:string):string {
 let output='',i=0;
 while(i<text.length){
  if(i>0&&/[\p{L}\p{N}]/u.test(text[i-1])){output+=text[i++];continue;}
  let j=i,last=i,parts=0;
  while(j<text.length){token.lastIndex=j;const m=token.exec(text);if(!m)break;parts++;last=token.lastIndex;j=last;while(text[j]===' ')j++;}
  let raw=text.slice(i,last).trimEnd();
  // Punctuation belongs to the sentence, unless it closes a mathematical group.
  raw=raw.replace(/[,:;]+$/,'');
  const balance=(s:string,a:string,b:string)=>[...s].filter(c=>c===a).length-[...s].filter(c=>c===b).length;
  while(raw.endsWith(')')&&balance(raw,'(',')')<0)raw=raw.slice(0,-1);
  if(raw.startsWith('(')&&balance(raw,'(',')')>0)raw='';
  if(raw&&(evidence.test(raw)||(raw.includes('·')&&!/[A-Za-z]/.test(raw))||/^\([-−\d., ]+\)$/.test(raw))&&!/^[-+*/<>]+$/.test(raw)&&parts>0){output+='$'+unicodeToTex(raw)+'$';i+=raw.length;}
  else{output+=text[i++];}
 }
 return output;
}

export function normalizeMathNotation(markdown:string):string {
 // Preserve fenced/inline code, authored math, destinations and HTML tags verbatim.
 const protectedPart=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`|\$\$[\s\S]*?\$\$|\$(?:\\.|[^$\n])+\$|(?<![_^])!?\[(?!\d)[^\]]*\]\([^\n)]*\)|https?:\/\/[^\s<>]+|<\/?[A-Za-z][^>]*>|^\|[^\n]+\|[ \t]*$|\*\*|__)/gm;
 return markdown.split(protectedPart).map((part,index)=>{
  if(index%2&&part.startsWith('|')){
   let result='',cell='',math=false,code=false;
   for(let i=0;i<part.length;i++){
    const c=part[i];if(c==='$'&&part[i-1]!=='\\')math=!math;if(c==='`')code=!code;
    if(c==='|'&&!math&&!code&&part[i-1]!=='\\'){result+=/^[\s:-]*$/.test(cell)?cell:normalizeMathNotation(cell);result+='|';cell='';}else cell+=c;
   }
   return result+cell;
  }
  return index%2?part:typesetPlain(part);
 }).join('');
}
