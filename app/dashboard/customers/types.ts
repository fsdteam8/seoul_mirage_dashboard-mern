export type CustomerStatus = "Active" | "Inactive"

export interface Customer {
  id: string
  name: string
  email: string
  orderCount: number
  totalSpent: number
  lastActive: string // Should be Date object in real app
  status: CustomerStatus
  avatarUrl?: string
}

const generateRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(-2)}`
}

export const mockCustomers: Customer[] = Array.from({ length: 30 }, (_, i) => ({
  id: `CUST-${String(20001 + i).padStart(5, "0")}`,
  name: `User ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
  email: `user${i + 1}@example.com`,
  orderCount: Math.floor(Math.random() * 20) + 1,
  totalSpent: Number.parseFloat((Math.random() * 500 + 50).toFixed(2)),
  lastActive: generateRandomDate(new Date(2022, 0, 1), new Date()),
  status: i % 4 === 0 ? "Inactive" : "Active", // Make some inactive
   avatarUrl: `/images/dashboardlistImage.png`, 
}))

export const customerStatuses: CustomerStatus[] = ["Active", "Inactive"]
