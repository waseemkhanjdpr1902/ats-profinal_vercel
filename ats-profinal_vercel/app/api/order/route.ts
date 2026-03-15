import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET)
      return NextResponse.json({ error: "Razorpay keys not configured." }, { status: 500 });

    const { amount } = await req.json();
    const rz = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const order = await rz.orders.create({ amount, currency: "INR", receipt: `r_${Date.now()}` });
    return NextResponse.json(order);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 500 });
  }
}
