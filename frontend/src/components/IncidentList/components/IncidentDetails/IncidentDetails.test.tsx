import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import IncidentDetails from './IncidentDetails';
import { Incident } from '@/types/incident';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => <img src={src} alt={alt} className={className} />,
}));

const mockIncident: Incident = {
  id: '1',
  title: 'Structure Fire',
  description: 'House fire in progress on Main Street',
  incident_type: 'Structure Fire',
  location: 'Main Street',
  created_at: '2024-01-01T10:00:00Z',
  image: '/uploads/fire-image.jpg',
};

const defaultProps = {
  incident: mockIncident,
  isEditing: false,
  isDeleting: false,
  onEdit: vi.fn(),
  onDelete: vi.fn(),
};

describe('IncidentDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders incident details correctly', () => {
    render(<IncidentDetails {...defaultProps} />);

    expect(
      screen.getByRole('heading', { name: 'Structure Fire' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('House fire in progress on Main Street')
    ).toBeInTheDocument();
    expect(screen.getByText('Main Street')).toBeInTheDocument();

    // Check for multiple instances of "Structure Fire" text
    const structureFireElements = screen.getAllByText('Structure Fire');
    expect(structureFireElements.length).toBeGreaterThan(0);
  });

  it('displays incident title as heading', () => {
    render(<IncidentDetails {...defaultProps} />);

    const heading = screen.getByRole('heading', { name: 'Structure Fire' });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-lg', 'font-bold', 'text-gray-900');
  });

  it('shows incident type with proper icon', () => {
    render(<IncidentDetails {...defaultProps} />);

    // Check for incident type text
    const typeElements = screen.getAllByText('Structure Fire');
    expect(typeElements.length).toBeGreaterThan(0);

    // Check for icon container
    const iconContainer = document.querySelector('.w-10.h-10.bg-red-100');
    expect(iconContainer).toBeInTheDocument();
  });

  it('displays location information', () => {
    render(<IncidentDetails {...defaultProps} />);

    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Main Street')).toBeInTheDocument();
  });

  it('shows formatted date', () => {
    render(<IncidentDetails {...defaultProps} />);

    expect(screen.getByText('Reported')).toBeInTheDocument();
    expect(screen.getByText('Jan 1, 2024')).toBeInTheDocument();
  });

  it('displays image when present', () => {
    render(<IncidentDetails {...defaultProps} />);

    const image = screen.getByAltText('Structure Fire');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining('/uploads/fire-image.jpg')
    );
  });

  it('handles missing image gracefully', () => {
    const incidentWithoutImage = { ...mockIncident, image: undefined };
    render(
      <IncidentDetails {...defaultProps} incident={incidentWithoutImage} />
    );

    const image = screen.queryByAltText('Structure Fire');
    expect(image).not.toBeInTheDocument();
  });

  it('handles missing location gracefully', () => {
    const incidentWithoutLocation = { ...mockIncident, location: undefined };
    render(
      <IncidentDetails {...defaultProps} incident={incidentWithoutLocation} />
    );

    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Not specified')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<IncidentDetails {...defaultProps} onEdit={onEdit} />);

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    render(<IncidentDetails {...defaultProps} onDelete={onDelete} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('shows editing state in action buttons', () => {
    render(<IncidentDetails {...defaultProps} isEditing={true} />);

    expect(screen.getByText('Editing...')).toBeInTheDocument();
  });

  it('shows deleting state in action buttons', () => {
    render(<IncidentDetails {...defaultProps} isDeleting={true} />);

    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });

  it('renders priority badge', () => {
    render(<IncidentDetails {...defaultProps} />);

    // Priority badge should be rendered (tested in PriorityBadge.test.tsx)
    const priorityContainer = document.querySelector('.inline-flex');
    expect(priorityContainer).toBeInTheDocument();
  });

  it('has proper CSS classes for styling', () => {
    const { container } = render(<IncidentDetails {...defaultProps} />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass(
      'group',
      'bg-white',
      'rounded-xl',
      'shadow-lg',
      'border',
      'border-gray-100'
    );
  });

  it('displays description text', () => {
    render(<IncidentDetails {...defaultProps} />);

    const description = screen.getByText(
      'House fire in progress on Main Street'
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('text-gray-700', 'mb-6', 'leading-relaxed');
  });

  it('uses environment variable for image URL', () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_URL;
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';

    render(<IncidentDetails {...defaultProps} />);

    const image = screen.getByAltText('Structure Fire');
    expect(image).toHaveAttribute(
      'src',
      'https://api.example.com/uploads/fire-image.jpg'
    );

    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  it('falls back to localhost when API URL not set', () => {
    const originalEnv = process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    render(<IncidentDetails {...defaultProps} />);

    const image = screen.getByAltText('Structure Fire');
    expect(image).toHaveAttribute(
      'src',
      'http://localhost:3001/uploads/fire-image.jpg'
    );

    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });
});
