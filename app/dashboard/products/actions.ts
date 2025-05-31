"use server"

import { revalidatePath } from "next/cache"
import { type Product, mockProducts } from "./types" // Assuming types.ts is in the same directory

// In a real app, this would interact with a database
let productsStore: Product[] = [...mockProducts]

export async function getProducts(
  page = 1,
  limit = 5,
  searchTerm?: string,
  categoryFilter?: string,
  statusFilter?: string,
): Promise<{ products: Product[]; totalCount: number; totalPages: number }> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  let filteredProducts = productsStore

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }
  if (categoryFilter && categoryFilter !== "All") {
    filteredProducts = filteredProducts.filter((p) => p.category === categoryFilter)
  }
  if (statusFilter && statusFilter !== "All Status") {
    filteredProducts = filteredProducts.filter((p) => p.status === statusFilter)
  }

  const totalCount = filteredProducts.length
  const totalPages = Math.ceil(totalCount / limit)
  const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit)

  return { products: paginatedProducts, totalCount, totalPages }
}

export async function addProductAction(
  productData: Omit<Product, "id" | "sales" | "revenue">,
): Promise<{ success: boolean; message: string; product?: Product }> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const newId = `SM${String(productsStore.length + 1).padStart(3, "0")}`
  const newProduct: Product = {
    ...productData,
    id: newId,
    sales: 0, // New products start with 0 sales
    revenue: 0, // New products start with 0 revenue
    thumbnailUrl:
      productData.thumbnailUrl || `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(productData.name)}`, // Default placeholder
  }
  productsStore.unshift(newProduct) // Add to the beginning
  revalidatePath("/dashboard/products")
  return { success: true, message: "Product added successfully!", product: newProduct }
}

export async function updateProductAction(
  productId: string,
  productData: Partial<Product>,
): Promise<{ success: boolean; message: string; product?: Product }> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const productIndex = productsStore.findIndex((p) => p.id === productId)
  if (productIndex === -1) {
    return { success: false, message: "Product not found." }
  }
  productsStore[productIndex] = { ...productsStore[productIndex], ...productData }
  revalidatePath("/dashboard/products")
  return { success: true, message: "Product updated successfully!", product: productsStore[productIndex] }
}

export async function deleteProductAction(productId: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const initialLength = productsStore.length
  productsStore = productsStore.filter((p) => p.id !== productId)
  if (productsStore.length === initialLength) {
    return { success: false, message: "Product not found or already deleted." }
  }
  revalidatePath("/dashboard/products")
  return { success: true, message: "Product deleted successfully!" }
}
