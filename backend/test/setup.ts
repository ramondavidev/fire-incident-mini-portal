import { vi, beforeEach } from 'vitest';

// Mock environment variables
vi.stubEnv('NODE_ENV', 'test');
vi.stubEnv('UPLOAD_DIR', 'test-uploads');
vi.stubEnv('API_TOKEN', 'fire-incident-secret-2024');

beforeEach(() => {
  vi.clearAllMocks();
});
