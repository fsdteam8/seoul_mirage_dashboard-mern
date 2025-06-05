export interface Category {
    id: string
    imageUrl?: string // Optional image URL for the category
    name: string
    description?: string
    type: string
    productCount: number // Number of products associated with this category
    created_at: string // Should be Date in a real app
    updated_at: string // Should be Date in a real app
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
      type: "essence",
      created_at: generateRandomDate(new Date(2023, 0, 1), new Date()),
      updated_at: generateRandomDate(new Date(2023, 6, 1), new Date()),
    },
    {
      id: "CAT002",
      name: "Cleansers",
      description: "Gentle and effective cleansers for all skin types.",
      productCount: 3,
      type: "essence",
      created_at: generateRandomDate(new Date(2023, 1, 1), new Date()),
      updated_at: generateRandomDate(new Date(2023, 7, 1), new Date()),
    },
    {
      id: "CAT003",
      name: "Makeup",
      description: "Cosmetics for enhancing beauty.",
      productCount: 10,
      type: "essence",
      created_at: generateRandomDate(new Date(2023, 2, 1), new Date()),
      updated_at: generateRandomDate(new Date(2023, 8, 1), new Date()),
    },
    {
      id: "CAT004",
      name: "Suncare",
      description: "Protection against harmful UV rays.",
      productCount: 4,
      type: "essence",
      created_at: generateRandomDate(new Date(2023, 3, 1), new Date()),
      updated_at: generateRandomDate(new Date(2023, 9, 1), new Date()),
    },
    {
      id: "CAT005",
      name: "Masks",
      type: "essence",
      description: "Intensive treatments for various skin needs.",
      productCount: 7,
      created_at: generateRandomDate(new Date(2023, 4, 1), new Date()),
      updated_at: generateRandomDate(new Date(2023, 10, 1), new Date()),
    },
    // Add more for pagination
    {
      id: "CAT006",
      name: "Eye Care",
      type: "grooming",
      description: "Specialized products for the delicate eye area.",
      productCount: 3,
      created_at: generateRandomDate(new Date(2023, 0, 15), new Date()),
      updated_at: generateRandomDate(new Date(2023, 6, 15), new Date()),
    },
    {
      id: "CAT007",
      name: "Body Care",
      type: "treatment",
      description: "Nourishing and hydrating products for the body.",
      productCount: 6,
      created_at: generateRandomDate(new Date(2023, 1, 10), new Date()),
      updated_at: generateRandomDate(new Date(2023, 7, 10), new Date()),
    },
    {
      id: "CAT008",
      name: "Serums",
      type: "resurfacing",
      description: "Potent formulations with active ingredients.",
      productCount: 8,
      created_at: generateRandomDate(new Date(2023, 2, 5), new Date()),
      updated_at: generateRandomDate(new Date(2023, 8, 5), new Date()),
    },
    {
      id: "CAT009",
      name: "Toners",
      type: "face",
      description: "Balancing and prepping solutions for the skin.",
      productCount: 4,
      created_at: generateRandomDate(new Date(2023, 3, 20), new Date()),
      updated_at: generateRandomDate(new Date(2023, 9, 20), new Date()),
    },
    {
      id: "CAT010",
      name: "Moisturizers",
      type: "deep",
      description: "Hydrating creams and lotions for daily use.",
      productCount: 9,
      created_at: generateRandomDate(new Date(2023, 4, 25), new Date()),
      updated_at: generateRandomDate(new Date(2023, 10, 25), new Date()),
    },
  ]
  