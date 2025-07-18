"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  UserPlus,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { customerStatuses } from "@/app/dashboard/customers/types";
import { StatCard } from "@/components/stat-card";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { CustomerApiResponse } from "@/types/CustomerDataType";
import { Skeleton } from "./ui/skeleton";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const session = useSession();
  const token = session?.data?.accessToken ?? "";

  const { data, isLoading,isError } = useQuery<CustomerApiResponse>({
    queryKey: ["customers", currentPage, searchTerm, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());

      if (searchTerm.trim()) {
        params.set("search", searchTerm);
      }

      if (statusFilter !== "All Status") {
        params.set("status", statusFilter);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch customers");
      return res.json();
    },
  });
// console.log(data?.stats)
  // const {
  //   data: statch,
  //   error: statchError,
  //   isLoading: statchLoading,
  // } = useQuery({
  //   queryKey: ["customerStats"],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/api/customers-stats`
  //     );
  //     if (!res.ok) throw new Error("Failed to fetch stats");
  //     return res.json();
  //   },
  // });

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
        <StatCard
          title="Total Customers"
          value={
            isLoading
              ? "Loading..."
              : isError
              ? "N/A"
              : String(data?.data?.stats?.totalCustomers ?? 0)
          }
          icon={Users}
        />
        <StatCard
          title="New Customers"
          value={
            isLoading
              ? "Loading..."
              : isError
              ? "N/A"
              : String(data?.data?.stats?.new_customers ?? 0)
          }
          icon={UserPlus}
          description="(Last 30 days)"
        />
        <StatCard
          title="Avg. Order Value"
          value={
            isLoading
              ? "Loading..."
              : isError
              ? "N/A"
              : `$${Number(data?.data?.stats?.averageOrderValue ?? 0).toFixed(3)}`
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
              <TableHead>Namew</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Full Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Postal Code</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Total Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array.from({ length: 11 }).map((_, i) => (
                      <TableCell key={i}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : customerData?.data?.length
              ? customerData?.data?.map((customer,i) => (
                  <TableRow key={customer?._id}>
                    <TableCell className="text-center">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      {customer?.name}
                    </TableCell>
                    <TableCell>{customer?.email}</TableCell>
                    <TableCell>{customer?.phone}</TableCell>
                    <TableCell className="text-center">
                      {customer?.orders_count}
                    </TableCell>
                    <TableCell>{customer?.full_address}</TableCell>
                    <TableCell>{customer?.city}</TableCell>
                    <TableCell>{customer?.state}</TableCell>
                    <TableCell className="text-center">
                      {customer?.postal_code}
                    </TableCell>
                    <TableCell>{customer?.country}</TableCell>
                    <TableCell className="text-center">
                      {customer?.orders_sum_total}
                    </TableCell>
                  </TableRow>
                ))
              : !isLoading && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center h-24">
                      No customers found.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>

        {data && data.data.pagination.last_page > 1 && (
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
