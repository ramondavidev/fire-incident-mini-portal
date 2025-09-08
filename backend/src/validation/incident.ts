import { z } from 'zod';
import { INCIDENT_TYPES } from '../types/incident';

export const createIncidentSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  incident_type: z.enum(INCIDENT_TYPES, {
    errorMap: () => ({ message: 'Invalid incident type' }),
  }),
  location: z.string().optional(),
});

export type CreateIncidentInput = z.infer<typeof createIncidentSchema>;
