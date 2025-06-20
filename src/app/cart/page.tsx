"use client"
import { useCart } from '@/store/useCart'
import { useQueries } from '@tanstack/react-query'
import React from 'react'
import { ShoppingCart } from 'lucide-react'
import CartProductCard from '@/components/cart/CartProductCard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CartSkeletonList } from '@/components/cart/CartSkeleton'
import Link from 'next/link'

function Cart() {
    const { items, clearCart, getTotalItems } = useCart()
    
    const fetchItems = async (slug: string) => {
        try {
            const res = await fetch(`/api/products/${slug}`)
            if (!res.ok) throw new Error("Error fetching items")
            return res.json()
        } catch {
            throw new Error("Error fetching items")
        }
    }

    const productQueries = useQueries({
        queries: items.map(item => ({
            queryKey: ["item", item.slug],
            queryFn: () => fetchItems(item.slug!),
            enabled: !!item.slug
        }))
    })

    const isLoading = productQueries.some(query => query.isLoading)
    
    // Calculate total price
    const totalPrice = productQueries.reduce((total, query, index) => {
        if (query.data?.price && items[index]) {
            return total + (query.data.price * items[index].quantity)
        }
        return total
    }, 0)

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card className="bg-white">
                    <CardContent className="text-center py-12">
                        <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-foreground mb-2">Your cart is empty</h2>
                        <p className="text-muted-foreground mb-6">Add some products to get started!</p>
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
                <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
                <div className="text-sm text-muted-foreground">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="mb-8">
                    <CartSkeletonList count={items.length} />
                </div>
            )}

            {/* Cart Items */}
            {!isLoading && (
                <div className="space-y-4 mb-8">
                    {productQueries.map((query, index) => {
                        const item = items[index]
                        if (!item) return null

                        return (
                            <CartProductCard
                                key={item.slug}
                                product={query.data}
                                slug={item.slug}
                                quantity={item.quantity}
                            />
                        )
                    })}
                </div>
            )}

            {/* Cart Summary */}
            <Card className="bg-white">
                <CardHeader>
                    <CardTitle className="text-xl text-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-medium text-foreground">Total Items:</span>
                        <span className="text-base font-medium text-foreground">{getTotalItems()}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-foreground">Total Price:</span>
                        <span className="text-lg md:text-xl font-bold text-foreground">₹{totalPrice.toFixed(2)}</span>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            variant="outline"
                            onClick={clearCart}
                            className="flex-1 bg-background text-foreground border-border hover:bg-muted"
                        >
                            Clear Cart
                        </Button>
                        <Button 
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            Proceed to Checkout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Cart