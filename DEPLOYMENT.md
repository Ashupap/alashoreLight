# Deployment Documentation - Alashore Light

This repository contains the lightweight version of the Alashore Marine website, optimized for performance and ease of deployment. It features a standalone Node.js/Express backend that handles contact form inquiries via Nodemailer (Gmail SMTP).

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Option 1: Docker Deployment (Recommended)](#option-1-docker-deployment-recommended)
4. [Option 2: PM2 Deployment](#option-2-pm2-deployment)
5. [Nginx Configuration](#nginx-configuration)

---

## Prerequisites
- Node.js 20+ (for PM2 deployment)
- Docker & Docker Compose (for containerized deployment)
- A Gmail account with an **App Password** for sending emails.

## Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
PORT=5100
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
NOTIFICATION_EMAIL=recipient-email@alashoremarine.com
```

---

## Option 1: Docker Deployment (Recommended)
The app is containerized using a multi-stage Docker build for efficiency.

### Steps:
1. **Build and Start**:
   ```bash
   docker compose up -d --build
   ```
2. **Verify**:
   ```bash
   docker logs alashore-light -f
   ```
3. **Stop**:
   ```bash
   docker compose down
   ```

---

## Option 2: PM2 Deployment
If you prefer running without Docker, you can use the provided ecosystem configuration.

### Steps:
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Build the Frontend**:
   ```bash
   npm run build
   ```
3. **Start with PM2**:
   ```bash
   pm2 start ecosystem.config.cjs
   ```
4. **Manage Process**:
   ```bash
   pm2 status alashore-light
   pm2 logs alashore-light
   ```

---

## Nginx Configuration
To serve the app on a standard port (80 or 443), use Nginx as a reverse proxy.

### Sample Configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Optional: Serve static assets directly for better performance
    location /attached_assets/ {
        alias /path/to/your/app/attached_assets/;
        expires 1y;
    }
}
```

## Security Note
The `.env` and `ecosystem.config.cjs` (if it contains secrets) should NOT be committed to public repositories. This repository includes a template `ecosystem.config.cjs` but assumes secrets are managed via environment variables.
