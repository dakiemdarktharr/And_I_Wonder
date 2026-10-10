'use client';
import {ViewTransition,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {usePortalTransition} from './portal-transition';
export function PageTransition({children}:{children:ReactNode}){
 const pathname=usePathname();const {active}=usePortalTransition();
 return <ViewTransition key={pathname} enter={active?'none':'page-enter'} exit={active?'none':'page-exit'} default="none"><div className="page-surface">{children}</div></ViewTransition>;
}
