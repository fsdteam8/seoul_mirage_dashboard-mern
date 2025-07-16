"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const COLORS = ["#D81B60", "#E76E50", "#AD1457", "#F4A462", "#E8C468"];

interface CategorySales {
  category: string;
  total_sales: number;
}

interface ApiResponse {
  category_wise_sales: CategorySales[];
}

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius?: number;
  value: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius = 0,
  value,
}: LabelProps) => {
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const textAnchor = x > cx ? "start" : x < cx ? "end" : "middle";

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize="12px"
      fontWeight="500"
    >
      {value}
    </text>
  );
};

export function SalesByCategoryChart() {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";
  const currentYear = new Date().getFullYear();

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ["category-wise-sales"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/stats`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch category-wise sales");
      return res.json();
    },
  });

  const chartData =
    data?.category_wise_sales
      .filter((item) => item.total_sales > 0)
      .map((item) => ({
        name: item.category,
        value: item.total_sales,
      })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Sales by Category
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {isLoading ? (
            <Skeleton className="h-4 w-40" />
          ) : (
            `January - June ${currentYear}`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        {isLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-40 w-full" />
          </div>
        ) : error ? (
          <div className="text-red-500">Failed to load chart data.</div>
        ) : chartData.length === 0 ? (
          <div className="text-muted-foreground text-center text-sm py-12">
            No sales data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={95}
                labelLine={false}
                label={renderCustomizedLabel}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`$${value}`, name]}
              />
              <Legend
                iconType="square"
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ fontSize: "12px", paddingLeft: "20px" }}
                formatter={(value) => (
                  <span style={{ color: "#333" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
