"use client";

import type React from "react";
import { useState } from "react";
// import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import // DropdownMenu,
// DropdownMenuContent,
// DropdownMenuItem,
// DropdownMenuTrigger,
"@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  // MoreHorizontal,
  Search,
  Users,
  UserPlus,
  DollarSign,
  // Eye,
  // Edit3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  // type Customer,
  // mockCustomers,
  customerStatuses,
} from "@/app/dashboard/customers/types";
import { StatCard } from "@/components/stat-card";
// import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CustomerApiResponse } from "@/types/CustomerDataType";
import { Skeleton } from "./ui/skeleton";

// const ITEMS_PER_PAGE = 10;

// Enhanced Pagination Component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

function EnhancedPagination({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      // Adjust if we're near the beginning or end
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
      {/* Results count */}
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
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
                currentPage === pageNum
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "hover:bg-gray-50"
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
  );
}

export function CustomerTable() {
  // const { toast } = useToast();
  // const [allCustomers] = useState<Customer[]>(mockCustomers);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const session = useSession();
  const token = session?.data?.accessToken ?? {};

  const { data, error, isLoading } = useQuery<CustomerApiResponse>({
    queryKey: ["orders", currentPage, searchTerm],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
  });

  const {
    data: statch,
    error: statchError,
    isLoading: statchLoading,
  } = useQuery({
    queryKey: ["coustomerStats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers-stats`
      );
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  console.log(statch);

  const customerData = data?.data;



  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };



  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-brand-text-dark">
        Manage Customers
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Customers"   value={
            statchLoading
              ? "Loading..."
              : statchError
              ? "N/A"
              : String(statch?.totalCustomers ?? 0)
          } icon={Users} />
        <StatCard
          title="New Customers"
          value={
            statchLoading
              ? "Loading..."
              : statchError
              ? "N/A"
              : String(statch?.new_customers ?? 0)
          }
          icon={UserPlus}
          description="(Last 30 days)"
        />
        {/* <StatCard title="Inactive" value={String(statch?.new_customers)} icon={UserX} /> */}
        <StatCard
          title="Avg. Order Value"
          value={
            statchLoading
              ? "Loading..."
              : statchError
              ? "N/A"
              : String(statch?.averageOrderValue ?? 0)
          }
          icon={DollarSign}
        />
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
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Full Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Postal Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Total Spent</TableHead>
              {/* <TableHead>Last Active</TableHead> */}
              {/* <TableHead>Status</TableHead> */}
              {/* <TableHead>Action</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerData?.data.length === 0 ||
              (error && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No customers found.
                  </TableCell>
                </TableRow>
              ))}
            {isLoading &&
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={`skeleton-customer-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-5" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-5 rounded-full" />
                  </TableCell>
                </TableRow>
              ))}
            {customerData?.data.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium text-center">
                  {customer.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {customer.full_name} {customer.last_name}
                  </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell className="text-center">
                  {customer.orders_count}
                </TableCell>
                <TableCell>{customer.full_address}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>{customer.state}</TableCell>
                <TableCell className="text-center">
                  {customer.postal_code}
                </TableCell>
                <TableCell>{customer.country}</TableCell>
                <TableCell className="text-center">{customer.orders_sum_total}</TableCell>
                {/* <TableCell>
                  <Badge
                    variant={getStatusBadgeVariant("Active")}
                    className={
                      "Active" === "Active"
                        ? "bg-[#B3E9C9] text-[#033618] border-green-200 rounded-full"
                        : "bg-[#FEF9C3] text-[#954D0E] border-gray-200 rounded-full"
                    }
                  >
                    {"Active"}
                  </Badge>
                </TableCell> */}
                {/* <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger> */}
                {/* <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => viewCustomerDetails(customer)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem> */}
                {/* <DropdownMenuItem
                        onClick={() => editCustomerDetails(customer)}
                      >
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem> */}
                {/* </DropdownMenuContent> */}
                {/* </DropdownMenu>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Enhanced Pagination */}
        {data && data?.total_pages > 1 && (
          <EnhancedPagination
            currentPage={data.current_page}
            totalPages={data.total_pages}
            totalCount={data.total}
            itemsPerPage={data.per_page}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}
