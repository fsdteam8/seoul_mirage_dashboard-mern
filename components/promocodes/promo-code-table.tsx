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
// import { Badge } from "@/components/ui/badge";
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
  // CheckCircle,
  // XCircle,
  Clock,
  Gift,
  DollarSign,
  EyeOff,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  // type PromoCode,
  type PromoCodeStatus,
  promoCodeStatuses,
  // getEffectivePromoCodeStatus,
} from "@/app/dashboard/promocodes/types";
// import { togglePromoCodeStatusAction } from "@/app/dashboard/promocodes/actions";
import { useToast } from "@/hooks/use-toast";
import { AddPromoCodeSheet } from "./add-promo-code-sheet";
import { StatCard } from "@/components/stat-card";
// import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { PromoCode, PromoCodeResponse } from "@/types/PromocodeDataType";
import { Skeleton } from "../ui/skeleton";
// import { Badge } from "../ui/badge";

// const ITEMS_PER_PAGE = 10;

// Enhanced Pagination Component
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
          disabled={currentPage === 1 || isLoading}
          className="h-9 px-3 text-sm"
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

        {/* Next button */}
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
  // const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  // const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PromoCodeStatus | "All">(
    "All"
  );
  // const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [promoCodeToEdit, setPromoCodeToEdit] = useState<PromoCode | null>(
    null
  );

  const { data, isLoading, error } = useQuery<PromoCodeResponse>({
    queryKey: ["promocodes", currentPage, searchTerm],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/promocodes?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        throw new Error("Failed to fetch blogs");
      }
      return res.json();
    },
  });

  const promoCode = data?.data?.data || [];

  // const fetchPromoCodesData = () => {
  //   startTransition(async () => {
  //     const data = await getPromoCodes(
  //       currentPage,
  //       ITEMS_PER_PAGE,
  //       searchTerm,
  //       statusFilter
  //     );
  //     setPromoCodes(promoCode);
  //     setTotalPages(data.totalPages);
  //     setTotalCount(data.totalCount);
  //   });
  // };

  // useEffect(() => {
  //   fetchPromoCodesData();
  // }, [currentPage, searchTerm, statusFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: PromoCodeStatus | "All") => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // const handleToggleStatus = async (promoCode: PromoCode) => {
  //   startTransition(async () => {
  //     const newStatus = !promoCode.isActive;
  //     const result = await togglePromoCodeStatusAction(promoCode.id, newStatus);
  //     if (result.success) {
  //       toast({ title: "Status Updated", description: result.message });
  //       fetchPromoCodesData();
  //     } else {
  //       toast({
  //         title: "Error",
  //         description: result.message,
  //         variant: "destructive",
  //       });
  //     }
  //   });
  // };

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

  // const getStatusBadgeVariant = (status: PromoCodeStatus) => {
  //   switch (status) {
  //     case "Active":
  //       return "default"; // Greenish
  //     case "Inactive":
  //       return "outline"; // Grayish
  //     case "Expired":
  //       return "secondary"; // Yellowish/Orangeish
  //     case "Fully Used":
  //       return "destructive"; // Reddish
  //     default:
  //       return "outline";
  //   }
  // };

  // const getStatusIcon = (status: PromoCodeStatus) => {
  //   switch (status) {
  //     case "Active":
  //       return <CheckCircle className="h-4 w-4 text-green-600" />;
  //     case "Inactive":
  //       return <EyeOff className="h-4 w-4 text-gray-500" />;
  //     case "Expired":
  //       return <Clock className="h-4 w-4 text-orange-500" />;
  //     case "Fully Used":
  //       return <XCircle className="h-4 w-4 text-red-600" />;
  //     default:
  //       return null;
  //   }
  // };

  // Simulated stats - in a real app, these would come from backend aggregates
  // const activeCodesCount = promoCode.filter(
  //   (pc) => getEffectivePromoCodeStatus(pc) === "Active"
  // ).length;
  // const totalRedeemedValue = promoCode.reduce((sum, pc) => {
  //   if (pc.type === "fixed") return sum + pc.timesUsed * pc.discountValue;
  //   // For percentage, this is harder to calculate without knowing order values.
  //   // Let's simulate an average order value of $50 for percentage discounts.
  //   if (pc.type === "percentage")
  //     return sum + pc.timesUsed * (50 * (pc.discountValue / 100));
  //   return sum;
  // }, 0);

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Active Codes" value={String(10)} icon={Gift} />
        <StatCard
          title="Total Redeemed Value"
          value={String(20)}
          icon={DollarSign}
          description="(Simulated)"
        />
        <StatCard
          title="Codes Expiring Soon"
          value={"N/A"}
          icon={Clock}
          description="(Feature TBD)"
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
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            {promoCodeStatuses.map((stat) => (
              <SelectItem key={stat} value={stat}>
                {stat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              {/* <TableHead>Discount</TableHead> */}
              <TableHead>Usage</TableHead>
              <TableHead>Min. Purchase</TableHead>
              {/* <TableHead>Expires</TableHead> */}
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
                    {/* <TableCell><Skeleton className="h-4 w-20" /></TableCell> */}
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
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))}
            {error && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Sorry Try Again
                </TableCell>
              </TableRow>
            )}
            {!isLoading && promoCode.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No promo codes found.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              promoCode.map((pc) => {
                // const effectiveStatus = pc;
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
                    {/* <TableCell>
                      {pc.discountType === "percentage"
                        ? `${pc.discountValue}% `
                        : `$${pc.discountValue.toFixed(2)}`}
                    </TableCell> */}
                    <TableCell>{pc.usage_limit}</TableCell>
                    <TableCell>{pc.amount}</TableCell>
                    {/* <TableCell>
                      {pc.expiryDate
                        ? format(new Date(pc.expiryDate), "MMM dd, yyyy")
                        : "Never"}
                    </TableCell> */}
                    {/* <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(pc.status)}
                        className="flex items-center gap-1 capitalize"
                      >
                        {getStatusIcon(pc.status)}
                        {pc.status.replace(/([A-Z])/g, " $1").trim()}
                      </Badge>
                    </TableCell> */}
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
                          <DropdownMenuItem
                          // onClick={() => handleToggleStatus(pc)}
                          >
                            {pc.status == "active" ? (
                              <EyeOff className="mr-2 h-4 w-4" />
                            ) : (
                              <Eye className="mr-2 h-4 w-4" />
                            )}
                            {pc.status == "Deactivate"
                              ? "Deactivate"
                              : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        {/* Enhanced Pagination */}
        {data && data.total_pages > 1 && (
          <EnhancedPagination
            currentPage={data?.current_page}
            totalPages={data?.total_pages}
            totalCount={data?.total}
            itemsPerPage={data?.per_page}
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
