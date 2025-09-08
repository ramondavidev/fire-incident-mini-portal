export interface Incident {
  id: string;
  title: string;
  description?: string;
  incident_type: string;
  location?: string;
  image?: string;
  created_at: string;
}

export const INCIDENT_TYPES = [
  'Structure Fire',
  'Vehicle Fire',
  'Wildfire',
  'Electrical Fire',
  'Chemical Fire',
  'Other',
] as const;

export type IncidentType = (typeof INCIDENT_TYPES)[number];
