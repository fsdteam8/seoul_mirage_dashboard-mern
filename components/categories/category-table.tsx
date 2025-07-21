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
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Search,
  Edit2,
  Trash2,
  PlusCircle,
  Package,
  ListChecks,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddCategorySheet } from "./add-category-sheet";
import { StatCard } from "@/components/stat-card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { useSession } from "next-auth/react";
import { Category, PaginatedCategoryResponse } from "@/types/CategoryDataType";
import AlertModal from "../ui/alert-modal";

const ITEMS_PER_PAGE = 5;

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
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      if (currentPage <= 3) end = Math.min(5, totalPages);
      else if (currentPage >= totalPages - 2)
        start = Math.max(1, totalPages - 4);
      for (let i = start; i <= end; i++) pages.push(i);
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
              disabled={isLoading}
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
          disabled={currentPage === totalPages || isLoading}
          className="h-9 w-9 text-sm"
        >
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export function CategoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const session = useSession();
  // interface SessionUser {
  //   token?: string;
  //   // add other user properties if needed
  // }
  const token = session.data?.accessToken || "";
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  );

  const { data, error, isLoading } = useQuery<PaginatedCategoryResponse>({
    queryKey: ["categories", currentPage, searchTerm],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL
        }/api/categories?page=${currentPage}&search=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const { data: categoryStats, isLoading: categoryStatsLoading, isError: categoryStatsError } = useQuery({
    queryKey: ["categoriesStats"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const categories = data?.data?.data;

  const mutationDelete = useMutation({
    mutationFn: async (categoryId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Category deleted successfully",
        description: "The category has been removed.",
      });
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (categoryId: string) => {
    setCategoryIdToDelete(categoryId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryIdToDelete) {
      mutationDelete.mutate(categoryIdToDelete);
      setCategoryIdToDelete(null);
    }
  };

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsSheetOpen(true);
  };

  const handleAddCategory = () => {
    setCategoryToEdit(null);
    setIsSheetOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);


  if (error)
    return (
      <p className="text-center text-red-500">Error loading categories.</p>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-brand-text-dark">
          Manage Categories
        </h2>
        <Button
          onClick={handleAddCategory}
          className="bg-brand-black text-brand-white hover:bg-brand-black/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Total Categories"
          value={
            categoryStatsLoading
              ? "Loading..."
              : categoryStatsError
                ? "N/A"
                : String(categoryStats?.totalCategories ?? 0)
          }
          icon={ListChecks}
          description="All product categories"
        />
        <StatCard
          title="Avg. Products/Category"
          value={
            categoryStatsLoading
              ? "Loading..."
              : categoryStatsError
                ? "N/A"
                : String(categoryStats?.averageProductsPerCategory ?? 0)
          }
          icon={Package}
          description="Average items per category"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 w-full h-[49px]"
          />
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              {/* <TableHead>Description</TableHead> */}
              <TableHead>Type</TableHead>
              {/* <TableHead>Created At</TableHead> */}
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array(ITEMS_PER_PAGE)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array(7)
                      .fill(0)
                      .map((__, i) => (
                        <TableCell key={i}>
                          <Skeleton className="h-4 w-10" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
            {!isLoading &&
              (categories ?? []).map((category, i) => (
                <TableRow key={category.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  {/* <TableCell className="max-w-xs truncate text-sm text-gray-600">
                    {category.description?.slice(0, 30) || "-"}...
                  </TableCell> */}
                  <TableCell className="text-sm text-gray-600">
                    {category.type}
                  </TableCell>
                  {/* <TableCell>{category.createdAt}</TableCell>
                  <TableCell>{category.updatedAt}</TableCell> */}
                  {/* <TableCell>
                    {new Date(category.createdAt).toLocaleString(undefined, {
                      month: "short",   // "Jul"
                      day: "2-digit",   // "18"
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,     // Shows AM/PM based on locale
                    })}
                  </TableCell> */}
                  <TableCell>
                    {new Date(category.updatedAt).toLocaleString(undefined, {
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">Category Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(String(category.id))}
                          className="text-red-600 hover:!text-red-600 hover:!bg-red-50"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {data && data.data.pagination.last_page > 1 && (
          <EnhancedPagination
            currentPage={data.data.pagination.current_page}
            totalPages={data.data.pagination.last_page}
            totalCount={data.data.pagination.total}
            itemsPerPage={data.data.pagination.per_page}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AlertModal
        title="Are you sure you want to delete this category?"
        message="This action cannot be undone."
        loading={mutationDelete.isPending}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <AddCategorySheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
}
