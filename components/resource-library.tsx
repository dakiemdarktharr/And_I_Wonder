'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, BookOpen, FileText, LibraryBig, Play, Search } from 'lucide-react';
import type { ResourceItem } from '@/lib/types';
import { Text, useLanguage } from './providers';
import coverData from '@/data/resource-covers.json';
import './library-project.css';

type CoverRecord = {
  resourceId: string;
  asset: string | null;
  captureType: string;
  sourceAttribution: string;
  sourceDocumentUrl: string;
  sourcePageUrl: string;
  sourcePageNumber: number | null;
  pageMetadata: string;
  fallbackReason?: string;
};

const covers = coverData as CoverRecord[];
const coverById = new Map(covers.map((cover) => [cover.resourceId, cover]));
const palette = ['#326782', '#dec469', '#ba705b', '#91b7a8', '#eeeae0', '#877ba0', '#b88b9f'];

function PaperScroll({ title, language }: { title: string; language: string }) {
  return (
    <div className="paper-scroll paper-scroll--rolled" aria-hidden="true">
      <svg className="rolled-scroll-art" viewBox="0 0 200 240" focusable="false">
        <title>{title}</title>
        <path d="M30 80L127 219L183 215L172 149L78 51Z" fill="#202e36"/>
        <path d="M29 41C3 61 9 91 32 111L100 199L164 130L77 41C64 27 44 29 29 41Z" fill="#d9bd7b" stroke="#202e36" strokeWidth="3"/>
        <path d="M30 42L118 129L143 120L77 41C60 29 44 30 30 42Z" fill="#fff0c5"/>
        <path d="M15 76L103 186L114 162L26 55Z" fill="#b29458"/>
        <path d="M47 69L70 56L112 97L84 121Z" fill="#c47760" stroke="#202e36" strokeWidth="2.5"/>
        <path d="M47 69L84 121L82 143L41 93Z" fill="#94523f" stroke="#202e36" strokeWidth="2.5"/>
        <circle cx="133" cy="163" r="48" fill="#f6e3b1" stroke="#202e36" strokeWidth="3"/>
        <circle cx="133" cy="163" r="40" fill="#e7cd92" stroke="#8b703e" strokeWidth="2"/>
        <path d="M134 130C114 130 101 146 103 165C105 187 124 199 143 190C159 182 162 165 152 152C144 142 131 143 124 151C117 159 120 171 129 175C137 178 144 174 144 167C144 160 137 157 133 161" fill="none" stroke="#765c32" strokeWidth="3" strokeLinecap="round"/>
        <path d="M81 112L59 147" stroke="#202e36" strokeWidth="2"/>
        <path d="M22 139L75 139L82 181L28 181Z" fill="#fffaf0" stroke="#202e36" strokeWidth="2.5"/>
        <text x="51" y="158" textAnchor="middle" fill="#202e36" fontSize="8" fontWeight="800">{language==='vi'?'BÀI BÁO':'PAPER'}</text>
        <text x="51" y="173" textAnchor="middle" fill="#315d8a" fontSize="10" fontWeight="800">PDF</text>
      </svg>
    </div>
  );
}

function Cassette({ title, language }: { title: string; language: string }) {
  return (
    <div className="cassette" aria-hidden="true">
      <div className="cassette-label">
        <span>{title}</span>
        <small><Play size={10} /> {language === 'vi' ? 'Bài giảng' : 'Lecture'} / A</small>
      </div>
      <div className="cassette-reels"><i /><div /><i /></div>
      <div className="cassette-bottom" />
      <span className="screw screw-1" /><span className="screw screw-2" />
      <span className="screw screw-3" /><span className="screw screw-4" />
    </div>
  );
}

function BookJacket({
  resource,
  title,
  color,
  cover,
  language,
}: {
  resource: ResourceItem;
  title: string;
  color: string;
  cover: CoverRecord | undefined;
  language: string;
}) {
  const author = resource.author || cover?.sourceAttribution || '';
  const imageDescription = title + ' — ' + author + '; ' + (cover?.sourcePageNumber === 1 ? 'page 1 of the official PDF' : 'official front cover');

  return (
    <div
      className={'book-cover ' + (cover?.asset ? 'book-cover--source-image' : 'book-cover--title-fallback')}
      style={{ '--cover': color } as React.CSSProperties}
    >
      {cover?.asset ? (
        <img className="book-cover-image" src={cover.asset} alt={imageDescription} loading="lazy" />
      ) : (
        <div className="book-title-page">
          <h3>{title}</h3>
          <p>{author}</p>
        </div>
      )}
      <span className="book-pages" aria-hidden="true" />
    </div>
  );
}

function CatalogObject({
  resource,
  title,
  color,
  language,
}: {
  resource: ResourceItem;
  title: string;
  color: string;
  language: string;
}) {
  const course = resource.kind === 'course';
  return (
    <div
      className={'catalog-object catalog-object--' + (course ? 'course' : 'link')}
      style={{ '--cover': color } as React.CSSProperties}
    >
      <h3>{title}</h3>
      <span className="catalog-object-author">{resource.author}</span>
      <span className="catalog-object-foot">
        <span>{language==='vi'?'Mở tài liệu':'Open resource'}</span>
        <ArrowUpRight size={15} />
      </span>
    </div>
  );
}

function LibraryObject({ resource, index }: { resource: ResourceItem; index: number }) {
  const { language } = useLanguage();
  const title = language === 'vi' ? resource.titleVi : resource.title;
  const color = palette[index % palette.length];
  const cover = coverById.get(resource.id);
  const objectClass = resource.kind === 'video'
    ? 'object-tape'
    : resource.kind === 'paper'
      ? 'object-scroll'
      : 'object-' + resource.kind;
  const linkLabel = title + ' — ' + (language === 'vi' ? 'mở tab mới' : 'opens a new tab');

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={'library-item ' + objectClass}
      aria-label={linkLabel}
      style={{ '--cover': color } as React.CSSProperties}
    >
      {resource.kind === 'video' ? (
        <Cassette title={title} language={language} />
      ) : resource.kind === 'paper' ? (
        <PaperScroll title={title} language={language} />
      ) : resource.kind === 'book' ? (
        <BookJacket resource={resource} title={title} color={color} cover={cover} language={language} />
      ) : (
        <CatalogObject resource={resource} title={title} color={color} language={language} />
      )}
      <span className="resource-tooltip">
        <b>{title}</b>
        <span>{resource.author || new URL(resource.url).hostname.replace('www.', '')}<ArrowUpRight size={15} /></span>
      </span>
      <span className="shelf-caption">{title}</span>
    </a>
  );
}

export function ResourceLibrary({ resources }: { resources: ResourceItem[] }) {
  const { language } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const items = resources.filter((resource) => (
    (filter === 'all'
      || (filter === 'book' && ['book', 'course', 'link'].includes(resource.kind))
      || resource.kind === filter)
    && (resource.title + ' ' + resource.titleVi + ' ' + (resource.author || '')).toLocaleLowerCase().includes(query.toLocaleLowerCase())
  ));
  const groups = Array.from({ length: Math.ceil(items.length / 6) }, (_, index) => items.slice(index * 6, index * 6 + 6));

  return (
    <main className="workspace library-workspace">
      <div className="page-heading">
        <div>
          <div className="breadcrumb"><Link href="/">And I Wonder</Link><span>/</span><Text vi="Thư viện" en="Resources" /></div>
          <h1><Text vi="Thư viện" en="Library" /></h1>
        </div>
      </div>

      <div className="library-controls">
        <div className="library-tabs">
          {[
            { id: 'all', vi: 'Tất cả', en: 'Everything', Icon: LibraryBig },
            { id: 'book', vi: 'Sách & khóa học', en: 'Books & courses', Icon: BookOpen },
            { id: 'paper', vi: 'Bài báo', en: 'Papers', Icon: FileText },
            { id: 'video', vi: 'Bài giảng', en: 'Lectures', Icon: Play },
          ].map(({ id, vi, en, Icon }) => (
            <button className={filter === id ? 'selected' : ''} key={id} onClick={() => setFilter(id)} aria-pressed={filter === id}>
              <Icon size={16} />{language === 'vi' ? vi : en}
            </button>
          ))}
        </div>
        <label className="library-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={language === 'vi' ? 'Tìm trên kệ sách…' : 'Find something on the shelf…'}
            aria-label={language === 'vi' ? 'Tìm tài liệu' : 'Search resources'}
          />
        </label>
      </div>

      <div className="library-room">
        <div className="cabinet-top">
          <span><Text vi="Sách · Bài báo · Bài giảng" en="Books · Papers · Lectures"/></span>
          <span aria-live="polite">{items.length} <Text vi="tài liệu" en="resources" /></span>
        </div>
        <div className="bookcase">
          {groups.length ? groups.map((group, row) => (
            <section className="shelf-row" key={row} aria-label={(language === 'vi' ? 'Kệ ' : 'Shelf ') + (row + 1)}>
              <div className="shelf-items">
                {group.map((resource, index) => <LibraryObject key={resource.id} resource={resource} index={row * 6 + index} />)}
              </div>
              <div className="shelf-plank"><span>{String(row + 1).padStart(2, '0')}</span><i /><span>+</span></div>
            </section>
          )) : (
            <div className="library-empty">
              <BookOpen size={42} />
              <h2><Text vi="Chưa có tài liệu phù hợp" en="No matching resources" /></h2>
              <p><Text vi="Thử một từ khóa khác hoặc xem tất cả tài liệu." en="Try another search term or browse everything." /></p>
              <button className="bold-button" onClick={() => { setQuery(''); setFilter('all'); }}>
                <Text vi="Xem tất cả" en="Show everything" />
              </button>
            </div>
          )}
        </div>
        <div className="cabinet-feet"><i /><i /></div>
      </div>

      <div className="library-footnote">
        <Link href="/notes/Free%20Resources%20and%20Access%20Policy">
          <Text vi="Thông tin nguồn" en="Source information" /><ArrowUpRight size={15} />
        </Link>
      </div>
    </main>
  );
}
