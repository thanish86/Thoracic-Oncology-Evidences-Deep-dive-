"use client";

/**
 * Local-first research workspace storage (browser localStorage).
 * Holds bookmarks, collections, notes and research questions. NO patient data.
 * Every access is guarded: storage may be unavailable (private mode, blocked).
 */
import { useCallback, useEffect, useState } from "react";

export interface BookmarkItem {
  type: "trial" | "biomarker" | "drug";
  slug: string;
  title: string;
  collection?: string;
  savedAt: string;
}
export interface NoteItem {
  id: string;
  title: string;
  kind: "notes" | "journal-club" | "brief" | "research-question";
  body: string;
  links: string[]; // trial slugs
  resolved?: boolean;
  updatedAt: string;
}

const KEYS = { bookmarks: "oa:bookmarks:v1", notes: "oa:notes:v1", board: "oa:board:v1" } as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("oa:storage", { detail: key }));
  } catch {
    /* storage unavailable */
  }
}

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setValue(read(key, fallback));
    setReady(true);
    const sync = (e: Event) => {
      if ((e as CustomEvent).detail === key || e.type === "storage") setValue(read(key, fallback));
    };
    window.addEventListener("oa:storage", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("oa:storage", sync);
      window.removeEventListener("storage", sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback((next: T) => {
    setValue(next);
    write(key, next);
  }, [key]);
  return [value, set, ready] as const;
}

export function useBookmarks() {
  const [items, setItems, ready] = useStored<BookmarkItem[]>(KEYS.bookmarks, []);
  const has = (type: string, slug: string) => items.some((b) => b.type === type && b.slug === slug);
  const toggle = (b: Omit<BookmarkItem, "savedAt">) =>
    setItems(has(b.type, b.slug) ? items.filter((x) => !(x.type === b.type && x.slug === b.slug)) : [...items, { ...b, savedAt: new Date().toISOString() }]);
  const setCollection = (type: string, slug: string, collection: string) =>
    setItems(items.map((x) => (x.type === type && x.slug === slug ? { ...x, collection: collection || undefined } : x)));
  const remove = (type: string, slug: string) => setItems(items.filter((x) => !(x.type === type && x.slug === slug)));
  return { items, has, toggle, setCollection, remove, ready };
}

export function useNotes() {
  const [items, setItems, ready] = useStored<NoteItem[]>(KEYS.notes, []);
  const upsert = (n: NoteItem) => setItems([{ ...n, updatedAt: new Date().toISOString() }, ...items.filter((x) => x.id !== n.id)]);
  const remove = (id: string) => setItems(items.filter((x) => x.id !== id));
  return { items, upsert, remove, ready };
}

export function useBoardSelection() {
  const [items, setItems, ready] = useStored<string[]>(KEYS.board, []);
  return { items, setItems, ready };
}

export function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now() + Math.random());
}
