'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, Files, Flag, ListChecks, Target, TriangleAlert } from 'lucide-react';
import type { Note } from '@/lib/types';
import guideData from '@/data/project-guides.json';
import { useLanguage } from './providers';
import './library-project.css';

type Localized = { en: string; vi: string };
type GuideStep = { title: Localized; detail: Localized };
type GuideCheck = { metric: Localized; criterion: Localized };
type GuideMilestone = { name: Localized; evidence: Localized; gate: Localized };
type ProjectGuideRecord = {
  id: string;
  title: Localized;
  question: Localized;
  scope: Localized;
  source?: { url: string; label: Localized };
  startingInputs: Localized[];
  steps: GuideStep[];
  repositoryTree: string[];
  acceptanceChecks: GuideCheck[];
  metrics: Localized[];
  pitfalls: Localized[];
  milestones: GuideMilestone[];
};

const guides = guideData as ProjectGuideRecord[];

function languageValue(value: Localized, language: string) {
  return language === 'vi' ? value.vi : value.en;
}

function weekRange(project: Note) {
  const first = project.meta.first_week;
  const last = project.meta.release_week;
  if (typeof first !== 'number' || typeof last !== 'number') return '';
  return 'W' + String(first).padStart(2, '0') + ' — W' + String(last).padStart(2, '0');
}

export function ProjectGuide({ project }: { project: Note }) {
  const projectCode = typeof project.meta.project === 'string' ? project.meta.project : '';
  const guide = guides.find((item) => item.id === projectCode);
  if (!guide) return null;
  return <ProjectGuideContent project={project} guide={guide} />;
}

function ProjectGuideContent({ project, guide }: { project: Note; guide: ProjectGuideRecord }) {
  const { language } = useLanguage();
  const currentLanguage = language === 'vi' ? 'vi' : 'en';
  const repository = typeof project.meta.repository === 'string' ? project.meta.repository : project.title;

  return (
    <section className="project-guide-shell" aria-labelledby="project-guide-title">
      <div className="project-guide-topline">
        <Link href="/projects"><ArrowLeft size={15} /><span>{currentLanguage === 'vi' ? 'Tất cả dự án' : 'All projects'}</span></Link>
        <span>{projectCodeOf(project)} · {repository}</span>
      </div>

      <header className="project-guide-header">
        <div>
          <p className="project-guide-kicker">
            {currentLanguage === 'vi' ? 'ĐẶC TẢ DỰ ÁN / ' : 'PROJECT BUILD SPEC / '}
            {projectCodeOf(project)}
          </p>
          <h2 id="project-guide-title">{languageValue(guide.title, currentLanguage)}</h2>
          <p className="project-guide-question">{languageValue(guide.question, currentLanguage)}</p>
        </div>
        <div className="project-guide-window">
          <div>{weekRange(project)}</div>
          <span>{currentLanguage === 'vi' ? 'Mốc hoàn thành theo chất lượng' : 'Quality-gated release window'}</span>
        </div>
      </header>

      <p className="project-guide-scope">{languageValue(guide.scope, currentLanguage)}</p>

      <div className="project-guide-content">
        <section className="project-guide-section" aria-labelledby="project-guide-inputs">
          <h3 id="project-guide-inputs"><span><Files size={13} /></span>{currentLanguage === 'vi' ? 'Đầu vào bắt đầu' : 'Start with these inputs'}</h3>
          <ol className="project-guide-list">
            {guide.startingInputs.map((item, index) => (
              <li key={index}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{languageValue(item, currentLanguage)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="project-guide-section" aria-labelledby="project-guide-steps">
          <h3 id="project-guide-steps"><span><ListChecks size={14} /></span>{currentLanguage === 'vi' ? 'Các bước triển khai' : 'Implementation steps'}</h3>
          <ol className="project-guide-list">
            {guide.steps.map((step, index) => (
              <li key={index}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{languageValue(step.title, currentLanguage)}</h4>
                  <p>{languageValue(step.detail, currentLanguage)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="project-guide-section" aria-labelledby="project-guide-tree">
          <h3 id="project-guide-tree"><span><Files size={13} /></span>{currentLanguage === 'vi' ? 'Cấu trúc kho mã dự kiến' : 'Expected repository tree'}</h3>
          <pre className="project-guide-tree"><code>{guide.repositoryTree.join('\n')}</code></pre>
        </section>

        <section className="project-guide-section" aria-labelledby="project-guide-acceptance">
          <h3 id="project-guide-acceptance"><span><Check size={15} /></span>{currentLanguage === 'vi' ? 'Kiểm tra nghiệm thu định lượng' : 'Numerical acceptance checks'}</h3>
          <div className="project-guide-checks">
            {guide.acceptanceChecks.map((check, index) => (
              <article className="project-guide-check" key={index}>
                <h4>{languageValue(check.metric, currentLanguage)}</h4>
                <p>{languageValue(check.criterion, currentLanguage)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="project-guide-section" aria-labelledby="project-guide-metrics">
          <h3 id="project-guide-metrics"><span><Target size={14} /></span>{currentLanguage === 'vi' ? 'Chỉ số cần báo cáo' : 'Metrics to report'}</h3>
          <ul className="project-guide-metrics">
            {guide.metrics.map((metric, index) => (
              <li className="project-guide-metric" key={index}><Target size={15} />{languageValue(metric, currentLanguage)}</li>
            ))}
          </ul>
        </section>

        <section className="project-guide-section" aria-labelledby="project-guide-pitfalls">
          <h3 id="project-guide-pitfalls"><span><TriangleAlert size={14} /></span>{currentLanguage === 'vi' ? 'Bẫy đánh giá cần tránh' : 'Evaluation pitfalls'}</h3>
          <ul className="project-guide-pitfalls">
            {guide.pitfalls.map((pitfall, index) => <li key={index}>{languageValue(pitfall, currentLanguage)}</li>)}
          </ul>
        </section>

        <section className="project-guide-section" aria-labelledby="project-guide-milestones">
          <h3 id="project-guide-milestones"><span><Flag size={14} /></span>{currentLanguage === 'vi' ? 'Mốc bàn giao và bằng chứng' : 'Milestones and evidence'}</h3>
          <div className="project-guide-milestones">
            {guide.milestones.map((milestone, index) => (
              <article className="project-guide-milestone" key={index}>
                <h4>{String(index + 1).padStart(2, '0')} · {languageValue(milestone.name, currentLanguage)}</h4>
                <p><b>{currentLanguage === 'vi' ? 'Bằng chứng' : 'Evidence'}:</b> {languageValue(milestone.evidence, currentLanguage)}</p>
                <p><b>{currentLanguage === 'vi' ? 'Cổng chất lượng' : 'Gate'}:</b> {languageValue(milestone.gate, currentLanguage)}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {guide.source && (
        <footer className="project-guide-source">
          <span>{currentLanguage === 'vi' ? 'Nguồn dữ liệu / bài báo:' : 'Data / paper source:'}</span>
          <a href={guide.source.url} target="_blank" rel="noopener noreferrer">
            {languageValue(guide.source.label, currentLanguage)}<ArrowUpRight size={13} />
          </a>
        </footer>
      )}
    </section>
  );
}

function projectCodeOf(project: Note) {
  return typeof project.meta.project === 'string' ? project.meta.project : '';
}
