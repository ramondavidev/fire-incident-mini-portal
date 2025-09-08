import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import incidentRoutes from '../src/routes/incidents';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/incidents', incidentRoutes);

describe('Incidents API', () => {
  it('should get empty incidents list initially', async () => {
    const response = await request(app).get('/api/incidents').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should require authentication for POST', async () => {
    await request(app)
      .post('/api/incidents')
      .send({
        title: 'Test Incident',
        incident_type: 'Structure Fire',
      })
      .expect(401);
  });

  it('should validate required fields', async () => {
    await request(app)
      .post('/api/incidents')
      .set('Authorization', 'Bearer fire-incident-secret-2024')
      .send({})
      .expect(400);
  });

  it('should require authentication for DELETE', async () => {
    await request(app).delete('/api/incidents/test-id').expect(401);
  });

  it('should return 404 for non-existent incident deletion', async () => {
    await request(app)
      .delete('/api/incidents/non-existent-id')
      .set('Authorization', 'Bearer fire-incident-secret-2024')
      .expect(404);
  });

  it('should require authentication for PUT', async () => {
    await request(app)
      .put('/api/incidents/test-id')
      .send({
        title: 'Updated Incident',
        incident_type: 'Structure Fire',
      })
      .expect(401);
  });

  it('should return 404 for non-existent incident update', async () => {
    await request(app)
      .put('/api/incidents/non-existent-id')
      .set('Authorization', 'Bearer fire-incident-secret-2024')
      .send({
        title: 'Updated Incident',
        incident_type: 'Structure Fire',
      })
      .expect(404);
  });
});
