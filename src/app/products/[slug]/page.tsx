"use client"
import { Product } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Heart, Share2, Truck, Shield, Gem, RefreshCw, ShoppingCart } from 'lucide-react';
import ProductPageSkeleton from '@/components/products/ProductPageSkeleton';
import { Button } from '@/components/ui/button';
import { useCart } from '@/store/useCart';
import { useWishlist } from '@/store/useWishlist';
import QuantityControl from '@/components/products/QuantityControl';
import { toast } from 'sonner';

function ProductPage() {
    const { slug } = useParams();
    const { addItem, updateQuantity, items } = useCart();
    const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlist();
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${slug}`);
            if (!res.ok) throw new Error("Failed to fetch product");
            return res.json();
        } catch {
            throw new Error("Failed to fetch product");
        }
    }

    const { data, isLoading, error } = useQuery<Product>({
        queryKey: ["product", slug],
        queryFn: fetchProduct,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 30, // 30 minutes
    });

    // Check if item is already in cart
    const itemInCart = items.find(item => item.slug === slug);
    const isInCart = !!itemInCart;
    const cartQuantity = itemInCart ? itemInCart.quantity : 0;

    // Check if item is in wishlist
    const isInWishlist = wishlistItems.includes(slug as string);

    const handleQuantityIncrease = () => {
        if (isInCart) {
            // Update cart quantity directly
            updateQuantity(slug as string, cartQuantity + 1);
        } else {
            setQuantity(prev => prev + 1);
        }
    };

    const handleQuantityDecrease = () => {
        if (isInCart) {
            // Update cart quantity directly
            if (cartQuantity > 1) {
                updateQuantity(slug as string, cartQuantity - 1);
            }
        } else {
            setQuantity(prev => prev > 1 ? prev - 1 : 1);
        }
    };

    const handleAddToCart = async () => {
        if (!data) return;
        
        setIsAddingToCart(true);
        
        try {
            addItem({
                slug: slug as string,
                quantity: quantity
            });

            toast.success(`Added ${quantity} ${data.name} to cart!`);
            
            // Reset quantity after adding to cart
            setQuantity(1);
        } catch (error) {
            toast.error('Failed to add item to cart');
            console.error('Error adding to cart:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleWishlistToggle = async () => {
        if (!data) return;
        
        setIsAddingToWishlist(true);
        
        try {
            if (isInWishlist) {
                removeFromWishlist(slug as string);
                toast.success(`Removed ${data.name} from wishlist`);
            } else {
                addToWishlist(slug as string);
                toast.success(`Added ${data.name} to wishlist`);
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
            console.error('Error updating wishlist:', error);
        } finally {
            setIsAddingToWishlist(false);
        }
    };

    if (isLoading) {
        return <ProductPageSkeleton />
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Product not found</h2>
                <p className="text-gray-600">We couldn&apos;t find the product you&apos;re looking for.</p>
            </div>
        )
    }

    if (!data) return null;

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                <div className="aspect-square overflow-hidden rounded-xl bg-gray-50 shadow-sm">
                    <img 
                        src={data.imageUrl} 
                        alt={data.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>

                <div className="space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                            {data.name}
                        </h1>
                        <p className="text-3xl font-bold text-gray-900">
                            ₹{data.price.toLocaleString()}
                        </p>
                    </div>

                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {data.description}
                        </p>
                    </div>

                    <div className="space-y-6 pt-2">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                                <QuantityControl
                                    quantity={isInCart ? cartQuantity : quantity}
                                    onIncrease={handleQuantityIncrease}
                                    onDecrease={handleQuantityDecrease}
                                    disabled={!isInCart && isAddingToCart}
                                    size="md"
                                />
                                {isInCart && (
                                    <span className="text-sm text-green-600 font-medium">
                                        In Cart
                                    </span>
                                )}
                            </div>

                            <Button 
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || isInCart}
                                className="w-full py-3 px-6 rounded-lg font-medium text-base h-12 bg-black hover:bg-gray-800"
                            >
                                {isAddingToCart ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Adding...
                                    </>
                                ) : isInCart ? (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <Button 
                                variant="outline"
                                onClick={handleWishlistToggle}
                                disabled={isAddingToWishlist}
                                className={`py-3 px-4 rounded-lg font-medium h-12 transition-colors ${
                                    isInWishlist 
                                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' 
                                        : 'hover:bg-gray-50 border-gray-300'
                                }`}
                            >
                                {isAddingToWishlist ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                        {isInWishlist ? 'Removing...' : 'Adding...'}
                                    </>
                                ) : (
                                    <>
                                        <Heart className={`w-4 h-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                                        {isInWishlist ? 'Wishlisted' : 'Wishlist'}
                                    </>
                                )}
                            </Button>
                            <Button 
                                variant="outline"
                                className="py-3 px-4 rounded-lg font-medium hover:bg-gray-50 border-gray-300 h-12"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="border-t pt-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="text-center p-4 rounded-lg bg-gray-50">
                                <Truck className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                                <p className="text-xs text-gray-600 mt-1">Within India</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-gray-50">
                                <Shield className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-900">Certified Jeweller</p>
                                <p className="text-xs text-gray-600 mt-1">Trusted quality</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-gray-50">
                                <Gem className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-900">Great Collection</p>
                                <p className="text-xs text-gray-600 mt-1">Handpicked designs</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-gray-50">
                                <RefreshCw className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-900">7 Day Exchange</p>
                                <p className="text-xs text-gray-600 mt-1">Hassle-free returns</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductPage