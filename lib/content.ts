import notesData from "../data/notes.json";
import resourcesData from "../data/resources.json";
import type { Note, ResourceItem } from "./types";

const notes = notesData as Note[];
const resources = resourcesData as ResourceItem[];
const notesById = new Map(notes.map((note) => [note.id, note]));

export function getAllNotes(): Note[] {
  return notes;
}

export function getNote(id: string): Note | undefined {
  const normalized = id.replace(/\.md$/i, "");
  const exact = notesById.get(normalized);
  if (exact) return exact;
  try { return notesById.get(decodeURIComponent(normalized)); }
  catch { return undefined; }
}

export function getResources(): ResourceItem[] {
  return resources;
}
