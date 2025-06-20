"use client";
import { useCart } from "@/store/useCart"; // Adjust path as needed

function CartSize() {
  const { getTotalItems, hasHydrated } = useCart();

  if (!hasHydrated) return null;
  const itemCount = getTotalItems();

  return (
    itemCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] pt-0.5">
        {itemCount > 9 ? "9+" : itemCount}
      </span>
    )
  );
}
export default CartSize;
