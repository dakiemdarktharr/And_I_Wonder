'use client';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowRight, ArrowLeft} from 'lucide-react';
import {Text, useLanguage} from './providers';
import {MathMarkdown} from './math-markdown';
import {mathProjectGuides as guides} from '@/lib/math-project-guides';
import './math-curriculum.css';
import './project-path.css';
const scenes = [
 {asset:'projection',vi:'Dựng phép chiếu. Giải hệ ổn định.',en:'Build projections. Solve stable systems.'},
 {asset:'inference',vi:'Ước lượng tham số. Đo độ bất định.',en:'Estimate parameters. Measure uncertainty.'},
 {asset:'time-series',vi:'Tìm cấu trúc trong chuỗi thời gian.',en:'Find structure in time series.'},
 {asset:'learning',vi:'Học từ phản hồi. Chứng minh cận sai số.',en:'Learn from feedback. Prove error bounds.'},
 {asset:'capstone',vi:'Kết nối toán học thành nghiên cứu của bạn.',en:'Connect the mathematics in your own research.'},
];
export function MathProjects({id}:{id?:string}) {
 const {language}=useLanguage();const vi=language==='vi';
 const index=guides.findIndex(g=>g.id===id);const guide=guides[index];
 if(id&&guide)return <main className="math-syllabus project-detail">
  <nav className="math-topbar"><Link href="/projects"><ArrowLeft size={16}/><Text vi="Các chặng dự án" en="Project path"/></Link><Link href={`/projects/${id}?curriculum=v1`}><Text vi="Dự án v1 (lưu trữ)" en="Legacy v1 projects"/></Link></nav>
  <div className="project-detail-banner"><Image src={`/quests/${scenes[index].asset}.png`} alt="" fill sizes="(max-width:800px) 100vw, 1100px" priority/><span>{guide.id} / {guide.weeks}</span></div>
  <h1>{vi?guide.vi:guide.en}</h1><MathMarkdown>{vi?guide.viBody:guide.enBody}</MathMarkdown>
  {guides[index+1]&&<Link className="project-next" href={`/projects/${guides[index+1].id}`}><Text vi="Chặng tiếp theo" en="Next project"/><ArrowRight size={18}/></Link>}
 </main>;
 return <main className="project-path">
  <header className="project-path-heading"><h1><Text vi="Hành trình dự án" en="Your project path"/></h1><Link href="/mathematics"><Text vi="Đề cương toán" en="Mathematics syllabus"/></Link></header>
  <ol className="project-questline">{guides.map((g,i)=><li key={g.id}>
   <span className="project-node" aria-hidden="true">{i+1}</span>
   <Link className={`project-quest project-quest-${i+1}`} href={`/projects/${g.id}`}>
    <Image className="project-quest-scene" src={`/quests/${scenes[i].asset}.png`} alt="" fill sizes="(max-width:800px) 100vw, 1200px" priority={i===0}/>
    <div className="project-quest-copy"><span className="project-range">{g.id} <span>{g.weeks}</span></span><h2>{vi?g.vi:g.en}</h2><p>{vi?scenes[i].vi:scenes[i].en}</p><span className="project-enter"><Text vi="Mở dự án" en="Open project"/><ArrowRight size={18}/></span></div>
   </Link>
  </li>)}</ol>
  <footer className="project-path-footer"><Link href="/projects?curriculum=v1"><Text vi="Dự án v1 (lưu trữ)" en="Legacy v1 projects"/></Link></footer>
 </main>;
}
