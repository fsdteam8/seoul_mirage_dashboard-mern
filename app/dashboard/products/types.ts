export type ProductStatus =
  | "Active"
  | "Out of Stock"
  | "Low Stock"
  | "Archived";

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  costPrice?: number;
  stock: number;
  description?: string;
  tags?: string[];
  vendor?: string;
  status: ProductStatus;
  sales?: number;
  revenue?: number;
  // images can be a single string or an array of strings
  images?: string[]; // <-- add this
}
export const mockProducts: Product[] = [
  {
    id: "SM001",
    images: ["/images/dashboardlistImage.png"],
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
    images: ["/images/dashboardlistImage.png"],
    name: "Gentle Cleanser",
    category: "Cleansers",
    price: 50,
    stock: 0,
    sales: 450,
    revenue: 22500,
    status: "Out of Stock",
    description:
      "A gentle cleanser that removes impurities without stripping moisture.",
    tags: ["cleansing", "gentle"],
    vendor: "Mirage Beauty",
  },
  {
    id: "SM003",
    images: ["/images/dashboardlistImage.png"],
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
    images: ["/images/dashboardlistImage.png"],
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
    images: ["/images/dashboardlistImage.png"],
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
    images: ["/images/dashboardlistImage.png"],
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
    images: ["/images/dashboardlistImage.png"],
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
    images: ["/images/dashboardlistImage.png"],
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
    images: ["/images/dashboardlistImage.png"],
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
    images: ["/images/dashboardlistImage.png"],
    name: "Repairing Night Cream",
    category: "Moisturizers",
    price: 75,
    stock: 12,
    sales: 90,
    revenue: 6750,
    status: "Active",
  },
];

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
];
export const productStatuses: ProductStatus[] = [
  "Active",
  "Low Stock",
  "Out of Stock",
  "Archived",
];
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
];
