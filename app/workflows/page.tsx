import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { WorkflowManager } from "@/components/workflow-manager"

export default function WorkflowsPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 space-y-4 p-4 pt-6">
          <WorkflowManager />
        </div>
      </SidebarInset>
    </>
  )
}
