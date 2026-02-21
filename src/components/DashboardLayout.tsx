import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/lib/auth-context";
import { Navigate } from "react-router-dom";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 bg-card">
            <SidebarTrigger />
            <h2 className="text-sm font-semibold text-muted-foreground">
              Programa Saúde Integral do Ser
            </h2>
          </header>
          <div className="flex-1 p-4 md:p-6 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
