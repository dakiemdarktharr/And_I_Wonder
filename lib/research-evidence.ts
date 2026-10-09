export const EVIDENCE_STORAGE='wonder-research-evidence-v1';
export type ResearchRecord={question:string;literature:string;plan:string;artifact:string;result:string;limitations:string;proofAttempt:string;selfDefence:string};
export type LearningRecord={startDate:string;projects:Record<string,ResearchRecord>;diagnostic?:{form:'A'|'B';answers:Record<string,string>;submittedAt:string};independentVerification:'unverified'};
export const emptyResearch=():ResearchRecord=>({question:'',literature:'',plan:'',artifact:'',result:'',limitations:'',proofAttempt:'',selfDefence:''});
export function validateLearningRecord(value:unknown):LearningRecord|null{
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const v=value as Record<string,unknown>;
 if(typeof v.startDate!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v.startDate)||!Number.isFinite(Date.parse(v.startDate+'T12:00:00Z'))||new Date(v.startDate+'T12:00:00Z').toISOString().slice(0,10)!==v.startDate)return null;
 if(!v.projects||typeof v.projects!=='object'||Array.isArray(v.projects)||v.independentVerification!=='unverified')return null;
 const projects:Record<string,ResearchRecord>={};
 for(const [id,raw] of Object.entries(v.projects)){
  if(!/^P0[1-5]$/.test(id)||!raw||typeof raw!=='object'||Array.isArray(raw))return null;
  const r=raw as Record<string,unknown>;const out=emptyResearch();
  for(const key of Object.keys(out) as (keyof ResearchRecord)[]){if(typeof r[key]!=='string'||r[key].length>6000)return null;out[key]=r[key];}
  projects[id]=out;
 }
 let diagnostic:LearningRecord['diagnostic'];
 if(v.diagnostic!==undefined){const d=v.diagnostic as Record<string,unknown>;if(!d||!['A','B'].includes(String(d.form))||typeof d.submittedAt!=='string'||!Number.isFinite(Date.parse(d.submittedAt))||!d.answers||typeof d.answers!=='object'||Array.isArray(d.answers))return null;const answers:Record<string,string>={};for(const [k,a] of Object.entries(d.answers)){if(!/^[afpl][1-4]$/.test(k)||typeof a!=='string'||a.length>40)return null;answers[k]=a;}diagnostic={form:d.form as 'A'|'B',answers,submittedAt:d.submittedAt};}
 return {startDate:v.startDate,projects,diagnostic,independentVerification:'unverified'};
}
