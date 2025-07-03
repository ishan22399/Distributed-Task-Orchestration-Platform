import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardOverview } from "@/components/dashboard-overview"
import { TaskExecutionChart } from "@/components/task-execution-chart"
import { RecentWorkflows } from "@/components/recent-workflows"
import { SystemMetrics } from "@/components/system-metrics"

export default function DashboardPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 space-y-4 p-4 pt-6">
          <DashboardOverview />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <TaskExecutionChart />
            <RecentWorkflows />
          </div>
          <SystemMetrics />
        </div>
      </SidebarInset>
    </>
  )
}
