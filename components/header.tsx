'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ArrowUpRight, LogOut, Menu, X, Route, CalendarDays, Flag, Library }  from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Text,useLanguage,useSession } from './providers';
import {QuantMark} from './quant-mark';
import { SearchDialog } from './search-dialog';

export function Header(){
 const {language,setLanguage}=useLanguage();const session=useSession();const path=usePathname();const [search,setSearch]=useState(false);const [menu,setMenu]=useState(false);
 const closeSearch=useCallback(()=>setSearch(false),[]);
 useEffect(()=>setMenu(false),[path]);
 return <><header className="site-header"><Link href="/" className="wordmark" aria-label="And I Wonder home"><QuantMark/><span>AND I<br/>WONDER<span className="brand-dot">.</span><small className="brand-caption">Quant research studio</small></span></Link><nav id="primary-navigation" className={menu?'nav-links is-open':'nav-links'} aria-label={language==='vi'?'Điều hướng chính':'Main navigation'}>{[['/path','Lộ trình','Path'],['/daily','Hằng ngày','Daily'],['/projects','Dự án','Projects'],['/resources','Thư viện','Resources']].map(([href,vi,en])=><Link key={href} href={href} onClick={()=>setMenu(false)} className={path.startsWith(href)?'active':''} aria-current={path.startsWith(href)?'page':undefined}>{href==='/path'?<Route size={16}/>:href==='/daily'?<CalendarDays size={16}/>:href==='/projects'?<Flag size={16}/>:<Library size={16}/>}<span>{language==='vi'?vi:en}</span></Link>)}</nav><div className="header-tools"><button type="button" className="icon-button search-open" onClick={()=>setSearch(true)} aria-label={language==='vi'?'Tìm kiếm ghi chú':'Search notes'}><Search size={19}/></button><div className="language-toggle" aria-label={language==='vi'?'Ngôn ngữ':'Language'}><button type="button" className={language==='vi'?'selected':''} onClick={()=>setLanguage('vi')} aria-pressed={language==='vi'}>VI</button><button type="button" className={language==='en'?'selected':''} onClick={()=>setLanguage('en')} aria-pressed={language==='en'}>EN</button></div>{session.authenticated?<button type="button" className="owner-button" onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});window.location.reload();}}><span>{session.owner?.login}</span><LogOut size={15}/></button>:<a className="owner-button" href="/api/auth/login"><Text vi="Đăng nhập" en="Owner login"/><ArrowUpRight size={16}/></a>}<button type="button" className="icon-button mobile-menu" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-controls="primary-navigation" aria-label={language==='vi'?(menu?'Đóng điều hướng':'Mở điều hướng'):(menu?'Close navigation':'Open navigation')}>{menu?<X/>:<Menu/>}</button></div></header><SearchDialog open={search} onClose={closeSearch}/></>;
}
