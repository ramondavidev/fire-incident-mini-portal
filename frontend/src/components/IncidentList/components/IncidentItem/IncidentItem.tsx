import React, { memo, useCallback } from 'react';
import { Incident } from '@/types/incident';
import IncidentDetails from '../IncidentDetails';
import IncidentEditForm, { IncidentFormData } from '../IncidentEditForm';

interface IncidentItemProps {
  incident: Incident;
  editingId: string | null;
  deletingId: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCancelEdit: () => void;
  onUpdateIncident: (
    id: string,
    data: IncidentFormData,
    image: File | null
  ) => void;
}

const IncidentItem = memo<IncidentItemProps>(
  ({
    incident,
    editingId,
    deletingId,
    onEdit,
    onDelete,
    onCancelEdit,
    onUpdateIncident,
  }) => {
    const isEditing = editingId === incident.id;
    const isDeleting = deletingId === incident.id;

    const handleEdit = useCallback(() => {
      onEdit(incident.id);
    }, [incident.id, onEdit]);

    const handleDelete = useCallback(() => {
      onDelete(incident.id);
    }, [incident.id, onDelete]);

    const handleSave = useCallback(
      (data: IncidentFormData, image: File | null) => {
        onUpdateIncident(incident.id, data, image);
      },
      [incident.id, onUpdateIncident]
    );

    // If in editing mode, show the edit form
    if (isEditing) {
      const initialData: IncidentFormData = {
        title: incident.title,
        description: incident.description || '',
        incident_type: incident.incident_type,
        location: incident.location || '',
      };

      return (
        <IncidentEditForm
          initialData={initialData}
          onSave={handleSave}
          onCancel={onCancelEdit}
        />
      );
    }

    // Otherwise, show the incident details
    return (
      <IncidentDetails
        incident={incident}
        isEditing={isEditing}
        isDeleting={isDeleting}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );
  }
);

IncidentItem.displayName = 'IncidentItem';

export default IncidentItem;
