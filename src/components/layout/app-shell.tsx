"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronRight, Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { NAV, SEGMENT_LABELS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { CommandSearch } from "./command-search";
import { ReadingProgress } from "./reading-progress";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/trials") return pathname === "/trials" || (pathname.startsWith("/trials/") && !pathname.startsWith("/trials/compare"));
  return pathname === href || pathname.startsWith(href + "/");
}

function Sidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="flex h-full flex-col overflow-y-auto px-3 pb-6">
      <Link href="/" className="mb-4 flex items-center gap-2.5 px-2 pt-5" onClick={onNavigate}>
        <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-ink font-serif text-sm text-bg">Oa</span>
        {!collapsed && (
          <span className="leading-tight">
            <span className="block text-[15px] font-semibold tracking-tight text-ink">ONCOATLAS</span>
            <span className="block text-[11px] text-ink-3">Oncology Evidence Intelligence</span>
          </span>
        )}
      </Link>
      {NAV.map((section) => (
        <div key={section.title} className="mt-4">
          {!collapsed && <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3">{section.title}</p>}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13px] transition-colors",
                      active ? "bg-surface-3 font-medium text-ink" : "text-ink-2 hover:bg-surface-2 hover:text-ink",
                      collapsed && "justify-center",
                    )}
                  >
                    {item.dot ? (
                      <span aria-hidden className="grid h-4 w-4 place-items-center">
                        <span className="h-2 w-2 rounded-full" style={{ background: item.dot }} />
                      </span>
                    ) : (
                      <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Breadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return <span className="text-sm text-ink-3">Home</span>;
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1 text-sm text-ink-3">
        <li>
          <Link href="/" className="hover:text-ink">Home</Link>
        </li>
        {parts.map((p, i) => {
          const href = "/" + parts.slice(0, i + 1).join("/");
          const label = SEGMENT_LABELS[p] ?? (parts[0] === "trials" ? decodeURIComponent(p).toUpperCase() : decodeURIComponent(p).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
          const last = i === parts.length - 1;
          return (
            <li key={href} className="flex min-w-0 items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {last || p === "admin" ? (
                <span className={cn("truncate", last && "text-ink")} aria-current={last ? "page" : undefined}>{label}</span>
              ) : (
                <Link href={href} className="truncate hover:text-ink">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="grid h-9 w-9 place-items-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-ink"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem("oa:sidebar") === "collapsed");
    } catch {
      /* storage unavailable */
    }
  }, []);
  useEffect(() => setMobileOpen(false), [pathname]);

  const toggle = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem("oa:sidebar", c ? "open" : "collapsed");
      } catch {
        /* ignore */
      }
      return !c;
    });
  };

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2">
        Skip to content
      </a>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-bg/95 backdrop-blur transition-[width] duration-200 lg:block",
          collapsed ? "w-[68px]" : "w-64",
        )}
      >
        <Sidebar collapsed={collapsed} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="absolute inset-0 bg-ink/30" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-border bg-bg shadow-xl">
            <button
              className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-full hover:bg-surface-2"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[68px]" : "lg:pl-64")}>
        <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur-md">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              className="grid h-9 w-9 place-items-center rounded-full text-ink-2 hover:bg-surface-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>
            <button
              className="hidden h-9 w-9 place-items-center rounded-full text-ink-2 hover:bg-surface-2 lg:grid"
              onClick={toggle}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <div className="hidden min-w-0 flex-1 md:block">
              <Breadcrumbs />
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <CommandSearch />
              <ThemeToggle />
            </div>
          </div>
          <ReadingProgress />
        </header>
        <main id="main" className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-8 sm:px-6 lg:px-10">
          {children}
        </main>
        <footer className="border-t border-border px-6 py-8 text-xs leading-relaxed text-ink-3 lg:px-10">
          <p className="max-w-4xl">
            ONCOATLAS is an educational evidence resource for clinicians and researchers. It is not a medical device and does not provide patient-specific
            treatment recommendations. Every numeric value is linked to its source; values marked “Awaiting verification” have not yet been approved by a
            human reviewer. Always confirm against the primary publication, current regulatory labelling and guidelines.
          </p>
        </footer>
      </div>
    </div>
  );
}
