import { NextResponse } from "next/server"
import { checkDatabaseSchema } from "@/lib/db-utils"

export async function GET() {
  try {
    // If no database URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        status: "unavailable",
        message: "Database connection not configured. Using mock data.",
        allTablesExist: false,
        missingTables: ["users", "teams", "workflows", "tasks", "task_executions", "worker_nodes"],
        existingTables: [],
        timestamp: new Date().toISOString(),
      })
    }

    const schemaStatus = await checkDatabaseSchema()

    return NextResponse.json({
      status: schemaStatus.allTablesExist ? "ready" : "incomplete",
      message: schemaStatus.allTablesExist 
        ? "Database is properly configured" 
        : `Missing tables: ${schemaStatus.missingTables.join(", ")}. Using mock data.`,
      ...schemaStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Database connection failed. Using mock data.",
        allTablesExist: false,
        missingTables: [],
        existingTables: [],
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
