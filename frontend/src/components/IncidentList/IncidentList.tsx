'use client';

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useIncidents } from '@/hooks/useIncidents';
import { LoadingState, ErrorState, EmptyState } from './components/UIStates';
import IncidentHeader from './components/IncidentHeader';
import IncidentItem from './components/IncidentItem';
import type { IncidentFormData } from './components/IncidentEditForm';

const IncidentList = () => {
  const {
    incidents,
    loading,
    error,
    fetchIncidents,
    deleteIncident,
    updateIncident,
  } = useIncidents();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        await deleteIncident(id);
      } catch (error) {
        console.error('Failed to delete incident:', error);
      } finally {
        setDeletingId(null);
      }
    },
    [deleteIncident]
  );

  const handleEdit = useCallback((id: string) => {
    setEditingId(id);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleUpdateIncident = useCallback(
    async (id: string, data: IncidentFormData, image: File | null) => {
      try {
        await updateIncident({ id, ...data, image: image || undefined });
        setEditingId(null);
        await fetchIncidents();
      } catch (error) {
        console.error('Failed to update incident:', error);
      }
    },
    [updateIncident, fetchIncidents]
  );

  const renderedIncidents = useMemo(
    () =>
      (incidents || []).map((incident) => (
        <IncidentItem
          key={incident.id}
          incident={incident}
          editingId={editingId}
          deletingId={deletingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCancelEdit={handleCancelEdit}
          onUpdateIncident={handleUpdateIncident}
        />
      )),
    [
      incidents,
      editingId,
      deletingId,
      handleEdit,
      handleDelete,
      handleCancelEdit,
      handleUpdateIncident,
    ]
  );

  // Handle different UI states
  if (loading) return <LoadingState />;
  if (error)
    return <ErrorState message={error.message} onRetry={fetchIncidents} />;
  if (!incidents || incidents.length === 0) return <EmptyState />;

  return (
    <div className="space-y-8">
      <IncidentHeader
        incidentCount={incidents?.length || 0}
        onRefresh={fetchIncidents}
      />

      <div className="grid gap-6">{renderedIncidents}</div>
    </div>
  );
};

export default memo(IncidentList);
