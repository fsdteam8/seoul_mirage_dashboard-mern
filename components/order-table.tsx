
"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "lucide-react"
import {
  type Order,
  type OrderPaymentStatus,
  type OrderFulfillmentStatus,
  mockOrders,
  orderPaymentStatuses,
  orderFulfillmentStatuses,
} from "@/app/dashboard/orders/types"
import { StatCard } from "@/components/stat-card"
import { useToast } from "@/hooks/use-toast"

const ITEMS_PER_PAGE = 10

// Enhanced Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

function EnhancedPagination({ currentPage, totalPages, totalCount, itemsPerPage, onPageChange }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, currentPage + 2)

      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        end = Math.min(5, totalPages)
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalCount)

  return (
    <div className="flex items-center justify-between border-t bg-white px-6 py-4">
      {/* Results count */}
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalCount}</span> results
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-9 w-9 text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
   
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1 mx-2">
          {pageNumbers.map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={`h-9 w-9 p-0 ${
                currentPage === pageNum ? "bg-gray-900 text-white hover:bg-gray-800" : "hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </Button>
          ))}
        </div>

        {/* Next button */}
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
  )
}

export function OrderTable() {
  const { toast } = useToast()
  const [allOrders] = useState<Order[]>(mockOrders) // Store all orders for client-side filtering/sorting
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentFilter, setPaymentFilter] = useState("All Payments")
  const [statusFilter, setStatusFilter] = useState("All Status")
  // Add sorting state if needed, e.g., { column: 'date', direction: 'desc' }

  const filteredAndSortedOrders = useMemo(() => {
    let processedOrders = [...allOrders]

    // Search
    if (searchTerm) {
      processedOrders = processedOrders.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Payment Filter
    if (paymentFilter !== "All Payments") {
      processedOrders = processedOrders.filter((order) => order.paymentStatus === paymentFilter)
    }

    // Status Filter
    if (statusFilter !== "All Status") {
      processedOrders = processedOrders.filter((order) => order.fulfillmentStatus === statusFilter)
    }

    // Sorting (example: by date descending)
    processedOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return processedOrders
  }, [allOrders, searchTerm, paymentFilter, statusFilter])

  const totalPages = Math.ceil(filteredAndSortedOrders.length / ITEMS_PER_PAGE)
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE
    return filteredAndSortedOrders.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, filteredAndSortedOrders])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handlePaymentFilterChange = (value: string) => {
    setPaymentFilter(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const viewOrderDetails = (order: Order) => {
    // In a real app, this might open a modal or navigate to an order detail page
    toast({
      title: `Order Details: ${order.id}`,
      description: `Customer: ${order.customerName}, Total: $${order.totalAmount.toFixed(2)}`,
    })
  }

  const getPaymentBadgeVariant = (status: OrderPaymentStatus) => {
    if (status === "Paid") return "default" // Greenish
    if (status === "Pending") return "secondary" // Yellowish
    if (status === "Failed") return "destructive" // Reddish
    return "outline"
  }

  const getFulfillmentBadgeVariant = (status: OrderFulfillmentStatus) => {
    if (status === "Delivered") return "default"
    if (status === "Shipped") return "default" // Could be different blue
    if (status === "Processing") return "secondary"
    if (status === "Cancelled") return "destructive"
    return "outline"
  }

  // Stats based on all orders
  const totalOrdersCount = allOrders.length
  const processingCount = allOrders.filter((o) => o.fulfillmentStatus === "Processing").length
  const pendingPaymentsCount = allOrders.filter((o) => o.paymentStatus === "Pending").length
  const totalRevenue = allOrders.filter((o) => o.paymentStatus === "Paid").reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-brand-text-dark">Manage Orders</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Orders" value={String(totalOrdersCount)} icon={PackageCheck} />
        <StatCard title="Processing" value={String(processingCount)} icon={Clock} />
        <StatCard title="Pending Payments" value={String(pendingPaymentsCount)} icon={AlertCircle} />
        <StatCard title="Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} />
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
            {currentTableData.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
            {currentTableData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.customerEmail}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.items.length} item(s)</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={getPaymentBadgeVariant(order.paymentStatus)}
                    className={
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : order.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : order.paymentStatus === "Failed"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : ""
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getFulfillmentBadgeVariant(order.fulfillmentStatus)}
                    className={
                      order.fulfillmentStatus === "Delivered"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : order.fulfillmentStatus === "Shipped"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : order.fulfillmentStatus === "Processing"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : order.fulfillmentStatus === "Cancelled"
                              ? "bg-red-100 text-red-700 border-red-200"
                              : ""
                    }
                  >
                    {order.fulfillmentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      {/* Add other actions like 'Update Status', 'Refund', etc. */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <EnhancedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={filteredAndSortedOrders.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}
