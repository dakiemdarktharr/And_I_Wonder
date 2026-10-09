import type {ExerciseCheckpoint} from './answer-workbench';
export type Bilingual = { en: string; vi: string };

/** A figure tied to the exact worked example, with explicit data and units. */
export type LessonVisual = {
  title: Bilingual;
  caption: Bilingual;
} & ({
  kind: 'xy';
  equalAspect?: boolean;
  xLabel: Bilingual;
  yLabel: Bilingual;
  series: {name:Bilingual; points:[number,number][]; mode:'line'|'scatter'}[];
} | {
  kind: 'bars';
  xLabel: Bilingual;
  yLabel: Bilingual;
  values: {label:Bilingual; value:number}[];
} | {
  kind: 'matrix';
  rows: string[];
  columns: string[];
  values: number[][];
} | {
  kind: 'steps';
  steps: Bilingual[];
});

export interface LessonSession {
  title: Bilingual;
  /** Original self-contained Markdown teaching this day's concept. */
  theory: Bilingual;
  workedExample: Bilingual;
  visual?: LessonVisual;
  /** An actionable four-hour agenda, with inputs provided inside the lesson. */
  agenda: Bilingual[];
  exercises: {
    id: string;
    prompt: Bilingual;
    hint: Bilingual;
    answer: Bilingual;
    checkpoint?: ExerciseCheckpoint;
  }[];
  deliverable: Bilingual;
}

export interface LessonModule {
  week: number;
  title: Bilingual;
  prerequisites: Bilingual;
  objectives: Bilingual[];
  /** Shared definitions, assumptions and key equations, original explanations. */
  foundations: Bilingual;
  diagram: {
    kind: "flow" | "plane" | "distribution" | "timeline" | "matrix";
    title: Bilingual;
    labels: Bilingual[];
    caption: Bilingual;
  };
  /** Five chronological study sessions: Wednesday, Thursday, Friday, Monday, Tuesday. */
  sessions: LessonSession[];
  /** Optional references only; no exercise may require opening these. */
  references: { title: string; url: string }[];
}
