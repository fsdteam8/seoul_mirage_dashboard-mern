export type ProductStatus = "Active" | "Out of Stock" | "Low Stock" | "Archived"

export interface Product {
  id: string
  thumbnailUrl: string
  name: string
  category: string
  price: number
  costPrice?: number // Added from form
  stock: number
  sales: number
  revenue: number
  status: ProductStatus
  description?: string // Added from form
  tags?: string[] // Added from form
  vendor?: string // Added from form
}

export const mockProducts: Product[] = [
  {
    id: "SM001",
    thumbnailUrl: "/placeholder.svg?height=40&width=40",
    name: "Hydrating Essence",
    category: "Essences",
    price: 65,
    stock: 5,
    sales: 254,
    revenue: 16510,
    status: "Low Stock",
    description: "A deeply hydrating essence for all skin types.",
    tags: ["hydrating", "skincare"],
    vendor: "Seoul Labs",
  },
  {
    id: "SM002",
    thumbnailUrl: "/placeholder.svg?height=40&width=40",
    name: "Gentle Cleanser",
    category: "Cleansers",
    price: 50,
    stock: 0,
    sales: 450,
    revenue: 22500,
    status: "Out of Stock",
    description: "A gentle cleanser that removes impurities without stripping moisture.",
    tags: ["cleansing", "gentle"],
    vendor: "Mirage Beauty",
  },
  {
    id: "SM003",
    thumbnailUrl: "/placeholder.svg?height=40&width=40",
    name: "Velvet Lipstick",
    category: "Makeup",
    price: 30,
    stock: 50,
    sales: 150,
    revenue: 4500,
    status: "Active",
    description: "A long-lasting velvet matte lipstick.",
    tags: ["makeup", "lipstick", "matte"],
    vendor: "Seoul Labs",
  },
  {
    id: "SM004",
    thumbnailUrl: "/placeholder.svg?height=40&width=40",
    name: "Daily Sunscreen SPF50",
    category: "Suncare",
    price: 45,
    stock: 25,
    sales: 300,
    revenue: 13500,
    status: "Active",
  },
  {
    id: "SM005",
    thumbnailUrl: "/placeholder.svg?height=40&width=40",
    name: "Brightening Sheet Mask",
    category: "Masks",
    price: 15,
    stock: 8,
    sales: 500,
    revenue: 7500,
    status: "Low Stock",
  },
  // Add more products to test pagination
  {
    id: "SM006",
    thumbnailUrl: "/placeholder.svg?height=40&width=40",
    name: "Revitalizing Eye Cream",
    category: "Eye Care",
    price: 55,
    stock: 15,
    sales: 120,
    revenue: 6600,
    status: "Active",
  },
  {
    id: "SM007",
    thumbnailUrl: "/placeholder.svg?height=40&width=40",
    name: "Nourishing Body Lotion",
    category: "Body Care",
    price: 40,
    stock: 0,
    sales: 200,
    revenue: 8000,
    status: "Out of Stock",
  },
  {
    id: "SM008",
    thumbnailUrl: "/placeholder.svg?height=40&width=40",
    name: "Vitamin C Serum",
    category: "Serums",
    price: 70,
    stock: 30,
    sales: 180,
    revenue: 12600,
    status: "Active",
  },
  {
    id: "SM009",
    thumbnailUrl: "/placeholder.svg?height=40&width=40",
    name: "Balancing Toner",
    category: "Toners",
    price: 35,
    stock: 3,
    sales: 220,
    revenue: 7700,
    status: "Low Stock",
  },
  {
    id: "SM010",
    thumbnailUrl: "/placeholder.svg?height=40&width=40",
    name: "Repairing Night Cream",
    category: "Moisturizers",
    price: 75,
    stock: 12,
    sales: 90,
    revenue: 6750,
    status: "Active",
  },
]

export const productCategories = [
  "Essences",
  "Cleansers",
  "Makeup",
  "Suncare",
  "Masks",
  "Eye Care",
  "Body Care",
  "Serums",
  "Toners",
  "Moisturizers",
]
export const productStatuses: ProductStatus[] = ["Active", "Low Stock", "Out of Stock", "Archived"]
export const productTags = [
  "hydrating",
  "skincare",
  "cleansing",
  "gentle",
  "makeup",
  "lipstick",
  "matte",
  "brightening",
  "anti-aging",
  "vegan",
]
