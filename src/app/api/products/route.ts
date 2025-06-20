import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/product";
import { products } from "@/utils/data/dummyProducts ";

interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
}

const isValidPrice = (price: number): boolean => {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice > 0 && numPrice < 1000000;
};

export const GET = async (req: NextRequest) => {
  try {
    const pageParam = req.nextUrl.searchParams.get("page");
    const searchParam = req.nextUrl.searchParams.get("search");
    const categoryParam = req.nextUrl.searchParams.get("category");

    let page = 1;
    const pageSize = 5;

    if (pageParam) {
      page = parseInt(pageParam);
    }

    let filteredProducts = [...products];

    if (searchParam && searchParam.trim()) {
      const searchTerm = searchParam.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product =>
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (categoryParam && categoryParam.trim()) {
      const category = categoryParam.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(product =>
        product.categories?.some(cat => 
          cat.toLowerCase().includes(category)
        )
      );
    }

    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const hasMore = endIndex < total;

    const response: ProductsResponse = {
      products: paginatedProducts,
      hasMore,
      total,
      currentPage: page,
      totalPages,
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { name, price, imageUrl, description, categories } = await req.json();

    // Basic validation
    if (!name || !price || !imageUrl) {
      return NextResponse.json(
        { error: "Name, price, and image URL are required" },
        { status: 400 }
      );
    }

    if (!isValidPrice(price)) {
      return NextResponse.json(
        { error: "Price must be a valid positive number" },
        { status: 400 }
      );
    }

    // Check if product already exists
    const existingProduct = products.find(
      product => product.name.toLowerCase() === name.toLowerCase()
    );

    if (existingProduct) {
      return NextResponse.json(
        { error: "Product with this name already exists" },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = name.replace(/\s+/g, '-').toLowerCase();

    const newProduct: Product = {
      id: Date.now().toString(),
      name,
      slug,
      price: Number(price),
      imageUrl,
      description: description || "",
      categories: categories || [],
    };

    products.push(newProduct);

    return NextResponse.json(newProduct, { status: 201 });

  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};