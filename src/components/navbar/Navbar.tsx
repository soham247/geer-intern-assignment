import React from "react";
import { Heart, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";
import CartSize from "./CartSize";
import SearchComp from "./SearchComp";

function Navbar() {
  const items = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/products",
      label: "Products",
    },
    {
      href: "/about",
      label: "About Us",
    },
    {
      href: "/contact",
      label: "Contact",
    },
  ];

  return (
    <nav className="fixed top-0 z-50 h-15 w-full flex justify-between items-center px-4 md:px-6 lg:px-8 bg-white shadow-sm">
      <h1 className="text-xl font-semibold">Brand</h1>
      <ul className="hidden md:flex gap-4 lg:gap-6">
        {items.map((item) => (
          <li key={item.href} className="group relative">
            <Link
              href={item.href}
              className="relative inline-block transition-colors duration-300"
            >
              {item.label}
              <span className="absolute left-1/2 bottom-0 w-0 h-[1px] bg-black transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex justify-center items-center gap-3">
        <SearchComp />
        <Link href="/wishlist" className="hidden md:block">
          <Heart />
        </Link>
        <UserRound size={22} />
        <Link href="/cart" className="relative hidden md:block">
          <CartSize />
          <ShoppingCart />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
