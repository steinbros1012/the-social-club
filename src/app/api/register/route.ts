import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'
import { sendConfirmationEmail } from '@/lib/email'
import { EVENT_CONFIG } from '@/config/event'
import type { RegistrationFormData } from '@/types/registration'

export async function POST(req: NextRequest) {
  try {
    const body: RegistrationFormData = await req.json()

    // Server-side required field validation
    const required: (keyof RegistrationFormData)[] = [
      'participantFirstName',
      'participantLastName',
      'participantEmail',
      'participantPhone',
      'caregiverFirstName',
      'caregiverLastName',
      'caregiverEmail',
      'caregiverPhone',
      'caregiverRelationship',
    ]
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.participantEmail) || !emailRegex.test(body.caregiverEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Check capacity
    if (EVENT_CONFIG.capacity > 0) {
      const { count } = await getSupabaseAdmin()
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .in('registration_status', ['complete'])

      if (count !== null && count >= EVENT_CONFIG.capacity) {
        return NextResponse.json({ error: 'Registration is full' }, { status: 409 })
      }
    }

    // Duplicate registration guard (same participant email)
    const { data: existing } = await getSupabaseAdmin()
      .from('registrations')
      .select('id')
      .eq('participant_email', body.participantEmail)
      .in('registration_status', ['complete', 'incomplete'])
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A registration with this email already exists' },
        { status: 409 },
      )
    }

    if (body.scholarshipRequested) {
      // Scholarship path: complete immediately, no payment required
      const { data, error } = await getSupabaseAdmin()
        .from('registrations')
        .insert({
          participant_first_name: body.participantFirstName,
          participant_last_name: body.participantLastName,
          participant_dob: body.participantDob || null,
          participant_email: body.participantEmail,
          participant_phone: body.participantPhone,
          caregiver_first_name: body.caregiverFirstName,
          caregiver_last_name: body.caregiverLastName,
          caregiver_relationship: body.caregiverRelationship,
          caregiver_email: body.caregiverEmail,
          caregiver_phone: body.caregiverPhone,
          emergency_contact_name: body.emergencyContactName || null,
          emergency_contact_phone: body.emergencyContactPhone || null,
          accommodation_notes: body.accommodationNotes || null,
          dietary_notes: body.dietaryNotes || null,
          scholarship_requested: true,
          payment_status: 'scholarship',
          registration_status: 'complete',
        })
        .select()
        .single()

      if (error) throw error

      try {
        await sendConfirmationEmail({
          to: body.caregiverEmail,
          participantName: `${body.participantFirstName} ${body.participantLastName}`,
          caregiverName: body.caregiverFirstName,
          isScholarship: true,
        })
      } catch (emailError) {
        // Log but don't fail registration if email fails
        console.error('Scholarship confirmation email failed:', emailError)
      }

      return NextResponse.json({ success: true, type: 'scholarship', registrationId: data.id })
    }

    // Payment path: create pending registration, then redirect to Stripe Checkout
    const { data, error } = await getSupabaseAdmin()
      .from('registrations')
      .insert({
        participant_first_name: body.participantFirstName,
        participant_last_name: body.participantLastName,
        participant_dob: body.participantDob || null,
        participant_email: body.participantEmail,
        participant_phone: body.participantPhone,
        caregiver_first_name: body.caregiverFirstName,
        caregiver_last_name: body.caregiverLastName,
        caregiver_relationship: body.caregiverRelationship,
        caregiver_email: body.caregiverEmail,
        caregiver_phone: body.caregiverPhone,
        emergency_contact_name: body.emergencyContactName || null,
        emergency_contact_phone: body.emergencyContactPhone || null,
        accommodation_notes: body.accommodationNotes || null,
        dietary_notes: body.dietaryNotes || null,
        scholarship_requested: false,
        payment_status: 'pending',
        registration_status: 'incomplete',
      })
      .select()
      .single()

    if (error) throw error

    const origin =
      req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'The Social Club – Registration Donation',
              description: `Registration for ${body.participantFirstName} ${body.participantLastName}`,
            },
            unit_amount: EVENT_CONFIG.donationAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: body.caregiverEmail,
      metadata: {
        registrationId: data.id,
        participantName: `${body.participantFirstName} ${body.participantLastName}`,
      },
      success_url: `${origin}/registration/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/registration/canceled?registration_id=${data.id}`,
    })

    // Persist the Stripe session ID so the webhook can correlate
    await getSupabaseAdmin()
      .from('registrations')
      .update({ stripe_session_id: session.id })
      .eq('id', data.id)

    return NextResponse.json({
      success: true,
      type: 'payment',
      checkoutUrl: session.url,
      registrationId: data.id,
    })
  } catch (err) {
    console.error('Registration error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
