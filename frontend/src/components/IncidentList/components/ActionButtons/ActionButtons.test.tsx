import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButtons, {
  ViewButton,
  EditButton,
  DeleteButton,
} from './ActionButtons';

describe('ViewButton', () => {
  it('renders view button with correct text and icon', () => {
    const mockOnView = vi.fn();
    render(<ViewButton onView={mockOnView} />);

    expect(screen.getByLabelText('View details')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('calls onView when clicked', () => {
    const mockOnView = vi.fn();
    render(<ViewButton onView={mockOnView} />);

    fireEvent.click(screen.getByLabelText('View details'));
    expect(mockOnView).toHaveBeenCalledTimes(1);
  });
});

describe('EditButton', () => {
  it('renders edit button with correct text and icon when not editing', () => {
    const mockOnEdit = vi.fn();
    render(<EditButton onEdit={mockOnEdit} isEditing={false} />);

    expect(screen.getByLabelText('Edit incident')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders editing state when isEditing is true', () => {
    const mockOnEdit = vi.fn();
    render(<EditButton onEdit={mockOnEdit} isEditing={true} />);

    expect(screen.getByText('Editing...')).toBeInTheDocument();
  });

  it('calls onEdit when clicked and not editing', () => {
    const mockOnEdit = vi.fn();
    render(<EditButton onEdit={mockOnEdit} isEditing={false} />);

    fireEvent.click(screen.getByLabelText('Edit incident'));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('is disabled when editing', () => {
    const mockOnEdit = vi.fn();
    render(<EditButton onEdit={mockOnEdit} isEditing={true} />);

    const button = screen.getByLabelText('Edit incident');
    expect(button).toBeDisabled();
  });
});

describe('DeleteButton', () => {
  it('renders delete button with correct text and icon when not deleting', () => {
    const mockOnDelete = vi.fn();
    render(<DeleteButton onDelete={mockOnDelete} isDeleting={false} />);

    expect(screen.getByLabelText('Delete incident')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('renders deleting state when isDeleting is true', () => {
    const mockOnDelete = vi.fn();
    render(<DeleteButton onDelete={mockOnDelete} isDeleting={true} />);

    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('calls onDelete when clicked and not deleting', () => {
    const mockOnDelete = vi.fn();
    render(<DeleteButton onDelete={mockOnDelete} isDeleting={false} />);

    fireEvent.click(screen.getByLabelText('Delete incident'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('is disabled when deleting', () => {
    const mockOnDelete = vi.fn();
    render(<DeleteButton onDelete={mockOnDelete} isDeleting={true} />);

    const button = screen.getByLabelText('Delete incident');
    expect(button).toBeDisabled();
  });
});

describe('ActionButtons', () => {
  it('renders edit and delete buttons by default', () => {
    const mockProps = {
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      isEditing: false,
      isDeleting: false,
    };

    render(<ActionButtons {...mockProps} />);

    expect(screen.getByLabelText('Edit incident')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete incident')).toBeInTheDocument();
  });

  it('renders view button when onView is provided', () => {
    const mockProps = {
      onView: vi.fn(),
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      isEditing: false,
      isDeleting: false,
    };

    render(<ActionButtons {...mockProps} />);

    expect(screen.getByLabelText('View details')).toBeInTheDocument();
    expect(screen.getByLabelText('Edit incident')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete incident')).toBeInTheDocument();
  });

  it('does not render view button when onView is not provided', () => {
    const mockProps = {
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      isEditing: false,
      isDeleting: false,
    };

    render(<ActionButtons {...mockProps} />);

    expect(screen.queryByLabelText('View details')).not.toBeInTheDocument();
  });
});
