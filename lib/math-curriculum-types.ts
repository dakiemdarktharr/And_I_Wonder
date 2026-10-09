import type { Bilingual } from './lesson-types';

export type MathLevel = 'foundation' | 'upper-undergraduate' | 'graduate bridge' | 'graduate core' | 'specialization';
export type MathSkill = 'computation' | 'derivation' | 'proof' | 'counterexample' | 'application' | 'numerical analysis' | 'transfer';
export interface MathSource {
  id: string; title: string; url: string; version: string;
  access: 'free official'; verified: string; sections: string;
}
export interface MathReading { sourceId: string; section: string; purpose: Bilingual; required: boolean }
export interface MathTheorem {
  id: string; title: Bilingual; statement: Bilingual;
  proofStatus: 'proved' | 'proof sketch' | 'assumed'; proof: Bilingual;
  sourceId: string; sourceSection: string;
}
export interface MathRubric { points: number; criterion: Bilingual; critical?: boolean }
export interface MathTeaching { application: Bilingual; formula: Bilingual; steps: Bilingual[]; solution?: Bilingual[] }
export interface MathDailyLesson {
  id: string; conceptKey: string; primaryExerciseId: string;
  title: Bilingual; application: Bilingual; formula: Bilingual;
  steps: Bilingual[];
  reading?: MathReading[];
}
export interface MathExercise {
  id: string; revision: number; title: Bilingual; skills: MathSkill[];
  /** Scheduled reconstruction of an earlier problem, never advertised as an unseen retest. */
  practiceOrigin?: string;
  reviewKind?: 'spaced';
  teaching?: MathTeaching;
  practiceRole?: 'concept' | 'derivation' | 'application' | 'error analysis';
  relatedExerciseId?: string;
  prompt: Bilingual; hints: Bilingual[]; solution: Bilingual[];
  rubric: MathRubric[]; commonErrors: Bilingual[];
  /** Earlier week numbers to revisit on failure. */
  remediation: number[];
  numeric?: { id: string; question: Bilingual; expected: number; tolerance: number; derivation: Bilingual }[];
}
export interface MathSessionPlan {
  title: Bilingual; exerciseIds: string[]; theoremIds: string[];
  lesson?: MathDailyLesson;
    /** Current main-route research path: theory/exercises/project/review = 50/90/90/10 minutes. */
  actions: [Bilingual, Bilingual, Bilingual, Bilingual];
  minutes?: [number, number, number, number];
  deliverable: Bilingual;
  mode?: 'study' | 'assessment' | 'remediation';
  /** A/B are alternatives, not additive homework. */
  alternativeExerciseIds?: string[];
}
export interface MathWeek {
  week: number; revision: number; title: Bilingual; level: MathLevel;
  prerequisites: number[]; outcomes: Bilingual[];
  definitions: Bilingual; theorems: MathTheorem[];
  workedExample: Bilingual; failureCase: Bilingual;
  exercises: MathExercise[]; sessions: MathSessionPlan[];
  reading: MathReading[]; errorChecklist: Bilingual[];
  coverage: { topic: string; status: 'taught' | 'introduced' | 'deferred'; evidence: string }[];
}
export interface MathAssessment {
  id: string; title: Bilingual; week: number; forms: { name: 'A' | 'B'; exerciseIds: string[] }[];
  blueprint: Bilingual; passRule: Bilingual; remediation: Bilingual;
}
export interface MathAuthorFile { sources: MathSource[]; weeks: MathWeek[]; assessments?: MathAssessment[] }
export interface MathSession extends MathSessionPlan {
  id: string; date: string; week: number; dayIndex: number; revision: string;
  calendarWeek?: number; route?: 'foundation';
  taskIds: string[];
}
export interface MathCurriculum {
  version: string; sourceHash: string; sources: MathSource[]; weeks: MathWeek[];
  sessions: MathSession[]; assessments: MathAssessment[];
  foundationSessions: MathSession[];
}
