import { NextRequest, NextResponse } from 'next/server'
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
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const format = req.nextUrl.searchParams.get('format')
  if (format === 'csv') {
    const csv = toCsv(data ?? [])
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="registrations-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    })
  }

  return NextResponse.json({ registrations: data })
}
