import { type NextRequest, NextResponse } from "next/server"

// Mock system metrics data
const generateMetrics = () => {
  const now = new Date()
  const metrics = []

  // Generate last 24 hours of data
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    metrics.push({
      timestamp: timestamp.toISOString(),
      cpuUsage: Math.floor(Math.random() * 40) + 40, // 40-80%
      memoryUsage: Math.floor(Math.random() * 30) + 30, // 30-60%
      diskUsage: Math.floor(Math.random() * 20) + 20, // 20-40%
      networkIO: Math.random() * 2 + 0.5, // 0.5-2.5 Gbps
      activeTasks: Math.floor(Math.random() * 10) + 5, // 5-15 tasks
      queueDepth: Math.floor(Math.random() * 100) + 50, // 50-150 tasks
      throughput: Math.floor(Math.random() * 200) + 250, // 250-450 tasks/min
    })
  }

  return metrics
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("range") || "24h"
    const metric = searchParams.get("metric")

    const metrics = generateMetrics()

    if (metric) {
      // Return specific metric data
      return NextResponse.json({
        metric,
        data: metrics.map((m) => ({
          timestamp: m.timestamp,
          value: m[metric as keyof typeof m],
        })),
      })
    }

    // Return all metrics
    return NextResponse.json({
      timeRange,
      metrics,
      summary: {
        avgCpuUsage: metrics.reduce((sum, m) => sum + m.cpuUsage, 0) / metrics.length,
        avgMemoryUsage: metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length,
        avgDiskUsage: metrics.reduce((sum, m) => sum + m.diskUsage, 0) / metrics.length,
        avgNetworkIO: metrics.reduce((sum, m) => sum + m.networkIO, 0) / metrics.length,
        totalThroughput: metrics[metrics.length - 1]?.throughput || 0,
        currentQueueDepth: metrics[metrics.length - 1]?.queueDepth || 0,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
