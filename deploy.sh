#!/bin/bash

# Alashore Marine Production Deployment Script
# This script updates the entire application including database schema

set -e  # Exit on any error

echo "🚀 Starting Alashore Marine Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo access."
   exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

print_status "Checking Node.js version..."
NODE_VERSION=$(node -v)
print_success "Node.js version: $NODE_VERSION"

# Backup current deployment
print_status "Creating backup of current deployment..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
if [ -d "node_modules" ]; then
    mkdir -p "$BACKUP_DIR"
    cp -r package.json package-lock.json "$BACKUP_DIR/" 2>/dev/null || true
    print_success "Backup created: $BACKUP_DIR"
else
    print_warning "No existing deployment found, skipping backup"
fi

# Update system packages (optional, uncomment if needed)
# print_status "Updating system packages..."
# sudo apt update && sudo apt upgrade -y

# Pull latest code (if using git)
if [ -d ".git" ]; then
    print_status "Pulling latest code from repository..."
    git pull origin main || git pull origin master
    print_success "Code updated from repository"
else
    print_warning "Not a git repository, assuming code is already updated"
fi

# Install/Update Node.js dependencies
print_status "Installing Node.js dependencies..."
if [ -f "package-lock.json" ]; then
    npm ci --production=false
else
    npm install
fi
print_success "Dependencies installed"

# Environment variables check
print_status "Checking environment variables..."
# Check for production environment file first
if [ -f ".env.production" ]; then
    ENV_FILE=".env.production"
    print_status "Using .env.production for production deployment"
else
    ENV_FILE=".env"
fi

if [ ! -f "$ENV_FILE" ]; then
    print_warning "No .env file found. Creating template..."
    cat > "$ENV_FILE" << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/alashore_marine
PGHOST=localhost
PGPORT=5432
PGUSER=alashore_user
PGPASSWORD=your_secure_password
PGDATABASE=alashore_marine

# Session Secret (generate a secure random string)
SESSION_SECRET=your_very_secure_session_secret_at_least_32_characters_long

# Application Configuration
NODE_ENV=production
PORT=4000

# Email Configuration for Inquiry Notifications (Required)
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
NOTIFICATION_EMAIL=your_admin_email@company.com

# File Upload Configuration
# Option 1: Use local file storage (recommended for simple setups)
# Leave the object storage variables commented out to use local storage

# Option 2: Use Replit Object Storage (for advanced cloud storage)
# Uncomment and configure these if you want to use cloud object storage:
# DEFAULT_OBJECT_STORAGE_BUCKET_ID=your_bucket_id
# PUBLIC_OBJECT_SEARCH_PATHS=/your_bucket_id/public
# PRIVATE_OBJECT_DIR=/your_bucket_id/.private
EOF
    print_warning "Please edit $ENV_FILE with your actual configuration before continuing!"
    print_warning "Press Enter to continue after updating the .env file..."
    read -r
fi

# Source environment variables
if [ -f "$ENV_FILE" ]; then
    set -a
    source "$ENV_FILE"
    set +a
    print_success "Environment variables loaded"
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL is not set in .env file"
    exit 1
fi

# Database operations
print_status "Setting up database..."

# Extract database details from DATABASE_URL
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')

# Test database connection
print_status "Testing database connection..."
if pg_isready -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" &> /dev/null; then
    print_success "Database connection successful"
else
    print_error "Cannot connect to database. Please check your database configuration."
    exit 1
fi

# Run database migrations - SAFE MODE
print_status "Checking database schema..."

# First, backup existing data before any migrations
if [ ! -z "$DATABASE_URL" ]; then
    print_status "Creating data backup before migration..."
    mkdir -p backups
    pg_dump "$DATABASE_URL" > "backups/pre-migration-$(date +%Y%m%d-%H%M%S).sql" 2>/dev/null || {
        print_warning "Could not create backup, but continuing..."
    }
fi

# Note: Website settings (social media links, contact info) will be automatically
# initialized on server startup if they don't exist. Existing settings are preserved.

# Use safe SQL migration instead of drizzle-kit for production
print_status "Applying safe schema migration for featured_image column (DISABLED BY REQUEST)..."
# if [ ! -z "$DATABASE_URL" ]; then
#     # Safe migration: ALTER COLUMN instead of recreating table
#     psql "$DATABASE_URL" -c "
#         DO \$\$
#         BEGIN
#             -- Only alter if column exists and is varchar
#             IF EXISTS (
#                 SELECT 1 FROM information_schema.columns 
#                 WHERE table_name = 'products' 
#                 AND column_name = 'featured_image' 
#                 AND data_type = 'character varying'
#             ) THEN
#                 ALTER TABLE products ALTER COLUMN featured_image TYPE text;
#                 RAISE NOTICE 'Successfully updated featured_image column to text type';
#             ELSE
#                 RAISE NOTICE 'Column already correct type or does not exist';
#             END IF;
#         END \$\$;
#     " && {
#         print_success "Database schema updated safely"
#     } || {
#         print_error "Safe migration failed. Database unchanged."
#         exit 1
#     }
# else
#     print_warning "No DATABASE_URL found, skipping migration"
# fi
print_warning "Database modifications are disabled for production deployment."

# Build the application
print_status "Building application for production..."
npm run build
print_success "Application built successfully"

# Copy built files to server public directory
print_status "Copying static files to server directory..."
mkdir -p server/public
if [ -d "dist/public" ]; then
    cp -r dist/public/* server/public/
    print_success "Static files copied successfully"
else
    print_warning "No dist/public directory found, skipping static file copy"
fi

# Create uploads directory for local file storage (fallback)
print_status "Setting up file upload directories..."
mkdir -p uploads/media
chmod 755 uploads/media
print_success "File upload directories created"

# Get absolute path first
APP_DIR=$(realpath .)
print_status "Working directory: $APP_DIR"

# Ensure server entry point exists and get absolute path
print_status "Determining server entry point..."
if [ -f "$APP_DIR/dist/index.js" ]; then
    SERVER_ENTRY_POINT="$APP_DIR/dist/index.js"
    print_success "Found built server at: $SERVER_ENTRY_POINT"
elif [ -f "$APP_DIR/dist/server/index.js" ]; then
    SERVER_ENTRY_POINT="$APP_DIR/dist/server/index.js"
    print_success "Found built server at: $SERVER_ENTRY_POINT"
elif [ -f "$APP_DIR/server/index.js" ]; then
    SERVER_ENTRY_POINT="$APP_DIR/server/index.js"
    print_success "Found source server at: $SERVER_ENTRY_POINT"
else
    print_error "No valid server entry point found!"
    print_error "Checked locations:"
    print_error "  - $APP_DIR/dist/index.js"
    print_error "  - $APP_DIR/dist/server/index.js"
    print_error "  - $APP_DIR/server/index.js"
    print_status "Current directory contents:"
    ls -la
    print_status "Dist directory contents:"
    ls -la dist/ 2>/dev/null || print_error "dist/ directory does not exist"
    exit 1
fi

# Verify the file actually exists
if [ ! -f "$SERVER_ENTRY_POINT" ]; then
    print_error "Server entry point file does not exist: $SERVER_ENTRY_POINT"
    print_status "File system check:"
    ls -la "$SERVER_ENTRY_POINT" 2>/dev/null || print_error "File definitely does not exist"
    exit 1
fi

# Create systemd service file
print_status "Setting up systemd service..."
SERVICE_FILE="/etc/systemd/system/alashore-marine.service"
# APP_DIR already set above with realpath
APP_USER=$(whoami)

print_status "Service configuration:"
print_status "  Working Directory: $APP_DIR"
print_status "  Server Entry Point: $SERVER_ENTRY_POINT"
print_status "  User: $APP_USER"

cat > /tmp/alashore-marine.service << EOF
[Unit]
Description=Alashore Marine Seafood Export Website
After=network.target postgresql.service

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
EnvironmentFile=$APP_DIR/.env
ExecStart=/usr/bin/node $SERVER_ENTRY_POINT
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=alashore-marine

[Install]
WantedBy=multi-user.target
EOF

sudo mv /tmp/alashore-marine.service "$SERVICE_FILE"

print_success "Systemd service file created"

# Verify the service file was created correctly
print_status "Verifying systemd service file..."
print_status "Expected entry point: $SERVER_ENTRY_POINT"
print_status "Actual ExecStart line in service file:"
sudo grep "ExecStart" "$SERVICE_FILE" || print_error "ExecStart line not found"

if sudo cat "$SERVICE_FILE" | grep -q "ExecStart=/usr/bin/node $SERVER_ENTRY_POINT"; then
    print_success "Service file verified - using correct entry point"
else
    print_error "Service file verification FAILED!"
    print_error "The ExecStart line does not match expected entry point"
    print_status "Attempting to fix service file..."
    
    # Create a corrected service file
    cat > /tmp/alashore-marine-fixed.service << EOF
[Unit]
Description=Alashore Marine Seafood Export Website
After=network.target postgresql.service

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
EnvironmentFile=$APP_DIR/.env
ExecStart=/usr/bin/node $SERVER_ENTRY_POINT
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=alashore-marine

[Install]
WantedBy=multi-user.target
EOF
    
    sudo mv /tmp/alashore-marine-fixed.service "$SERVICE_FILE"
    print_success "Service file corrected"
    
    # Verify again
    print_status "Re-verifying corrected service file:"
    sudo grep "ExecStart" "$SERVICE_FILE"
fi

# Set up log rotation
print_status "Setting up log rotation..."
sudo tee "/etc/logrotate.d/alashore-marine" > /dev/null << 'EOF'
/var/log/alashore-marine.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0644 syslog adm
    postrotate
        systemctl reload rsyslog > /dev/null 2>&1 || true
    endscript
}
EOF

print_success "Log rotation configured"

# Skip nginx configuration as requested

# Reload systemd and start service
print_status "Starting Alashore Marine service..."
sudo systemctl daemon-reload
sudo systemctl enable alashore-marine
sudo systemctl restart alashore-marine

# Wait a moment for service to start
sleep 3

# Check service status
if sudo systemctl is-active --quiet alashore-marine; then
    print_success "Alashore Marine service is running!"
else
    print_error "Service failed to start. Check logs with: sudo journalctl -u alashore-marine -f"
    exit 1
fi

# Show service status
print_status "Service status:"
sudo systemctl status alashore-marine --no-pager -l

# Skip firewall configuration as requested

# Final instructions
echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
print_status "Useful commands:"
echo "- Check logs: sudo journalctl -u alashore-marine -f"
echo "- Restart service: sudo systemctl restart alashore-marine"
echo "- Stop service: sudo systemctl stop alashore-marine"
echo "- Update app: ./deploy.sh"
echo ""
print_success "Alashore Marine is ready for production! 🐟"