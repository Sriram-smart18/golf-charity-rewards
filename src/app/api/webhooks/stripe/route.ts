import { NextResponse } from "next/server";

export async function POST() {
  try {
    return NextResponse.json({
      success: true,
      received: true,
      message: "Stripe webhook temporarily disabled for deployment",
    });
  } catch (err: any) {
    console.error("Webhook error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}