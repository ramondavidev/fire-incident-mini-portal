import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithToastProvider as render } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IncidentEditForm from './IncidentEditForm';
import { Incident } from '@/types/incident';

// Mock fetch
global.fetch = vi.fn();

const mockIncident: Incident = {
  id: '1',
  title: 'Kitchen Fire',
  description: 'Small fire in kitchen',
  incident_type: 'Structure Fire',
  location: 'Kitchen',
  image: '/uploads/image1.jpg',
  created_at: '2024-01-01T10:00:00Z',
};

describe('IncidentEditForm', () => {
  const mockOnCancel = vi.fn();
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetch).mockClear();
  });

  it('renders form with pre-filled incident data', () => {
    render(
      <IncidentEditForm
        incident={mockIncident}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByDisplayValue('Kitchen Fire')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Small fire in kitchen')
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue('Structure Fire')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Kitchen')).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <IncidentEditForm
        incident={mockIncident}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('calls onCancel when X button is clicked', () => {
    render(
      <IncidentEditForm
        incident={mockIncident}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );

    fireEvent.click(screen.getByTitle('Cancel editing'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('shows validation error when required fields are empty', async () => {
    // Create a mock incident with empty required fields
    const emptyIncident: Incident = {
      id: '1',
      title: '',
      description: 'Small fire in kitchen',
      incident_type: '',
      location: 'Kitchen',
      image: '/uploads/image1.jpg',
      created_at: '2024-01-01T10:00:00Z',
    };

    const { container } = render(
      <IncidentEditForm
        incident={emptyIncident}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );

    const form = container.querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText(/Title and incident type are required/i)
      ).toBeInTheDocument();
    });
  });

  it('updates form data when inputs change', () => {
    render(
      <IncidentEditForm
        incident={mockIncident}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );

    const titleInput = screen.getByDisplayValue('Kitchen Fire');
    fireEvent.change(titleInput, { target: { value: 'Updated Kitchen Fire' } });

    expect(titleInput).toHaveValue('Updated Kitchen Fire');
  });

  it('handles file upload', () => {
    render(
      <IncidentEditForm
        incident={mockIncident}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );

    const fileInput = screen.getByLabelText(/update image/i);
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect((fileInput as HTMLInputElement).files?.[0]).toBe(file);
  });

  it('submits form successfully', async () => {
    const updatedIncident = { ...mockIncident, title: 'Updated Kitchen Fire' };
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      headers: new Headers([['content-type', 'application/json']]),
      json: async () => updatedIncident,
    } as Response);

    render(
      <IncidentEditForm
        incident={mockIncident}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );

    // Update title
    fireEvent.change(screen.getByDisplayValue('Kitchen Fire'), {
      target: { value: 'Updated Kitchen Fire' },
    });

    // Submit
    fireEvent.click(screen.getByText('Update Incident'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:3001/api/incidents/${mockIncident.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer fire-incident-secret-2024',
          },
          body: expect.any(FormData),
        }
      );
      expect(mockOnUpdate).toHaveBeenCalledWith(updatedIncident);
    });
  });

  it('handles submission error', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
    } as Response);

    render(
      <IncidentEditForm
        incident={mockIncident}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );

    fireEvent.click(screen.getByText('Update Incident'));

    await waitFor(() => {
      expect(
        screen.getByText(/failed to update incident/i)
      ).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    let resolvePromise: (value: Response) => void;
    const promise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(fetch).mockReturnValueOnce(promise);

    render(
      <IncidentEditForm
        incident={mockIncident}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );

    fireEvent.click(screen.getByText('Update Incident'));

    // Check loading state immediately
    expect(screen.getByText(/updating.../i)).toBeInTheDocument();
    expect(screen.getByText(/updating.../i)).toBeDisabled();

    // Resolve the promise to clean up
    resolvePromise!({
      ok: true,
      headers: new Headers([['content-type', 'application/json']]),
      json: () => Promise.resolve(mockIncident),
    } as Response);
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('displays current image filename', () => {
    render(
      <IncidentEditForm
        incident={mockIncident}
        onCancel={mockOnCancel}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText(/current image: image1.jpg/i)).toBeInTheDocument();
  });
});
