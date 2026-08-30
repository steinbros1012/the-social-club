import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/email'
import type Stripe from 'stripe'

// Required: disable body parsing so we can verify the raw Stripe signature
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing stripe signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    if (session.payment_status === 'paid') {
      const registrationId = session.metadata?.registrationId

      if (!registrationId) {
        console.error('No registrationId in Stripe session metadata')
        return NextResponse.json({ error: 'Missing registrationId' }, { status: 400 })
      }

      const { data, error } = await getSupabaseAdmin()
        .from('registrations')
        .update({
          payment_status: 'paid',
          registration_status: 'complete',
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq('id', registrationId)
        .select()
        .single()

      if (error) {
        console.error('Failed to update registration after payment:', error)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }

      try {
        await sendConfirmationEmail({
          to: data.caregiver_email,
          participantName: `${data.participant_first_name} ${data.participant_last_name}`,
          caregiverName: data.caregiver_first_name,
          isScholarship: false,
        })
      } catch (emailError) {
        console.error('Payment confirmation email failed:', emailError)
        // Don't fail the webhook — registration is complete
      }
    }
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const registrationId = session.metadata?.registrationId

    if (registrationId) {
      await getSupabaseAdmin()
        .from('registrations')
        .update({ payment_status: 'canceled', registration_status: 'canceled' })
        .eq('id', registrationId)
    }
  }

  return NextResponse.json({ received: true })
}
