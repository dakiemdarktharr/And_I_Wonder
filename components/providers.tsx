'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Language = 'vi' | 'en';
const LanguageContext = createContext<{language: Language; setLanguage:(language:Language)=>void}>({language:'vi',setLanguage:()=>{}});
type Session = {authenticated:boolean; owner?:{login:string;avatarUrl?:string}; loading:boolean};
const SessionContext = createContext<Session>({authenticated:false,loading:true});
export function Providers({children}:{children:ReactNode}) {
  const [language,setLang] = useState<Language>('vi');
  const [session,setSession] = useState<Session>({authenticated:false,loading:true});
  useEffect(()=>{try{const saved=localStorage.getItem('wonder-language');if(saved==='en'||saved==='vi')setLang(saved);}catch{/* The language toggle still works when browser storage is disabled. */}},[]);
  useEffect(()=>{document.documentElement.lang=language;},[language]);
  useEffect(()=>{let active=true;fetch('/api/auth/session').then(r=>r.json()).then(data=>{if(active)setSession({...data,loading:false});}).catch(()=>{if(active)setSession({authenticated:false,loading:false});});return()=>{active=false;};},[]);
  function setLanguage(value:Language){setLang(value);try{localStorage.setItem('wonder-language',value);}catch{}}
  return <LanguageContext.Provider value={{language,setLanguage}}><SessionContext.Provider value={session}>{children}</SessionContext.Provider></LanguageContext.Provider>;
}
export const useLanguage=()=>useContext(LanguageContext);
export const useSession=()=>useContext(SessionContext);
export function Text({vi,en}:{vi:string;en:string}){return <>{(useLanguage().language==='vi'?vi:en).replace(/\\n/g,'\n')}</>;}
