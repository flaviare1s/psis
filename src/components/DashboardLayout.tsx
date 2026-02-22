import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/lib/auth-context";
import { Navigate, Link } from "react-router-dom";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-16 flex items-center gap-3 border-b border-border px-4 bg-card">
            <SidebarTrigger className="md:hidden" />
            <Link
              to="/dashboard"
              className="font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              PSIS - Programa Saúde Integral do Ser
            </Link>
          </header>
          <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
