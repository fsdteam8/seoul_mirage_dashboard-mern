

"use client"

import type React from "react"
import { useState, useMemo } from "react"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MoreHorizontal,
  Search,
  Users,
  UserPlus,
  UserX,
  DollarSign,
  Eye,
  Edit3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { type Customer, type CustomerStatus, mockCustomers, customerStatuses } from "@/app/dashboard/customers/types"
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
          className="h-9 px-3 text-sm"
        >
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

export function CustomerTable() {
  const { toast } = useToast()
  const [allCustomers] = useState<Customer[]>(mockCustomers)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredAndSortedCustomers = useMemo(() => {
    let processedCustomers = [...allCustomers]

    if (searchTerm) {
      processedCustomers = processedCustomers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "All Status") {
      processedCustomers = processedCustomers.filter((customer) => customer.status === statusFilter)
    }

    // Example sorting: by name alphabetically
    processedCustomers.sort((a, b) => a.name.localeCompare(b.name))

    return processedCustomers
  }, [allCustomers, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / ITEMS_PER_PAGE)
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE
    return filteredAndSortedCustomers.slice(firstPageIndex, lastPageIndex)
  }, [currentPage, filteredAndSortedCustomers])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const viewCustomerDetails = (customer: Customer) => {
    toast({
      title: `Customer Details: ${customer.name}`,
      description: `Email: ${customer.email}, Total Spent: $${customer.totalSpent.toFixed(2)}`,
    })
  }

  const editCustomerDetails = (customer: Customer) => {
    toast({
      title: `Edit Customer: ${customer.name}`,
      description: `(Edit functionality not implemented yet)`,
    })
  }

  const getStatusBadgeVariant = (status: CustomerStatus) => {
    return status === "Active" ? "default" : "secondary" // Active: Greenish, Inactive: Yellowish/Grayish
  }

  // Stats
  const totalCustomersCount = allCustomers.length
  // For "New Customers", we'd need a "joinDate" or similar. Let's simulate.
  const newCustomersCount = allCustomers.filter(
    (c) => new Date(c.lastActive) > new Date(new Date().setMonth(new Date().getMonth() - 1)),
  ).length
  const inactiveCount = allCustomers.filter((c) => c.status === "Inactive").length
  const avgOrderValue =
    allCustomers.length > 0
      ? allCustomers.reduce((sum, c) => sum + c.totalSpent, 0) / allCustomers.reduce((sum, c) => sum + c.orderCount, 0)
      : 0

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-brand-text-dark">Manage Customers</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Customers" value={String(totalCustomersCount)} icon={Users} />
        <StatCard
          title="New Customers"
          value={String(newCustomersCount)}
          icon={UserPlus}
          description="(Last 30 days)"
        />
        <StatCard title="Inactive" value={String(inactiveCount)} icon={UserX} />
        <StatCard title="Avg. Order Value" value={`$${avgOrderValue.toFixed(2)}`} icon={DollarSign} />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 border p-6 rounded-[15px]">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 w-[265px] h-[49px]"
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Status">All Status</SelectItem>
            {customerStatuses.map((cs) => (
              <SelectItem key={cs} value={cs}>
                {cs}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTableData.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
            {currentTableData.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        customer.avatarUrl ||
                        `/placeholder.svg?height=32&width=32&query=${customer.name || "/placeholder.svg"}`
                      }
                      alt={customer.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    {customer.name}
                  </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.orderCount}</TableCell>
                <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                <TableCell>{customer.lastActive}</TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant(customer.status)}
                    className={
                      customer.status === "Active"
                        ? "bg-[#B3E9C9] text-[#033618] border-green-200 rounded-full"
                        : "bg-[#FEF9C3] text-[#954D0E] border-gray-200 rounded-full"
                    }
                  >
                    {customer.status}
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
                      <DropdownMenuItem onClick={() => viewCustomerDetails(customer)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => editCustomerDetails(customer)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
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
            totalCount={filteredAndSortedCustomers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  )
}
