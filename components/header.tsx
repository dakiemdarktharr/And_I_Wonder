'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ArrowUpRight, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Text,useLanguage,useSession } from './providers';
import { SearchDialog } from './search-dialog';

export function Header(){
 const {language,setLanguage}=useLanguage();const session=useSession();const path=usePathname();const [search,setSearch]=useState(false);const [menu,setMenu]=useState(false);
 return <><header className="site-header"><Link href="/" className="wordmark" aria-label="And I Wonder home"><span className="logo-shape" aria-hidden="true"><i/><i/><i/></span><span>AND I<br/>WONDER<span className="brand-dot">.</span></span></Link><nav className={menu?'nav-links is-open':'nav-links'} aria-label={language==='vi'?'Điều hướng chính':'Main navigation'}>{[['/daily','Hằng ngày','Daily'],['/projects','Dự án','Projects'],['/resources','Thư viện','Resources']].map(([href,vi,en])=><Link key={href} href={href} onClick={()=>setMenu(false)} className={path.startsWith(href)?'active':''}>{language==='vi'?vi:en}</Link>)}</nav><div className="header-tools"><button className="icon-button search-open" onClick={()=>setSearch(true)} aria-label={language==='vi'?'Tìm kiếm ghi chú':'Search notes'}><Search size={19}/></button><div className="language-toggle" aria-label="Language"><button className={language==='vi'?'selected':''} onClick={()=>setLanguage('vi')} aria-pressed={language==='vi'}>VI</button><button className={language==='en'?'selected':''} onClick={()=>setLanguage('en')} aria-pressed={language==='en'}>EN</button></div>{session.authenticated?<button className="owner-button" onClick={async()=>{await fetch('/api/auth/logout',{method:'POST'});window.location.reload();}}><span>{session.owner?.login}</span><LogOut size={15}/></button>:<a className="owner-button" href="/api/auth/login"><Text vi="Đăng nhập" en="Owner login"/><ArrowUpRight size={16}/></a>}<button className="icon-button mobile-menu" onClick={()=>setMenu(!menu)} aria-label={language==='vi'?'Mở điều hướng':'Toggle navigation'}>{menu?<X/>:<Menu/>}</button></div></header><SearchDialog open={search} onClose={()=>setSearch(false)}/></>;
}
