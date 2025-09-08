import React, { memo } from 'react';

interface PriorityBadgeProps {
  incidentType: string;
}

type PriorityLevel = 'high' | 'medium' | 'low';

interface Priority {
  level: PriorityLevel;
  color: string;
  dotColor: string;
}

const getPriorityLevel = (type: string): Priority => {
  const normalizedType = (type || '').toLowerCase();
  switch (normalizedType) {
    case 'structure fire':
    case 'wildfire':
    case 'chemical fire':
      return {
        level: 'high',
        color: 'bg-red-100 text-red-800 border-red-200',
        dotColor: 'bg-red-400',
      };
    case 'vehicle fire':
    case 'electrical fire':
      return {
        level: 'medium',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dotColor: 'bg-yellow-400',
      };
    default:
      return {
        level: 'low',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        dotColor: 'bg-blue-400',
      };
  }
};

const PriorityBadge: React.FC<PriorityBadgeProps> = memo(({ incidentType }) => {
  const priority = getPriorityLevel(incidentType);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${priority.color}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${priority.dotColor}`}
      ></span>
      {priority.level.toUpperCase()} PRIORITY
    </span>
  );
});

PriorityBadge.displayName = 'PriorityBadge';

export default PriorityBadge;
