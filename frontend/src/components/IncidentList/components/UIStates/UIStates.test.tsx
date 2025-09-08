import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LoadingState, ErrorState, EmptyState } from './UIStates';

describe('LoadingState', () => {
  it('renders loading spinner and text', () => {
    render(<LoadingState />);

    expect(screen.getByText('Loading incidents...')).toBeInTheDocument();
  });

  it('displays loading animation elements', () => {
    const { container } = render(<LoadingState />);
    const spinners = container.querySelectorAll('.animate-spin');

    expect(spinners).toHaveLength(2);
  });

  it('renders clock icon', () => {
    const { container } = render(<LoadingState />);
    const clockIcon = container.querySelector('svg');

    expect(clockIcon).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  const mockOnRetry = vi.fn();
  const defaultProps = {
    message: 'Failed to load incidents',
    onRetry: mockOnRetry,
  };

  beforeEach(() => {
    mockOnRetry.mockClear();
  });

  it('renders error message and title', () => {
    render(<ErrorState {...defaultProps} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to load incidents')).toBeInTheDocument();
  });

  it('renders try again button', () => {
    render(<ErrorState {...defaultProps} />);

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('calls onRetry when try again button is clicked', () => {
    render(<ErrorState {...defaultProps} />);

    fireEvent.click(screen.getByText('Try Again'));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('renders error icon', () => {
    const { container } = render(<ErrorState {...defaultProps} />);
    const errorIcon = container.querySelector('.bg-red-100 svg');

    expect(errorIcon).toBeInTheDocument();
  });

  it('displays custom error message', () => {
    const customMessage = 'Network connection failed';
    render(<ErrorState message={customMessage} onRetry={mockOnRetry} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders empty state title and description', () => {
    render(<EmptyState />);

    expect(screen.getByText('No incidents reported yet')).toBeInTheDocument();
    expect(
      screen.getByText(/When fire incidents are reported/)
    ).toBeInTheDocument();
  });

  it('renders fire icon', () => {
    const { container } = render(<EmptyState />);
    const fireIcon = container.querySelector('.bg-gradient-to-br svg');

    expect(fireIcon).toBeInTheDocument();
  });

  it('renders monitoring indicator', () => {
    render(<EmptyState />);

    expect(screen.getByText('Monitoring for incidents...')).toBeInTheDocument();
  });

  it('has proper styling for empty state container', () => {
    const { container } = render(<EmptyState />);
    const emptyContainer = container.querySelector('.text-center.py-20');

    expect(emptyContainer).toBeInTheDocument();
  });

  it('renders info icon in monitoring section', () => {
    const { container } = render(<EmptyState />);
    const infoIcon = container.querySelector('.text-gray-400 svg');

    expect(infoIcon).toBeInTheDocument();
  });
});
