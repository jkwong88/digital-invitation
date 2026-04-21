import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RsvpForm from '@/components/RsvpForm';

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe('RsvpForm', () => {
  it('renders all three input fields and submit button', () => {
    render(<RsvpForm />);
    expect(screen.getByPlaceholderText(/姓名 NAME/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/出席人数 PAX/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/電話 PHONE/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SUBMIT/i })).toBeInTheDocument();
  });

  it('shows validation errors when submitted empty', async () => {
    render(<RsvpForm />);
    fireEvent.click(screen.getByRole('button', { name: /SUBMIT/i }));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Pax must be a positive whole number')).toBeInTheDocument();
    expect(screen.getByText('Phone is required')).toBeInTheDocument();
  });

  it('calls fetch with correct payload on valid submit', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
    render(<RsvpForm />);
    fireEvent.change(screen.getByPlaceholderText(/姓名 NAME/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText(/出席人数 PAX/i), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText(/電話 PHONE/i), { target: { value: '0123456789' } });
    fireEvent.click(screen.getByRole('button', { name: /SUBMIT/i }));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/rsvp', expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ name: 'Alice', pax: 2, phone: '0123456789' }),
      }));
    });
  });

  it('shows success message after successful submit', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
    render(<RsvpForm />);
    fireEvent.change(screen.getByPlaceholderText(/姓名 NAME/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByPlaceholderText(/出席人数 PAX/i), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText(/電話 PHONE/i), { target: { value: '0123456789' } });
    fireEvent.click(screen.getByRole('button', { name: /SUBMIT/i }));
    expect(await screen.findByText(/感謝您的回覆/i)).toBeInTheDocument();
  });
});
