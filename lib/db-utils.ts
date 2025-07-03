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

/**
 * Check if a table exists in the database
 */
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    if (!sql) return false
    
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
      ) as exists
    `
    return result[0]?.exists || false
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error)
    return false
  }
}

/**
 * Get all required tables and their existence status
 */
export async function checkDatabaseSchema() {
  const requiredTables = [
    "users",
    "teams",
    "team_members",
    "workflows",
    "workflow_executions",
    "tasks",
    "task_executions",
    "worker_nodes",
    "system_metrics",
    "audit_logs",
  ]

  const tableStatus = await Promise.all(
    requiredTables.map(async (table) => ({
      table,
      exists: await tableExists(table),
    })),
  )

  return {
    allTablesExist: tableStatus.every((t) => t.exists),
    missingTables: tableStatus.filter((t) => !t.exists).map((t) => t.table),
    existingTables: tableStatus.filter((t) => t.exists).map((t) => t.table),
    tableStatus,
  }
}

/**
 * Safe database query with fallback
 */
export async function safeQuery<T>(queryFn: () => Promise<T>, fallback: T, errorMessage?: string): Promise<T> {
  try {
    return await queryFn()
  } catch (error) {
    console.error(errorMessage || "Database query failed:", error)
    return fallback
  }
}
