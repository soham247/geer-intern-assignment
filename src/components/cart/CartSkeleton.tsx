import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
    return (
        <Card className="bg-white">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    {/* Product Image Skeleton */}
                    <Skeleton className="flex-shrink-0 w-20 h-20 rounded-md" />

                    {/* Product Details Skeleton */}
                    <div className="flex-grow space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-5 w-20" />
                    </div>

                    {/* Quantity Controls Skeleton */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-10" />
                    </div>

                    {/* Subtotal Skeleton */}
                    <div className="flex-shrink-0 text-right space-y-1">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-20" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function CartSkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <CartSkeleton key={index} />
            ))}
        </div>
    );
}