import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'
import { waiversByRegistration, type ParticipantWaiver } from '@/lib/waivers'
import { getSupabaseAdmin } from '@/lib/supabase'

const CSV_COLUMNS = [
  'created_at',
  'id',
  'status',
  'payment_status',
  'participant_first_name',
  'participant_last_name',
  'participant_dob',
  'participant_email',
  'participant_phone',
  'caregiver_first_name',
  'caregiver_last_name',
  'caregiver_relationship',
  'caregiver_email',
  'caregiver_phone',
  'emergency_contact_name',
  'emergency_contact_phone',
  'accommodation_notes',
  'dietary_notes',
  'scholarship_requested',
  'waiver_agreed',
  'waiver_printed_name',
  'waiver_date',
]

function toCsv(rows: Record<string, unknown>[]): string {
  const escape = (val: unknown): string => {
    const str = val === null || val === undefined ? '' : String(val)
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str
  }
  const header = CSV_COLUMNS.join(',')
  const body = rows.map((row) => CSV_COLUMNS.map((col) => escape(row[col])).join(',')).join('\n')
  return `${header}\n${body}`
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Signed waivers are kept privately outside the table (lib/waivers.ts): fold them in.
  let waivers = new Map<string, ParticipantWaiver>()
  try {
    waivers = await waiversByRegistration()
  } catch (err) {
    console.error('Loading waivers failed:', err)
  }
  const rows = (data ?? []).map((r: Record<string, unknown>) => {
    const w = waivers.get(String(r.id))
    return {
      ...r,
      waiver_agreed: w ? true : null,
      waiver_printed_name: w?.signedBy ?? null,
      waiver_date: w?.signedDate || (w ? w.signedAt.slice(0, 10) : null),
    }
  })

  const format = req.nextUrl.searchParams.get('format')
  if (format === 'csv') {
    const csv = toCsv(rows)
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  return NextResponse.json({ registrations: rows })
}
