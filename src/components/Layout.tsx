import { useState } from "react";
import { Outlet } from "react-router-dom";
import { X } from "lucide-react";
import { TopBar } from "./TopBar";
import { Sidebar, SidebarContent } from "./Sidebar";

export function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <TopBar onMenuClick={() => setDrawerOpen(true)} />
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />

        {drawerOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-[var(--color-bg)] shadow-[var(--shadow-raised)]">
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

        <main className="min-w-0 flex-1 px-4 py-8 md:px-8">
          <div className="mx-auto max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
