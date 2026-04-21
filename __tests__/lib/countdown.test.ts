import { calculateTimeLeft } from '@/lib/countdown';

const target = new Date('2026-11-14T00:00:00');

describe('calculateTimeLeft', () => {
  it('returns correct days when exactly 1 day away', () => {
    const now = new Date('2026-11-13T00:00:00');
    const result = calculateTimeLeft(target, now);
    expect(result.days).toBe(1);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
  });

  it('returns correct hours and minutes', () => {
    const now = new Date('2026-11-13T22:30:00');
    const result = calculateTimeLeft(target, now);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(1);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(0);
  });

  it('returns zeros when target date has passed', () => {
    const now = new Date('2026-11-15T00:00:00');
    const result = calculateTimeLeft(target, now);
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it('returns zeros when now equals target', () => {
    const result = calculateTimeLeft(target, target);
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
