export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Fire Incident API',
    version: '1.0.0',
    description: 'API for managing fire incident reports',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Incident: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          description: { type: 'string' },
          incident_type: {
            type: 'string',
            enum: [
              'Structure Fire',
              'Vehicle Fire',
              'Wildfire',
              'Electrical Fire',
              'Chemical Fire',
              'Other',
            ],
          },
          location: { type: 'string' },
          image: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'title', 'incident_type', 'created_at'],
      },
      CreateIncident: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          incident_type: {
            type: 'string',
            enum: [
              'Structure Fire',
              'Vehicle Fire',
              'Wildfire',
              'Electrical Fire',
              'Chemical Fire',
              'Other',
            ],
          },
          location: { type: 'string' },
          image: { type: 'string', format: 'binary' },
        },
        required: ['title', 'incident_type'],
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          details: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
  paths: {
    '/api/incidents': {
      get: {
        summary: 'Get all incidents',
        description:
          'Retrieve a list of all fire incidents in reverse chronological order',
        responses: {
          '200': {
            description: 'List of incidents',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Incident' },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new incident',
        description:
          'Create a new fire incident report with optional image upload',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/CreateIncident' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Incident created successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Incident' },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/incidents/{id}': {
      put: {
        summary: 'Update an incident',
        description: 'Update a fire incident by ID with optional image upload',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The ID of the incident to update',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/CreateIncident' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Incident updated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Incident' },
              },
            },
          },
          '400': {
            description: 'Bad request - Invalid ID or validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Incident not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete an incident',
        description: 'Delete a fire incident by ID',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The ID of the incident to delete',
            schema: {
              type: 'string',
              format: 'uuid',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Incident deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request - Invalid ID',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '404': {
            description: 'Incident not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
  },
};
