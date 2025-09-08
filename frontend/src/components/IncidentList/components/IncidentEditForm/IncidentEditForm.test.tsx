import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IncidentEditForm, { IncidentFormData } from './IncidentEditForm';

const mockInitialData: IncidentFormData = {
  title: 'Structure Fire',
  description: 'House fire in progress',
  incident_type: 'Structure Fire',
  location: 'Main Street',
};

const defaultProps = {
  initialData: mockInitialData,
  onSave: vi.fn(),
  onCancel: vi.fn(),
};

describe('IncidentEditForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form with initial data', () => {
    render(<IncidentEditForm {...defaultProps} />);

    expect(screen.getByLabelText('Title')).toHaveValue('Structure Fire');
    expect(screen.getByLabelText('Description')).toHaveValue(
      'House fire in progress'
    );
    expect(screen.getByLabelText('Location')).toHaveValue('Main Street');
    expect(screen.getByLabelText('Incident Type')).toHaveValue(
      'Structure Fire'
    );
  });

  it('displays form header with edit icon', () => {
    render(<IncidentEditForm {...defaultProps} />);

    expect(screen.getByText('Edit Incident')).toBeInTheDocument();
    const header = screen.getByRole('heading', { name: 'Edit Incident' });
    expect(header).toBeInTheDocument();
  });

  it('updates title field when user types', async () => {
    render(<IncidentEditForm {...defaultProps} />);

    const titleInput = screen.getByLabelText('Title');
    await user.clear(titleInput);
    await user.type(titleInput, 'New Fire Title');

    expect(titleInput).toHaveValue('New Fire Title');
  });

  it('updates description field when user types', async () => {
    render(<IncidentEditForm {...defaultProps} />);

    const descriptionInput = screen.getByLabelText('Description');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated fire description');

    expect(descriptionInput).toHaveValue('Updated fire description');
  });

  it('updates location field when user types', async () => {
    render(<IncidentEditForm {...defaultProps} />);

    const locationInput = screen.getByLabelText('Location');
    await user.clear(locationInput);
    await user.type(locationInput, 'New Location');

    expect(locationInput).toHaveValue('New Location');
  });

  it('updates incident type when selected', async () => {
    render(<IncidentEditForm {...defaultProps} />);

    const select = screen.getByLabelText('Incident Type');
    await user.selectOptions(select, 'Vehicle Fire');

    expect(select).toHaveValue('Vehicle Fire');
  });

  it('handles file upload', async () => {
    render(<IncidentEditForm {...defaultProps} />);

    const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Image (optional)');

    await user.upload(fileInput, file);

    expect(
      screen.getByText('New image selected: test.jpg')
    ).toBeInTheDocument();
    expect(screen.getByText(/New image selected/)).toBeInTheDocument();
  });

  it('calls onSave with form data when save button is clicked', async () => {
    const onSave = vi.fn();
    render(<IncidentEditForm {...defaultProps} onSave={onSave} />);

    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith(mockInitialData, null);
  });

  it('calls onSave with updated data and image', async () => {
    const onSave = vi.fn();
    render(<IncidentEditForm {...defaultProps} onSave={onSave} />);

    // Update title
    const titleInput = screen.getByLabelText('Title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Title');

    // Add image
    const file = new File(['test image'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = screen.getByLabelText('Image (optional)');
    await user.upload(fileInput, file);

    // Save
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith(
      {
        ...mockInitialData,
        title: 'Updated Title',
      },
      file
    );
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<IncidentEditForm {...defaultProps} onCancel={onCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('renders all incident type options', () => {
    render(<IncidentEditForm {...defaultProps} />);

    const select = screen.getByLabelText('Incident Type');
    const options = Array.from(select.querySelectorAll('option'));
    const optionTexts = options.map((option) => option.textContent);

    expect(optionTexts).toEqual([
      'Structure Fire',
      'Vehicle Fire',
      'Wildfire',
      'Electrical Fire',
      'Chemical Fire',
      'Other',
    ]);
  });

  it('has proper form field labels', () => {
    render(<IncidentEditForm {...defaultProps} />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Incident Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Image (optional)')).toBeInTheDocument();
  });

  it('has proper placeholders for input fields', () => {
    render(<IncidentEditForm {...defaultProps} />);

    expect(
      screen.getByPlaceholderText('Enter incident title')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Describe the incident')
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Enter incident location')
    ).toBeInTheDocument();
  });

  it('textarea has correct number of rows', () => {
    render(<IncidentEditForm {...defaultProps} />);

    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('file input accepts only images', () => {
    render(<IncidentEditForm {...defaultProps} />);

    const fileInput = screen.getByLabelText('Image (optional)');
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  it('applies proper CSS classes to form elements', () => {
    render(<IncidentEditForm {...defaultProps} />);

    const titleInput = screen.getByLabelText('Title');
    expect(titleInput).toHaveClass(
      'w-full',
      'p-3',
      'border',
      'border-gray-300',
      'rounded-lg'
    );
  });

  it('save button has proper styling and icon', () => {
    render(<IncidentEditForm {...defaultProps} />);

    const saveButton = screen.getByText('Save Changes');
    expect(saveButton).toHaveClass(
      'inline-flex',
      'items-center',
      'px-4',
      'py-2',
      'bg-red-600',
      'text-white',
      'rounded-lg'
    );
  });

  it('cancel button has proper styling and icon', () => {
    render(<IncidentEditForm {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toHaveClass(
      'inline-flex',
      'items-center',
      'px-4',
      'py-2',
      'bg-gray-600',
      'text-white',
      'rounded-lg'
    );
  });

  it('updates all form fields independently', async () => {
    render(<IncidentEditForm {...defaultProps} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const locationInput = screen.getByLabelText('Location');
    const typeSelect = screen.getByLabelText('Incident Type');

    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');

    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'New Description');

    await user.clear(locationInput);
    await user.type(locationInput, 'New Location');

    await user.selectOptions(typeSelect, 'Wildfire');

    expect(titleInput).toHaveValue('New Title');
    expect(descriptionInput).toHaveValue('New Description');
    expect(locationInput).toHaveValue('New Location');
    expect(typeSelect).toHaveValue('Wildfire');
  });
});
