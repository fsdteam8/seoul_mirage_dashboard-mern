import { CategoryTable } from "@/components/categories/category-table"
import { Suspense } from "react"

export default function ManageCategoriesPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading category management...</div>}>
      <CategoryTable />
    </Suspense>
  )
}
