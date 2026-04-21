import { validateRsvp } from '@/lib/rsvpValidation';

describe('validateRsvp', () => {
  it('returns no errors for valid input', () => {
    const errors = validateRsvp({ name: 'Alice', pax: '2', phone: '0123456789' });
    expect(errors).toEqual({});
  });

  it('requires name', () => {
    const errors = validateRsvp({ name: '', pax: '2', phone: '0123456789' });
    expect(errors.name).toBeDefined();
  });

  it('requires name to be non-whitespace', () => {
    const errors = validateRsvp({ name: '   ', pax: '2', phone: '0123456789' });
    expect(errors.name).toBeDefined();
  });

  it('requires pax to be a positive integer', () => {
    expect(validateRsvp({ name: 'A', pax: '0', phone: '123' }).pax).toBeDefined();
    expect(validateRsvp({ name: 'A', pax: '-1', phone: '123' }).pax).toBeDefined();
    expect(validateRsvp({ name: 'A', pax: '1.5', phone: '123' }).pax).toBeDefined();
    expect(validateRsvp({ name: 'A', pax: 'abc', phone: '123' }).pax).toBeDefined();
    expect(validateRsvp({ name: 'A', pax: '', phone: '123' }).pax).toBeDefined();
  });

  it('requires phone', () => {
    const errors = validateRsvp({ name: 'Alice', pax: '2', phone: '' });
    expect(errors.phone).toBeDefined();
  });
});
