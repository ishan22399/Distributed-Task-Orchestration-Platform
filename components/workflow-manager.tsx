"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, Play, Pause, Edit, Trash2, MoreHorizontal, GitBranch } from "lucide-react"

const workflows = [
  {
    id: "wf-001",
    name: "ETL Data Pipeline",
    description: "Extract, transform, and load customer data from multiple sources",
    status: "active",
    schedule: "Daily at 2:00 AM",
    lastRun: "2024-01-15 02:00:00",
    nextRun: "2024-01-16 02:00:00",
    duration: "5m 23s",
    success_rate: 98.5,
    tasks: 12,
    owner: "Sarah Kim",
    created: "2024-01-01",
  },
  {
    id: "wf-002",
    name: "ML Model Training",
    description: "Train and validate machine learning models for recommendation system",
    status: "running",
    schedule: "Weekly on Sunday",
    lastRun: "2024-01-14 10:00:00",
    nextRun: "2024-01-21 10:00:00",
    duration: "45m 12s",
    success_rate: 95.2,
    tasks: 8,
    owner: "Mike Chen",
    created: "2024-01-05",
  },
  {
    id: "wf-003",
    name: "Report Generation",
    description: "Generate daily business intelligence reports and dashboards",
    status: "paused",
    schedule: "Daily at 6:00 AM",
    lastRun: "2024-01-14 06:00:00",
    nextRun: "Paused",
    duration: "2m 45s",
    success_rate: 99.1,
    tasks: 6,
    owner: "Alex Johnson",
    created: "2024-01-03",
  },
  {
    id: "wf-004",
    name: "Data Backup",
    description: "Backup critical databases and file systems to cloud storage",
    status: "active",
    schedule: "Every 6 hours",
    lastRun: "2024-01-15 12:00:00",
    nextRun: "2024-01-15 18:00:00",
    duration: "12m 34s",
    success_rate: 99.8,
    tasks: 4,
    owner: "Emma Davis",
    created: "2024-01-02",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "running":
      return "bg-blue-500"
    case "paused":
      return "bg-yellow-500"
    case "failed":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

export function WorkflowManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredWorkflows = workflows.filter(
    (workflow) =>
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workflow Management</h2>
          <p className="text-muted-foreground">Create, monitor, and manage your distributed task workflows</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Workflow
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Workflows</CardTitle>
              <CardDescription>Manage and monitor all your workflow definitions</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
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
              <TabsTrigger value="all">All Workflows</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="running">Running</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <GitBranch className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{workflow.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{workflow.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(workflow.status)}`} />
                          {workflow.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{workflow.schedule}</TableCell>
                      <TableCell className="text-sm">
                        <div>
                          <div>{new Date(workflow.lastRun).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">{new Date(workflow.lastRun).toLocaleTimeString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${workflow.success_rate}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{workflow.success_rate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{workflow.tasks}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{workflow.owner}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Play className="mr-2 h-4 w-4" />
                              Run Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pause className="mr-2 h-4 w-4" />
                              Pause
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>View Logs</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
