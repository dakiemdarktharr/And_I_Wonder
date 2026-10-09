'use client';

import { useEffect, useRef, useState, type CSSProperties, type FocusEvent, type MouseEvent } from 'react';
import {usePortalTransition} from './portal-transition';
import { ArrowUpRight, Asterisk, MoveUpRight } from 'lucide-react';
import { useLanguage, Text } from './providers';
import { CalendarArt, QuestArt, ShelfArt, Cutout } from './portal-art';

const portals = [
  { id: 'daily', en: 'Daily', vi: 'Hằng ngày', subEn: 'A little further. Every day.', subVi: 'Mỗi ngày, tiến thêm một chút.', code: '24 months', Art: CalendarArt },
  { id: 'projects', en: 'Projects', vi: 'Dự án', subEn: 'Five quests. Real discoveries.', subVi: 'Năm chặng. Những khám phá thật.', code: '5 quest lines', Art: QuestArt },
  { id: 'resources', en: 'Resources', vi: 'Thư viện', subEn: 'Good questions start here.', subVi: 'Nơi khởi đầu câu hỏi hay.', code: 'Free, always', Art: ShelfArt },
] as const;

type PortalId = (typeof portals)[number]['id'];
type Particle = { id: number; type: PortalId; index: number; x: number; y: number; dx: number; dy: number; rotate: number };

export function HomePortals() {
  const { language } = useLanguage();
  const {active,enter:startTransition}=usePortalTransition();
  const [particles, setParticles] = useState<Particle[]>([]);
  const counter = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cooldown = useRef<Record<string, number>>({});

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
  }, []);


  function burst(event: MouseEvent<HTMLAnchorElement> | FocusEvent<HTMLAnchorElement>, type: PortalId) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || Date.now() - (cooldown.current[type] || 0) < 4500) return;
    cooldown.current[type] = Date.now();
    const rect = event.currentTarget.getBoundingClientRect();
    const count = type === 'daily' ? 4 : 3;
    const set = Array.from({ length: count }, (_, index) => {
      const x = rect.left + rect.width * (type === 'daily' ? 0.16 + index * 0.22 : 0.2 + index * 0.28);
      const y = rect.top + rect.height * 0.55;
      return {
        id: counter.current++, type, index, x, y,
        dx: (index - (count - 1) / 2) * (type === 'daily' ? 90 : 100),
        dy: window.innerHeight - y - 70,
        rotate: (index - (count - 1) / 2) * 22,
      };
    });
    setParticles((current) => [...current, ...set]);
    timers.current.push(setTimeout(() => setParticles((current) => current.filter((item) => !set.some((particle) => particle.id === item.id))), 4900));
  }

  function enter(event: MouseEvent<HTMLAnchorElement>, id: PortalId) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    startTransition(id,event.currentTarget.getBoundingClientRect());
  }

  return <main className="home-main">
    <section className="home-intro">
      <div>
        <p className="intro-note"><span className="small-cross">+</span><Text vi="Một không gian cho trí tò mò." en="A place for a curious mind." /></p>
        <h1>AND I <span className="wonder-word">WONDER<svg viewBox="0 0 460 20" aria-hidden="true"><path d="M3 12Q170 0 457 9M5 16Q250 7 440 17" /></svg></span><span className="title-star"><Asterisk /></span></h1>
      </div>
      <p className="intro-description"><Text vi="Từ câu hỏi đầu tiên đến nghiên cứu của riêng bạn. Hành trình quant bắt đầu bằng một ngày hôm nay." en="From your first question to research of your own. Your quant journey starts with today." /></p>
    </section>

    <section className="portal-grid" aria-label={language === 'vi' ? 'Chọn không gian học' : 'Choose your study space'}>
      {portals.map(({ id, en, vi, subEn, subVi, code, Art }) => <a
        key={id}
        href={`/${id}`}
        className={`portal portal-${id} ${active === id ? 'portal-entering' : ''}`}
        onClick={(event) => enter(event, id)}
        onMouseEnter={(event) => burst(event, id)}
        onFocus={(event) => burst(event, id)}
        aria-busy={active === id}
      >
        <div className="portal-top"><span className="portal-type">{language === 'vi' ? { daily: 'Lịch học', projects: 'Phòng nghiên cứu', resources: 'Tủ tri thức' }[id] : { daily: 'Study calendar', projects: 'Research studio', resources: 'Knowledge cabinet' }[id]}</span><span className="portal-arrow"><ArrowUpRight /></span></div>
        <div className="portal-scene"><Art /><div className="scene-ground" /></div>
        <div className="portal-caption"><h2>{language === 'vi' ? vi : en}</h2><p>{language === 'vi' ? subVi : subEn}</p></div>
        <div className="portal-ruler"><span>{language === 'vi' ? { daily: '24 tháng', projects: '5 chặng dự án', resources: 'Hoàn toàn miễn phí' }[id] : code}</span><span aria-hidden="true">+</span></div>
      </a>)}
    </section>

    <footer className="home-footer">
      <span><i className="status-square" /><Text vi="Thiết kế để học sâu." en="Built for deep work." /></span>
      <div><span>07.10.2026 — 06.10.2028</span><span><Text vi="4 giờ / ngày · 5 ngày / tuần" en="4 hours / day · 5 days / week" /></span></div>
      <span className="footer-mark"><MoveUpRight size={16} /><Text vi="Cứ tiếp tục tò mò" en="Stay curious" /></span>
    </footer>

    <div className="particle-layer" aria-hidden="true">{particles.map((particle) => <div className="flying-cutout" key={particle.id} style={{ left: particle.x, top: particle.y, '--dx': `${particle.dx}px`, '--dy': `${particle.dy}px`, '--spin': `${particle.rotate}deg` } as CSSProperties}>
      <div className="cutout-solid"><Cutout type={particle.type} index={particle.index} /></div>
      <div className="cutout-ashes">{Array.from({ length: 24 }, (_, index) => <i key={index} style={{ '--px': `${(index % 6) * 13}px`, '--py': `${Math.floor(index / 6) * 15}px`, '--ax': `${((index * 37) % 120) - 60}px`, '--ay': `${-35 - (index % 5) * 19}px`, '--delay': `${index % 4 * 0.04}s` } as CSSProperties} />)}</div>
    </div>)}</div>

  </main>;
}
