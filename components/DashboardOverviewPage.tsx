"use client";

import { StatCard } from "@/components/stat-card";
import {
  CircleDollarSign,
  ShoppingBag,
  Users,
  Archive,
  Package,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { SalesOverviewChart } from "@/components/sales-overview-chart";
import { RevenueTrendChart } from "@/components/revenue-trend-chart";
import { SalesByCategoryChart } from "@/components/sales-by-category-chart";
import { useQuery } from "@tanstack/react-query";
import { OrdersResponse } from "@/types/RecentOrderDataType";
import { useSession } from "next-auth/react";
import { SalesReportApiResponse } from "@/types/DashboardDataType";
                                                            
interface Media {
  id: number;                                        
  product_id: number;    
  file_path: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image: string | null;
  price: string;
  category_id: number;
  status: string;
  cost_price: string;
  stock_quantity: number;
  sales: number;
  created_at: string;
  updated_at: string;
  orders_count: number;
  category: Category;
  media: Media[];
}

interface ProductApiResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Product[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  current_page: number;
  total_pages: number;
  per_page: number;
  total: number;
}

export default function DashboardOverviewPage() {
  const { data: session } = useSession();
  const token = session?.accessToken ?? "";

  const { data, error, isLoading } = useQuery<ProductApiResponse>({
    queryKey: ["TopProducts"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/best-selling-products?paginate_count=5`
        , {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }

      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const {
    data: statch,
    error: statchError,
    isLoading: statchLoading,
  } = useQuery<SalesReportApiResponse>({
    queryKey: ["dashboardOverview"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/stats`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const {
    data: rcnOrder,
    error: rcnError,
    isLoading: rcnLoading,
  } = useQuery<OrdersResponse>({
    queryKey: ["recentOrder"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders?paginate_count=5`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });


  const topProducts = (data?.data?.data ?? []).map((product) => ({
    id: product?.id,
    name: product?.name,
    unitsSold: `${product?.stock_quantity} Stock Quantity`,
    price: `$${parseFloat(product?.price).toFixed(2)}`,
    sales: `${product?.sales} Sales`,
    image: product?.media[0]
      ? `${product?.media[0]?.file_path}`
      : "/placeholder.svg",
  }));

  const recentOrders = (rcnOrder?.data?.data ?? []).map((order) => {
    let icon, statusColor, bgColor;
    switch (order.status.toLowerCase()) {
      case "pending":
        icon = Clock;
        statusColor = "text-yellow-600";
        bgColor = "bg-yellow-100";
        break;
      case "shipped":
        icon = Package;
        statusColor = "text-blue-600";
        bgColor = "bg-blue-100";
        break;
      case "delivered":
        icon = CheckCircle;
        statusColor = "text-green-600";
        bgColor = "bg-green-100";
        break;
      default:
        icon = Clock;
        statusColor = "text-gray-600";
        bgColor = "bg-gray-100";
    }

    return {
      id: order?.id,
      customer: `${order?.customer?.name}`,
      amount: `$${parseFloat(order?.total).toFixed(2)}`,
      status: order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1),
      icon,
      statusColor,
      bgColor,
    };
  });


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-brand-text-dark">
        Dashboard Overview
      </h2>

      {/* ✅ Stat Cards with Loading and Error Handling */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={
            statchLoading
              ? "Loading..."
              : statchError
                ? "N/A"
                : `$${statch?.revenue ?? 0}`
          }
          icon={CircleDollarSign}
        />
        <StatCard
          title="Orders"
          value={
            statchLoading
              ? "Loading..."
              : statchError
                ? "N/A"
                : String(statch?.totalOrders ?? 0)
          }
          icon={ShoppingBag}
        />
        <StatCard
          title="Customers"
          value={
            statchLoading
              ? "Loading..."
              : statchError
                ? "N/A"
                : String(statch?.customerCount ?? 0)
          }
          icon={Users}
          description="Active customers"
        />
        <StatCard
          title="Avg. Order Value"
          value={
            statchLoading
              ? "Loading..."
              : statchError
                ? "N/A"
                : `$${statch?.averageOrderValue?.toFixed(3) ?? 0}`
          }
          icon={Archive}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SalesOverviewChart />
        <RevenueTrendChart />
        <SalesByCategoryChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-[20px] font-semibold leading-[120%]">
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-4">
              {rcnLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <li key={i} className="flex items-center space-x-3 py-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                      <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                  </li>
                ))
              ) : rcnError ? (
                <li className="text-center text-red-600">
                  Error loading orders: {rcnError.message}
                </li>
              ) : recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const Icon = order.icon;
                  return (
                    <li
                      key={order.id}
                      className="flex items-center space-x-3 py-2"
                    >
                      <Icon className={`h-5 w-5 ${order.statusColor}`} />
                      <div className="flex-1 space-y-3">
                        <p className="text-base font-semibold text-[#09090B]">
                          {order.id}
                        </p>
                        <p className="text-[14px] text-[#71717A] font-medium">
                          {order.customer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-semibold text-[#09090B] mb-3">
                          {order.amount}
                        </p>
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${order.bgColor} ${order.statusColor}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="text-center text-gray-600">
                  No recent orders available
                </li>
              )}
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4 h-[45px] text-base font-semibold"
              asChild
            >
              <Link href="/dashboard/orders">View All</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[20px] font-semibold leading-[120%]">
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center space-x-3 py-2.5 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="h-[60px] w-[60px] bg-gray-200 rounded animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="text-right space-y-2">
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </li>
                ))
              ) : error ? (
                <li className="text-center text-red-600">
                  Error loading products: {error.message}
                </li>
              ) : topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <li
                    key={`${product.name}-${product.id}-${index}`}
                    className="flex items-center space-x-3 py-2.5 border-b border-gray-100 last:border-b-0"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="object-cover h-[60px] w-[60px]"
                    />
                    <div className="flex-1">
                      <p className="text-base font-semibold leading-[120%] text-[#09090B] mb-2">
                        {product.name}
                      </p>
                      <p className="text-[14px] font-medium text-[#71717A]">
                        {product.unitsSold}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-[#09090B] mb-2">
                        {product.price}
                      </p>
                      <p className="text-xs text-[#1E2A38] font-semibold">
                        {product.sales}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-center text-gray-600">
                  No top products available
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
