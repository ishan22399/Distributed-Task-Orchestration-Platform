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
const mockWorkflows = [
  {
    id: "wf-001",
    name: "ETL Data Pipeline",
    description: "Extract, transform, and load customer data from multiple sources",
    status: "active",
    schedule: "Daily at 2:00 AM",
    lastRun: "2024-01-15T02:00:00Z",
    nextRun: "2024-01-16T02:00:00Z",
    duration: "5m 23s",
    success_rate: 98.5,
    tasks: 12,
    owner: "Sarah Kim",
    created: "2024-01-01T00:00:00Z",
  },
  {
    id: "wf-002",
    name: "ML Model Training",
    description: "Train and validate machine learning models for recommendation system",
    status: "running",
    schedule: "Weekly on Sunday",
    lastRun: "2024-01-14T10:00:00Z",
    nextRun: "2024-01-21T10:00:00Z",
    duration: "45m 12s",
    success_rate: 95.2,
    tasks: 8,
    owner: "Mike Chen",
    created: "2024-01-05T00:00:00Z",
  },
  {
    id: "wf-003",
    name: "Report Generation",
    description: "Generate daily business intelligence reports and dashboards",
    status: "paused",
    schedule: "Daily at 6:00 AM",
    lastRun: "2024-01-14T06:00:00Z",
    nextRun: "Paused",
    duration: "2m 45s",
    success_rate: 99.1,
    tasks: 6,
    owner: "Alex Johnson",
    created: "2024-01-03T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    // Check if workflows table exists
    const workflowsTableExists = await tableExists("workflows")
    const usersTableExists = await tableExists("users")
    const tasksTableExists = await tableExists("tasks")

    if (!workflowsTableExists) {
      // Return mock data if table doesn't exist
      let filteredWorkflows = mockWorkflows

      if (status && status !== "all") {
        filteredWorkflows = filteredWorkflows.filter((w) => w.status === status)
      }

      if (search) {
        filteredWorkflows = filteredWorkflows.filter(
          (w) =>
            w.name.toLowerCase().includes(search.toLowerCase()) ||
            w.description.toLowerCase().includes(search.toLowerCase()),
        )
      }

      return NextResponse.json({
        workflows: filteredWorkflows,
        total: filteredWorkflows.length,
        usingMockData: true,
        message: "Database tables not found. Using mock data. Please run database initialization scripts.",
      })
    }

    // Use real database queries
    const workflows = await safeQuery(
      async () => {
        let query = `
          SELECT 
            w.id,
            w.name,
            w.description,
            CASE 
              WHEN w.is_active THEN 'active'
              ELSE 'paused'
            END as status,
            w.schedule_expression as schedule,
            w.created_at,
            ${usersTableExists ? "COALESCE(u.first_name || ' ' || u.last_name, 'Unknown User')" : "'Unknown User'"} as owner,
            ${tasksTableExists ? "COUNT(t.id)" : "0"} as tasks,
            0 as success_rate
          FROM workflows w
          ${usersTableExists ? "LEFT JOIN users u ON w.created_by = u.id" : ""}
          ${tasksTableExists ? "LEFT JOIN tasks t ON w.id = t.workflow_id" : ""}
          WHERE 1=1
        `

        const params: any[] = []
        let paramIndex = 1

        if (status && status !== "all") {
          if (status === "active") {
            query += ` AND w.is_active = $${paramIndex}`
            params.push(true)
          } else if (status === "paused") {
            query += ` AND w.is_active = $${paramIndex}`
            params.push(false)
          }
          paramIndex++
        }

        if (search) {
          query += ` AND (w.name ILIKE $${paramIndex} OR w.description ILIKE $${paramIndex})`
          params.push(`%${search}%`)
          paramIndex++
        }

        if (tasksTableExists) {
          query += ` GROUP BY w.id, w.name, w.description, w.is_active, w.schedule_expression, w.created_at${usersTableExists ? ", u.first_name, u.last_name" : ""}`
        }

        query += ` ORDER BY w.created_at DESC`

        const { rows } = await sql.query(query, params)
        return rows
      },
      [],
      "Failed to fetch workflows from database",
    )

    return NextResponse.json({
      workflows: workflows.map((w: any) => ({
        ...w,
        lastRun: "2024-01-15T02:00:00Z", // This would come from workflow_executions
        nextRun: "2024-01-16T02:00:00Z", // This would be calculated
        duration: "5m 23s", // This would come from execution history
      })),
      total: workflows.length,
      usingMockData: false,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch workflows" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    // Check if workflows table exists
    const workflowsTableExists = await tableExists("workflows")

    if (!workflowsTableExists) {
      return NextResponse.json(
        {
          error: "Database not initialized. Please run database setup scripts first.",
        },
        { status: 503 },
      )
    }

    // Insert new workflow into database
    const result = await safeQuery(
      async () => {
        return await sql`
          INSERT INTO workflows (name, description, team_id, created_by, definition, schedule_expression, is_active)
          VALUES (
            ${body.name},
            ${body.description},
            ${"660e8400-e29b-41d4-a716-446655440001"},
            ${"550e8400-e29b-41d4-a716-446655440001"},
            ${JSON.stringify(body.definition || {})},
            ${body.schedule || null},
            ${true}
          )
          RETURNING *
        `
      },
      null,
      "Failed to create workflow",
    )

    if (!result) {
      return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 })
    }

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 })
  }
}
