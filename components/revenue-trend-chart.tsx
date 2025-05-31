"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { month: "Jan", revenue: 198 },
  { month: "Feb", revenue: 305 },
  { month: "Mar", revenue: 237 },
  { month: "Apr", revenue: 73 },
  { month: "May", revenue: 209 },
  { month: "Jun", revenue: 214 },
]

const CHART_COLOR = "#d81b60" // Figma pink

export function RevenueTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
        <CardDescription className="text-sm text-gray-500">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 25, right: 20, left: 0, bottom: 5 }}>
            {" "}
            {/* Increased top margin for labels */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#666", fontSize: 12 }}
              tickFormatter={() => ""} // Hide Y-axis labels as values are on points
            />
            <Tooltip formatter={(value: number) => [`$${value}`, "Revenue"]} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={CHART_COLOR}
              strokeWidth={2}
              dot={{ r: 4, fill: CHART_COLOR, strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: CHART_COLOR, strokeWidth: 2, fill: "#fff" }}
            >
              <LabelList
                dataKey="revenue"
                position="top"
                style={{ fill: "#333", fontSize: 10, fontWeight: 500 }}
                formatter={(value: number) => `${value}`} // Raw value as per Figma
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
