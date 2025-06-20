"use client"
import { useWishlist } from '@/store/useWishlist'
import { useQueries } from '@tanstack/react-query'
import React from 'react'
import { Heart } from 'lucide-react'
import ProductCard from '@/components/products/cards/ProductCard'
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'

function WishlistPage() {
    const { items, getTotalItems, hasHydrated } = useWishlist()
    
    const fetchItem = async (slug: string) => {
        try {
            const res = await fetch(`/api/products/${slug}`)
            if (!res.ok) throw new Error("Error fetching item")
            return res.json()
        } catch {
            throw new Error("Error fetching item")
        }
    }

    const productQueries = useQueries({
        queries: items.map(slug => ({
            queryKey: ["wishlist-item", slug],
            queryFn: () => fetchItem(slug),
            enabled: !!slug && hasHydrated
        }))
    })

    const isLoading = productQueries.some(query => query.isLoading)
    
    if (!hasHydrated) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card className="bg-white">
                    <CardContent className="text-center py-12">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-foreground mb-2">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mb-6">Save your favorite items to your wishlist and shop them later!</p>
                        <Link href="/products" className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-lg">
                            Continue Shopping
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
                <div className="text-sm text-muted-foreground">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: items.length }).map((_, index) => (
                            <div key={index} className="border rounded-lg p-3 bg-white shadow-sm animate-pulse">
                                <div className="w-full aspect-square bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="h-5 bg-gray-200 rounded w-20"></div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && (
                <div className="mb-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {productQueries.map((query, index) => {
                            const slug = items[index]
                            if (!slug || !query.data) return null

                            return (
                                <ProductCard
                                    key={slug}
                                    product={query.data}
                                />
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default WishlistPage