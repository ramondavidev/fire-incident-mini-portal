import { Router, Request, Response } from 'express';
import { createIncidentSchema } from '../validation/incident';
import { incidentStore } from '../services/incident';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/incidents - List all incidents
router.get('/', (req: Request, res: Response) => {
  try {
    const incidents = incidentStore.getAll();
    logger.info('Retrieved all incidents', { count: incidents.length });
    res.json(incidents);
  } catch (error) {
    logger.error('Error fetching incidents', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/incidents - Create new incident (requires auth)
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  (req: Request, res: Response) => {
    try {
      // Validate input
      const validationResult = createIncidentSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors,
        });
      }

      const data = validationResult.data;

      // Add image path if file was uploaded
      const incidentData = {
        ...data,
        image: req.file ? `/uploads/${req.file.filename}` : undefined,
      };

      const incident = incidentStore.create(incidentData);

      logger.info('Created new incident', {
        incidentId: incident.id,
        incidentType: incident.incident_type,
      });
      res.status(201).json(incident);
    } catch (error) {
      logger.error('Error creating incident', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// PUT /api/incidents/:id - Update incident (requires auth)
router.put(
  '/:id',
  authMiddleware,
  upload.single('image'),
  (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'Incident ID is required' });
      }

      // Validate input
      const validationResult = createIncidentSchema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors,
        });
      }

      const data = validationResult.data;

      // Add image path if file was uploaded, otherwise keep existing image
      const incidentData = {
        ...data,
        image: req.file ? `/uploads/${req.file.filename}` : undefined,
      };

      const updatedIncident = incidentStore.update(id, incidentData);

      if (!updatedIncident) {
        logger.warn('Attempted to update non-existent incident', {
          incidentId: id,
        });
        return res.status(404).json({ error: 'Incident not found' });
      }

      logger.info('Updated incident', {
        incidentId: id,
        incidentType: updatedIncident.incident_type,
      });
      res.status(200).json(updatedIncident);
    } catch (error) {
      logger.error('Error updating incident', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// DELETE /api/incidents/:id - Delete incident (requires auth)
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Incident ID is required' });
    }

    const deleted = incidentStore.delete(id);

    if (!deleted) {
      logger.warn('Attempted to delete non-existent incident', {
        incidentId: id,
      });
      return res.status(404).json({ error: 'Incident not found' });
    }

    logger.info('Deleted incident', { incidentId: id });
    res.status(200).json({ message: 'Incident deleted successfully' });
  } catch (error) {
    logger.error('Error deleting incident', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
