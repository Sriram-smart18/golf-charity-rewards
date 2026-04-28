import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, userId, email, charityId, contributionPercent } = body;

    console.log("Checkout request:", {
      plan,
      userId,
      email,
      charityId,
      contributionPercent,
    });

    return NextResponse.json({
      success: true,
      url: "/dashboard?mockStripe=true",
      message: "Stripe temporarily disabled for deployment",
    });
  } catch (err: any) {
    console.error("Checkout error:", err);

    return NextResponse.json(
      {
        success: false,
        error: err.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}