#!/bin/bash

# Alashore Marine Development Setup Script

set -e # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "🚀 Starting Alashore Marine Development Setup..."

# 1. Check Prerequisites
print_status "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+."
    exit 1
fi

if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL client (psql) is not installed."
    exit 1
fi

NODE_VERSION=$(node -v)
print_success "Node.js version: $NODE_VERSION"

# 2. Install Dependencies
print_status "Installing npm dependencies..."
npm install
print_success "Dependencies installed."

# 3. Environment Configuration
print_status "Configuring environment..."

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        print_success "Created .env from .env.example"
        print_warning "PLEASE EDIT .env manually to match your local database credentials!"
    else
        print_error ".env.example not found. Creating default .env..."
        cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alashore_marine
SESSION_SECRET=dev_secret_key
NODE_ENV=development
PORT=5000
EOF
        print_success "Created default .env"
    fi
else
    print_status ".env file already exists. Skipping creation."
fi

# 4. Database Setup
print_status "Setting up database..."

# Load .env variables to get DB settings if possible, or prompt
# Ideally we parse DATABASE_URL from .env
DB_NAME="alashore_marine"

if psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    print_status "Database '$DB_NAME' already exists."
else
    print_status "Creating database '$DB_NAME'..."
    # Try creating database assuming current user has rights, or instruct user
    if createdb "$DB_NAME"; then
        print_success "Database created."
    else
        print_warning "Could not create database automatically. You might need to run: createdb $DB_NAME"
    fi
fi

print_status "Pushing database schema..."
npm run db:push

print_success "Setup complete! 🎉"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
