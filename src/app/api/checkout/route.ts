import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia', // using latest or standard string
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { plan, userId, email, charityId, contributionPercent } = body

    if (process.env.STRIPE_SECRET_KEY?.includes("mock")) {
      return NextResponse.json({ url: "/dashboard?mockStripe=true" })
    }

    const priceId = plan === 'yearly' ? 'price_yearly_mock' : 'price_monthly_mock'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        userId,
        charityId,
        contributionPercent,
        plan
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/signup`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
