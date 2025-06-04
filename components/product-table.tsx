"use client";

import type React from "react";
import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
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
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  PackageX,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  type Product,
  type ProductStatus,
  mockProducts,
  productCategories,
  productStatuses,
} from "@/app/dashboard/products/types";
import {
  getProducts,
  deleteProductAction,
} from "@/app/dashboard/products/actions";
import { useToast } from "@/hooks/use-toast";
import { AddProductSheet } from "./add-product-sheet";
import { StatCard } from "@/components/stat-card";

const ITEMS_PER_PAGE = 5;

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
          className="h-9 w-9 text-sm"
        >
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isLoading, startTransition] = useTransition();
  const { toast } = useToast();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const fetchProductsData = () => {
    startTransition(async () => {
      const data = await getProducts(
        currentPage,
        ITEMS_PER_PAGE,
        searchTerm,
        categoryFilter,
        statusFilter
      );
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    });
  };

  useEffect(() => {
    fetchProductsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (result.success) {
        toast({ title: "Product Deleted", description: result.message });
        fetchProductsData(); // Refresh data
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  // const handleEditProduct = (product: Product) => {
  //   // setProductToEdit(product);
  //   setIsSheetOpen(true);
  // };

  const handleAddProduct = () => {
    // setProductToEdit(null); // Ensure no product is being edited
    setIsSheetOpen(true);
  };

  const getStatusBadgeVariant = (status: ProductStatus) => {
    switch (status) {
      case "Active":
        return "default"; // Greenish in figma
      case "Low Stock":
        return "secondary"; // Yellowish in figma
      case "Out of Stock":
        return "destructive"; // Reddish in figma
      case "Archived":
        return "outline";
      default:
        return "default";
    }
  };

  // Calculate stats based on all products (not just current page)
  // In a real app, these would be fetched from the backend or calculated on all client-side data if small enough
  const totalProductsCount = mockProducts.length; // Using mockProducts for overall stats
  const lowStockCount = mockProducts.filter(
    (p) => p.status === "Low Stock"
  ).length;
  const outOfStockCount = mockProducts.filter(
    (p) => p.status === "Out of Stock"
  ).length;
  const totalRevenue = mockProducts.reduce(
    (sum, p) => sum + (p.revenue ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-brand-text-dark">
          Manage Products
        </h2>
        <Button
          onClick={handleAddProduct}
          className="bg-brand-black text-brand-white hover:bg-brand-black/80 h-[40px]"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={String(totalProductsCount)}
          icon={Package}
        />
        <StatCard
          title="Low Stock"
          value={String(lowStockCount)}
          icon={AlertTriangle}
        />
        <StatCard
          title="Out of Stock"
          value={String(outOfStockCount)}
          icon={PackageX}
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 border border-[#E4E4E7] h-[99px] px-6 rounded-[15px]">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 w-[264px] h-[49px]"
          />
        </div>
        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {productCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Status">All Status</SelectItem>
            {productStatuses.map((stat) => (
              <SelectItem key={stat} value={stat}>
                {stat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table className="border-none">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Thumbnail</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array(ITEMS_PER_PAGE)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell colSpan={10} className="h-16 text-center">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    <Image
                      src={
                        Array.isArray(product.images)
                          ? product.images[0] ||
                            "/placeholder.svg?height=40&width=40&query=product"
                          : product.images ||
                            "/placeholder.svg?height=40&width=40&query=product"
                      }
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.sales}</TableCell>
                  <TableCell>
                    ${(product.revenue ?? 0).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(product.status)}
                      className={
                        product.status === "Active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : product.status === "Low Stock"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : product.status === "Out of Stock"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">Product Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                        // onClick={() => handleEditProduct(product)}
                        >
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
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

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <EnhancedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            itemsPerPage={ITEMS_PER_PAGE}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AddProductSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        // productToEdit={productToEdit}
      />
    </div>
  );
}
