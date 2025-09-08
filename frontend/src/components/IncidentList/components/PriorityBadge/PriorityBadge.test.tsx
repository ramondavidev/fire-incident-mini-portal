import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriorityBadge from './PriorityBadge';

describe('PriorityBadge', () => {
  it('renders high priority for structure fire', () => {
    render(<PriorityBadge incidentType="Structure Fire" />);

    expect(screen.getByText('HIGH PRIORITY')).toBeInTheDocument();
  });

  it('renders high priority for wildfire', () => {
    render(<PriorityBadge incidentType="Wildfire" />);

    expect(screen.getByText('HIGH PRIORITY')).toBeInTheDocument();
  });

  it('renders high priority for chemical fire', () => {
    render(<PriorityBadge incidentType="Chemical Fire" />);

    expect(screen.getByText('HIGH PRIORITY')).toBeInTheDocument();
  });

  it('renders medium priority for vehicle fire', () => {
    render(<PriorityBadge incidentType="Vehicle Fire" />);

    expect(screen.getByText('MEDIUM PRIORITY')).toBeInTheDocument();
  });

  it('renders medium priority for electrical fire', () => {
    render(<PriorityBadge incidentType="Electrical Fire" />);

    expect(screen.getByText('MEDIUM PRIORITY')).toBeInTheDocument();
  });

  it('renders low priority for unknown incident types', () => {
    render(<PriorityBadge incidentType="Unknown Type" />);

    expect(screen.getByText('LOW PRIORITY')).toBeInTheDocument();
  });

  it('handles case insensitive incident types', () => {
    render(<PriorityBadge incidentType="STRUCTURE FIRE" />);

    expect(screen.getByText('HIGH PRIORITY')).toBeInTheDocument();
  });

  it('applies correct styling classes for high priority', () => {
    const { container } = render(
      <PriorityBadge incidentType="Structure Fire" />
    );
    const badge = container.querySelector('span');

    expect(badge).toHaveClass('bg-red-100', 'text-red-800', 'border-red-200');
  });

  it('applies correct styling classes for medium priority', () => {
    const { container } = render(<PriorityBadge incidentType="Vehicle Fire" />);
    const badge = container.querySelector('span');

    expect(badge).toHaveClass(
      'bg-yellow-100',
      'text-yellow-800',
      'border-yellow-200'
    );
  });

  it('applies correct styling classes for low priority', () => {
    const { container } = render(<PriorityBadge incidentType="Unknown" />);
    const badge = container.querySelector('span');

    expect(badge).toHaveClass(
      'bg-blue-100',
      'text-blue-800',
      'border-blue-200'
    );
  });

  it('renders priority dot with correct color for high priority', () => {
    const { container } = render(
      <PriorityBadge incidentType="Structure Fire" />
    );
    const dot = container.querySelector('span span');

    expect(dot).toHaveClass('bg-red-400');
  });

  it('renders priority dot with correct color for medium priority', () => {
    const { container } = render(<PriorityBadge incidentType="Vehicle Fire" />);
    const dot = container.querySelector('span span');

    expect(dot).toHaveClass('bg-yellow-400');
  });

  it('renders priority dot with correct color for low priority', () => {
    const { container } = render(<PriorityBadge incidentType="Unknown" />);
    const dot = container.querySelector('span span');

    expect(dot).toHaveClass('bg-blue-400');
  });
});
