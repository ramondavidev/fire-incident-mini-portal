import React, { memo } from 'react';
import Image from 'next/image';
import { Incident } from '@/types/incident';
import { getIncidentIcon, LocationIcon, CalendarIcon } from '../Icons';
import PriorityBadge from '../PriorityBadge';
import ActionButtons from '../ActionButtons';

interface IncidentDetailsProps {
  incident: Incident;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const IncidentDetails = memo<IncidentDetailsProps>(
  ({ incident, isEditing, isDeleting, onEdit, onDelete }) => (
    <div className="group bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              {getIncidentIcon(incident.incident_type)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {incident.title}
              </h3>
              <PriorityBadge incidentType={incident.incident_type} />
            </div>
          </div>
          <ActionButtons
            onEdit={onEdit}
            onDelete={onDelete}
            isEditing={isEditing}
            isDeleting={isDeleting}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-700 mb-6 leading-relaxed">
          {incident.description}
        </p>

        {/* Details grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
              {getIncidentIcon(incident.incident_type, 'w-4 h-4')}
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Type
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {incident.incident_type}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              <LocationIcon />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Location
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {incident.location || 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              <CalendarIcon />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Reported
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(incident.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        {incident.image && (
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${incident.image}`}
              alt={incident.title}
              width={600}
              height={300}
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </div>
    </div>
  )
);

IncidentDetails.displayName = 'IncidentDetails';

export default IncidentDetails;
