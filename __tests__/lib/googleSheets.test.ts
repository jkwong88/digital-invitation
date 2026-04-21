jest.mock('googleapis', () => ({
  google: {
    auth: {
      JWT: jest.fn().mockImplementation(() => ({})),
    },
    sheets: jest.fn().mockReturnValue({
      spreadsheets: {
        values: {
          append: jest.fn().mockResolvedValue({ data: {} }),
        },
      },
    }),
  },
}));

import { appendRsvpRow } from '@/lib/googleSheets';
import { google } from 'googleapis';

describe('appendRsvpRow', () => {
  const mockSheets = {
    spreadsheets: {
      values: {
        append: jest.fn().mockResolvedValue({ data: {} }),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (google.sheets as jest.Mock).mockReturnValue(mockSheets);
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = 'test@test.iam.gserviceaccount.com';
    process.env.GOOGLE_PRIVATE_KEY = '-----BEGIN RSA PRIVATE KEY-----\ntest\n-----END RSA PRIVATE KEY-----';
    process.env.GOOGLE_SHEET_ID = 'test-sheet-id';
  });

  it('calls sheets.spreadsheets.values.append with correct spreadsheetId', async () => {
    await appendRsvpRow({ name: 'Alice', pax: 2, phone: '0123456789' });
    expect(mockSheets.spreadsheets.values.append).toHaveBeenCalledWith(
      expect.objectContaining({ spreadsheetId: 'test-sheet-id' })
    );
  });

  it('includes name, pax, and phone in the appended row', async () => {
    await appendRsvpRow({ name: 'Alice', pax: 2, phone: '0123456789' });
    const call = mockSheets.spreadsheets.values.append.mock.calls[0][0];
    const row: unknown[] = call.requestBody.values[0];
    expect(row).toContain('Alice');
    expect(row).toContain(2);
    expect(row).toContain('0123456789');
  });

  it('includes a timestamp as the first element of the row', async () => {
    await appendRsvpRow({ name: 'Alice', pax: 2, phone: '0123456789' });
    const call = mockSheets.spreadsheets.values.append.mock.calls[0][0];
    const row: unknown[] = call.requestBody.values[0];
    expect(typeof row[0]).toBe('string');
    expect(row[0]).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
