import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Incident } from '../types/incident';
import { logger } from '../utils/logger';

class IncidentStore {
  private incidents: Incident[] = [];
  private dataFile: string;

  constructor() {
    this.dataFile = path.join(process.cwd(), 'incidents.json');
    this.loadFromFile();
  }

  private loadFromFile(): void {
    try {
      if (fs.existsSync(this.dataFile)) {
        const data = fs.readFileSync(this.dataFile, 'utf-8');
        this.incidents = JSON.parse(data);
        logger.info('Incidents loaded from file', {
          count: this.incidents.length,
        });
      }
    } catch (error) {
      logger.warn('Could not load incidents from file', {
        error: error instanceof Error ? error.message : error,
      });
      this.incidents = [];
    }
  }

  private saveToFile(): void {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(this.incidents, null, 2));
      logger.debug('Incidents saved to file', { count: this.incidents.length });
    } catch (error) {
      logger.error('Could not save incidents to file', {
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  create(data: Omit<Incident, 'id' | 'created_at'>): Incident {
    const incident: Incident = {
      id: uuidv4(),
      ...data,
      created_at: new Date().toISOString(),
    };

    this.incidents.unshift(incident); // Add to beginning for latest-first order
    this.saveToFile();

    logger.info('Incident created', {
      id: incident.id,
      title: incident.title,
      type: incident.incident_type,
    });
    return incident;
  }

  getAll(): Incident[] {
    return [...this.incidents]; // Return copy to prevent external modification
  }

  findById(id: string): Incident | undefined {
    return this.incidents.find((incident) => incident.id === id);
  }

  delete(id: string): boolean {
    const initialLength = this.incidents.length;
    this.incidents = this.incidents.filter((incident) => incident.id !== id);

    if (this.incidents.length < initialLength) {
      this.saveToFile();
      logger.info('Incident deleted', { id });
      return true;
    }

    logger.warn('Attempted to delete non-existent incident', { id });
    return false;
  }

  update(
    id: string,
    data: Omit<Incident, 'id' | 'created_at'>
  ): Incident | null {
    const index = this.incidents.findIndex((incident) => incident.id === id);

    if (index === -1) {
      logger.warn('Attempted to update non-existent incident', { id });
      return null;
    }

    const existingIncident = this.incidents[index];
    const updatedIncident: Incident = {
      ...existingIncident,
      ...data,
      // Keep original id and created_at, only update image if new one provided
      id: existingIncident.id,
      created_at: existingIncident.created_at,
      image: data.image !== undefined ? data.image : existingIncident.image,
    };

    this.incidents[index] = updatedIncident;
    this.saveToFile();

    logger.info('Incident updated', {
      id: updatedIncident.id,
      title: updatedIncident.title,
    });
    return updatedIncident;
  }
}

export const incidentStore = new IncidentStore();
