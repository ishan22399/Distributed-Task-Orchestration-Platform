"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { time: "00:00", successful: 45, failed: 2, pending: 8 },
  { time: "04:00", successful: 52, failed: 1, pending: 12 },
  { time: "08:00", successful: 78, failed: 3, pending: 15 },
  { time: "12:00", successful: 95, failed: 4, pending: 22 },
  { time: "16:00", successful: 87, failed: 2, pending: 18 },
  { time: "20:00", successful: 63, failed: 1, pending: 14 },
]

const chartConfig = {
  successful: {
    label: "Successful",
    color: "hsl(var(--chart-1))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-3))",
  },
}

export function TaskExecutionChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Task Execution Overview</CardTitle>
        <CardDescription>Real-time task execution metrics over the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="successful"
                stackId="1"
                stroke="var(--color-successful)"
                fill="var(--color-successful)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="pending"
                stackId="1"
                stroke="var(--color-pending)"
                fill="var(--color-pending)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="failed"
                stackId="1"
                stroke="var(--color-failed)"
                fill="var(--color-failed)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
