export type DiscountType = "percentage" | "fixed"
export type PromoCodeStatus = "Active" | "Inactive" | "Expired" | "Fully Used"

export interface PromoCode {
  id: string
  code: string
  description?: string
  discountType: DiscountType
  discountValue: number
  minPurchaseAmount?: number
  expiryDate?: string // ISO string date YYYY-MM-DD
  usageLimit?: number // 0 or undefined for unlimited
  timesUsed: number
  isActive: boolean // Admin can toggle this
  createdAt: string
  updatedAt: string
}

const generateRandomDate = (start: Date, end: Date, includeTime = false): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  if (includeTime) return date.toISOString()
  return date.toISOString().split("T")[0]
}

const generateRandomCode = (length = 8): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const mockPromoCodes: PromoCode[] = [
  {
    id: "PC001",
    code: "SUMMER20",
    description: "20% off for summer sale",
    discountType: "percentage",
    discountValue: 20,
    minPurchaseAmount: 50,
    expiryDate: generateRandomDate(new Date(), new Date(new Date().setDate(new Date().getDate() + 30))),
    usageLimit: 100,
    timesUsed: 25,
    isActive: true,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  },
  {
    id: "PC002",
    code: "SAVE10NOW",
    description: "$10 off on first order",
    discountType: "fixed",
    discountValue: 10,
    expiryDate: undefined, // No expiry
    usageLimit: 1, // Single use per customer (logic not fully implemented in mock)
    timesUsed: 0,
    isActive: true,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  },
  {
    id: "PC003",
    code: "EXPIREDCODE",
    description: "An old expired code",
    discountType: "percentage",
    discountValue: 15,
    expiryDate: generateRandomDate(
      new Date(new Date().setDate(new Date().getDate() - 60)),
      new Date(new Date().setDate(new Date().getDate() - 30)),
    ), // Expired
    usageLimit: 50,
    timesUsed: 40,
    isActive: true, // Still active but expiry date has passed
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  },
  {
    id: "PC004",
    code: "FULLYUSED",
    description: "A code that has reached its usage limit",
    discountType: "fixed",
    discountValue: 5,
    usageLimit: 10,
    timesUsed: 10,
    isActive: true,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  },
  {
    id: "PC005",
    code: "INACTIVEPROMO",
    description: "A manually deactivated promo",
    discountType: "percentage",
    discountValue: 25,
    isActive: false,
    timesUsed: 5,
    usageLimit: 200,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  },
  // Add more for pagination
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `PC${String(100 + i).padStart(3, "0")}`,
    code: generateRandomCode(),
    description: `Random promo code ${i + 1}`,
    discountType: i % 2 === 0 ? ("percentage" as DiscountType) : ("fixed" as DiscountType),
    discountValue: i % 2 === 0 ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 15) + 5,
    minPurchaseAmount: i % 3 === 0 ? Math.floor(Math.random() * 50) + 20 : undefined,
    expiryDate:
      i % 4 !== 0 ? generateRandomDate(new Date(), new Date(new Date().setDate(new Date().getDate() + 90))) : undefined,
    usageLimit: i % 2 === 0 ? Math.floor(Math.random() * 100) + 50 : undefined,
    timesUsed: Math.floor(Math.random() * 40),
    isActive: i % 5 !== 0,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  })),
]

export const promoCodeStatuses: PromoCodeStatus[] = ["Active", "Inactive", "Expired", "Fully Used"]
export const discountTypes: DiscountType[] = ["percentage", "fixed"]

// Helper to determine the actual status based on isActive, expiryDate, and usage
export const getEffectivePromoCodeStatus = (promo: PromoCode): PromoCodeStatus => {
  if (!promo.isActive) return "Inactive"
  if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) return "Expired"
  if (promo.usageLimit && promo.timesUsed >= promo.usageLimit) return "Fully Used"
  return "Active"
}