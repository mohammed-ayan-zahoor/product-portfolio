import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const query = categoryId ? { categoryId } : {};

    try {
        const products = await Product.find(query).populate("categoryId", "name").sort({ createdAt: -1 });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
    }
}

export async function POST(request) {
    const token = request.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    try {
        const data = await request.json();
        console.log('CREATING PRODUCT:', data); // Security: Log for debugging persistence
        const product = await Product.create(data);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error creating product" }, { status: 500 });
    }
}
