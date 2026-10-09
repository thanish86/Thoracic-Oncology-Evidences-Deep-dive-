import {
  Activity, BarChart3, Bookmark, BookOpen, Dna, FileCheck2, FlaskConical, GitBranch, GraduationCap, Landmark,
  LayoutDashboard, Microscope, NotebookPen, Pill, Radiation, Scale, ScrollText, Scissors, Sparkles, Users, Waypoints, Home,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  dot?: string; // css colour var for disease dots
}
export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAV: NavSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Disease modules",
    items: [
      { href: "/breast", label: "Breast", icon: Sparkles, dot: "var(--rose)" },
      { href: "/nsclc", label: "NSCLC", icon: Activity, dot: "var(--blue)" },
      { href: "/sclc", label: "SCLC", icon: Activity, dot: "var(--lavender)" },
      { href: "/thymoma", label: "Thymic tumours", icon: Activity, dot: "var(--sand)" },
      { href: "/mesothelioma", label: "Mesothelioma", icon: Activity, dot: "var(--sage)" },
    ],
  },
  {
    title: "Evidence",
    items: [
      { href: "/trials", label: "Trial explorer", icon: FlaskConical },
      { href: "/trials/compare", label: "Compare trials", icon: Scale },
      { href: "/timeline", label: "Evidence timeline", icon: Waypoints },
      { href: "/guidelines", label: "Guidelines", icon: ScrollText },
      { href: "/regulatory", label: "Regulatory", icon: Landmark },
    ],
  },
  {
    title: "Reference atlases",
    items: [
      { href: "/biomarkers", label: "Molecular atlas", icon: Dna },
      { href: "/drugs", label: "Pharmacology", icon: Pill },
      { href: "/algorithms", label: "Algorithm studio", icon: GitBranch },
      { href: "/pathology", label: "Pathology & imaging", icon: Microscope },
      { href: "/radiation", label: "Radiation oncology", icon: Radiation },
      { href: "/surgery", label: "Surgical oncology", icon: Scissors },
    ],
  },
  {
    title: "Learn",
    items: [
      { href: "/statistics", label: "Statistics academy", icon: BarChart3 },
      { href: "/exams", label: "Exam studio", icon: GraduationCap },
    ],
  },
  {
    title: "Workspace",
    items: [
      { href: "/tumour-board", label: "Tumour board", icon: Users },
      { href: "/notebook", label: "Notebook", icon: NotebookPen },
      { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    ],
  },
  {
    title: "Governance",
    items: [{ href: "/admin/evidence", label: "Evidence review", icon: FileCheck2 }],
  },
];

/** Route segment → readable label for breadcrumbs. */
export const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard", breast: "Breast", nsclc: "NSCLC", sclc: "SCLC", thymoma: "Thymic tumours",
  mesothelioma: "Mesothelioma", trials: "Trials", compare: "Compare", timeline: "Timeline", biomarkers: "Molecular atlas",
  drugs: "Pharmacology", algorithms: "Algorithms", pathology: "Pathology & imaging", radiation: "Radiation oncology",
  surgery: "Surgical oncology", guidelines: "Guidelines", regulatory: "Regulatory", statistics: "Statistics academy",
  exams: "Exam studio", "tumour-board": "Tumour board", notebook: "Notebook", bookmarks: "Bookmarks", admin: "Admin",
  evidence: "Evidence review",
};

export const ABOUT_ICON = BookOpen;
