import { useCallback, useMemo } from 'react';
import { Incident } from '@/types/incident';
import { useCrudApi } from './useApi';
import { apiClient } from '@/lib/api-client';
import { ApiError } from '@/lib/api-error';
import { useToast } from '@/contexts/ToastContext';

export interface CreateIncidentData {
  title: string;
  description: string;
  incident_type: string;
  location: string;
  image?: File;
}

export interface UpdateIncidentData extends CreateIncidentData {
  id: string;
}

export function useIncidents() {
  const { state, setState } = useCrudApi<Incident>();
  const { showError, showSuccess } = useToast();

  const fetchIncidents = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const incidents = await apiClient.getIncidents();
      setState({ data: incidents, loading: false, error: null });
      return incidents;
    } catch (error) {
      showError(error, 'Loading Incidents');
      const apiError = {
        message:
          error instanceof Error ? error.message : 'Failed to fetch incidents',
      };
      setState({ data: null, loading: false, error: apiError });
      throw error;
    }
  }, [setState, showError]);

  const createIncident = useCallback(
    async (data: CreateIncidentData): Promise<Incident> => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('incident_type', data.incident_type);
      formData.append('location', data.location);
      if (data.image) {
        formData.append('image', data.image);
      }

      try {
        const result = await apiClient.createIncident(formData);
        showSuccess('Incident created successfully');

        // Update local state
        setState((prev) => ({
          ...prev,
          data: prev.data ? [...prev.data, result] : [result],
        }));

        return result;
      } catch (error) {
        showError(error, 'Creating Incident');
        throw error;
      }
    },
    [setState, showError, showSuccess]
  );

  const updateIncident = useCallback(
    async (data: UpdateIncidentData): Promise<Incident> => {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('incident_type', data.incident_type);
      formData.append('location', data.location);
      if (data.image) {
        formData.append('image', data.image);
      }

      try {
        const result = await apiClient.updateIncident(data.id, formData);
        showSuccess('Incident updated successfully');

        // Update local state
        setState((prev) => ({
          ...prev,
          data: prev.data
            ? prev.data.map((incident) =>
                incident.id === data.id ? result : incident
              )
            : [result],
        }));

        return result;
      } catch (error) {
        showError(error, 'Updating Incident');
        throw error;
      }
    },
    [setState, showError, showSuccess]
  );

  const deleteIncident = useCallback(
    async (id: string): Promise<void> => {
      try {
        await apiClient.deleteIncident(id);
        showSuccess('Incident deleted successfully');

        // Update local state by removing the incident
        setState((prev) => ({
          ...prev,
          data: prev.data
            ? prev.data.filter((incident) => incident.id !== id)
            : null,
        }));
      } catch (error) {
        showError(error, 'Deleting Incident');
        throw error;
      }
    },
    [setState, showError, showSuccess]
  );

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      incidents: state.data || [],
      loading: state.loading,
      error: state.error,
      fetchIncidents,
      createIncident,
      updateIncident,
      deleteIncident,
    }),
    [
      state.data,
      state.loading,
      state.error,
      fetchIncidents,
      createIncident,
      updateIncident,
      deleteIncident,
    ]
  );
}
