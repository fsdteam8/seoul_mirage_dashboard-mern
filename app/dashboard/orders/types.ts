export type OrderPaymentStatus = "paid" | "pending" | "failed"
export type OrderFulfillmentStatus = "Delivered" | "Processing" | "Shipped" | "Cancelled"

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  date: string // Should be Date object in real app, string for simplicity
  items: OrderItem[] // Simplified to a placeholder string in Figma, but let's make it more real
  totalAmount: number
  paymentStatus: OrderPaymentStatus
  fulfillmentStatus: OrderFulfillmentStatus
}

const generateRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return `${date.getMonth() + 1}/${date.getDate()}/${String(date.getFullYear()).slice(-2)}`
}

const generateRandomItems = (): OrderItem[] => {
  const itemCount = Math.floor(Math.random() * 3) + 1
  const items: OrderItem[] = []
  for (let i = 0; i < itemCount; i++) {
    items.push({
      id: `P00${Math.floor(Math.random() * 10) + 1}`,
      name: `Product ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`, // Product A-E
      quantity: Math.floor(Math.random() * 3) + 1,
      price: Math.floor(Math.random() * 50) + 20,
    })
  }
  return items
}

export const mockOrders: Order[] = Array.from({ length: 25 }, (_, i) => {
  const items = generateRandomItems()
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const paymentStatuses: OrderPaymentStatus[] = ["paid", "pending", "failed"]
  const fulfillmentStatuses: OrderFulfillmentStatus[] = ["Delivered", "Processing", "Shipped", "Cancelled"]
  return {
    id: `ORD-${String(10001 + i).padStart(5, "0")}`,
    customerName: `Customer ${String.fromCharCode(65 + (i % 26))}${i + 1}`, // Customer A1, B2, etc.
    customerEmail: `customer${i + 1}@example.com`,
    date: generateRandomDate(new Date(2023, 0, 1), new Date()),
    items: items,
    totalAmount: totalAmount,
    paymentStatus: paymentStatuses[i % paymentStatuses.length],
    fulfillmentStatus: fulfillmentStatuses[i % fulfillmentStatuses.length],
  }
})

export const orderPaymentStatuses: OrderPaymentStatus[] =["paid", "pending", "failed"]
export const orderFulfillmentStatuses: OrderFulfillmentStatus[] = ["Delivered", "Processing", "Shipped", "Cancelled"]
