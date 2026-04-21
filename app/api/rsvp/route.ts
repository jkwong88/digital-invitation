import { NextRequest, NextResponse } from 'next/server';
import { appendRsvpRow } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, pax, phone } = body as Record<string, unknown>;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }
  if (typeof pax !== 'number' || pax < 1 || !Number.isInteger(pax)) {
    return NextResponse.json({ error: 'Pax must be a positive integer' }, { status: 400 });
  }
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
  }

  try {
    await appendRsvpRow({ name: name.trim(), pax, phone: phone.trim() });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Google Sheets error:', error);
    return NextResponse.json({ error: 'Failed to save RSVP' }, { status: 500 });
  }
}
