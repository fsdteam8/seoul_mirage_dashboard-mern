"use client";

import {
  LineChart,
  Line,
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
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { SalesReportApiResponse } from "@/types/DashboardDataType";
import { Skeleton } from "@/components/ui/skeleton"; // Optional loading UI

const CHART_COLOR = "#d81b60"; // Figma pink

export function RevenueTrendChart() {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/stats`,
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

  // Transform sales to revenue (if needed)
  const revenueData =
    orderStats?.monthly_sales.map((item) => ({
      month: item.month,
      revenue: item.sales,
    })) || [];
  const currentYear = new Date().getFullYear();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {orderStatsLoading ? (
            <Skeleton className="h-4 w-40 rounded" />
          ) : (
            `${revenueData[0]?.month} - ${revenueData[5]?.month} ${currentYear}`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        {orderStatsLoading ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <Skeleton className="h-40 w-full" />
          </div>
        ) : orderStatsError ? (
          <div className="text-red-500">Failed to load revenue chart.</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={revenueData}
              margin={{ top: 25, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 12 }}
                tickFormatter={() => ""}
              />
              <Tooltip
                formatter={(value: number) => [`$${value}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLOR}
                strokeWidth={2}
                dot={{ r: 4, fill: CHART_COLOR, strokeWidth: 0 }}
                activeDot={{
                  r: 6,
                  stroke: CHART_COLOR,
                  strokeWidth: 2,
                  fill: "#fff",
                }}
              >
                <LabelList
                  dataKey="revenue"
                  position="top"
                  style={{ fill: "#333", fontSize: 10, fontWeight: 500 }}
                  formatter={(value: number) => `${value}`}
                />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
