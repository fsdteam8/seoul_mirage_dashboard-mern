"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "January", sales: 186 },
  { month: "February", sales: 305 },
  { month: "March", sales: 237 },
  { month: "April", sales: 73 },
  { month: "May", sales: 209 },
  { month: "June", sales: 214 },
]

const CHART_COLOR = "#AD1457" // Figma pink

export function SalesOverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sales Overview</CardTitle>
        <CardDescription className="text-sm text-gray-500">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="pr-4 py-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
            <XAxis
              type="number"
              tickFormatter={(value) => `$${value}`}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
            />
            <YAxis
              dataKey="month"
              type="category"
              axisLine={false}
              tickLine={false}
              width={70}
              tick={{ fill: "#666", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(216, 27, 96, 0.1)" }}
              formatter={(value: number) => [`$${value}`, "Sales"]}
            />
            <Bar dataKey="sales" barSize={20} radius={[0, 4, 4, 0]} fill={CHART_COLOR}>
              <LabelList
                dataKey="sales"
                position="right"
                formatter={(value: number) => `$${value}`}
                style={{ fill: "#333", fontSize: 12 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
