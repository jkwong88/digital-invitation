'use client';
import { useState } from 'react';
import { validateRsvp, type RsvpFormData, type ValidationErrors } from '@/lib/rsvpValidation';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function RsvpForm() {
  const [form, setForm] = useState<RsvpFormData>({ name: '', pax: '', phone: '' });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (field: keyof RsvpFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateRsvp(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus('loading');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          pax: Number(form.pax),
          phone: form.phone.trim(),
        }),
      });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12 animate-slide-in">
        <p className="font-noto text-deep-red text-xl">感謝您的回覆！</p>
        <p className="text-gray-500 text-sm mt-2">We look forward to celebrating with you.</p>
      </div>
    );
  }

  const inputClass =
    'w-full border border-deep-red px-4 py-3 text-sm placeholder-deep-red/70 focus:outline-none focus:ring-1 focus:ring-deep-red bg-transparent';

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <input
          type="text"
          placeholder="* 姓名 NAME"
          value={form.name}
          onChange={handleChange('name')}
          className={inputClass}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <input
          type="number"
          placeholder="* 出席人数 PAX"
          value={form.pax}
          onChange={handleChange('pax')}
          min="1"
          step="1"
          className={inputClass}
        />
        {errors.pax && <p className="text-red-500 text-xs mt-1">{errors.pax}</p>}
      </div>
      <div>
        <input
          type="tel"
          placeholder="* 電話 PHONE"
          value={form.phone}
          onChange={handleChange('phone')}
          className={inputClass}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
      {status === 'error' && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-deep-red text-white py-4 text-sm tracking-widest disabled:opacity-60 hover:bg-accent-red transition-colors"
      >
        {status === 'loading' ? '...' : 'SUBMIT'}
      </button>
    </form>
  );
}
