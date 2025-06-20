"use client";
import { Heart, Home, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import CartSize from "./CartSize";

function BottomNavbar() {
  const pathname = usePathname();

  const items = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/products",
      label: "Shop",
      icon: ShoppingBag,
    },
    {
      href: "/wishlist",
      label: "Wishlist",
      icon: Heart,
    },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 w-full h-16 flex justify-around items-center bg-background shadow-[0_-2px_10px_rgba(0,0,0,0.2)]">
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link
            href={item.href}
            key={index}
            className={`flex flex-col items-center gap-1 ${
              pathname.startsWith(item.href)
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
      <Link
        href="/cart"
        className={`relative flex flex-col items-center gap-1 ${
          pathname.startsWith("/cart")
            ? "text-primary"
            : "text-muted-foreground"
        }`}
      >
        <CartSize />
        <ShoppingCart size={20} className="mt-0.5" />
        <span className="text-xs">Cart</span>
      </Link>
    </nav>
  );
}

export default BottomNavbar;
