import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { checkDatabaseSchema } from "@/lib/db-utils"

let sql: any = null

// Try to initialize database connection
try {
  if (process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  }
} catch (error) {
  console.warn("Database connection not available:", error)
}

export async function GET(request: NextRequest) {
  try {
    let databaseStatus = {
      status: "unavailable",
      timestamp: null,
      schema: { allTablesExist: false, missingTables: [], existingTables: [] },
      message: "Database connection not configured"
    }

    // Test database connection if available
    if (sql && process.env.DATABASE_URL) {
      try {
        const connectionTest = await sql`SELECT NOW() as timestamp, 'connected' as status`
        const schemaStatus = await checkDatabaseSchema()
        
        databaseStatus = {
          status: "connected",
          timestamp: connectionTest[0].timestamp,
          schema: schemaStatus,
          message: "Database connected successfully"
        }
      } catch (dbError) {
        console.error("Database health check failed:", dbError)
        databaseStatus = {
          status: "error",
          timestamp: null,
          schema: { allTablesExist: false, missingTables: [], existingTables: [] },
          message: `Database error: ${dbError instanceof Error ? dbError.message : "Unknown error"}`
        }
      }
    }

    return NextResponse.json({
      status: databaseStatus.status === "connected" ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      database: databaseStatus,
      version: "1.0.0",
      features: {
        mockDataFallback: true,
        realTimeUpdates: databaseStatus.status === "connected",
        authentication: false // Not implemented yet
      }
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: {
          status: "disconnected",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 503 },
    )
  }
}
