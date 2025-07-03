"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Play, Pause, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const workflows = [
  {
    id: "wf-001",
    name: "ETL Data Pipeline",
    status: "running",
    lastRun: "2 minutes ago",
    duration: "5m 23s",
    owner: "Sarah Kim",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "wf-002",
    name: "ML Model Training",
    status: "completed",
    lastRun: "1 hour ago",
    duration: "45m 12s",
    owner: "Mike Chen",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "wf-003",
    name: "Report Generation",
    status: "failed",
    lastRun: "3 hours ago",
    duration: "2m 45s",
    owner: "Alex Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "wf-004",
    name: "Data Backup",
    status: "scheduled",
    lastRun: "6 hours ago",
    duration: "12m 34s",
    owner: "Emma Davis",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "bg-blue-500"
    case "completed":
      return "bg-green-500"
    case "failed":
      return "bg-red-500"
    case "scheduled":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

export function RecentWorkflows() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Workflows</CardTitle>
        <CardDescription>Latest workflow executions and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.status)}`} />
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={workflow.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {workflow.owner
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{workflow.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{workflow.lastRun}</span>
                    <span>•</span>
                    <span>{workflow.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="capitalize">
                  {workflow.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
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
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Workflow</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
