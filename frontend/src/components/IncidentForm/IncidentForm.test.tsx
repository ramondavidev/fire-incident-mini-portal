import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithToastProvider as render } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IncidentForm from './IncidentForm';

// Mock fetch
global.fetch = vi.fn();

describe('IncidentForm', () => {
  const mockOnIncidentCreated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    beforeEach(() => {
      vi.mocked(fetch).mockClear();
    });
  });

  it('renders form fields correctly', () => {
    render(<IncidentForm onIncidentCreated={mockOnIncidentCreated} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/incident type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create incident/i })
    ).toBeInTheDocument();
  });

  it('shows validation error for empty required fields', () => {
    const { container } = render(
      <IncidentForm onIncidentCreated={mockOnIncidentCreated} />
    );

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    expect(
      screen.getByText(/Title and incident type are required/)
    ).toBeInTheDocument();
  });

  it('updates form data when inputs change', () => {
    render(<IncidentForm onIncidentCreated={mockOnIncidentCreated} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    fireEvent.change(titleInput, { target: { value: 'Test Incident' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' },
    });

    expect(titleInput).toHaveValue('Test Incident');
    expect(descriptionInput).toHaveValue('Test Description');
  });

  it('handles file input change', () => {
    render(<IncidentForm onIncidentCreated={mockOnIncidentCreated} />);

    const fileInput = screen.getByLabelText(/image/i);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect((fileInput as HTMLInputElement).files?.[0]).toBe(file);
  });

  it('submits form successfully', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers([['content-type', 'application/json']]),
      json: () => Promise.resolve({}),
    } as Response);

    render(<IncidentForm onIncidentCreated={mockOnIncidentCreated} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Incident' },
    });
    fireEvent.change(screen.getByLabelText(/incident type/i), {
      target: { value: 'Structure Fire' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /create incident/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/incidents',
        {
          method: 'POST',
          headers: {
            Authorization: 'Bearer fire-incident-secret-2024',
          },
          body: expect.any(FormData),
        }
      );

      expect(mockOnIncidentCreated).toHaveBeenCalled();
    });
  });

  it('handles submission error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      headers: {
        get: vi.fn(() => null),
      },
      json: () =>
        Promise.resolve({
          error: 'Server Error',
          message: 'Failed to create incident',
        }),
    } as unknown as Response);

    render(<IncidentForm onIncidentCreated={mockOnIncidentCreated} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Incident' },
    });
    fireEvent.change(screen.getByLabelText(/incident type/i), {
      target: { value: 'Structure Fire' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /create incident/i }));

    // Check that the error toast appears
    await waitFor(() => {
      expect(screen.getByText(/Failed to create incident/)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    let resolvePromise: (value: Response) => void;
    const promise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(fetch).mockReturnValueOnce(promise);

    render(<IncidentForm onIncidentCreated={mockOnIncidentCreated} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Incident' },
    });
    fireEvent.change(screen.getByLabelText(/incident type/i), {
      target: { value: 'Structure Fire' },
    });

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /create incident/i }));

    // Check loading state immediately
    expect(screen.getByText(/Creating\.\.\./)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();

    // Resolve the promise to clean up
    resolvePromise!({
      ok: true,
      headers: new Headers([['content-type', 'application/json']]),
      json: () => Promise.resolve({}),
    } as Response);
    await waitFor(() => {
      expect(mockOnIncidentCreated).toHaveBeenCalled();
    });
  });
});
