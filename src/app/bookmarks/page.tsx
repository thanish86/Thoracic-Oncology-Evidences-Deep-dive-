import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/primitives";
import { BookmarksView } from "@/components/workspace/bookmarks-view";

export const metadata: Metadata = { title: "Bookmarks" };

export default function BookmarksPage() {
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Bookmarks & reading collections" description="Saved trials, biomarkers and drugs, grouped into collections. Export references in RIS, BibTeX or Vancouver style." />
      <BookmarksView />
    </>
  );
}
