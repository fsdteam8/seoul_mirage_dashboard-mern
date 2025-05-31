export interface Category {
    id: string
    name: string
    description?: string
    productCount: number // Number of products associated with this category
    createdAt: string // Should be Date in a real app
    updatedAt: string // Should be Date in a real app
  }
  
  const generateRandomDate = (start: Date, end: Date): string => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return date.toISOString().split("T")[0] // YYYY-MM-DD
  }
  
  export const mockCategories: Category[] = [
    {
      id: "CAT001",
      name: "Essences",
      description: "Concentrated formulas for targeted skin concerns.",
      productCount: 5,
      createdAt: generateRandomDate(new Date(2023, 0, 1), new Date()),
      updatedAt: generateRandomDate(new Date(2023, 6, 1), new Date()),
    },
    {
      id: "CAT002",
      name: "Cleansers",
      description: "Gentle and effective cleansers for all skin types.",
      productCount: 3,
      createdAt: generateRandomDate(new Date(2023, 1, 1), new Date()),
      updatedAt: generateRandomDate(new Date(2023, 7, 1), new Date()),
    },
    {
      id: "CAT003",
      name: "Makeup",
      description: "Cosmetics for enhancing beauty.",
      productCount: 10,
      createdAt: generateRandomDate(new Date(2023, 2, 1), new Date()),
      updatedAt: generateRandomDate(new Date(2023, 8, 1), new Date()),
    },
    {
      id: "CAT004",
      name: "Suncare",
      description: "Protection against harmful UV rays.",
      productCount: 4,
      createdAt: generateRandomDate(new Date(2023, 3, 1), new Date()),
      updatedAt: generateRandomDate(new Date(2023, 9, 1), new Date()),
    },
    {
      id: "CAT005",
      name: "Masks",
      description: "Intensive treatments for various skin needs.",
      productCount: 7,
      createdAt: generateRandomDate(new Date(2023, 4, 1), new Date()),
      updatedAt: generateRandomDate(new Date(2023, 10, 1), new Date()),
    },
    // Add more for pagination
    {
      id: "CAT006",
      name: "Eye Care",
      description: "Specialized products for the delicate eye area.",
      productCount: 3,
      createdAt: generateRandomDate(new Date(2023, 0, 15), new Date()),
      updatedAt: generateRandomDate(new Date(2023, 6, 15), new Date()),
    },
    {
      id: "CAT007",
      name: "Body Care",
      description: "Nourishing and hydrating products for the body.",
      productCount: 6,
      createdAt: generateRandomDate(new Date(2023, 1, 10), new Date()),
      updatedAt: generateRandomDate(new Date(2023, 7, 10), new Date()),
    },
    {
      id: "CAT008",
      name: "Serums",
      description: "Potent formulations with active ingredients.",
      productCount: 8,
      createdAt: generateRandomDate(new Date(2023, 2, 5), new Date()),
      updatedAt: generateRandomDate(new Date(2023, 8, 5), new Date()),
    },
    {
      id: "CAT009",
      name: "Toners",
      description: "Balancing and prepping solutions for the skin.",
      productCount: 4,
      createdAt: generateRandomDate(new Date(2023, 3, 20), new Date()),
      updatedAt: generateRandomDate(new Date(2023, 9, 20), new Date()),
    },
    {
      id: "CAT010",
      name: "Moisturizers",
      description: "Hydrating creams and lotions for daily use.",
      productCount: 9,
      createdAt: generateRandomDate(new Date(2023, 4, 25), new Date()),
      updatedAt: generateRandomDate(new Date(2023, 10, 25), new Date()),
    },
  ]
  