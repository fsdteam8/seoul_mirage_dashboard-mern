/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type React from "react";
import { useState, useEffect, useTransition } from "react";
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
} from "lucide-react";
import type { Category } from "@/app/dashboard/categories/types";
import {
  getCategories,
  deleteCategoryAction,
} from "@/app/dashboard/categories/actions";
import { useToast } from "@/hooks/use-toast";
import { AddCategorySheet } from "./add-category-sheet";
import { StatCard } from "@/components/stat-card";

const ITEMS_PER_PAGE = 5;

export function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const fetchCategoriesData = () => {
    startTransition(async () => {
      const data = await getCategories(currentPage, ITEMS_PER_PAGE, searchTerm);
      setCategories(data.categories);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    });
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [currentPage, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDeleteCategory = async (
    categoryId: string,
    categoryName: string
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`
      )
    )
      return;
    startTransition(async () => {
      const result = await deleteCategoryAction(categoryId);
      if (result.success) {
        toast({ title: "Category Deleted", description: result.message });
        fetchCategoriesData(); // Refresh data
      } else {
        toast({
          title: "Error Deleting Category",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsSheetOpen(true);
  };

  const handleAddCategory = () => {
    setCategoryToEdit(null);
    setIsSheetOpen(true);
  };

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
          value={String(totalCount)}
          icon={ListChecks}
          description="All product categories"
        />
        <StatCard
          title="Avg. Products/Category"
          value={
            totalCount > 0
              ? (
                  categories.reduce((sum, cat) => sum + cat.productCount, 0) /
                  totalCount
                ).toFixed(1)
              : "0"
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
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Products</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array(ITEMS_PER_PAGE)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-cat-${index}`}>
                    <TableCell colSpan={7} className="h-16 text-center">
                      Loading categories...
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-gray-600">
                    {category.description?.slice(0, 30) || "-"}...
                    
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                      {category.type}
                    </TableCell>
                  <TableCell className="text-center">
                    {category.productCount}
                  </TableCell>
                  <TableCell>{category.createdAt}</TableCell>
                  <TableCell>{category.updatedAt}</TableCell>
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
                          onClick={() =>
                            handleDeleteCategory(category.id, category.name)
                          }
                          className="text-red-600 hover:!text-red-600 hover:!bg-red-50"
                          disabled={category.productCount > 0} // Disable if products are associated
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
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span> results
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <span className="p-2 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      <AddCategorySheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
}
