
import dynamic from "next/dynamic"
const OrderTable = dynamic(() => import("@/components/order-table"),{
  ssr: false
})
export default function ManageOrdersPage() {
  return <OrderTable />
}
