import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
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
        const updated = await Category.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: "Error updating category" }, { status: 500 });
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
        await Category.findByIdAndDelete(id);
        return NextResponse.json({ message: "Category deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting category" }, { status: 500 });
    }
}
