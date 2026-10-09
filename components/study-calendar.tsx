'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock3, Coffee, CalendarDays, Crosshair } from 'lucide-react';
import { Text, useLanguage } from './providers';

export type DailySummary = { id: string; date: string; focus: string; focusVi: string; week: number; project: string; minutes: number; total: number; completed: number };
type Progress = { checked?: Record<string, boolean>; status?: string };
type ProgressResponse = { notes?: Record<string, Progress> };

const PLAN_START = '2026-10';
const PLAN_END = '2028-10';
const AGENDA_SIZE = 4;

function dateInHoChiMinh() {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = (type: 'year' | 'month' | 'day') => parts.find((item) => item.type === type)?.value ?? '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}

function clampPlanMonth(date: string) {
  const requested = date.slice(0, 7);
  if (requested < PLAN_START) return PLAN_START;
  if (requested > PLAN_END) return PLAN_END;
  return requested;
}

export function StudyCalendar({ days }: { days: DailySummary[] }) {
  const { language } = useLanguage();
  const [today, setToday] = useState('');
  const [month, setMonth] = useState(PLAN_START);
  const [progress, setProgress] = useState<Record<string, Progress>>({});
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const date = dateInHoChiMinh();
    setToday(date);
    setMonth(clampPlanMonth(date));
    fetch('/api/progress', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Progress unavailable');
        return response.json() as Promise<ProgressResponse>;
      })
      .then((payload) => { setProgress(payload.notes ?? {}); setConnected(true); })
      .catch(() => setConnected(false));
  }, []);

  const [year, monthNumber] = month.split('-').map(Number);
  const current = new Date(year, monthNumber - 1, 1);
  const dayCount = new Date(year, monthNumber, 0).getDate();
  const offset = (current.getDay() + 6) % 7;
  const byDate = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);

  const checkedCount = (day: DailySummary) => Array.from({ length: AGENDA_SIZE }, (_, index) => progress[day.id]?.checked?.[`${day.id}::lesson${index}`] === true).filter(Boolean).length;
  const isDone = (day: DailySummary) => day.minutes > 0 && (progress[day.id]?.status === 'done' || checkedCount(day) === AGENDA_SIZE);
  const hasStarted = (day: DailySummary) => progress[day.id]?.status === 'in-progress' || progress[day.id]?.status === 'blocked' || checkedCount(day) > 0;

  const monthDays = days.filter((day) => day.date.startsWith(month));
  const planned = monthDays.filter((day) => day.minutes > 0);
  const finished = connected ? planned.filter(isDone).length : null;
  const todayPlan = byDate.get(today);
  const activeDay = connected ? days
    .filter((day) => day.date <= today && day.minutes > 0 && hasStarted(day) && !isDone(day))
    .sort((a, b) => b.date.localeCompare(a.date))[0] : undefined;
  const nextDay = today ? days.find((day) => day.date >= today && day.minutes > 0 && !(connected && isDone(day))) : undefined;
  const featured = today ? activeDay
    ?? (todayPlan?.minutes && !(connected && isDone(todayPlan)) ? todayPlan : undefined)
    ?? nextDay
    ?? (todayPlan?.minutes ? todayPlan : undefined) : undefined;
  const featuredMode = !today ? 'loading' : activeDay ? 'resume' : featured === todayPlan && featured && isDone(featured) ? 'review' : featured === todayPlan ? 'today' : 'next';
  const featuredChecked = featured && connected ? checkedCount(featured) : null;
  const monthName = new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-GB', { month: 'long' }).format(current);

  function changeMonth(delta: number) {
    const next = new Date(year, monthNumber - 1 + delta, 1);
    const value = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    setMonth(clampPlanMonth(`${value}-01`));
  }

  return <main className="workspace calendar-workspace">
    <div className="page-heading">
      <div>
        <div className="breadcrumb"><Link href="/">And I Wonder</Link><span>/</span><Text vi="Hằng ngày" en="Daily" /></div>
        <h1><Text vi="Mỗi ngày.\nMột bước." en="One day.\nOne step." /></h1>
      </div>
      <p><Text vi="Không cần biết hết mọi thứ hôm nay. Chỉ cần bắt đầu với một điều." en="You don't need to know everything today. Just start with one thing." /></p>
    </div>

    <div className="calendar-layout">
      <section className="calendar-board" aria-label={language === 'vi' ? 'Lịch học' : 'Study calendar'}>
        <div className="calendar-toolbar">
          <div><span className="month-number">{String(monthNumber).padStart(2, '0')}</span><h2>{monthName}<small>{year}</small></h2></div>
          <div className="calendar-actions">
            <button className="plain-button today-button" onClick={() => today && setMonth(clampPlanMonth(today))} disabled={!today || month === clampPlanMonth(today)}><Crosshair size={15} /><Text vi="Hôm nay" en="Today" /></button>
            <button className="square-button" onClick={() => changeMonth(-1)} disabled={month === PLAN_START} aria-label={language === 'vi' ? 'Tháng trước' : 'Previous month'}><ArrowLeft /></button>
            <button className="square-button" onClick={() => changeMonth(1)} disabled={month === PLAN_END} aria-label={language === 'vi' ? 'Tháng sau' : 'Next month'}><ArrowRight /></button>
          </div>
        </div>

        <div className="weekdays">{(language === 'vi' ? ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']).map((day) => <span key={day}>{day}</span>)}</div>
        <div className="calendar-grid">{Array.from({ length: offset }, (_, index) => <div className="day-cell empty" key={`empty-${index}`} aria-hidden="true" />)}{Array.from({ length: dayCount }, (_, index) => {
          const dayNumber = index + 1;
          const date = `${month}-${String(dayNumber).padStart(2, '0')}`;
          const day = byDate.get(date);
          const rest = day?.minutes === 0;
          const complete = Boolean(day && connected && isDone(day));
          const ariaLabel = day ? `${date}, ${language === 'vi' ? day.focusVi : day.focus}${complete ? `, ${language === 'vi' ? 'đã hoàn thành' : 'completed'}` : ''}` : date;
          return day ? <Link prefetch={false} key={date} href={`/daily/${date}`} className={`day-cell ${rest ? 'rest' : ''} ${date === today ? 'is-today' : ''} ${complete ? 'completed' : ''}`} aria-label={ariaLabel} aria-current={date === today ? 'date' : undefined}>
            <div className="day-cell-top"><span>{dayNumber}</span>{complete ? <Check size={15} aria-label={language === 'vi' ? 'Đã hoàn thành' : 'Completed'} /> : date === today ? <span className="today-dot" aria-hidden="true" /> : null}</div>
            <div className="day-cell-bottom">{rest ? <><Coffee size={14} /><span><Text vi="Nghỉ ngơi" en="Rest day" /></span></> : <><span className="day-project">{day.project}</span><span>4h</span></>}</div>
            <span className="day-tooltip">{rest ? (language === 'vi' ? 'Nạp lại năng lượng.' : 'Recharge.') : language === 'vi' ? day.focusVi : day.focus}</span>
          </Link> : <div key={date} className="day-cell unavailable" aria-hidden="true"><div className="day-cell-top"><span>{dayNumber}</span></div></div>;
        })}</div>

        <div className="calendar-legend"><span><i className="legend-dot blue" /><Text vi="Hôm nay" en="Today" /></span><span><i className="legend-dot mint" /><Text vi="Hoàn thành" en="Completed" /></span><span><i className="legend-dot striped" /><Text vi="Nghỉ cuối tuần" en="Weekend rest" /></span></div>
      </section>

      <aside className="calendar-sidebar">
        <div className="today-card">
          <div className="today-card-label"><CalendarDays size={19} /><Text vi={featuredMode === 'loading' ? 'Đang tìm ngày hôm nay' : featuredMode === 'resume' ? 'Tiếp tục buổi học' : featuredMode === 'next' ? 'Buổi học tiếp theo' : featuredMode === 'review' ? 'Hôm nay đã hoàn thành' : 'Buổi học hôm nay'} en={featuredMode === 'loading' ? 'Finding today’s session' : featuredMode === 'resume' ? 'Resume your session' : featuredMode === 'next' ? 'Next study session' : featuredMode === 'review' ? 'Today is complete' : 'Your study today'} /></div>
          <div className="today-card-date">{featured?.date.slice(8) ?? '—'}<span>{featured ? `${featured.date.slice(5, 7)} / ${featured.date.slice(0, 4)}` : ' '}</span></div>
          <h3>{featured ? (language === 'vi' ? featured.focusVi : featured.focus) : !today ? <Text vi="Đang tải lịch học…" en="Loading your calendar…" /> : language === 'vi' ? 'Bạn đã hoàn thành kế hoạch học.' : 'Your study plan is complete.'}</h3>
          {featured && <p className="today-card-time"><Clock3 size={15} /><Text vi="4 giờ tập trung" en="4 hours of focus" /></p>}
          {featured && <div className={`today-progress ${connected === true ? 'is-known' : 'is-unknown'}`} aria-live="polite">
            <div className="today-progress-track" aria-hidden="true">{Array.from({ length: AGENDA_SIZE }, (_, index) => <i key={index} className={connected && index < (featuredChecked ?? 0) ? 'is-checked' : ''} />)}</div>
            <span>{connected === null ? <Text vi="Đang tải tiến độ đã lưu…" en="Checking saved progress…" /> : connected === false ? <Text vi="Tiến độ hiện chưa khả dụng." en="Progress is currently unavailable." /> : isDone(featured) ? <Text vi="Đã đánh dấu hoàn thành." en="Marked complete." /> : <Text vi={`${featuredChecked} / ${AGENDA_SIZE} việc đã đánh dấu`} en={`${featuredChecked} of ${AGENDA_SIZE} tasks checked`} />}</span>
          </div>}
          {featured && <Link className="bold-button" href={`/daily/${featured.date}`}><Text vi={featuredMode === 'resume' ? 'Tiếp tục học' : featuredMode === 'review' ? 'Xem lại bài học' : 'Mở bài học'} en={featuredMode === 'resume' ? 'Resume learning' : featuredMode === 'review' ? 'Review today’s lesson' : 'Open daily lesson'} /><ArrowUpRight size={20} /></Link>}
        </div>

        <div className="month-progress">
          <div><span><Text vi="Tiến độ tháng này" en="This month's progress" /></span><b>{finished === null ? '—' : finished}<small> / {planned.length}</small></b></div>
          <div className={`progress-track ${connected ? 'is-known' : 'is-unknown'}`} role="img" aria-label={connected ? (language === 'vi' ? `${finished} trong ${planned.length} buổi học hoàn thành` : `${finished} of ${planned.length} study sessions completed`) : connected === null ? (language === 'vi' ? 'Đang tải tiến độ' : 'Progress is loading') : (language === 'vi' ? 'Tiến độ hiện chưa khả dụng' : 'Progress is currently unavailable')}><i style={{ width: `${finished === null || planned.length === 0 ? 0 : finished / planned.length * 100}%` }} /></div>
          <p>{connected === null ? <Text vi="Đang kiểm tra các buổi học đã hoàn thành." en="Checking completed study sessions." /> : connected === false ? <Text vi="Chưa tải được tiến độ đã lưu; lịch học vẫn sẵn sàng." en="Saved progress could not be loaded; your calendar is ready." /> : <Text vi="Đếm các buổi đã đánh dấu xong hoặc đủ bốn việc học." en="Counts sessions marked complete or with all four tasks checked." />}</p>
        </div>
        <div className="sidebar-note"><span aria-hidden="true">↳</span><p><Text vi="Cuối tuần là để nghỉ. Học sâu cần cả những khoảng dừng." en="Weekends are for resting. Deep work needs room to breathe." /></p></div>
      </aside>
    </div>
    <div className="page-footnote"><Text vi="731 ngày · 523 buổi học · 5 dự án · một hành trình của riêng bạn" en="731 days · 523 study sessions · 5 projects · a journey of your own" /></div>
  </main>;
}
