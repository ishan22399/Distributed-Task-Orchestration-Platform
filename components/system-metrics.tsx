"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Cpu, HardDrive, MemoryStick, Network, Server, Zap } from "lucide-react"

const metrics = [
  {
    name: "CPU Usage",
    value: 68,
    max: 100,
    unit: "%",
    icon: Cpu,
    status: "normal",
    details: "4 cores, 2.4 GHz avg",
  },
  {
    name: "Memory Usage",
    value: 12.4,
    max: 16,
    unit: "GB",
    icon: MemoryStick,
    status: "normal",
    details: "16 GB total available",
  },
  {
    name: "Disk Usage",
    value: 245,
    max: 500,
    unit: "GB",
    icon: HardDrive,
    status: "normal",
    details: "500 GB SSD storage",
  },
  {
    name: "Network I/O",
    value: 1.2,
    max: 10,
    unit: "Gbps",
    icon: Network,
    status: "normal",
    details: "10 Gbps connection",
  },
  {
    name: "Active Connections",
    value: 342,
    max: 1000,
    unit: "",
    icon: Server,
    status: "normal",
    details: "WebSocket & HTTP",
  },
  {
    name: "Queue Depth",
    value: 89,
    max: 500,
    unit: "tasks",
    icon: Zap,
    status: "warning",
    details: "Redis message queue",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "text-green-600"
    case "warning":
      return "text-yellow-600"
    case "critical":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

const getProgressColor = (status: string) => {
  switch (status) {
    case "normal":
      return "bg-green-500"
    case "warning":
      return "bg-yellow-500"
    case "critical":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export function SystemMetrics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Metrics</CardTitle>
        <CardDescription>Real-time system resource utilization and performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <div key={metric.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <Badge variant="outline" className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {metric.value}
                    {metric.unit} / {metric.max}
                    {metric.unit}
                  </span>
                  <span className="font-medium">{Math.round((metric.value / metric.max) * 100)}%</span>
                </div>
                <Progress value={(metric.value / metric.max) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">{metric.details}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
