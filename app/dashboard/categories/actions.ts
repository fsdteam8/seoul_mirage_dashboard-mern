"use server"

import { revalidatePath } from "next/cache"
import { type Category, mockCategories } from "./types"

let categoriesStore: Category[] = [...mockCategories]

export async function getCategories(
  page = 1,
  limit = 5,
  searchTerm?: string,
): Promise<{ categories: Category[]; totalCount: number; totalPages: number }> {
  await new Promise((resolve) => setTimeout(resolve, 300)) // Simulate network delay

  let filteredCategories = categoriesStore

  if (searchTerm) {
    filteredCategories = filteredCategories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }

  // Sort by name for consistency
  filteredCategories.sort((a, b) => a.name.localeCompare(b.name))

  const totalCount = filteredCategories.length
  const totalPages = Math.ceil(totalCount / limit)
  const paginatedCategories = filteredCategories.slice((page - 1) * limit, page * limit)

  return { categories: paginatedCategories, totalCount, totalPages }
}

export async function addCategoryAction(
  categoryData: Omit<Category, "id" | "productCount" | "createdAt" | "updatedAt">,
): Promise<{ success: boolean; message: string; category?: Category }> {
  await new Promise((resolve) => setTimeout(resolve, 700))
  const newId = `CAT${String(categoriesStore.length + 101).padStart(3, "0")}` // Ensure unique IDs
  const currentDate = new Date().toISOString().split("T")[0]
  const newCategory: Category = {
    ...categoryData,
    id: newId,
    productCount: 0, // New categories start with 0 products
    created_at: currentDate,
    updated_at: currentDate,
  }
  categoriesStore.unshift(newCategory)
  revalidatePath("/dashboard/categories")
  revalidatePath("/dashboard/products") // If product form uses categories
  return { success: true, message: "Category added successfully!", category: newCategory }
}

export async function updateCategoryAction(
  categoryId: string,
  categoryData: Partial<Omit<Category, "id" | "productCount" | "createdAt" | "updatedAt">>,
): Promise<{ success: boolean; message: string; category?: Category }> {
  await new Promise((resolve) => setTimeout(resolve, 700))
  const categoryIndex = categoriesStore.findIndex((cat) => cat.id === categoryId)
  if (categoryIndex === -1) {
    return { success: false, message: "Category not found." }
  }
  const currentDate = new Date().toISOString().split("T")[0]
  categoriesStore[categoryIndex] = {
    ...categoriesStore[categoryIndex],
    ...categoryData,
     updated_at: currentDate,
  }
  revalidatePath("/dashboard/categories")
  revalidatePath("/dashboard/products") // If product form uses categories
  return { success: true, message: "Category updated successfully!", category: categoriesStore[categoryIndex] }
}

export async function deleteCategoryAction(categoryId: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 700))
  const initialLength = categoriesStore.length
  // Basic check: prevent deletion if products are associated. Real app needs robust check.
  const category = categoriesStore.find((cat) => cat.id === categoryId)
  if (category && category.productCount > 0) {
    return {
      success: false,
      message: `Cannot delete category "${category.name}" as it has ${category.productCount} associated products.`,
    }
  }

  categoriesStore = categoriesStore.filter((cat) => cat.id !== categoryId)
  if (categoriesStore.length === initialLength && category?.productCount === 0) {
    // only if no products and still not found
    return { success: false, message: "Category not found or already deleted." }
  }
  if (category?.productCount === 0) {
    revalidatePath("/dashboard/categories")
    revalidatePath("/dashboard/products")
    return { success: true, message: "Category deleted successfully!" }
  }
  // If we reached here, it means productCount > 0 and deletion was blocked
  return { success: false, message: `Deletion prevented for category with products.` }
}
