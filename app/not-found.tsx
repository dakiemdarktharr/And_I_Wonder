import Link from 'next/link';
import {Text} from '@/components/providers';
export default function NotFound(){return <main className="error-page"><span className="error-code">404</span><h1><Text vi="Chưa có trang này." en="This page is uncharted."/></h1><p><Text vi="Quay về lịch học để tìm đúng ngày." en="Find your way through the calendar."/></p><Link className="bold-button" href="/daily"><Text vi="Mở lịch học" en="Open calendar"/> ↗</Link></main>}
