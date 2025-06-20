import { NextRequest, NextResponse } from "next/server"
import { products } from "@/utils/data/dummyProducts ";

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const productIndex = products.findIndex((product) => product.id === id);

        if (productIndex === -1) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        } else {
            products.splice(productIndex, 1);
        }
        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const slug = id
        const product = products.find((product) => product.slug === slug);
        if (product) {
            return NextResponse.json(product, { status: 200 });
        } else {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
    } catch {
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}