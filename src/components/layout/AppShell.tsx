import { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <AppSidebar />
        </div>
      </aside>

      {navOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal/50"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0">
            <AppSidebar onNavigate={() => setNavOpen(false)} onClose={() => setNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className={cn("flex min-w-0 flex-1 flex-col")}>
        <TopBar onOpenNav={() => setNavOpen(true)} />
        <main className="min-w-0 flex-1 px-4 py-5 lg:px-6">
          <div className="mx-auto w-full max-w-[1480px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
