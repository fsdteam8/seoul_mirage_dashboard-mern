"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import Image from "next/image";
import { Product, ProductApiResponse } from "@/types/ProductDataType";
import AlertModal from "./ui/alert-modal";

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
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

interface ProductStatsApiResponse {
  totalProducts: number;
  lowStock: number;
  outOfStock: number;
  revenue: number;
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

export function ProductTable() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [productFilter, setProductFilter] = useState("regular");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const { toast } = useToast();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null | number>(null);
  const session = useSession();
  const token = session?.data?.accessToken ?? "";

  // Debounce search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch products from your API
  const {
    data,
    error,
    isLoading: queryLoading,
    refetch,
  } = useQuery<ProductApiResponse>({
    queryKey: [
      "products",
      currentPage,
      debouncedSearchTerm,
      categoryFilter,
      statusFilter,
      productFilter
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        ...(categoryFilter !== "All" && { category: categoryFilter }),
        ...(statusFilter !== "All Status" && { status: statusFilter }),
        ...(productFilter !== "All Status" && { arrival_status: productFilter }),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
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

  const {
    data: productStats,
    error: productStatsError,
    isLoading: productStatsLoading,
  } = useQuery<ProductStatsApiResponse>({
    queryKey: ["productStats", currentPage, debouncedSearchTerm],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/stats`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch product stats");
      return res.json();
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handelSetProductStatus = (value: string) => {
    setProductFilter(value);
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
    mutationFn: async (productId: string) => {
      console.log(productId)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
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
      setIsModalOpen(false);
      refetch();
    },
    onError: (error: Error) => {
      console.log(error)
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (productId: string) => {
    console.log(productId)
    setProductIdToDelete(productId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productIdToDelete !== null) {
      mutationDelete.mutate(String(productIdToDelete));
      setProductIdToDelete(null);

    }
  };

  const handleProduct = () => {
    setProductToEdit(null);
    setIsSheetOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsSheetOpen(true);
    setProductToEdit(product);
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

  const {
    data: allCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<string[]>({
    queryKey: ["allCategories"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?paginate_count=60`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }

      const json = await res.json();
      return json.data.data.map((cat: { name: string }) => cat.name);
    },
  });


  // const categories = Array.from(new Set(products.map((p) => p?.category?.name)));

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
        {productStatsError ? (
          <div className="md:col-span-2 lg:col-span-4 flex items-start gap-2 p-3 rounded-md bg-red-100 text-red-700 text-sm font-medium">
            <AlertTriangle className="w-4 h-4 mt-[2px]" />
            <span>{productStatsError.message}</span>
          </div>
        ) : productStatsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 border rounded-xl shadow-sm space-y-3 animate-pulse"
            >
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Total Products"
              value={
                productStatsLoading
                  ? "Loading..."
                  : productStatsError
                    ? "N/A"
                    : String(productStats?.totalProducts ?? 0)
              }
              icon={Package}
            />
            <StatCard
              title="Low Stock"
              value={
                productStatsLoading
                  ? "Loading..."
                  : productStatsError
                    ? "N/A"
                    : String(productStats?.lowStock ?? 0)
              }
              icon={AlertTriangle}
            />
            <StatCard
              title="Out of Stock"
              value={
                productStatsLoading
                  ? "Loading..."
                  : productStatsError
                    ? "N/A"
                    : String(productStats?.outOfStock ?? 0)
              }
              icon={PackageX}
            />
            <StatCard
              title="Total Value"
              value={
                productStatsLoading
                  ? "Loading..."
                  : productStatsError
                    ? "N/A"
                    : String(productStats?.revenue ?? 0)
              }
              icon={TrendingUp}
            />
          </>
        )}
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

        {/* <Select value={categoryFilter} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((cat, i) => (
              <SelectItem key={i} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}

        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categoriesLoading ? (
              <SelectItem disabled value="loading">Loading...</SelectItem>
            ) : categoriesError ? (
              <SelectItem disabled value="error">Failed to load</SelectItem>
            ) : (
              allCategories && allCategories?.map((cat, i) => (
                <SelectItem key={i} value={cat}>
                  {cat}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        <Select value={productFilter} onValueChange={handelSetProductStatus}>
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="Regular" />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="All">Regular OR Coming</SelectItem> */}
            <SelectItem value={"regular"}>Regular</SelectItem>
            <SelectItem value={"coming_soon"}>Coming Soon</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-[49px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Status">All Status</SelectItem>
            {/* <SelectItem value="active">Active</SelectItem> */}
            <SelectItem value="low_stock">Low Stock</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            {/* <SelectItem value="available">Inactive</SelectItem> */}
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
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-16" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
            {!queryLoading && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
            {!queryLoading &&
              products.map((product, i) => (
                <TableRow key={product?.id}>
                  <TableCell className="font-medium">{i + 1}</TableCell>
                  <TableCell>
                    <Image
                      src={
                        product?.media?.length > 0
                          ? product?.media[0]?.file_path
                          : product?.image || "/placeholder.svg?height=40&width=40"
                      }
                      alt={product?.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {product?.name}
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate text-gray-600">
                    {product?.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product?.category?.name}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(product?.price)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatPrice(product?.cost_price)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${product?.stock_quantity < 10
                        ? "text-red-600"
                        : product?.stock_quantity < 50
                          ? "text-yellow-600"
                          : "text-green-600"
                        }`}
                    >
                      {product?.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(product?.status)}
                      className={
                        product?.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700 hover:border-green-200 cursor-default"
                          : product?.status === "low_stock"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100 hover:text-yellow-700 hover:border-yellow-200 cursor-default"
                            : product?.status === "out_of_stock"
                              ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-200 cursor-default"
                              : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-200 cursor-default"
                      }
                    >
                      {getStatusDisplay(product?.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(product?.createdAt)}
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
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(String(product?.id))}
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

        {data && data?.data.pagination.last_page > 1 && (
          <EnhancedPagination
            currentPage={data?.data.pagination.current_page}
            totalPages={data?.data.pagination.last_page}
            totalCount={data?.data.pagination.total}
            itemsPerPage={data?.data.pagination.per_page}
            isLoading={queryLoading}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AlertModal
        title="Are you sure you want to delete this Product?"
        message="This action cannot be undone."
        loading={mutationDelete.isPending}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <AddProductSheet
        productToEdit={productToEdit}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}
