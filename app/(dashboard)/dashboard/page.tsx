import { DashboardHeader } from "@/features/dashboard/dashboard-header";

export default async function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className="flex-1 p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder cards -- buyer replaces with real data */}
          {["Projects", "Activity", "Usage"].map((label) => (
            <div
              key={label}
              className="rounded-lg border border-dashed p-6 space-y-2"
            >
              <h3 className="text-sm font-medium text-muted-foreground">
                {label}
              </h3>
              <p className="text-2xl font-bold font-doto tracking-tight">--</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
