import { PromoCodeTable } from "@/components/promocodes/promo-code-table"
import { Suspense } from "react"

export default function ManagePromoCodesPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading promo code management...</div>}>
      <PromoCodeTable />
    </Suspense>
  )
}