import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID || 'rzp_test_your_id',
    key_secret: process.env.RAZORPAY_KEY || 'your_secret',
});

export async function POST(request) {
    try {
        const { amount, currency = "INR" } = await request.json();

        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        return NextResponse.json(order);
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        return NextResponse.json({ message: "Error creating Razorpay order" }, { status: 500 });
    }
}
