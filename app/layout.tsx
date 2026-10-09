import type {Metadata,Viewport} from 'next';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/800.css';
import '@fontsource/be-vietnam-pro/900.css';
import 'katex/dist/katex.min.css';
import './globals.css';
import '@/components/studio-theme.css';
import {Providers} from '@/components/providers';
import {Header} from '@/components/header';
import {PortalTransition} from '@/components/portal-transition';

export const metadata:Metadata={title:{default:'And I Wonder — A quant learning studio',template:'%s · And I Wonder'},description:'A bilingual, open learning studio. A 24-month quant research journey, five projects, and a library of free resources.',robots:{index:true,follow:true}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#1947e5'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi" suppressHydrationWarning><body><Providers><PortalTransition><a className="skip-link" href="#main-content">Đi tới nội dung / Skip to content</a><Header/><div id="main-content">{children}</div></PortalTransition></Providers></body></html>}
