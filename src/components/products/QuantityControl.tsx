"use client";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantityControlProps {
    quantity: number;
    onIncrease: (e?: React.MouseEvent) => void;
    onDecrease: (e?: React.MouseEvent) => void;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
    minQuantity?: number;
    maxQuantity?: number;
}

function QuantityControl({ 
    quantity, 
    onIncrease, 
    onDecrease, 
    disabled = false,
    size = "md",
    className = "",
    minQuantity = 1,
    maxQuantity
}: QuantityControlProps) {
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10", 
        lg: "h-12 w-12"
    };

    const textSizeClasses = {
        sm: "text-sm px-3",
        md: "text-base px-4",
        lg: "text-lg px-5"
    };

    const handleDecrease = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        onDecrease(e);
    };

    const handleIncrease = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
        }
        onIncrease(e);
    };

    return (
        <div className={`flex items-center border border-border rounded-md bg-background ${className}`}>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleDecrease}
                disabled={disabled || quantity <= minQuantity}
                className={`${sizeClasses[size]} p-0 hover:bg-muted rounded-r-none border-r border-border`}
                aria-label="Decrease quantity"
            >
                <Minus className="w-4 h-4" />
            </Button>
            <div className={`${textSizeClasses[size]} py-2 font-semibold min-w-[3rem] text-center text-foreground bg-background border-x-0`}>
                {quantity}
            </div>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleIncrease}
                disabled={disabled || (maxQuantity ? quantity >= maxQuantity : false)}
                className={`${sizeClasses[size]} p-0 hover:bg-muted rounded-l-none border-l border-border`}
                aria-label="Increase quantity"
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
}

export default QuantityControl;