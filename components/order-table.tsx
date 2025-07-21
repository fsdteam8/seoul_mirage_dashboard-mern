"use client";

import type React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MoreHorizontal,
  Search,
  PackageCheck,
  Clock,
  AlertCircle,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  orderPaymentStatuses,
  orderFulfillmentStatuses,
} from "@/app/dashboard/orders/types";
import { StatCard } from "@/components/stat-card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { OrdersApiResponse } from "@/types/OrderDataType";
import { useSession } from "next-auth/react";
import OrderDetails from "@/app/dashboard/orders/_components/order-details-popup";
import StatusCell from "./SelectStatus";
// import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
type StatusType = "pending" | "cancelled" | "delivered";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

interface OrderStatchApiResponse {
  totalOrders: number;
  processing: number;
  pendingPayments: number;
  revenue: number;
  averageOrderValue: number;
}

function EnhancedPagination({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = Math.min(5, totalPages);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  return (
    <div className="flex items-center justify-between border-t bg-white px-6 py-4">
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalCount}</span> results
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
        </Button>
        <div className="flex items-center space-x-1 mx-2">
          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={`h-9 w-9 p-0 ${currentPage === pageNum
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "hover:bg-gray-50"
                }`}
            >
              {pageNum}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="h-9 w-9 text-sm"
        >
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default function OrderTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [singelOrder, setSingelOrder] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const token = session?.data?.accessToken ?? {};
  // const allStatuses = ["Delivered", "Shipped", "Processing", "Cancelled"];
  const { data, isLoading } = useQuery<OrdersApiResponse>({
    queryKey: ["orders", currentPage, searchTerm, paymentFilter, statusFilter],
    queryFn: async () => {
      // Construct query parameters
      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      if (searchTerm) params.append("search", searchTerm);
      if (paymentFilter !== "All Payments")
        params.append("payment_status", paymentFilter);
      if (statusFilter !== "All Status") params.append("status", statusFilter);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
  });

  const orderData = data?.data;

  const {
    data: orderStats,
    error: orderStatsError,
    isLoading: orderStatsLoading,
  } = useQuery<OrderStatchApiResponse>({
    queryKey: ["orderStats"],
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
      if (!res.ok) throw new Error("Failed to fetch order stats");
      return res.json();
    },
  });


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePaymentFilterChange = (value: string) => {
    setPaymentFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaymentBadgeVariant = (status: string) => {
    if (status === "Paid") return "default";
    if (status === "pending") return "secondary";
    if (status === "Failed") return "destructive";
    return "outline";
  };

  // const getFulfillmentBadgeVariant = (status: string) => {
  //   if (status === "Delivered") return "default";
  //   if (status === "Shipped") return "default";
  //   if (status === "Processing") return "secondary";
  //   if (status === "Cancelled") return "destructive";
  //   return "outline";
  // };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-brand-text-dark">
        Manage Orders
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orderStatsError ? (
          <div className="md:col-span-2 lg:col-span-4 flex items-start gap-2 p-3 rounded-md bg-red-100 text-red-700 text-sm font-medium">
            <AlertCircle className="w-4 h-4 mt-[2px]" />
            <span>{orderStatsError.message}</span>
          </div>
        ) : orderStatsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-xl shadow-sm space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Total Orders"
              value={
                orderStatsLoading
                  ? "Loading..."
                  : orderStatsError
                    ? "N/A"
                    : String(orderStats?.totalOrders ?? 0)
              }
              icon={PackageCheck}
            />
            <StatCard
              title="Processing"
              value={
                orderStatsLoading
                  ? "Loading..."
                  : orderStatsError
                    ? "N/A"
                    : String(orderStats?.processing ?? 0)
              }
              icon={Clock}
            />
            <StatCard
              title="Pending Payments"
              value={
                orderStatsLoading
                  ? "Loading..."
                  : orderStatsError
                    ? "N/A"
                    : String(orderStats?.pendingPayments ?? 0)
              }
              icon={AlertCircle}
            />
            <StatCard
              title="Revenue"
              value={
                orderStatsLoading
                  ? "Loading..."
                  : orderStatsError
                    ? "N/A"
                    : String(orderStats?.revenue ?? 0)
              }
              icon={DollarSign}
            />
          </>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 border p-5 rounded-[15px]">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 w-[246px] h-[49px]"
          />
        </div>
        <Select value={paymentFilter} onValueChange={handlePaymentFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="All Payments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Payments">All Payments</SelectItem>
            {orderPaymentStatuses.map((ps) => (
              <SelectItem key={ps} value={ps}>
                {ps}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Status">All Status</SelectItem>
            {orderFulfillmentStatuses.map((fs) => (
              <SelectItem key={fs} value={fs}>
                {fs}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead>ID</TableHead> */}
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Item(s)</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderData && orderData.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-order-${index}`}>
                  {/* ... skeleton rows ... */}
                </TableRow>
              ))}
            {!isLoading &&
              orderData &&
              orderData.data?.map((order, i) => {
                // Parse shipping_details JSON string safely
                let shippingDetails = { firstName: "-", email: "-" };
                try {
                  shippingDetails = JSON.parse(order.shipping_details);
                } catch {
                  // fallback, already set above
                }

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{i + 1}</TableCell>

                    {/* Use shipping_details firstName instead of customer name */}
                    <TableCell>{shippingDetails.firstName || "-"}</TableCell>

                    {/* Use shipping_details email instead of customer email */}
                    <TableCell>{shippingDetails.email || "-"}</TableCell>

                    <TableCell>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                        : "-"}
                    </TableCell>
                    <TableCell>{order.items} item(s)</TableCell>
                    <TableCell>${order.total}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getPaymentBadgeVariant(order.payment_status)}
                        className={
                          order.payment_status === "paid"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : order.payment_status === "pending"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : order.payment_status === "failed"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : ""
                        }
                      >
                        {order.payment_status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <StatusCell
                        orderId={order.id}
                        initialStatus={order.status as StatusType}
                      />
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setIsOpen(true);
                              setSingelOrder(order.id);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <OrderDetails
          orderId={singelOrder ?? ""}
          setOpen={setIsOpen}
          open={isOpen}
        />
        {data && data?.data.pagination.last_page > 1 && (
          <EnhancedPagination
            currentPage={data.data.pagination.current_page}
            totalPages={data.data.pagination.last_page}
            totalCount={data.data.pagination.total}
            itemsPerPage={data.data.pagination.per_page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
