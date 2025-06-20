import ProductCardSkeleton from "@/components/products/cards/ProductCardSkeleton";
import ProductListContent from "@/components/products/ProductListContent";
import { Suspense } from "react";


function ProductListFallback() {
  return (
    <div className="flex">
      {/* Sidebar skeleton for lg+ screens */}
      <div className="hidden lg:block w-64 bg-gray-50 animate-pulse h-screen"></div>
      
      <div className="flex-1 p-2 md:p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AllProductList() {
  return (
    <Suspense fallback={<ProductListFallback />}>
      <ProductListContent />
    </Suspense>
  );
}

export default AllProductList;