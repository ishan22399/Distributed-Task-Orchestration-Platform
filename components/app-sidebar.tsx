"use client"

import type * as React from "react"
import {
  Activity,
  BarChart3,
  Bot,
  Command,
  LifeBuoy,
  PieChart,
  Settings2,
  Workflow,
  GitBranch,
  Server,
  Database,
  Shield,
  Bell,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Alex Chen",
    email: "alex.chen@taskflow.dev",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  teams: [
    {
      name: "TaskFlow Platform",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Data Engineering",
      logo: Database,
      plan: "Pro",
    },
    {
      name: "ML Operations",
      logo: Bot,
      plan: "Pro",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Workflows",
      url: "/workflows",
      icon: Workflow,
      items: [
        {
          title: "All Workflows",
          url: "/workflows",
        },
        {
          title: "Create Workflow",
          url: "/workflows/create",
        },
        {
          title: "Templates",
          url: "/workflows/templates",
        },
      ],
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: Activity,
      items: [
        {
          title: "Task Monitor",
          url: "/tasks",
        },
        {
          title: "Task History",
          url: "/tasks/history",
        },
        {
          title: "Failed Tasks",
          url: "/tasks/failed",
        },
      ],
    },
    {
      title: "Workers",
      url: "/workers",
      icon: Server,
      items: [
        {
          title: "Worker Nodes",
          url: "/workers",
        },
        {
          title: "Resource Usage",
          url: "/workers/resources",
        },
        {
          title: "Health Checks",
          url: "/workers/health",
        },
      ],
    },
    {
      title: "Monitoring",
      url: "/monitoring",
      icon: PieChart,
      items: [
        {
          title: "System Metrics",
          url: "/monitoring/metrics",
        },
        {
          title: "Logs",
          url: "/monitoring/logs",
        },
        {
          title: "Alerts",
          url: "/monitoring/alerts",
        },
      ],
    },
  ],
  projects: [
    {
      name: "ETL Pipeline",
      url: "/projects/etl-pipeline",
      icon: GitBranch,
    },
    {
      name: "ML Training",
      url: "/projects/ml-training",
      icon: Bot,
    },
    {
      name: "Data Sync",
      url: "/projects/data-sync",
      icon: Database,
    },
    {
      name: "Report Generation",
      url: "/projects/reports",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Security",
      url: "/security",
      icon: Shield,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
    },
    {
      title: "Support",
      url: "/support",
      icon: LifeBuoy,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
