# Docker Setup Guide

## Docker Installation Required

This project includes Docker configuration, but Docker Desktop needs to be installed first.

### 1. Install Docker Desktop

**For Windows:**

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop/
2. Run the installer
3. Restart your computer
4. Start Docker Desktop

**For macOS:**

1. Download Docker Desktop for Mac
2. Drag to Applications folder
3. Open Docker Desktop

**For Linux:**

1. Follow installation guide: https://docs.docker.com/engine/install/

### 2. Verify Installation

After installing Docker Desktop, open a new terminal and verify:

```bash
docker --version
docker compose --version
```

### 3. Running the Application with Docker

Once Docker is installed, you can run the application:

```bash
# From the project root directory
docker compose up -d

# Check if containers are running
docker compose ps

# View logs
docker compose logs

# Stop the application
docker compose down
```

## Alternative: Running Without Docker

If you prefer not to use Docker, you can run the application normally:

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Setup Steps

1. **Install root dependencies:**

   ```bash
   npm install
   ```

2. **Install frontend dependencies:**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Create environment file:**

   ```bash
   # Create backend/.env
   API_TOKEN=fire-incident-secret-2024
   ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
   ```

5. **Start both services:**

   ```bash
   # From project root
   npm run dev
   ```

6. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs

## Environment Variables for Docker

When using Docker, create these environment files:

### `.env` (for docker-compose.prod.yml)

```bash
API_TOKEN=your-secure-production-token
ALLOWED_ORIGINS=https://your-domain.com
REDIS_PASSWORD=your-redis-password
```

## Docker Commands Reference

```bash
# Development
docker compose up -d                    # Start in background
docker compose up                       # Start with logs
docker compose down                     # Stop all services
docker compose logs                     # View all logs
docker compose logs backend             # View backend logs only
docker compose logs -f frontend         # Follow frontend logs

# Production
docker compose -f docker-compose.prod.yml up -d

# Building images
docker compose build                    # Build all services
docker compose build backend           # Build specific service

# Debugging
docker compose exec backend sh         # Access backend container
docker compose exec frontend sh        # Access frontend container
```

## Troubleshooting

### Common Issues:

1. **Port conflicts:** If ports 3000 or 3001 are in use, stop other services or modify the docker-compose.yml ports

2. **Permission issues:** On Linux/macOS, you may need to adjust file permissions:

   ```bash
   sudo chown -R $USER:$USER uploads logs
   ```

3. **Build errors:** Clear Docker cache and rebuild:

   ```bash
   docker compose down
   docker system prune -a
   docker compose build --no-cache
   docker compose up -d
   ```

4. **Environment variables:** Ensure all required environment variables are set in .env files

## Performance Tips

- Use Docker Desktop with increased memory allocation (4GB+)
- Enable BuildKit for faster builds: `DOCKER_BUILDKIT=1`
- Use Docker volumes for better performance on Windows/macOS
