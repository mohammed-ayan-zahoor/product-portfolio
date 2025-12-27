import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Category from "@/models/Category";
import { verifyToken } from "@/lib/auth";

export async function GET() {
    await dbConnect();
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching categories" }, { status: 500 });
    }
}

export async function POST(request) {
    const token = request.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    try {
        const { name, slug, isActive } = await request.json();
        const category = await Category.create({ name, slug, isActive });
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        if (error.code === 11000) {
            return NextResponse.json({ message: "Category slice/slug already exists" }, { status: 400 });
        }
        return NextResponse.json({ message: "Error creating category" }, { status: 500 });
    }
}
