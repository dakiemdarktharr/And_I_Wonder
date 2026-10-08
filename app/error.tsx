'use client';
import {Text} from '@/components/providers';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="error-page"><h1><Text vi="Trang chưa tải được." en="This page couldn't load."/></h1><p><Text vi="Thử tải lại để tiếp tục học." en="Try loading it again to continue studying."/></p><button className="bold-button" onClick={reset}><Text vi="Thử lại" en="Try again"/></button></main>}
