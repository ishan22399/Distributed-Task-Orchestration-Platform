"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, RefreshCw, Eye, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react"

const tasks = [
  {
    id: "task-001",
    name: "Extract Customer Data",
    workflow: "ETL Data Pipeline",
    status: "running",
    progress: 65,
    startTime: "2024-01-15 14:30:00",
    duration: "2m 15s",
    worker: "worker-node-01",
    retries: 0,
    priority: "high",
  },
  {
    id: "task-002",
    name: "Transform User Profiles",
    workflow: "ETL Data Pipeline",
    status: "completed",
    progress: 100,
    startTime: "2024-01-15 14:28:00",
    duration: "1m 45s",
    worker: "worker-node-02",
    retries: 0,
    priority: "medium",
  },
  {
    id: "task-003",
    name: "Train Recommendation Model",
    workflow: "ML Model Training",
    status: "failed",
    progress: 45,
    startTime: "2024-01-15 14:25:00",
    duration: "5m 30s",
    worker: "worker-node-03",
    retries: 2,
    priority: "high",
    error: "Out of memory error during model training",
  },
  {
    id: "task-004",
    name: "Generate Sales Report",
    workflow: "Report Generation",
    status: "pending",
    progress: 0,
    startTime: null,
    duration: null,
    worker: null,
    retries: 0,
    priority: "low",
  },
  {
    id: "task-005",
    name: "Backup Database",
    workflow: "Data Backup",
    status: "running",
    progress: 25,
    startTime: "2024-01-15 14:32:00",
    duration: "45s",
    worker: "worker-node-01",
    retries: 0,
    priority: "medium",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "running":
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "failed":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "bg-blue-500"
    case "completed":
      return "bg-green-500"
    case "failed":
      return "bg-red-500"
    case "pending":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50 border-red-200"
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200"
    case "low":
      return "text-green-600 bg-green-50 border-green-200"
    default:
      return "text-gray-600 bg-gray-50 border-gray-200"
  }
}

export function TaskMonitor() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredTasks = tasks.filter(
    (task) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.workflow.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Task Monitor</h2>
          <p className="text-muted-foreground">Real-time monitoring of task execution across all workflows</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Task Execution</CardTitle>
              <CardDescription>Monitor task status, progress, and performance metrics</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="running">Running</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Retries</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(task.status)}
                            <span className="font-medium">{task.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.workflow}</p>
                          {task.error && <p className="text-sm text-red-600">{task.error}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(task.status)}`} />
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={task.progress} className="w-[100px]" />
                          <span className="text-sm text-muted-foreground">{task.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.worker ? (
                          <Badge variant="secondary">{task.worker}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{task.duration || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`capitalize ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.retries > 0 ? (
                          <Badge variant="destructive">{task.retries}</Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
