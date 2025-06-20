import { Skeleton } from "@/components/ui/skeleton"

function ProductCardSkeleton() {
  return (
    <div className='border rounded-lg p-3 bg-white shadow-sm'>
      <div className='relative w-full aspect-square mb-2'>
        <Skeleton className="w-full h-full rounded" />
        <Skeleton className="absolute top-2 right-2 w-10 h-10 rounded-full" />
      </div>

      <Skeleton className="h-4 w-3/4 mb-1" />
      
      <Skeleton className="h-5 w-16 mb-2" />
    </div>
  )
}

export default ProductCardSkeleton