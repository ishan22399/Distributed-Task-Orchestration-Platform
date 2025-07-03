import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { tableExists, safeQuery } from "@/lib/db-utils"

let sql: any = null

// Try to initialize database connection
try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  }
} catch (error) {
  console.warn("Database connection not available:", error)
}

// Mock data fallback
const mockTasks = [
  {
    id: "task-001",
    name: "Extract Customer Data",
    workflow: "ETL Data Pipeline",
    status: "running",
    progress: 65,
    start_time: "2024-01-15T14:30:00Z",
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
    start_time: "2024-01-15T14:28:00Z",
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
    start_time: "2024-01-15T14:25:00Z",
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
    start_time: null,
    duration: null,
    worker: null,
    retries: 0,
    priority: "low",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const workflow = searchParams.get("workflow")

    // Check if required tables exist
    const taskExecutionsExists = await tableExists("task_executions")
    const tasksExists = await tableExists("tasks")
    const workflowsExists = await tableExists("workflows")

    if (!taskExecutionsExists || !tasksExists || !workflowsExists) {
      // Return mock data if tables don't exist
      let filteredTasks = mockTasks

      if (status && status !== "all") {
        filteredTasks = filteredTasks.filter((t) => t.status === status)
      }

      if (workflow) {
        filteredTasks = filteredTasks.filter((t) => t.workflow.toLowerCase().includes(workflow.toLowerCase()))
      }

      const summary = {
        running: filteredTasks.filter((t) => t.status === "running").length,
        completed: filteredTasks.filter((t) => t.status === "completed").length,
        failed: filteredTasks.filter((t) => t.status === "failed").length,
        pending: filteredTasks.filter((t) => t.status === "pending").length,
      }

      return NextResponse.json({
        tasks: filteredTasks,
        total: filteredTasks.length,
        summary,
        usingMockData: true,
        message: "Database tables not found. Using mock data. Please run database initialization scripts.",
      })
    }

    // Use real database queries
    const tasks = await safeQuery(
      async () => {
        let query = `
          SELECT 
            te.id,
            t.name,
            w.name as workflow,
            te.status,
            CASE 
              WHEN te.status = 'completed' THEN 100
              WHEN te.status = 'running' THEN 65
              WHEN te.status = 'failed' THEN 45
              ELSE 0
            END as progress,
            te.started_at as start_time,
            CASE 
              WHEN te.completed_at IS NOT NULL AND te.started_at IS NOT NULL 
              THEN EXTRACT(EPOCH FROM (te.completed_at - te.started_at)) || 's'
              ELSE null
            END as duration,
            te.worker_node_id as worker,
            te.retry_count as retries,
            'high' as priority,
            te.error_message as error
          FROM task_executions te
          JOIN tasks t ON te.task_id = t.id
          JOIN workflows w ON t.workflow_id = w.id
          WHERE 1=1
        `

        const params: any[] = []
        let paramIndex = 1

        if (status && status !== "all") {
          query += ` AND te.status = $${paramIndex}`
          params.push(status)
          paramIndex++
        }

        if (workflow) {
          query += ` AND w.name ILIKE $${paramIndex}`
          params.push(`%${workflow}%`)
          paramIndex++
        }

        query += ` ORDER BY te.created_at DESC LIMIT 50`

        const { rows } = await sql.query(query, params)
        return rows
      },
      [],
      "Failed to fetch tasks from database",
    )

    // Get summary counts
    const summary = await safeQuery(
      async () => {
        const summaryResult = await sql`
          SELECT 
            status,
            COUNT(*) as count
          FROM task_executions 
          WHERE created_at > NOW() - INTERVAL '24 hours'
          GROUP BY status
        `

        const result = {
          running: 0,
          completed: 0,
          failed: 0,
          pending: 0,
        }

        summaryResult.forEach((row: any) => {
          result[row.status as keyof typeof result] = Number.parseInt(row.count)
        })

        return result
      },
      { running: 0, completed: 0, failed: 0, pending: 0 },
      "Failed to fetch task summary",
    )

    return NextResponse.json({
      tasks,
      total: tasks.length,
      summary,
      usingMockData: false,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}
