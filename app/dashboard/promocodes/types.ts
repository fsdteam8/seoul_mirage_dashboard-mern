// export type type = "percentage" | "fixed";
// export type PromoCodeStatus = string;

// export interface PromoCode {
//   id: string;
//   name: string;
//   description?: string;
//   type: type;
//   discountValue: number;
//   minPurchaseAmount?: number;
//   expiryDate?: string; // ISO string date YYYY-MM-DD
//   usage_limit?: number; // 0 or undefined for unlimited
//   timesUsed: number;
//   isActive?: boolean; // Admin can toggle this
//   createdAt: string;
//   status?:string
//   updatedAt: string;
//   amount: number;
// }

// const generateRandomDate = (
//   start: Date,
//   end: Date,
//   includeTime = false
// ): string => {
//   const date = new Date(
//     start.getTime() + Math.random() * (end.getTime() - start.getTime())
//   );
//   if (includeTime) return date.toISOString();
//   return date.toISOString().split("T")[0];
// };

// const generateRandomCode = (length = 8): string => {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   let result = "";
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// };

// export const mockPromoCodes: PromoCode[] = [
//   {
//     id: "PC001",
//     amount: 10,
//     name: "SUMMER20",
//     description: "20% off for summer sale",
//     type: "percentage",
//     discountValue: 20,
//     minPurchaseAmount: 50,
//     expiryDate: generateRandomDate(
//       new Date(),
//       new Date(new Date().setDate(new Date().getDate() + 30))
//     ),
//     usage_limit: 100,
//     timesUsed: 25,
//     isActive: true,
//     createdAt: generateRandomDate(
//       new Date(2023, 0, 1),
//       new Date(2023, 5, 1),
//       true
//     ),
//     updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
//   },
//   {
//     id: "PC002",
//     amount: 0,
//     name: "SAVE10NOW",
//     description: "$10 off on first order",
//     type: "fixed",
//     discountValue: 10,
//     expiryDate: undefined, // No expiry
//     usage_limit: 1, // Single use per customer (logic not fully implemented in mock)
//     timesUsed: 0,
//     isActive: true,
//     createdAt: generateRandomDate(
//       new Date(2023, 0, 1),
//       new Date(2023, 5, 1),
//       true
//     ),
//     updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
//   },
//   {
//     id: "PC003",
//     name: "EXPIREDCODE",
//     amount: 20,
//     description: "An old expired code",
//     type: "percentage",
//     discountValue: 15,
//     expiryDate: generateRandomDate(
//       new Date(new Date().setDate(new Date().getDate() - 60)),
//       new Date(new Date().setDate(new Date().getDate() - 30))
//     ), // Expired
//     usage_limit: 50,
//     timesUsed: 40,
//     isActive: true, // Still active but expiry date has passed
//     createdAt: generateRandomDate(
//       new Date(2023, 0, 1),
//       new Date(2023, 5, 1),
//       true
//     ),
//     updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
//   },
//   {
//     id: "PC004",
//     amount: 40,

//     name: "FULLYUSED",
//     description: "A code that has reached its usage limit",
//     type: "fixed",
//     discountValue: 5,
//     usage_limit: 10,
//     timesUsed: 10,
//     isActive: true,
//     createdAt: generateRandomDate(
//       new Date(2023, 0, 1),
//       new Date(2023, 5, 1),
//       true
//     ),
//     updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
//   },
//   {
//     id: "PC005",
//     amount: 50,
//     name: "INACTIVEPROMO",
//     description: "A manually deactivated promo",
//     type: "percentage",
//     discountValue: 25,
//     isActive: false,
//     timesUsed: 5,
//     usage_limit: 200,
//     createdAt: generateRandomDate(
//       new Date(2023, 0, 1),
//       new Date(2023, 5, 1),
//       true
//     ),
//     updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
//   },
//   // Add more for pagination
//   ...Array.from({ length: 10 }, (_, i) => ({
//     id: `PC${String(100 + i).padStart(3, "0")}`,
//     name: generateRandomCode(),
//     amount: 60,
//     description: `Random promo code ${i + 1}`,
//     type: i % 2 === 0 ? ("percentage" as type) : ("fixed" as type),
//     discountValue:
//       i % 2 === 0
//         ? Math.floor(Math.random() * 20) + 5
//         : Math.floor(Math.random() * 15) + 5,
//     minPurchaseAmount:
//       i % 3 === 0 ? Math.floor(Math.random() * 50) + 20 : undefined,
//     expiryDate:
//       i % 4 !== 0
//         ? generateRandomDate(
//             new Date(),
//             new Date(new Date().setDate(new Date().getDate() + 90))
//           )
//         : undefined,
//     usageLimit: i % 2 === 0 ? Math.floor(Math.random() * 100) + 50 : undefined,
//     timesUsed: Math.floor(Math.random() * 40),
//     isActive: i % 5 !== 0,
//     createdAt: generateRandomDate(
//       new Date(2023, 0, 1),
//       new Date(2023, 5, 1),
//       true
//     ),
//     updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
//   })),
// ];

// export const promoCodeStatuses: PromoCodeStatus[] = ["active", "inactive"];
// export const types: type[] = ["percentage", "fixed"];

// // Helper to determine the actual status based on isActive, expiryDate, and usage
// export const getEffectivePromoCodeStatus = (
//   promo: PromoCode
// ): PromoCodeStatus => {
//   if (!promo.isActive) return "inactive";
//   if (promo.expiryDate && new Date(promo.expiryDate) < new Date())
//     return "expired";
//   if (promo.usage_limit && promo.timesUsed >= promo.usage_limit)
//     return "Fully Used";
//   return "active";
// };
export type type = "percentage" | "fixed";
export type PromoCodeStatus = string;

export interface PromoCode {
  id: string;
  name: string;
  description?: string;
  type: type ;
  discountValue?: number;
  minPurchaseAmount?: number;
  expiryDate?: string; // ISO string date YYYY-MM-DD
  usage_limit?: number; // 0 or undefined for unlimited
  // timesUsed: number | string;
  isActive?: boolean; // Admin can toggle this
  createdAt: string;
  status?: string;
  updatedAt: string;
  amount: number;
}

const generateRandomDate = (start: Date, end: Date, includeTime = false): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return includeTime ? date.toISOString() : date.toISOString().split("T")[0];
};

const generateRandomCode = (length = 8): string => {
  const chars = "ABCDEFGHIJKLabcdefjhijklmnopqrstwxyzMNOPQRST@#%UVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const mockPromoCodes: PromoCode[] = [
  {
    id: "PC001",
    amount: 10,
    name: "SUMMER20",
    description: "20% off for summer sale",
    type: "percentage",
    discountValue: 20,
    minPurchaseAmount: 50,
    expiryDate: generateRandomDate(new Date(), new Date(new Date().setDate(new Date().getDate() + 30))),
    usage_limit: 100,
    // timesUsed: 25,
    isActive: true,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  },
  {
    id: "PC002",
    amount: 0,
    name: "SAVE10NOW",
    description: "$10 off on first order",
    type: "fixed",
    discountValue: 10,
    expiryDate: undefined,
    usage_limit: 1,
    // timesUsed: 0,
    isActive: true,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  },
  {
    id: "PC003",
    name: "EXPIREDCODE",
    amount: 20,
    description: "An old expired code",
    type: "percentage",
    discountValue: 15,
    expiryDate: generateRandomDate(new Date(new Date().setDate(new Date().getDate() - 60)), new Date(new Date().setDate(new Date().getDate() - 30))),
    usage_limit: 50,
    // timesUsed: 40,
    isActive: true,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  },
  {
    id: "PC004",
    amount: 40,
    name: "FULLYUSED",
    description: "A code that has reached its usage limit",
    type: "fixed",
    discountValue: 5,
    usage_limit: 10,
    // timesUsed: 10,
    isActive: true,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  },
  {
    id: "PC005",
    amount: 50,
    name: "INACTIVEPROMO",
    description: "A manually deactivated promo",
    type: "percentage",
    discountValue: 25,
    isActive: false,
    // timesUsed: 5,
    usage_limit: 200,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `PC${String(100 + i).padStart(3, "0")}`,
    name: generateRandomCode(),
    amount: 60,
    description: `Random promo code ${i + 1}`,
    type: i % 2 === 0 ? ("percentage" as type) : ("fixed" as type),
    discountValue: i % 2 === 0 ? Math.floor(Math.random() * 20) + 5 : Math.floor(Math.random() * 15) + 5,
    minPurchaseAmount: i % 3 === 0 ? Math.floor(Math.random() * 50) + 20 : undefined,
    expiryDate: i % 4 !== 0 ? generateRandomDate(new Date(), new Date(new Date().setDate(new Date().getDate() + 90))) : undefined,
    usage_limit: i % 2 === 0 ? Math.floor(Math.random() * 100) + 50 : undefined,
    timesUsed: Math.floor(Math.random() * 40),
    isActive: i % 5 !== 0,
    createdAt: generateRandomDate(new Date(2023, 0, 1), new Date(2023, 5, 1), true),
    updatedAt: generateRandomDate(new Date(2023, 5, 1), new Date(), true),
  })),
];

export const promoCodeStatuses: PromoCodeStatus[] = ["active", "inactive"];
export const types: type[] = ["percentage", "fixed"];

export const getEffectivePromoCodeStatus = (promo: PromoCode): PromoCodeStatus => {
  if (!promo.isActive) return "inactive";
  if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) return "expired";
  // if (promo.usage_limit && promo.timesUsed >= promo.usage_limit) return "Fully Used";
  return "active";
};
