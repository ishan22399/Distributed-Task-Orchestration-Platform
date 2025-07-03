"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Server, Cpu, MemoryStick, Activity, AlertTriangle, CheckCircle } from "lucide-react"

const workers = [
  {
    id: "worker-node-01",
    name: "Primary Worker 01",
    status: "healthy",
    region: "us-east-1",
    instance_type: "c5.2xlarge",
    cpu_usage: 68,
    memory_usage: 45,
    disk_usage: 32,
    network_io: 1.2,
    active_tasks: 3,
    completed_tasks: 1247,
    failed_tasks: 12,
    uptime: "15d 4h 23m",
    last_heartbeat: "2024-01-15 14:35:00",
  },
  {
    id: "worker-node-02",
    name: "Primary Worker 02",
    status: "healthy",
    region: "us-east-1",
    instance_type: "c5.2xlarge",
    cpu_usage: 42,
    memory_usage: 38,
    disk_usage: 28,
    network_io: 0.8,
    active_tasks: 2,
    completed_tasks: 1156,
    failed_tasks: 8,
    uptime: "12d 8h 15m",
    last_heartbeat: "2024-01-15 14:35:00",
  },
  {
    id: "worker-node-03",
    name: "ML Worker 01",
    status: "warning",
    region: "us-west-2",
    instance_type: "p3.2xlarge",
    cpu_usage: 85,
    memory_usage: 78,
    disk_usage: 65,
    network_io: 2.1,
    active_tasks: 1,
    completed_tasks: 342,
    failed_tasks: 23,
    uptime: "8d 12h 45m",
    last_heartbeat: "2024-01-15 14:34:30",
  },
  {
    id: "worker-node-04",
    name: "Backup Worker 01",
    status: "healthy",
    region: "us-west-2",
    instance_type: "c5.xlarge",
    cpu_usage: 25,
    memory_usage: 22,
    disk_usage: 18,
    network_io: 0.3,
    active_tasks: 1,
    completed_tasks: 892,
    failed_tasks: 5,
    uptime: "20d 2h 10m",
    last_heartbeat: "2024-01-15 14:35:00",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "healthy":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    case "critical":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    default:
      return <Server className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "healthy":
      return "bg-green-500"
    case "warning":
      return "bg-yellow-500"
    case "critical":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

const getUsageColor = (usage: number) => {
  if (usage >= 80) return "text-red-600"
  if (usage >= 60) return "text-yellow-600"
  return "text-green-600"
}

export function WorkerNodes() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Worker Nodes</h2>
          <p className="text-muted-foreground">Monitor and manage distributed worker node infrastructure</p>
        </div>
        <Button>
          <Server className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-green-600">All nodes operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Across all workers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">55%</div>
            <p className="text-xs text-green-600">Within normal range</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Memory</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">46%</div>
            <p className="text-xs text-green-600">Optimal utilization</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Worker Node Status</CardTitle>
          <CardDescription>Real-time status and resource utilization of all worker nodes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="tasks">Task Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Node</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Instance Type</TableHead>
                    <TableHead>Active Tasks</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Last Heartbeat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((worker) => (
                    <TableRow key={worker.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Server className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{worker.name}</div>
                            <div className="text-sm text-muted-foreground">{worker.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(worker.status)}
                          <Badge variant="outline" className="capitalize">
                            <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(worker.status)}`} />
                            {worker.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{worker.region}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{worker.instance_type}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{worker.active_tasks}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{worker.uptime}</TableCell>
                      <TableCell className="text-sm">{new Date(worker.last_heartbeat).toLocaleTimeString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <div className="space-y-6">
                {workers.map((worker) => (
                  <Card key={worker.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{worker.name}</CardTitle>
                        <Badge variant="outline" className="capitalize">
                          <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(worker.status)}`} />
                          {worker.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">CPU Usage</span>
                            <span className={`text-sm font-bold ${getUsageColor(worker.cpu_usage)}`}>
                              {worker.cpu_usage}%
                            </span>
                          </div>
                          <Progress value={worker.cpu_usage} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Memory</span>
                            <span className={`text-sm font-bold ${getUsageColor(worker.memory_usage)}`}>
                              {worker.memory_usage}%
                            </span>
                          </div>
                          <Progress value={worker.memory_usage} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Disk Usage</span>
                            <span className={`text-sm font-bold ${getUsageColor(worker.disk_usage)}`}>
                              {worker.disk_usage}%
                            </span>
                          </div>
                          <Progress value={worker.disk_usage} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Network I/O</span>
                            <span className="text-sm font-bold">{worker.network_io} Gbps</span>
                          </div>
                          <Progress value={(worker.network_io / 10) * 100} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Node</TableHead>
                    <TableHead>Active Tasks</TableHead>
                    <TableHead>Completed Tasks</TableHead>
                    <TableHead>Failed Tasks</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Load Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((worker) => {
                    const totalTasks = worker.completed_tasks + worker.failed_tasks
                    const successRate = totalTasks > 0 ? ((worker.completed_tasks / totalTasks) * 100).toFixed(1) : "0"

                    return (
                      <TableRow key={worker.id}>
                        <TableCell>
                          <div className="font-medium">{worker.name}</div>
                          <div className="text-sm text-muted-foreground">{worker.id}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{worker.active_tasks}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">{worker.completed_tasks.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-red-600">{worker.failed_tasks}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${successRate}%` }} />
                            </div>
                            <span className="text-sm font-medium">{successRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={(worker.active_tasks / 5) * 100} className="w-[80px]" />
                            <span className="text-sm text-muted-foreground">{worker.active_tasks}/5</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
