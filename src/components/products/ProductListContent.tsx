"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/products/cards/ProductCard";
import { useInView } from "react-intersection-observer";
import ProductCardSkeleton from "@/components/products/cards/ProductCardSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

const PRICE_RANGES = [
  { label: "Under ₹10K", min: 0, max: 10000 },
  { label: "₹10K - ₹30K", min: 10000, max: 30000 },
  { label: "₹30K - ₹50K", min: 30000, max: 50000 },
  { label: "₹50K - ₹1L", min: 50000, max: 100000 },
  { label: "Above ₹1L", min: 100000, max: null },
];

// Sidebar Filter Component
function FilterSidebar({ 
  selectedPriceRange, 
  onPriceRangeSelect, 
  onClearFilters
}: {
  selectedPriceRange: typeof PRICE_RANGES[number] | null;
  onPriceRangeSelect: (range: typeof PRICE_RANGES[number]) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="w-64 border-r border-gray-200 p-6 h-fit sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h2>
        {selectedPriceRange && (
          <Badge variant="secondary">1</Badge>
        )}
      </div>

      {/* Active Filters */}
      {selectedPriceRange && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Active filters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
          <Badge variant="outline" className="gap-1 text-xs">
            {selectedPriceRange.label}
            <X 
              className="w-3 h-3 cursor-pointer" 
              onClick={() => onPriceRangeSelect(selectedPriceRange)}
            />
          </Badge>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-gray-900">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <div
              key={range.label}
              className={`p-2 rounded-md cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedPriceRange?.label === range.label 
                  ? 'bg-primary/10 border-2 border-primary/20' 
                  : 'border border-gray-200'
              }`}
              onClick={() => onPriceRangeSelect(range)}
            >
              <span className="text-sm">{range.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mobile Filter Dropdown Component
function MobileFilterDropdown({ 
  selectedPriceRange, 
  onPriceRangeSelect, 
  onClearFilters
}: {
  selectedPriceRange: typeof PRICE_RANGES[number] | null;
  onPriceRangeSelect: (range: typeof PRICE_RANGES[number]) => void;
  onClearFilters: () => void;
}) {
  return (
    <div className="mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {selectedPriceRange && (
                <Badge variant="secondary" className="ml-1">1</Badge>
              )}
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="start">
          {/* Active Filters Section */}
          {selectedPriceRange && (
            <>
              <DropdownMenuLabel>Active Filters</DropdownMenuLabel>
              <div className="px-2 pb-2">
                <Badge variant="outline" className="gap-1 text-xs">
                  {selectedPriceRange.label}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onPriceRangeSelect(selectedPriceRange);
                    }}
                  />
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="mt-2 h-6 px-2 text-xs w-full"
                >
                  Clear all filters
                </Button>
              </div>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Price Range Filter */}
          <DropdownMenuLabel>Price Range</DropdownMenuLabel>
          {PRICE_RANGES.map((range) => (
            <DropdownMenuCheckboxItem
              key={range.label}
              checked={selectedPriceRange?.label === range.label}
              onCheckedChange={() => onPriceRangeSelect(range)}
            >
              {range.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filters display for mobile */}
      {selectedPriceRange && (
        <div className="mt-3">
          <Badge variant="outline" className="gap-1 text-xs">
            {selectedPriceRange.label}
            <X 
              className="w-3 h-3 cursor-pointer" 
              onClick={() => onPriceRangeSelect(selectedPriceRange)}
            />
          </Badge>
        </div>
      )}
    </div>
  );
}

function ProductListContent() {
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    label: string;
    min: number;
    max: number | null;
  } | null>(null);
  
  const categoryFromUrl = searchParams.get('category');

  const fetchProducts = async ({ pageParam = 1 }) => {
    const params = new URLSearchParams({ page: pageParam.toString() });
    
    if (categoryFromUrl) {
      params.append('category', categoryFromUrl);
    }

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
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", categoryFromUrl],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
  });

  // Filter products by price on client side
  const allProducts = data?.pages.flatMap(page => page.products) || [];
  const filteredProducts = selectedPriceRange 
    ? allProducts.filter(product => {
        const price = product.price;
        if (!price) return false;
        
        const matchesMin = selectedPriceRange.min ? price >= selectedPriceRange.min : true;
        const matchesMax = selectedPriceRange.max ? price <= selectedPriceRange.max : true;
        
        return matchesMin && matchesMax;
      })
    : allProducts;

  // Auto-fetch next page when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handlePriceRangeSelect = (priceRange: typeof PRICE_RANGES[number]) => {
    setSelectedPriceRange(
      selectedPriceRange?.label === priceRange.label ? null : priceRange
    );
  };

  const clearFilters = () => {
    setSelectedPriceRange(null);
  };

  if (status === "pending") {
    return (
      <div className="flex">
        <div className="hidden lg:block w-64 bg-gray-50 animate-pulse h-screen"></div>
        
        <div className="flex-1 p-2 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(12)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="p-2 md:p-8 lg:p-10">
        <div className="text-center py-8">
          <p className="text-red-500">Something went wrong loading products</p>
          <button 
            onClick={() => refetch()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalResults = filteredProducts.length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <FilterSidebar
          selectedPriceRange={selectedPriceRange}
          onPriceRangeSelect={handlePriceRangeSelect}
          onClearFilters={clearFilters}
        />
      </div>

      <div className="flex-1 bg-white lg:bg-gray-50">
        <div className="p-2 md:p-8 lg:p-6">
          {/* Mobile Filter Dropdown */}
          <div className="lg:hidden">
            <MobileFilterDropdown
              selectedPriceRange={selectedPriceRange}
              onPriceRangeSelect={handlePriceRangeSelect}
              onClearFilters={clearFilters}
            />
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {categoryFromUrl && `${categoryFromUrl} • `}
              {totalResults} product{totalResults !== 1 ? 's' : ''} found
              {selectedPriceRange && ` in ${selectedPriceRange.label}`}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-2">No products found</p>
              <p className="text-sm text-gray-400 mb-4">
                {selectedPriceRange 
                  ? "No products found in the selected price range"
                  : "Try adjusting your filters or browse all products"
                }
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Loading indicator */}
              {isFetchingNextPage && (
                <div className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(8)].map((_, i) => (
                      <ProductCardSkeleton key={`loading-${i}`} />
                    ))}
                  </div>
                </div>
              )}
              
              {selectedPriceRange && hasNextPage && !isFetchingNextPage && (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Showing {filteredProducts.length} products in selected price range
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    Load more products
                  </Button>
                </div>
              )}
              
              {/* Intersection observer trigger element */}
              {hasNextPage && !isFetchingNextPage && (
                <div 
                  ref={ref} 
                  className="h-20 flex items-center justify-center mt-8"
                >
                  <div className="text-gray-400 text-sm">
                    {selectedPriceRange ? "Loading more to find products in your price range..." : "Loading more products..."}
                  </div>
                </div>
              )}
              
              {!hasNextPage && filteredProducts.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {selectedPriceRange 
                      ? `Found ${filteredProducts.length} products in ${selectedPriceRange.label}`
                      : "You've reached the end of our products."
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListContent;