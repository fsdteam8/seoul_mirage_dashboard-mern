"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SalesReportApiResponse } from "@/types/DashboardDataType";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton"; // Optional: for loading state

const CHART_COLOR = "#AD1457"; // Figma pink

export function SalesOverviewChart() {
  const session = useSession();
  const token = session?.data?.accessToken ?? "";

  const {
    data: orderStats,
    error: orderStatsError,
    isLoading: orderStatsLoading,
  } = useQuery<SalesReportApiResponse>({
    queryKey: ["order-stats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/order-stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch order stats");
      }
      return res.json();
    },
  });

  const orderStatsData = orderStats?.monthly_sales || [];
  console.log(orderStatsData);
  const currentYear = new Date().getFullYear();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sales Overview</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {orderStatsLoading ? (
            <Skeleton className="h-4 w-40 rounded" />
          ) : (
            `${orderStatsData[0]?.month} - ${orderStatsData[5]?.month} ${currentYear}`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="pr-4 py-4">
        {orderStatsLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-40 w-full" />
          </div>
        ) : orderStatsError ? (
          <div className="text-red-500">Failed to load chart data.</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={orderStatsData}
              layout="vertical"
              margin={{ top: 2, right: 50, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#f0f0f0"
              />
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
              <Bar
                dataKey="sales"
                barSize={20}
                radius={[0, 4, 4, 0]}
                fill={CHART_COLOR}
              >
                <LabelList
                  dataKey="sales"
                  position="right"
                  formatter={(value: number) => `$${value}`}
                  style={{ fill: "#333", fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
