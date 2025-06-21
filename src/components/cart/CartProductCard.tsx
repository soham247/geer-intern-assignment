"use client";
import { useCart } from "@/store/useCart";
import { Product } from "@/types/product";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuantityControl from "@/components/products/QuantityControl";
import { useRouter } from "next/navigation";

interface CartProductCardProps {
    product: Product;
    slug: string;
    quantity: number;
}

function CartProductCard({ product, slug, quantity }: CartProductCardProps) {
    const { updateQuantity, removeItem } = useCart();
    const router = useRouter();

    const handleDecrease = () => {
        if (quantity > 1) {
            updateQuantity(slug, quantity - 1);
        }
    };

    const handleIncrease = () => {
        updateQuantity(slug, quantity + 1);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        removeItem(slug);
    };

    const subtotal = product?.price ? product.price * quantity : 0;

    return (
        <Card className="bg-white border border-border cursor-pointer" onClick={() => router.push(`/products/${slug}`)}>
            <CardContent className="p-4">
                {/* Mobile Layout (< md) */}
                <div className="md:hidden">
                    <div className="flex gap-4 mb-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-md overflow-hidden">
                            {product?.imageUrl ? (
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                    <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-grow">
                            <h3 className="font-semibold text-foreground text-base leading-tight">
                                {product?.name || 'Loading...'}
                            </h3>
                            <p className="text-lg font-bold text-foreground mt-1 font-mono">
                                ₹{product?.price?.toFixed(2) || '0.00'}
                            </p>
                        </div>

                        {/* Remove Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
                            title="Remove item"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Quantity and Subtotal Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <span className="text-sm text-muted-foreground">Qty:</span>
                            <QuantityControl
                                quantity={quantity}
                                onIncrease={handleIncrease}
                                onDecrease={handleDecrease}
                                size="sm"
                            />
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Subtotal</p>
                            <p className="text-lg font-bold text-foreground">
                                ₹{subtotal.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tablet/Desktop Layout (≥ md) */}
                <div className="hidden md:flex items-center gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-md overflow-hidden">
                        {product?.imageUrl ? (
                            <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                <ShoppingCart className="w-8 h-8 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-foreground text-lg truncate">
                            {product?.name || 'Loading...'}
                        </h3>
                        <p className="text-lg font-bold text-foreground mt-2 font-mono">
                            ₹{product?.price?.toFixed(2) || '0.00'}
                        </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <QuantityControl
                            quantity={quantity}
                            onIncrease={handleIncrease}
                            onDecrease={handleDecrease}
                            size="sm"
                        />

                        {/* Remove Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            title="Remove item"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Subtotal */}
                    <div className="flex-shrink-0 text-right min-w-[80px]">
                        <p className="text-sm text-muted-foreground">Subtotal</p>
                        <p className="text-lg font-bold text-foreground">
                            ₹{subtotal.toFixed(2)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default CartProductCard;