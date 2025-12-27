import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY || 'your_secret')
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            return NextResponse.json({ message: "Payment verified successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Payment verification failed" }, { status: 400 });
        }
    } catch (error) {
        console.error("Razorpay verification error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
