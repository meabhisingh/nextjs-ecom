import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const payment = await razorpay.orders.create({
      amount: amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: `order_${Date.now()}`,
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Razorpay error:", error);
    return NextResponse.json(
      { error: "Error creating payment" },
      { status: 500 }
    );
  }
}