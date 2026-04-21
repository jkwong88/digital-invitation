/**
 * @jest-environment node
 */
jest.mock('@/lib/googleSheets', () => ({
  appendRsvpRow: jest.fn().mockResolvedValue(undefined),
}));

import { POST } from '@/app/api/rsvp/route';
import { appendRsvpRow } from '@/lib/googleSheets';
import { NextRequest } from 'next/server';

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/rsvp', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 200 and calls appendRsvpRow with valid data', async () => {
    const req = makeRequest({ name: 'Alice', pax: 2, phone: '0123456789' });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(appendRsvpRow).toHaveBeenCalledWith({ name: 'Alice', pax: 2, phone: '0123456789' });
  });

  it('returns 400 when name is missing', async () => {
    const req = makeRequest({ name: '', pax: 2, phone: '0123456789' });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });

  it('returns 400 when pax is not a positive integer', async () => {
    const req = makeRequest({ name: 'Alice', pax: 0, phone: '0123456789' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when phone is missing', async () => {
    const req = makeRequest({ name: 'Alice', pax: 2, phone: '' });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 500 when Google Sheets throws', async () => {
    (appendRsvpRow as jest.Mock).mockRejectedValueOnce(new Error('Sheets error'));
    const req = makeRequest({ name: 'Alice', pax: 2, phone: '0123456789' });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
