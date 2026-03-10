# Test Instance Setup Guide

This guide walks through creating a staging/test instance of the ShorelineVision application on the same VPS as production without disturbing the live site. The test instance runs from its own checkout, uses an isolated PostgreSQL database, and binds to a different port behind an Nginx subdomain.

## 1. Prerequisites
- Node.js 20.x (same as production)
- PostgreSQL server access with privileges to create databases/users
- Git and basic shell access to `/var/www`
- Domain or DNS entry for the staging site (e.g. `staging.alashoremarine.com`)
- Existing production instance remains untouched during the procedure

## 2. Prepare a Separate Application Directory
```bash
cd /var/www
cp -R testAlashore/ShorelineVision testAlashore/ShorelineVision-staging
cd testAlashore/ShorelineVision-staging
```
> You can also `git clone` the repository into `ShorelineVision-staging` instead of copying if you prefer a clean git history.

The clone provides a dedicated `uploads/` directory and `dist/` build output so files do not collide with production.

## 3. Provision a Staging Database
Create a separate database/user so test data never touches production:
```sql
sudo -u postgres psql
CREATE DATABASE shoreline_staging;
CREATE USER shoreline_staging_user WITH ENCRYPTED PASSWORD 'change_me_strong_password';
GRANT ALL PRIVILEGES ON DATABASE shoreline_staging TO shoreline_staging_user;
\q
```

## 4. Configure Environment Variables
1. Copy the staging template:
   ```bash
   cd /var/www/testAlashore/ShorelineVision-staging
   cp .env.staging.example .env.staging
   ```
2. Update `.env.staging` with the staging credentials:
   - `DATABASE_URL=postgresql://shoreline_staging_user:<password>@localhost:5432/shoreline_staging`
   - `SESSION_SECRET=` generate a unique, long random string (do **not** reuse production)
   - Set `PORT=5100` (or any unused port)
   - Add optional email or object storage variables if you need to exercise those code paths

## 5. Install Dependencies and Build
```bash
npm ci
npm run build
```

## 6. Apply Database Migrations
Use the Drizzle migration script against the staging database:
```bash
DATABASE_URL=postgresql://shoreline_staging_user:<password>@localhost:5432/shoreline_staging \
PGHOST=localhost PGPORT=5432 PGUSER=shoreline_staging_user PGPASSWORD=<password> PGDATABASE=shoreline_staging \
npm run db:push
```
For convenience you can export these variables or place them directly in `.env.staging` (see template).

## 7. Seed an Admin Account
```bash
NODE_ENV=production \
DATABASE_URL=postgresql://shoreline_staging_user:<password>@localhost:5432/shoreline_staging \
node create-admin.js staging-admin StrongPass123 staging-admin@example.com
```
Use throwaway credentials; the staging environment should never share production logins.

## 8. Configure Process Manager (systemd example)
1. Copy the provided unit file template:
   ```bash
   sudo cp systemd/alashore-marine-staging.service /etc/systemd/system/
   ```
2. Edit `/etc/systemd/system/alashore-marine-staging.service` and confirm:
   - `WorkingDirectory=/var/www/testAlashore/ShorelineVision-staging`
   - `EnvironmentFile=/var/www/testAlashore/ShorelineVision-staging/.env.staging`
   - `ExecStart=/usr/bin/node dist/index.js`
3. Reload and start:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable --now alashore-marine-staging
   sudo systemctl status alashore-marine-staging
   ```
If you prefer PM2, create a separate `ecosystem` entry referencing `.env.staging` and `PORT=5100`.

## 9. Nginx Staging Virtual Host
Create `/etc/nginx/sites-available/shorelinevision-staging` using the sample below, then enable it.
```nginx
server {
    listen 80;
    server_name staging.alashoremarine.com;

    location / {
        proxy_pass http://127.0.0.1:5100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/shorelinevision-staging /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
Add HTTPS via Certbot once the host resolves correctly.

## 10. Smoke Test
- `curl http://127.0.0.1:5100/api/test` should respond with JSON.
- Load `https://staging.alashoremarine.com/temp-login` and confirm you can sign in with the staging admin.
- Upload an image and ensure it lands in `ShorelineVision-staging/uploads`.

## 11. Updating the Test Instance
When you want to test new changes:
```bash
cd /var/www/testAlashore/ShorelineVision-staging
git pull                # or copy in new code
npm ci                  # when package.json changes
npm run build
NODE_ENV=production npm run db:push
sudo systemctl restart alashore-marine-staging
```
Run smoke tests after each update, and destroy/rebuild the staging database if you need a clean slate.

## 12. Cleaning Up
To remove the staging instance:
```bash
sudo systemctl disable --now alashore-marine-staging
sudo rm /etc/systemd/system/alashore-marine-staging.service
sudo systemctl daemon-reload
sudo rm /etc/nginx/sites-enabled/shorelinevision-staging
sudo systemctl reload nginx
sudo -u postgres dropdb shoreline_staging
sudo -u postgres dropuser shoreline_staging_user
rm -rf /var/www/testAlashore/ShorelineVision-staging
```

The production deployment in `/var/www/testAlashore/ShorelineVision` will stay intact throughout this entire workflow.
