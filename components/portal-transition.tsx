'use client';

import {createContext,useContext,useEffect,useRef,useState,type CSSProperties,type ReactNode} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {CalendarArt,QuestArt,ShelfArt} from './portal-art';

type PortalId='daily'|'projects'|'resources';
type Flight={id:PortalId;rect:DOMRect;phase:'opening'|'covered'|'leaving'};
const TransitionContext=createContext<{active:PortalId|null;enter:(id:PortalId,rect:DOMRect)=>void}>({active:null,enter:()=>{}});
export const usePortalTransition=()=>useContext(TransitionContext);

/** The overlay lives in the persistent layout so route replacement cannot cut it off. */
export function PortalTransition({children}:{children:ReactNode}){
 const router=useRouter(),pathname=usePathname();
 const [flight,setFlight]=useState<Flight|null>(null);
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
 const locked=useRef(false);
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 useEffect(()=>{
  if(!flight||pathname!==`/${flight.id}`||flight.phase==='leaving')return;
  timers.current.forEach(clearTimeout);
  setFlight(v=>v?{...v,phase:'leaving'}:null);
  timers.current=[setTimeout(()=>{setFlight(null);locked.current=false;},280)];
 },[pathname,flight]);
 function enter(id:PortalId,rect:DOMRect){
  if(locked.current)return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){router.push(`/${id}`);return;}
  locked.current=true;
  setFlight({id,rect,phase:'opening'});
  router.prefetch(`/${id}`);
  timers.current=[setTimeout(()=>{
   setFlight(v=>v?{...v,phase:'covered'}:null);
   router.push(`/${id}`);
  },680),setTimeout(()=>{setFlight(null);locked.current=false;},7500)];
 }
 return <TransitionContext.Provider value={{active:flight?.id??null,enter}}>{children}
  {flight&&<div className={`portal-flight flight-${flight.id} portal-flight--${flight.phase}`} style={{'--from-x':`${flight.rect.left}px`,'--from-y':`${flight.rect.top}px`,'--from-w':`${flight.rect.width}px`,'--from-h':`${flight.rect.height}px`} as CSSProperties} aria-hidden="true"><div>{flight.id==='daily'?<CalendarArt/>:flight.id==='projects'?<QuestArt/>:<ShelfArt/>}</div></div>}
 </TransitionContext.Provider>;
}
