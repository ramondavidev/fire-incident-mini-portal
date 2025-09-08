import React from 'react';
import { render } from '@testing-library/react';
import {
  StructureFireIcon,
  VehicleFireIcon,
  WildfireIcon,
  ElectricalFireIcon,
  ChemicalFireIcon,
  AlertIcon,
  LocationIcon,
  CalendarIcon,
  EditIcon,
  DeleteIcon,
  RefreshIcon,
  CheckIcon,
  CloseIcon,
  getIncidentIcon,
} from './Icons';

describe('Icons Component', () => {
  describe('Individual Icon Components', () => {
    it('renders StructureFireIcon with default className', () => {
      const { container } = render(<StructureFireIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-5', 'h-5');
    });

    it('renders VehicleFireIcon with custom className', () => {
      const { container } = render(
        <VehicleFireIcon className="w-6 h-6 text-blue-500" />
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-6', 'h-6', 'text-blue-500');
    });

    it('renders WildfireIcon correctly', () => {
      const { container } = render(<WildfireIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
    });

    it('renders ElectricalFireIcon correctly', () => {
      const { container } = render(<ElectricalFireIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders ChemicalFireIcon correctly', () => {
      const { container } = render(<ChemicalFireIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders AlertIcon correctly', () => {
      const { container } = render(<AlertIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders LocationIcon with default small size', () => {
      const { container } = render(<LocationIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-4', 'h-4');
    });

    it('renders CalendarIcon correctly', () => {
      const { container } = render(<CalendarIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders EditIcon correctly', () => {
      const { container } = render(<EditIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders DeleteIcon correctly', () => {
      const { container } = render(<DeleteIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders RefreshIcon correctly', () => {
      const { container } = render(<RefreshIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders CheckIcon correctly', () => {
      const { container } = render(<CheckIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders CloseIcon correctly', () => {
      const { container } = render(<CloseIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('getIncidentIcon Function', () => {
    it('returns StructureFireIcon for structure fire', () => {
      const { container } = render(
        <div>{getIncidentIcon('Structure Fire')}</div>
      );
      expect(container.firstChild?.firstChild).toBeInTheDocument();
    });

    it('returns VehicleFireIcon for vehicle fire', () => {
      const { container } = render(
        <div>{getIncidentIcon('Vehicle Fire')}</div>
      );
      expect(container.firstChild?.firstChild).toBeInTheDocument();
    });

    it('returns WildfireIcon for wildfire', () => {
      const { container } = render(<div>{getIncidentIcon('Wildfire')}</div>);
      expect(container.firstChild?.firstChild).toBeInTheDocument();
    });

    it('returns ElectricalFireIcon for electrical fire', () => {
      const { container } = render(
        <div>{getIncidentIcon('Electrical Fire')}</div>
      );
      expect(container.firstChild?.firstChild).toBeInTheDocument();
    });

    it('returns ChemicalFireIcon for chemical fire', () => {
      const { container } = render(
        <div>{getIncidentIcon('Chemical Fire')}</div>
      );
      expect(container.firstChild?.firstChild).toBeInTheDocument();
    });

    it('returns AlertIcon for unknown incident type', () => {
      const { container } = render(
        <div>{getIncidentIcon('Unknown Type')}</div>
      );
      expect(container.firstChild?.firstChild).toBeInTheDocument();
    });

    it('handles case-insensitive incident types', () => {
      const { container } = render(
        <div>{getIncidentIcon('STRUCTURE FIRE')}</div>
      );
      expect(container.firstChild?.firstChild).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <div>{getIncidentIcon('Structure Fire', 'w-8 h-8 text-red-600')}</div>
      );
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('w-8', 'h-8', 'text-red-600');
    });
  });

  describe('SVG Attributes', () => {
    it('all icons have proper SVG attributes', () => {
      const icons = [
        <StructureFireIcon key="1" />,
        <VehicleFireIcon key="2" />,
        <WildfireIcon key="3" />,
        <ElectricalFireIcon key="4" />,
        <ChemicalFireIcon key="5" />,
        <AlertIcon key="6" />,
        <LocationIcon key="7" />,
        <CalendarIcon key="8" />,
        <EditIcon key="9" />,
        <DeleteIcon key="10" />,
        <RefreshIcon key="11" />,
        <CheckIcon key="12" />,
        <CloseIcon key="13" />,
      ];

      icons.forEach((icon, index) => {
        const { container } = render(icon);
        const svg = container.querySelector('svg');
        expect(svg).toHaveAttribute('fill', 'currentColor');
        expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
      });
    });
  });
});
