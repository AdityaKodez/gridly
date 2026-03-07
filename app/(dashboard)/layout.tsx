import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/app-sidebar";
import { dashboardConfig } from "@/config";
import { requireAuth } from "@/lib/auth-utils";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  const sidebarStyle = {
    "--sidebar-width": dashboardConfig.sidebar.width,
    "--sidebar-width-icon": dashboardConfig.sidebar.widthIcon,
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
