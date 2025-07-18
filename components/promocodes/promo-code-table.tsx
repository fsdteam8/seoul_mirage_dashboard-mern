/* eslint-disable react-hooks/exhaustive-deps */
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  Edit2,
  PlusCircle,
  Copy,
  Clock,
  Gift,
  DollarSign,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  type PromoCodeStatus,
  promoCodeStatuses,
} from "@/app/dashboard/promocodes/types";
import { useToast } from "@/hooks/use-toast";
import { AddPromoCodeSheet } from "./add-promo-code-sheet";
import { StatCard } from "@/components/stat-card";
import { useQuery } from "@tanstack/react-query";
import { PromoCode, PromoCodeResponse } from "@/types/PromocodeDataType";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

function EnhancedPagination({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  isLoading = false,
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
          disabled={currentPage === 1 || isLoading}
          className="h-9 px-3 text-sm"
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
              disabled={isLoading}
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
          disabled={currentPage === totalPages || isLoading}
          className="h-9 px-3 text-sm"
        >
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export function PromoCodeTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PromoCodeStatus | "All">(
    "All"
  );
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [promoCodeToEdit, setPromoCodeToEdit] = useState<PromoCode | null>(
    null
  );

  const { data, isLoading, error } = useQuery<PromoCodeResponse>({
    queryKey: ["promocodes", currentPage, searchTerm, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", String(currentPage));
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "All") params.append("status", statusFilter);

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/promocodes?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch promo codes");
      return res.json();
    },
  });

  const {
    data: promostats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["promocodeStats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/promocodes/stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch promo code stats");
      return res.json();
    },
  });

  const promoCode = data?.data?.data || [];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as PromoCodeStatus | "All");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditPromoCode = (promoCode: PromoCode) => {
    setPromoCodeToEdit(promoCode);
    setIsSheetOpen(true);
  };

  const handleAddPromoCode = () => {
    setPromoCodeToEdit(null);
    setIsSheetOpen(true);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `"${text}" copied to clipboard.` });
  };

  // Normalize status and map to badge variant
  const getStatusBadgeVariant = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "active":
        return "default";
      case "inactive":
        return "outline";
      case "expired":
        return "secondary";
      case "fully used":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "inactive":
        return <EyeOff className="h-4 w-4 text-gray-500" />;
      case "expired":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "fully used":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const statusLabels: Record<string, string> = {
    active: "Active",
    inactive: "Inactive",
    expired: "Expired",
    "fully used": "Fully Used",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-brand-text-dark">
          Manage Promo Codes
        </h2>
        <Button
          onClick={handleAddPromoCode}
          className="bg-brand-black text-brand-white hover:bg-brand-black/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Promo Code
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <StatCard
          title="Active Codes"
          value={
            statsLoading
              ? "Loading..."
              : statsError
              ? "N/A"
              : String(promostats?.active ?? 0)
          }
          icon={Gift}
        />
        <StatCard
          title="Inactive Codes"
          value={
            statsLoading
              ? "Loading..."
              : statsError
              ? "N/A"
              : String(promostats?.inactive ?? 0)
          }
          icon={DollarSign}
          description="(Simulated)"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border rounded-[15px]">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search by code or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 w-[256px] h-[49px]"
          />
        </div>
        <Select
          value={String(statusFilter)}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            {promoCodeStatuses.map((stat) => (
              <SelectItem key={String(stat)} value={String(stat)}>
                {String(stat)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-red-100 text-red-700 text-sm font-medium">
          <XCircle className="w-4 h-4 mt-[2px]" />
          <span>{error.message}</span>
        </div>
      )}

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Min. Purchase</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array(10)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-promo-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && promoCode.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No promo codes found.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              promoCode.map((pc) => {
                const normalizedStatus = pc.status.toLowerCase();
                return (
                  <TableRow key={pc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{pc.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyToClipboard(pc.name)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 max-w-[200px] truncate">
                      {pc.description || "-"}
                    </TableCell>
                    <TableCell>{pc.usage_limit}</TableCell>
                    <TableCell>
                      {pc.amount}
                      {pc.type === "percentage" ? "%" : ""}
                    </TableCell>
                    <TableCell>{pc.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(pc.status)}
                        className="flex items-center gap-1 capitalize"
                      >
                        {getStatusIcon(pc.status)}
                        {statusLabels[normalizedStatus] ?? pc.status}
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
                          <DropdownMenuItem
                            onClick={() => handleEditPromoCode(pc)}
                          >
                            <Edit2 className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {/* Additional menu items if needed */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        {data && data?.data?.pagination?.last_page > 1 && (
          <EnhancedPagination
            currentPage={data?.data?.pagination?.current_page}
            totalPages={data?.data.pagination.last_page}
            totalCount={data?.data.pagination.total}
            itemsPerPage={data?.data.pagination.per_page}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AddPromoCodeSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        promoCodeToEdit={promoCodeToEdit}
      />
    </div>
  );
}
