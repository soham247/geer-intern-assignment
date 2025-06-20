"use client";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantityControlProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
}

function QuantityControl({ 
    quantity, 
    onIncrease, 
    onDecrease, 
    disabled = false,
    size = "md",
    className = ""
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

    return (
        <div className={`flex items-center border border-border rounded-md ${className}`}>
            <Button
                variant="ghost"
                size="sm"
                onClick={onDecrease}
                disabled={disabled || quantity <= 1}
                className={`${sizeClasses[size]} p-0 hover:bg-muted`}
            >
                <Minus className="w-4 h-4" />
            </Button>
            <span className={`${textSizeClasses[size]} py-2 font-semibold min-w-[3rem] text-center text-foreground`}>
                {quantity}
            </span>
            <Button
                variant="ghost"
                size="sm"
                onClick={onIncrease}
                disabled={disabled}
                className={`${sizeClasses[size]} p-0 hover:bg-muted`}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
}

export default QuantityControl;