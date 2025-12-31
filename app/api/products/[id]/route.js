import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function PUT(request, { params }) {
    const token = request.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    try {
        const data = await request.json();
        const updated = await Product.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: "Error updating product" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const token = request.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    try {
        await Product.findByIdAndDelete(id);
        return NextResponse.json({ message: "Product deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting product" }, { status: 500 });
    }
}
