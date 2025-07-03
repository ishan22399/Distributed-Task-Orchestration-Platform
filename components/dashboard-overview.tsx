"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, Clock, XCircle, Users, Zap } from "lucide-react"
import { DatabaseStatusBanner } from "./database-status-banner"

/**
 * Fetch JSON safely – returns null on network / parsing / non-OK errors.
 */
async function fetchJsonSafe<T = any>(input: RequestInfo, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(input, init)
    if (!res.ok) {
      console.error(`Request failed (${res.status})`, input)
      return null
    }

    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      console.error("Unexpected content-type:", contentType, "for", input)
      return null
    }

    return (await res.json()) as T
  } catch (err) {
    console.error("fetchJsonSafe() error →", input, err)
    return null
  }
}

interface DashboardStats {
  activeWorkflows: number
  completedTasks: number
  failedTasks: number
  pendingTasks: number
  workerNodes: number
  throughput: number
  usingMockData: boolean
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    activeWorkflows: 0,
    completedTasks: 0,
    failedTasks: 0,
    pendingTasks: 0,
    workerNodes: 0,
    throughput: 0,
    usingMockData: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [workflows, tasks, workers] = await Promise.all([
          fetchJsonSafe<any>("/api/workflows"),
          fetchJsonSafe<any>("/api/tasks"),
          fetchJsonSafe<any>("/api/workers"),
        ])

        setStats({
          activeWorkflows: workflows?.workflows?.filter((w: any) => w.status === "active").length ?? 0,
          completedTasks: tasks?.summary?.completed ?? 0,
          failedTasks: tasks?.summary?.failed ?? 0,
          pendingTasks: tasks?.summary?.pending ?? 0,
          workerNodes: workers?.summary?.total ?? 0,
          throughput: 342,
          usingMockData: workflows?.usingMockData || tasks?.usingMockData || workers?.usingMockData || false,
        })
      } catch (error) {
        /* Should never reach here because fetchJsonSafe traps errors,
           but keep a fallback just in case. */
        console.error("Failed to fetch dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const statsConfig = [
    {
      title: "Active Workflows",
      value: stats.activeWorkflows.toString(),
      description: loading ? "Loading..." : stats.usingMockData ? "Mock Data" : "+2 from last hour",
      icon: Activity,
      trend: "up",
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks.toLocaleString(),
      description: loading ? "Loading..." : stats.usingMockData ? "Mock Data" : "+18% from yesterday",
      icon: CheckCircle,
      trend: "up",
    },
    {
      title: "Failed Tasks",
      value: stats.failedTasks.toString(),
      description: loading ? "Loading..." : stats.usingMockData ? "Mock Data" : "-4 from last hour",
      icon: XCircle,
      trend: "down",
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks.toString(),
      description: loading ? "Loading..." : stats.usingMockData ? "Mock Data" : "Avg wait time: 2.3s",
      icon: Clock,
      trend: "neutral",
    },
    {
      title: "Worker Nodes",
      value: stats.workerNodes.toString(),
      description: loading ? "Loading..." : stats.usingMockData ? "Mock Data" : "All nodes healthy",
      icon: Users,
      trend: "up",
    },
    {
      title: "Throughput",
      value: `${stats.throughput}/min`,
      description: loading ? "Loading..." : stats.usingMockData ? "Mock Data" : "Tasks per minute",
      icon: Zap,
      trend: "up",
    },
  ]

  return (
    <div className="space-y-4">
      <DatabaseStatusBanner />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statsConfig.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
              <p
                className={`text-xs ${
                  stats.usingMockData
                    ? "text-orange-600"
                    : stat.trend === "up"
                      ? "text-green-600"
                      : stat.trend === "down"
                        ? "text-red-600"
                        : "text-muted-foreground"
                }`}
              >
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
