
/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import type React from "react"
import { useState, useEffect, useTransition } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
} from "lucide-react"
import type { Category } from "@/app/dashboard/categories/types"
import { getCategories, deleteCategoryAction } from "@/app/dashboard/categories/actions"
import { useToast } from "@/hooks/use-toast"
import { AddCategorySheet } from "./add-category-sheet"
import { StatCard } from "@/components/stat-card"

const ITEMS_PER_PAGE = 5

// Enhanced Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  totalCount: number
  itemsPerPage: number
  isLoading?: boolean
  onPageChange: (page: number) => void
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
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, currentPage + 2)

      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        end = Math.min(5, totalPages)
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - 4)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalCount)

  return (
    <div className="flex items-center justify-between border-t bg-white px-6 py-4">
      {/* Results count */}
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{" "}
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
                currentPage === pageNum ? "bg-gray-900 text-white hover:bg-gray-800" : "hover:bg-gray-50"
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
  )
}

export function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, startTransition] = useTransition()
  const { toast } = useToast()

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null)

  const fetchCategoriesData = () => {
    startTransition(async () => {
      const data = await getCategories(currentPage, ITEMS_PER_PAGE, searchTerm)
      setCategories(data.categories)
      setTotalPages(data.totalPages)
      setTotalCount(data.totalCount)
    })
  }

  useEffect(() => {
    fetchCategoriesData()
  }, [currentPage, searchTerm])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"? This action cannot be undone.`))
      return
    startTransition(async () => {
      const result = await deleteCategoryAction(categoryId)
      if (result.success) {
        toast({ title: "Category Deleted", description: result.message })
        fetchCategoriesData() // Refresh data
      } else {
        toast({
          title: "Error Deleting Category",
          description: result.message,
          variant: "destructive",
        })
      }
    })
  }

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category)
    setIsSheetOpen(true)
  }

  const handleAddCategory = () => {
    setCategoryToEdit(null)
    setIsSheetOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-brand-text-dark">Manage Categories</h2>
        <Button onClick={handleAddCategory} className="bg-brand-black text-brand-white hover:bg-brand-black/80">
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
            totalCount > 0 ? (categories.reduce((sum, cat) => sum + cat.productCount, 0) / totalCount).toFixed(1) : "0"
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
                    <TableCell colSpan={8} className="h-16 text-center">
                      Loading categories...
                    </TableCell>
                  </TableRow>
                ))}
            {!isLoading && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
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
                  <TableCell className="text-sm text-gray-600">{category.type}</TableCell>
                  <TableCell className="text-center">{category.productCount}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCategory(category.id, category.name)}
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

      <AddCategorySheet isOpen={isSheetOpen} onOpenChange={setIsSheetOpen} categoryToEdit={categoryToEdit} />
    </div>
  )
}
