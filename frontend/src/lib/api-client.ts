import { Incident } from '@/types/incident';
import { ApiError, ApiErrorResponse } from './api-error';

export class ApiClient {
  private baseUrl: string;
  private apiToken: string;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  ) {
    this.baseUrl = baseUrl;
    this.apiToken = process.env.API_TOKEN || 'fire-incident-secret-2024';
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
    };

    // Only add headers if not FormData
    if (!(options.body instanceof FormData)) {
      config.headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
    } else if (options.headers) {
      // For FormData, merge with existing headers
      config.headers = {
        ...config.headers,
        ...options.headers,
      };
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData: ApiErrorResponse;

      try {
        errorData = await response.json();
      } catch {
        // If we can't parse JSON, create a basic error response
        errorData = {
          error: 'Network Error',
          message: `HTTP ${response.status}: ${response.statusText}`,
          statusCode: response.status,
        };
      }

      // Extract retry-after header for rate limiting
      const retryAfter = response.headers.get('retry-after');
      if (retryAfter) {
        errorData.retryAfter = parseInt(retryAfter, 10);
      }

      throw new ApiError(response, errorData);
    }

    // Handle empty responses (like DELETE)
    if (
      response.status === 204 ||
      (response.headers && response.headers.get('content-length') === '0')
    ) {
      return {} as T;
    }

    return response.json();
  }

  // Incident API methods
  async getIncidents(): Promise<Incident[]> {
    return this.request<Incident[]>('/api/incidents');
  }

  async createIncident(data: FormData): Promise<Incident> {
    return this.request<Incident>('/api/incidents', {
      method: 'POST',
      body: data,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });
  }

  async updateIncident(id: string, data: FormData): Promise<Incident> {
    return this.request<Incident>(`/api/incidents/${id}`, {
      method: 'PUT',
      body: data,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });
  }

  async deleteIncident(id: string): Promise<void> {
    return this.request(`/api/incidents/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    });
  }
}

// Export a singleton instance
export const apiClient = new ApiClient();
