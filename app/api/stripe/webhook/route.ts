import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { updateUserSubscriptionStatus, getUserByEmail } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  // Initialize Stripe at runtime to avoid build-time errors
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY not configured')
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 500 }
    )
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
  })

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Get customer email from the session
        const customerEmail = session.customer_email || session.customer_details?.email

        if (customerEmail) {
          // Update user subscription status to 'pro'
          await updateUserSubscriptionStatus(customerEmail, 'pro')
          console.log(`✅ Subscription activated for ${customerEmail}`)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Get customer details
        const customer = await stripe.customers.retrieve(subscription.customer as string)

        if ('email' in customer && customer.email) {
          const status = subscription.status === 'active' ? 'pro' : 'trial'
          await updateUserSubscriptionStatus(customer.email, status)
          console.log(`✅ Subscription ${subscription.status} for ${customer.email}`)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        // Get customer details
        const customer = await stripe.customers.retrieve(subscription.customer as string)

        if ('email' in customer && customer.email) {
          await updateUserSubscriptionStatus(customer.email, 'expired')
          console.log(`❌ Subscription cancelled for ${customer.email}`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
