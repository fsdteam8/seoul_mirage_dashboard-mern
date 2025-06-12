"use client";

import type React from "react";
import { useState, useEffect } from "react";
// import Image from "next/image";
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
import { useToast } from "@/hooks/use-toast";
import { AddProductSheet } from "./add-product-sheet";
import { StatCard } from "@/components/stat-card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import { useSession } from "next-auth/react";

const ITEMS_PER_PAGE = 5;

// Updated Product interface to match your API response
interface Product {
  id: string | number; // Assuming ID can be string or number
  name: string;
  description: string;
  image: string;
  price: string;
  category_id: number;
  status: "active" | "inactive" | "low_stock" | "out_of_stock";
  cost_price: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  media: unknown[]; // Replace 'unknown' with a specific Media type if available
  category: {
    id: string | number; // Assuming category ID can be string or number
    name: string;
  };
}

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
          className="h-9 w-9 text-sm"
        >
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export function ProductTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const session = useSession();
  const token = session?.data?.accessToken ?? {};
  // Fetch products from your API
  const {
    data,
    error,
    isLoading: queryLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "products",
      currentPage,
      searchTerm,
      categoryFilter,
      statusFilter,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== "All" && { category: categoryFilter }),
        ...(statusFilter !== "All Status" && { status: statusFilter }),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      return res.json();
    },
  });

  const products: Product[] = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};

  // Update pagination info when data changes
  useEffect(() => {
    if (pagination) {
      setTotalPages(pagination.last_page || 1);
      setTotalCount(pagination.total || 0);
    }
  }, [pagination]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
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

  // Handle product deletion
  const mutationDelete = useMutation({
    mutationFn: async (productId: number) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
            // Don't set Content-Type - let browser set it for FormData
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Product deleted successfully",
        description: "The product has been removed from your inventory.",
      });
      refetch(); // Refresh the product list
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteProduct = async (productId: number) => {
    mutationDelete.mutate(productId);
  };

  const handleProduct = () => {
    setProductToEdit(null); // Clear any existing product to edit
    setIsSheetOpen(true);
  };
  const handleEditProduct = (product: Product) => {
    setIsSheetOpen(true);
    setProductToEdit(product);
    // You can pass the product data to the sheet if needed
  };
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "low_stock":
        return "secondary";
      case "out_of_stock":
        return "destructive";
      case "inactive":
        return "outline";
      default:
        return "default";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Active";
      case "low_stock":
        return "Low Stock";
      case "out_of_stock":
        return "Out of Stock";
      case "inactive":
        return "Inactive";
      default:
        return status;
    }
  };

  const formatPrice = (price: string | number) => {
    return `$${Number.parseFloat(price.toString()).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate stats
  const totalProductsCount = totalCount;
  const lowStockCount = products.filter((p) => p.status === "low_stock").length;
  const outOfStockCount = products.filter(
    (p) => p.status === "out_of_stock"
  ).length;
  const totalValue = products.reduce(
    (sum, p) => sum + Number.parseFloat(p.price) * p.stock_quantity,
    0
  );

  // Get unique categories for filter
  const categories = Array.from(new Set(products.map((p) => p.category.name)));

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading products</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-brand-text-dark">
          Manage Products
        </h2>
        <Button
          onClick={handleProduct}
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
          title="Total Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={TrendingUp}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 border border-[#E4E4E7] h-[99px] px-6 rounded-[15px]">
        <div className="relative w-full sm:w-auto sm:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Search products..."
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
            {categories.map((cat) => (
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table className="border-none">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Cost Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queryLoading && (
              <TableBody>
                {Array(ITEMS_PER_PAGE)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      <TableCell>
                        <Skeleton className="h-4 w-10" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-10 w-10 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[120px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[40px]" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            )}
            {!queryLoading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
            {!queryLoading &&
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">#{product.id}</TableCell>
                  <TableCell>
                    {/* <Image
                      src={
                        `${process.env.NEXT_PUBLIC_API_URL}/${product.image}` || "/placeholder.svg?height=40&width=40"
                      }
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    /> */}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {product.name}
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate text-gray-600">
                    {product.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category.name}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatPrice(product.cost_price)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        product.stock_quantity < 10
                          ? "text-red-600"
                          : product.stock_quantity < 50
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(product.status)}
                      className={
                        product.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : product.status === "low_stock"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : product.status === "out_of_stock"
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {getStatusDisplay(product.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(product.created_at)}
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
                        {/* <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteProduct(Number(product.id))
                          }
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

        {totalPages > 1 && (
          <EnhancedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            itemsPerPage={ITEMS_PER_PAGE}
            isLoading={queryLoading}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AddProductSheet
        productToEdit={productToEdit}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
