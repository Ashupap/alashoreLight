# Test Environment Setup

This document describes the configuration of the **Test/Staging Instance** running in this repository.

## Overview

The test instance allows us to verify changes in a production-like environment before deploying to the main production server.

- **URL**: `http://<SERVER_IP>:8091`
- **Port**: `5100` (Internal App Port), `8091` (Nginx External Port)
- **Database**: `test_alashore_marine`
- **Process Manager**: PM2

## Configuration Files

The following files are **local-only** and ignored by git (added to `.gitignore`):

1.  **`ecosystem.config.cjs`**:
    -   Defines the PM2 process configuration.
    -   Contains environment variables specific to the test instance (DB credentials, Session Secret).
    -   **Important**: This file contains secrets and must NOT be committed to the repository.

2.  **`.env`**:
    -   Used by the application for local development or when sourced manually.
    -   Must align with the variables in `ecosystem.config.cjs`.

## Setup Instructions

### 1. Database

Ensure the test database exists:

```bash
psql -U postgres -c "CREATE DATABASE test_alashore_marine;"
# Run migrations
DATABASE_URL=postgresql://user:pass@localhost/test_alashore_marine npm run db:push
```

### 2. Nginx Configuration

The Nginx configuration is located at `/etc/nginx/sites-available/test-alashore` and maps port **8091** to internal port **5100**.

```nginx
server {
    listen 8091;
    server_name _;
    
    location / {
        proxy_pass http://localhost:5100;
        # ... standard proxy headers ...
    }
}
```

### 3. Running the Instance

We use PM2 to manage the test instance.

**Start/Restart:**
```bash
# Start using the specific ecosystem config
pm2 start ecosystem.config.cjs --env production

# Restart
pm2 restart alashore-test

# Stop
pm2 stop alashore-test
```

**Logs:**
```bash
pm2 logs alashore-test
```

## Deployment

To update the test instance with the latest code:

1.  Pull the latest changes:
    ```bash
    git pull origin main
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Build the project:
    ```bash
    npm run build
    ```
4.  Restart the process:
    ```bash
    pm2 restart alashore-test
    ```
