"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { useBookmarks, type BookmarkItem } from "./storage";

export function BookmarkButton({ type, slug, title }: Pick<BookmarkItem, "type" | "slug" | "title">) {
  const { has, toggle, ready } = useBookmarks();
  const saved = ready && has(type, slug);
  return (
    <Button size="sm" variant={saved ? "primary" : "secondary"} onClick={() => toggle({ type, slug, title })} aria-pressed={saved} disabled={!ready}>
      {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
      {saved ? "Saved" : "Save"}
    </Button>
  );
}
