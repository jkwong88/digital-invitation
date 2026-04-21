export interface RsvpFormData {
  name: string;
  pax: string;
  phone: string;
}

export interface ValidationErrors {
  name?: string;
  pax?: string;
  phone?: string;
}

export function validateRsvp(data: RsvpFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  const paxNum = Number(data.pax);
  if (!data.pax || isNaN(paxNum) || paxNum < 1 || !Number.isInteger(paxNum)) {
    errors.pax = 'Pax must be a positive whole number';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone is required';
  }

  return errors;
}
