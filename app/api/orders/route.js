import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

export async function GET(request) {
    const token = request.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    try {
        const orders = await Order.find({}).populate("items.productId").sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
    }
}

export async function POST(request) {
    await dbConnect();
    try {
        const data = await request.json();
        const order = await Order.create(data);
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json({ message: "Error creating order" }, { status: 500 });
    }
}
