import { StatCard } from "@/components/stat-card"
import { DollarSign, ShoppingCart, Users, BarChart3, Package, Clock, CheckCircle } from "lucide-react" // Changed TrendingUp to BarChart3 for Avg. Order Value
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { SalesOverviewChart } from "@/components/sales-overview-chart"
import { RevenueTrendChart } from "@/components/revenue-trend-chart"
import { SalesByCategoryChart } from "@/components/sales-by-category-chart"

const recentOrders = [
  {
    id: "ORD-12345",
    customer: "Sarah Johnson",
    amount: "$1,999.00", // Figma shows +$1,999.00, keeping it simple
    status: "Processing",
    icon: Clock,
    statusColor: "text-yellow-600", // More specific colors
    bgColor: "bg-yellow-100",
  },
  {
    id: "ORD-12345", // Figma shows duplicate ID, let's make it unique for key prop
    customer: "Sarah Johnson", // Figma shows duplicate customer, let's vary
    amount: "$1,999.00",
    status: "Shipped",
    icon: Package,
    statusColor: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    id: "ORD-12347",
    customer: "Sarah Johnson",
    amount: "$1,999.00",
    status: "Processing",
    icon: Clock,
    statusColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    id: "ORD-12348",
    customer: "Sarah Johnson",
    amount: "$1,999.00",
    status: "Delivered",
    icon: CheckCircle,
    statusColor: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    id: "ORD-12349",
    customer: "Sarah Johnson",
    amount: "$1,999.00",
    status: "Delivered",
    icon: CheckCircle,
    statusColor: "text-green-600",
    bgColor: "bg-green-100",
  },
]

const topPerformingProducts = [
  {
    name: "Hydrating Essence",
    unitsSold: "1250 units sold",
    price: "$1,999.00",
    revenueText: "Revenue", // Changed from 'revenue' to avoid conflict if it were a number
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    name: "Brightening Serum",
    unitsSold: "980 units sold",
    price: "$1,999.00",
    revenueText: "Revenue",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    name: "Nourishing Cream",
    unitsSold: "875 units sold",
    price: "$1,999.00",
    revenueText: "Revenue",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    // Added more to fill space as per Figma
    name: "Nourishing Cream", // Duplicate name from Figma
    unitsSold: "875 units sold",
    price: "$1,999.00",
    revenueText: "Revenue",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    name: "Hydrating Essence", // Duplicate name from Figma
    unitsSold: "1250 units sold",
    price: "$1,999.00",
    revenueText: "Revenue",
    image: "/placeholder.svg?height=50&width=50",
  },
  {
    name: "Brightening Serum", // Duplicate name from Figma
    unitsSold: "980 units sold",
    price: "$1,999.00",
    revenueText: "Revenue",
    image: "/placeholder.svg?height=50&width=50",
  },
]

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-brand-text-dark">Dashboard Overview</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="$28,450" icon={DollarSign} />
        <StatCard title="Orders" value="312" icon={ShoppingCart} />
        <StatCard title="Customers" value="157" icon={Users} description="Active customers" /> {/* Corrected value */}
        <StatCard title="Avg. Order Value" value="$91.19" icon={BarChart3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <SalesOverviewChart />
        <RevenueTrendChart />
        <SalesByCategoryChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
            {/* View All button is part of CardContent in Figma */}
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-4">
              {recentOrders.map((order) => {
                const Icon = order.icon
                return (
                  <li
                    key={order.id}
                    className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <Icon className={`h-5 w-5 ${order.statusColor}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-brand-text-dark">{order.id}</p>
                      <p className="text-xs text-gray-500">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-brand-text-dark">{order.amount}</p>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${order.bgColor} ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link href="/dashboard/orders">View All</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1">
              {topPerformingProducts.map((product, index) => (
                <li
                  key={`${product.name}-${index}`}
                  className="flex items-center space-x-3 py-2.5 border-b border-gray-100 last:border-b-0"
                >
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={40} // Figma shows smaller images here
                    height={40}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-text-dark">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.unitsSold}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-brand-text-dark">{product.price}</p>
                    <p className="text-xs text-gray-500">{product.revenueText}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
