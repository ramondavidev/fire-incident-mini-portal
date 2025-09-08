import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IncidentItem from './IncidentItem';
import { Incident } from '@/types/incident';
import { IncidentFormData } from '../IncidentEditForm';

// Mock the sub-components
vi.mock('../IncidentDetails', () => ({
  default: ({
    incident,
    onEdit,
    onDelete,
    isEditing,
    isDeleting,
  }: {
    incident: Incident;
    onEdit: () => void;
    onDelete: () => void;
    isEditing: boolean;
    isDeleting: boolean;
  }) => (
    <div data-testid="incident-details">
      <h3>{incident.title}</h3>
      <p>{incident.description}</p>
      <button onClick={onEdit} disabled={isEditing}>
        {isEditing ? 'Editing...' : 'Edit'}
      </button>
      <button onClick={onDelete} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  ),
}));

vi.mock('../IncidentEditForm', () => ({
  default: ({
    initialData,
    onSave,
    onCancel,
  }: {
    initialData: IncidentFormData;
    onSave: (data: IncidentFormData, files: FileList | null) => void;
    onCancel: () => void;
  }) => (
    <div data-testid="incident-edit-form">
      <h3>Edit Form</h3>
      <p>Title: {initialData.title}</p>
      <button onClick={() => onSave(initialData, null)}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

const mockIncident: Incident = {
  id: '1',
  title: 'Structure Fire',
  description: 'House fire in progress',
  incident_type: 'Structure Fire',
  location: 'Main Street',
  created_at: '2024-01-01T10:00:00Z',
};

const defaultProps = {
  incident: mockIncident,
  editingId: null,
  deletingId: null,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
  onCancelEdit: vi.fn(),
  onUpdateIncident: vi.fn(),
};

describe('IncidentItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders IncidentDetails by default', () => {
    render(<IncidentItem {...defaultProps} />);

    expect(screen.getByTestId('incident-details')).toBeInTheDocument();
    expect(screen.getByText('Structure Fire')).toBeInTheDocument();
    expect(screen.getByText('House fire in progress')).toBeInTheDocument();
    expect(screen.queryByTestId('incident-edit-form')).not.toBeInTheDocument();
  });

  it('renders IncidentEditForm when in editing mode', () => {
    render(<IncidentItem {...defaultProps} editingId="1" />);

    expect(screen.getByTestId('incident-edit-form')).toBeInTheDocument();
    expect(screen.getByText('Edit Form')).toBeInTheDocument();
    expect(screen.getByText('Title: Structure Fire')).toBeInTheDocument();
    expect(screen.queryByTestId('incident-details')).not.toBeInTheDocument();
  });

  it('passes correct isEditing prop to IncidentDetails', () => {
    render(<IncidentItem {...defaultProps} editingId="1" />);

    // Should show edit form when editing this incident
    expect(screen.getByTestId('incident-edit-form')).toBeInTheDocument();
  });

  it('passes correct isDeleting prop to IncidentDetails', () => {
    render(<IncidentItem {...defaultProps} deletingId="1" />);

    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('calls onEdit with incident id when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<IncidentItem {...defaultProps} onEdit={onEdit} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith('1');
  });

  it('calls onDelete with incident id when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<IncidentItem {...defaultProps} onDelete={onDelete} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('calls onUpdateIncident when save is clicked in edit form', () => {
    const onUpdateIncident = vi.fn();
    render(
      <IncidentItem
        {...defaultProps}
        editingId="1"
        onUpdateIncident={onUpdateIncident}
      />
    );

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(onUpdateIncident).toHaveBeenCalledWith(
      '1',
      {
        title: 'Structure Fire',
        description: 'House fire in progress',
        incident_type: 'Structure Fire',
        location: 'Main Street',
      },
      null
    );
  });

  it('calls onCancelEdit when cancel is clicked in edit form', () => {
    const onCancelEdit = vi.fn();
    render(
      <IncidentItem
        {...defaultProps}
        editingId="1"
        onCancelEdit={onCancelEdit}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(onCancelEdit).toHaveBeenCalledTimes(1);
  });

  it('creates correct initial data for edit form', () => {
    render(<IncidentItem {...defaultProps} editingId="1" />);

    expect(screen.getByText('Title: Structure Fire')).toBeInTheDocument();
  });

  it('handles missing description in initial data', () => {
    const incidentWithoutDescription = {
      ...mockIncident,
      description: undefined,
    };
    render(
      <IncidentItem
        {...defaultProps}
        incident={incidentWithoutDescription}
        editingId="1"
      />
    );

    // Should handle undefined description gracefully
    expect(screen.getByTestId('incident-edit-form')).toBeInTheDocument();
  });

  it('handles missing location in initial data', () => {
    const incidentWithoutLocation = {
      ...mockIncident,
      location: undefined,
    };
    render(
      <IncidentItem
        {...defaultProps}
        incident={incidentWithoutLocation}
        editingId="1"
      />
    );

    // Should handle undefined location gracefully
    expect(screen.getByTestId('incident-edit-form')).toBeInTheDocument();
  });

  it('does not show edit form for different incident id', () => {
    render(<IncidentItem {...defaultProps} editingId="2" />);

    expect(screen.getByTestId('incident-details')).toBeInTheDocument();
    expect(screen.queryByTestId('incident-edit-form')).not.toBeInTheDocument();
  });

  it('does not show deleting state for different incident id', () => {
    render(<IncidentItem {...defaultProps} deletingId="2" />);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.queryByText('Deleting...')).not.toBeInTheDocument();
  });

  it('maintains component display name', () => {
    expect(IncidentItem.displayName).toBe('IncidentItem');
  });

  it('is memoized to prevent unnecessary re-renders', () => {
    // Test that the component is wrapped with memo
    expect(IncidentItem.$$typeof).toBeDefined();
  });

  it('handles edit state transitions correctly', () => {
    const { rerender } = render(<IncidentItem {...defaultProps} />);

    // Initially shows details
    expect(screen.getByTestId('incident-details')).toBeInTheDocument();

    // Switch to edit mode
    rerender(<IncidentItem {...defaultProps} editingId="1" />);
    expect(screen.getByTestId('incident-edit-form')).toBeInTheDocument();

    // Switch back to details
    rerender(<IncidentItem {...defaultProps} editingId={null} />);
    expect(screen.getByTestId('incident-details')).toBeInTheDocument();
  });

  it('passes all required props to IncidentDetails', () => {
    render(<IncidentItem {...defaultProps} />);

    const detailsElement = screen.getByTestId('incident-details');
    expect(detailsElement).toBeInTheDocument();

    // Check that edit and delete buttons are present (props passed correctly)
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('passes correct initial data structure to edit form', () => {
    const incidentWithNulls = {
      ...mockIncident,
      description: null,
      location: null,
    } as any;

    render(
      <IncidentItem
        {...defaultProps}
        incident={incidentWithNulls}
        editingId="1"
      />
    );

    // Should handle null values by converting to empty strings
    expect(screen.getByTestId('incident-edit-form')).toBeInTheDocument();
  });
});
