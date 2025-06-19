import { ProductTable } from "@/components/product-table";
import { Suspense } from "react";

export default function ManageProductsPage() {
  return (
    // Suspense can be used here if ProductTable fetches data on its own initially
    // or if parts of it are server components. For client-side fetching, it's less critical at this level.
    <Suspense
      fallback={
        <div className="text-center p-8">Loading product management...</div>
      }
    >
      <ProductTable/>
    </Suspense>
  );
}
