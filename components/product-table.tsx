/* eslint-disable react-hooks/exhaustive-deps */
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
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

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

  const handleEditProduct = (product: Product) => {
    setProductToEdit(product);
    setIsSheetOpen(true);
  };

  const handleAddProduct = () => {
    setProductToEdit(null); // Ensure no product is being edited
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
  const totalRevenue = mockProducts.reduce((sum, p) => sum + p.revenue, 0);

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
                      src={product.thumbnailUrl || "/placeholder.svg"}
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
                  <TableCell>${product.revenue.toLocaleString()}</TableCell>
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
                          onClick={() => handleEditProduct(product)}
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

        <div className="flex items-center justify-between border-t px-6 py-4">
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
            {/* Simple page number display, can be enhanced */}
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
      </div>

    

      <AddProductSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        productToEdit={productToEdit}
      />
    </div>
  );
}
