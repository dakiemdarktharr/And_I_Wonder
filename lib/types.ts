export type NoteKind =
  | "daily"
  | "project"
  | "resource"
  | "week"
  | "month"
  | "note";

export interface Note {
  /** Vault-relative path without the .md extension. */
  id: string;
  title: string;
  titleVi: string;
  /** Original Markdown body, with YAML front matter removed. */
  body: string;
  /** Vietnamese Markdown with the same link targets and checkbox structure. */
  bodyVi: string;
  kind: NoteKind;
  meta: Record<string, unknown>;
}

export type ResourceKind = "book" | "paper" | "video" | "course" | "link";

export interface ResourceItem {
  id: string;
  title: string;
  titleVi: string;
  url: string;
  kind: ResourceKind;
  author?: string;
  /** CSS color chosen from the app's fixed palette. */
  color?: string;
}
