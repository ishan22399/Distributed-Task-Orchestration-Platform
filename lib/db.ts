import { neon } from "@neondatabase/serverless"

let sql: any = null

// Try to initialize database connection
try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  }
} catch (error) {
  console.warn("Database connection not available:", error)
}

export { sql }

// Database utility functions
export async function testConnection() {
  try {
    if (!sql) {
      return { success: false, error: "Database connection not configured" }
    }
    
    const result = await sql`SELECT NOW() as timestamp`
    return { success: true, timestamp: result[0].timestamp }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getWorkflowStats() {
  try {
    if (!sql) {
      return { total_workflows: 4, active_workflows: 2, paused_workflows: 1 }
    }
    
    const stats = await sql`
      SELECT 
        COUNT(*) as total_workflows,
        COUNT(*) FILTER (WHERE is_active = true) as active_workflows,
        COUNT(*) FILTER (WHERE is_active = false) as paused_workflows
      FROM workflows
    `
    return stats[0]
  } catch (error) {
    console.error("Failed to get workflow stats:", error)
    return { total_workflows: 0, active_workflows: 0, paused_workflows: 0 }
  }
}

export async function getTaskStats() {
  try {
    if (!sql) {
      return { running: 3, completed: 156, failed: 2, pending: 8 }
    }
    
    const stats = await sql`
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

    stats.forEach((stat: any) => {
      result[stat.status as keyof typeof result] = Number.parseInt(stat.count)
    })

    return result
  } catch (error) {
    console.error("Failed to get task stats:", error)
    return { running: 0, completed: 0, failed: 0, pending: 0 }
  }
}
