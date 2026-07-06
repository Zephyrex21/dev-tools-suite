import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { TopBar } from "./TopBar";
import { Sidebar, SidebarContent } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";
import { ErrorBoundary } from "./ErrorBoundary";
import { useFocusTrap } from "../hooks/useFocusTrap";

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { pathname } = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap(drawerRef, drawerOpen);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <a
        href="#main-content"
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--color-accent-strong)] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <TopBar onMenuClick={() => setDrawerOpen(true)} onSearchClick={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 md:hidden"
            onKeyDown={(e) => {
              if (e.key === "Escape") setDrawerOpen(false);
            }}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <div
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-[var(--color-bg)] shadow-[var(--shadow-raised)]"
            >
              <div className="flex h-14 items-center justify-between border-b border-[var(--color-border)] px-4">
                <span className="text-[15px] font-semibold text-[var(--color-ink)]">Tools</span>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-ink-dim)]"
                >
                  <X size={18} />
                </button>
              </div>
              <SidebarContent onNavigate={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        <main id="main-content" className="min-w-0 flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-4xl">
            <ErrorBoundary key={pathname}>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
