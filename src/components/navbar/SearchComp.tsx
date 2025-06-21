"use client";
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Product } from "@/types/product";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CATEGORIES = [
  "Earring",
  "Bracelet", 
  "Necklace",
  "Ring",
  "Nose Pin",
  "Pendant",
];

function SearchComp() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const router = useRouter();
  const { ref, inView } = useInView();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchSearchResults = async ({ pageParam = 1 }) => {
    if (!debouncedQuery.trim() && !selectedCategory) {
      return { products: [], hasMore: false, total: 0 };
    }

    const params = new URLSearchParams({ page: pageParam.toString() });
    if (debouncedQuery.trim()) params.append('search', debouncedQuery.trim());
    if (selectedCategory) params.append('category', selectedCategory);

    const res = await fetch(`/api/products?${params}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  };

  const {
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["search-products", debouncedQuery, selectedCategory],
    queryFn: fetchSearchResults,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.currentPage + 1 : undefined,
    enabled: isOpen && (!!debouncedQuery.trim() || !!selectedCategory),
  });

  // Auto-fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(selectedCategory === category ? "" : category);
  };

  const handleProductClick = (product: Product) => {
    setIsOpen(false);
    router.push(`/products/${product.slug}`);
  };

  const allProducts = data?.pages.flatMap(page => page.products) || [];
  const totalResults = data?.pages[0]?.total || 0;
  const hasActiveFilters = debouncedQuery.trim() || selectedCategory;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="cursor-pointer">
        <Search size={22} />
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full overflow-hidden">
        <SheetHeader className="space-y-4 flex-shrink-0 pb-4 border-b">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Search Products</h2>
          </div>
          
          <div className="relative">
            <Input
              placeholder="Search for products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-10"
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuery("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </SheetHeader>

        <div className="flex-1 min-h-0 flex flex-col">
          {!hasActiveFilters ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Start typing to search for products</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-shrink-0 px-4 pb-2">
                <p className="text-sm text-gray-600 font-medium">
                  {status === "pending" ? "Searching..." : `${totalResults} result${totalResults !== 1 ? 's' : ''} found`}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0 p-4">
                {status === "pending" && (
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="p-3 border rounded-lg animate-pulse">
                        <div className="w-full aspect-square bg-gray-200 rounded mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {status === "success" && allProducts.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-gray-500 py-16">
                    <div className="text-center">
                      <p>No products found</p>
                      <p className="text-sm mt-1">Try adjusting your search terms</p>
                    </div>
                  </div>
                )}

                {status === "success" && allProducts.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {allProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                      >
                        {product.imageUrl && (
                          <div className="w-full aspect-square relative mb-3">
                            <Image
                              src={product.imageUrl}
                              alt={product.name || "Product"}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <h3 className="font-medium text-sm line-clamp-2">
                            {product.name}
                          </h3>
                          {product.price && (
                            <p className="font-semibold text-sm">₹{product.price}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isFetchingNextPage && (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <span className="text-sm text-gray-600">Loading more...</span>
                  </div>
                )}

                {hasNextPage && !isFetchingNextPage && <div ref={ref} className="h-4" />}

                {status === "success" && !hasNextPage && allProducts.length > 0 && (
                  <div className="text-center py-6 text-sm text-gray-500">
                    End of results
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SearchComp;