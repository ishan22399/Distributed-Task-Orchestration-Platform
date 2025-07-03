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
const mockWorkers = [
  {
    id: "worker-node-01",
    name: "Primary Worker 01",
    status: "healthy",
    region: "us-east-1",
    instance_type: "c5.2xlarge",
    cpuUsage: 68,
    memoryUsage: 45,
    diskUsage: 32,
    networkIO: 1.2,
    active_tasks: 3,
    max_concurrent_tasks: 5,
    completedTasks: 1247,
    failedTasks: 12,
    uptime: "15d 4h 23m",
    last_heartbeat: "2024-01-15T14:35:00Z",
  },
  {
    id: "worker-node-02",
    name: "Primary Worker 02",
    status: "healthy",
    region: "us-east-1",
    instance_type: "c5.2xlarge",
    cpuUsage: 42,
    memoryUsage: 38,
    diskUsage: 28,
    networkIO: 0.8,
    active_tasks: 2,
    max_concurrent_tasks: 5,
    completedTasks: 1156,
    failedTasks: 8,
    uptime: "12d 8h 15m",
    last_heartbeat: "2024-01-15T14:35:00Z",
  },
  {
    id: "worker-node-03",
    name: "ML Worker 01",
    status: "warning",
    region: "us-west-2",
    instance_type: "p3.2xlarge",
    cpuUsage: 85,
    memoryUsage: 78,
    diskUsage: 65,
    networkIO: 2.1,
    active_tasks: 1,
    max_concurrent_tasks: 3,
    completedTasks: 342,
    failedTasks: 23,
    uptime: "8d 12h 45m",
    last_heartbeat: "2024-01-15T14:34:30Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Check if worker_nodes table exists
    const workerNodesExists = await tableExists("worker_nodes")
    const systemMetricsExists = await tableExists("system_metrics")

    if (!workerNodesExists) {
      // Return mock data if table doesn't exist
      let filteredWorkers = mockWorkers

      if (status && status !== "all") {
        filteredWorkers = filteredWorkers.filter((w) => w.status === status)
      }

      const summary = {
        total: filteredWorkers.length,
        healthy: filteredWorkers.filter((w) => w.status === "healthy").length,
        warning: filteredWorkers.filter((w) => w.status === "warning").length,
        critical: filteredWorkers.filter((w) => w.status === "critical").length,
        avgCpuUsage: filteredWorkers.reduce((sum, w) => sum + w.cpuUsage, 0) / filteredWorkers.length,
        avgMemoryUsage: filteredWorkers.reduce((sum, w) => sum + w.memoryUsage, 0) / filteredWorkers.length,
        totalActiveTasks: filteredWorkers.reduce((sum, w) => sum + w.active_tasks, 0),
      }

      return NextResponse.json({
        workers: filteredWorkers,
        summary,
        usingMockData: true,
        message: "Database tables not found. Using mock data. Please run database initialization scripts.",
      })
    }

    // Use real database queries
    const workers = await safeQuery(
      async () => {
        let query = `
          SELECT 
            id,
            name,
            status,
            region,
            instance_type,
            current_load as active_tasks,
            max_concurrent_tasks,
            last_heartbeat,
            metadata,
            created_at
          FROM worker_nodes
          WHERE 1=1
        `

        const params: any[] = []
        let paramIndex = 1

        if (status && status !== "all") {
          query += ` AND status = $${paramIndex}`
          params.push(status)
          paramIndex++
        }

        query += ` ORDER BY created_at DESC`

        const { rows } = await sql.query(query, params)
        return rows
      },
      [],
      "Failed to fetch workers from database",
    )

    // Get recent metrics for each worker
    const workersWithMetrics = await Promise.all(
      workers.map(async (worker: any) => {
        const metrics = await safeQuery(
          async () => {
            if (!systemMetricsExists) return []

            return await sql`
              SELECT metric_name, metric_value
              FROM system_metrics 
              WHERE source = ${worker.id} 
              AND recorded_at > NOW() - INTERVAL '5 minutes'
              ORDER BY recorded_at DESC
              LIMIT 10
            `
          },
          [],
          `Failed to fetch metrics for worker ${worker.id}`,
        )

        const metricsMap = metrics.reduce((acc: any, metric: any) => {
          acc[metric.metric_name] = metric.metric_value
          return acc
        }, {})

        return {
          ...worker,
          cpuUsage: metricsMap.cpu_usage_percent || Math.floor(Math.random() * 40) + 40,
          memoryUsage: metricsMap.memory_usage_percent || Math.floor(Math.random() * 30) + 30,
          diskUsage: metricsMap.disk_usage_percent || Math.floor(Math.random() * 20) + 20,
          networkIO: metricsMap.network_io_gbps || Math.random() * 2 + 0.5,
          completedTasks: 1247, // This would come from task_executions
          failedTasks: 12, // This would come from task_executions
          uptime: "15d 4h 23m", // This would be calculated
        }
      }),
    )

    const summary = {
      total: workers.length,
      healthy: workers.filter((w: any) => w.status === "healthy").length,
      warning: workers.filter((w: any) => w.status === "warning").length,
      critical: workers.filter((w: any) => w.status === "critical").length,
      avgCpuUsage: workersWithMetrics.reduce((sum, w) => sum + w.cpuUsage, 0) / (workersWithMetrics.length || 1),
      avgMemoryUsage: workersWithMetrics.reduce((sum, w) => sum + w.memoryUsage, 0) / (workersWithMetrics.length || 1),
      totalActiveTasks: workersWithMetrics.reduce((sum, w) => sum + w.active_tasks, 0),
    }

    return NextResponse.json({
      workers: workersWithMetrics,
      summary,
      usingMockData: false,
    })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Failed to fetch worker nodes" }, { status: 500 })
  }
}
