import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { TaskMonitor } from "@/components/task-monitor"

export default function TasksPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 space-y-4 p-4 pt-6">
          <TaskMonitor />
        </div>
      </SidebarInset>
    </>
  )
}
