import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { VOLUNTEER_EVENT, type VolunteerFormData } from '@/types/volunteer'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function POST(req: NextRequest) {
  try {
    const body: VolunteerFormData = await req.json()
    const age = parseInt(body.age, 10)

    if (!body.name?.trim()) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    if (isNaN(age) || age < 1 || age > 120) return NextResponse.json({ error: 'Enter a valid age.' }, { status: 400 })
    if (!body.waiverAgreed) return NextResponse.json({ error: 'The waiver must be agreed to.' }, { status: 400 })
    if (!body.signatureVolunteer?.trim()) return NextResponse.json({ error: 'Volunteer signature is required.' }, { status: 400 })
    if (!DATE_RE.test(body.signatureVolunteerDate ?? '')) return NextResponse.json({ error: 'Volunteer signature date is required.' }, { status: 400 })

    const isMinor = age < 18
    if (isMinor) {
      if (!body.guardianName?.trim()) return NextResponse.json({ error: 'Parent or guardian name is required.' }, { status: 400 })
      if (body.guardianPhone.replace(/\D/g, '').length < 10) return NextResponse.json({ error: 'Enter a guardian telephone number with area code.' }, { status: 400 })
      if (!EMAIL_RE.test(body.guardianEmail ?? '')) return NextResponse.json({ error: 'Enter a valid guardian email address.' }, { status: 400 })
      if (!body.signatureGuardian?.trim()) return NextResponse.json({ error: 'Parent or guardian signature is required.' }, { status: 400 })
      if (!DATE_RE.test(body.signatureGuardianDate ?? '')) return NextResponse.json({ error: 'Guardian signature date is required.' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin()
      .from('volunteers')
      .insert({
        event_name: VOLUNTEER_EVENT.name,
        event_date: VOLUNTEER_EVENT.date,
        volunteer_name: body.name.trim(),
        volunteer_age: age,
        is_minor: isMinor,
        guardian_name: isMinor ? body.guardianName.trim() : null,
        guardian_phone: isMinor ? body.guardianPhone.trim() : null,
        guardian_email: isMinor ? body.guardianEmail.trim() : null,
        waiver_agreed: true,
        signature_volunteer: body.signatureVolunteer.trim(),
        signature_volunteer_date: body.signatureVolunteerDate,
        signature_guardian: isMinor ? body.signatureGuardian.trim() : null,
        signature_guardian_date: isMinor ? body.signatureGuardianDate : null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, volunteerId: data.id })
  } catch (err) {
    console.error('Volunteer registration error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
