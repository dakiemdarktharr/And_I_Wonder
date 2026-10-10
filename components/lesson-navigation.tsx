'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {BookOpen,PenLine,Flag,Library,FlaskConical,Route} from 'lucide-react';
import {Text,useLanguage} from './providers';
export function LessonNavigation({children,lessonId}:{children:React.ReactNode;lessonId:string}){
 const {language}=useLanguage();const [active,setActive]=useState('math-theory');
 const sections=[['math-theory','Bài giảng','Lesson',BookOpen],['math-practice','Bốn bài tập','Four problems',PenLine],['math-research','Dự án','Project',Flag],['math-reading','Tài liệu','Sources',Library]] as const;
 useEffect(()=>{
  const update=()=>{const nodes=['math-theory','math-practice','math-research','math-reading'].map(id=>document.getElementById(id)).filter((n):n is HTMLElement=>!!n);const above=nodes.filter(n=>n.getBoundingClientRect().top<=180);setActive(above.at(-1)?.id??'math-theory');};
  update();window.addEventListener('scroll',update,{passive:true});return()=>window.removeEventListener('scroll',update);
 },[lessonId]);
 return <aside className="math-sidebar" aria-label={language==='vi'?'Mục lục bài học':'Lesson navigation'}><p className="lesson-nav-title"><Text vi="Trong buổi học" en="In this session"/></p>{sections.map(([id,vi,en,Icon])=><a key={id} href={'#'+id} aria-current={active===id?'location':undefined}><Icon aria-hidden="true"/>{language==='vi'?vi:en}</a>)}{children}<div className="lesson-side-links"><Link href="/lab"><FlaskConical/><Text vi="Phòng thí nghiệm" en="Research lab"/></Link><Link href="/path"><Route/><Text vi="Lộ trình của tôi" en="My learning path"/></Link></div></aside>;
}
