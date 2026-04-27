import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') as string

    if (!webhookSecret || process.env.STRIPE_SECRET_KEY?.includes("mock")) {
      return NextResponse.json({ received: true, mock: true })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    const supabase = await createAdminClient()

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, charityId, contributionPercent, plan } = session.metadata || {}

      if (userId) {
        // Create or update subscription
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription
        
        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        })

        // Update profile status
        await supabase.from('profiles').update({
          subscription_status: 'active',
          stripe_customer_id: session.customer as string,
        }).eq('id', userId)
      }
    } else if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription
      
      await supabase.from('subscriptions').update({
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      }).eq('stripe_subscription_id', subscription.id)

      if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
        const { data: subData } = await supabase.from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single()
        
        if (subData) {
          await supabase.from('profiles').update({
            subscription_status: 'inactive'
          }).eq('id', subData.user_id)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
