"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Category A", value: 275 },
  { name: "Category B", value: 200 },
  { name: "Category C", value: 187 },
  { name: "Category D", value: 173 },
  { name: "Category E", value: 90 },
]

// Updated COLORS to match Figma visual (DarkPink, Orange, Purple, Peach, Yellow)
// For data: Cat A (275), Cat B (200), Cat C (187), Cat D (173), Cat E (90)
const COLORS = ["#D81B60", "#E76E50", "#AD1457", "#F4A462", "#E8C468"]

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius?: number;
  value: number;
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius = 0, value }: LabelProps) => {
  const LABEL_OFFSET = 18 // How far from the slice the label should be
  const radius = outerRadius + LABEL_OFFSET
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // Determine text anchor based on position relative to center
  let textAnchor = "middle"
  if (x > cx) {
    // Right side
    textAnchor = "start"
  } else if (x < cx) {
    // Left side
    textAnchor = "end"
  }

  return (
    <text
      x={x}
      y={y}
      fill="#333" // Darker text for better readability
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize="12px"
      fontWeight="500"
    >
      {`${value}`}
    </text>
  )
}

export function SalesByCategoryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
        <CardDescription className="text-sm text-gray-500">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            {" "}
            {/* Added margins for labels */}
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false} // No connector lines as per simplified Figma
              label={renderCustomizedLabel}
              outerRadius={95} // Adjusted outerRadius to make space for labels
              fill="#8884d8"
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number, name: string) => [`$${value}`, name]} />
            <Legend
              iconType="square"
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ fontSize: "12px", paddingLeft: "20px" }} // Increased padding for legend
              formatter={(value) => <span style={{ color: "#333" }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
