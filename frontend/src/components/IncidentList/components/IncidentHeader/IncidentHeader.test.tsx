import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IncidentHeader from './IncidentHeader';

describe('IncidentHeader', () => {
  const mockOnRefresh = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders incident header with count', () => {
    render(<IncidentHeader incidentCount={5} onRefresh={mockOnRefresh} />);

    expect(screen.getByText('Fire Incidents')).toBeInTheDocument();
    expect(screen.getByText('5 Total')).toBeInTheDocument();
  });

  it('displays last updated time', () => {
    render(<IncidentHeader incidentCount={3} onRefresh={mockOnRefresh} />);

    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it('shows refresh button', () => {
    render(<IncidentHeader incidentCount={2} onRefresh={mockOnRefresh} />);

    const refreshButton = screen.getByRole('button');
    expect(refreshButton).toBeInTheDocument();
    expect(refreshButton).toHaveTextContent('Refresh');
  });

  it('calls onRefresh when refresh button is clicked', () => {
    render(<IncidentHeader incidentCount={4} onRefresh={mockOnRefresh} />);

    const refreshButton = screen.getByRole('button');
    fireEvent.click(refreshButton);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('applies correct styling classes', () => {
    const { container } = render(
      <IncidentHeader incidentCount={1} onRefresh={mockOnRefresh} />
    );

    expect(container.firstChild).toHaveClass(
      'bg-white',
      'rounded-xl',
      'shadow-sm',
      'border',
      'border-gray-100',
      'p-6'
    );
  });

  it('displays correct icon', () => {
    const { container } = render(
      <IncidentHeader incidentCount={0} onRefresh={mockOnRefresh} />
    );

    // The icon should be present (SVG)
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
