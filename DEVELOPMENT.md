# Alashore Marine - Development Guide

This guide describes how to set up the Alashore Marine website for local development.

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 14 or higher
- **npm**: Version 9 or higher

## Quick Start via Script

We have provided a script to automate the setup process. This script will:
1. Check for required dependencies (Node.js, PostgreSQL).
2. Install npm dependencies.
3. Setup the `.env` file if it doesn't exist.
4. Setup the database and run migrations.

To run the setup script:

```bash
chmod +x dev-setup.sh
./dev-setup.sh
```

## Manual Setup

If you prefer to set up manually, follow these steps:

### 1. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file and update the `DATABASE_URL` and other variables to match your local PostgreSQL configuration.

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/alashore_marine
NODE_ENV=development
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Ensure your PostgreSQL server is running and create the database:

```bash
createdb alashore_marine
```

Push the schema to the database:

```bash
npm run db:push
```

### 4. Running the Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Project Structure

- `client/`: React frontend code
- `server/`: Express backend code
- `shared/`: Shared schemas and types (Drizzle ORM)
- `migrations/`: Database SQL migrations (managed by Drizzle)
- `uploads/`: Local directory for uploaded files (in development)

## Common Commands

- `npm run dev`: Start development server (frontend + backend).
- `npm run build`: Build for production.
- `npm run db:push`: Push Drizzle schema changes to the database.
- `npm run check`: Run TypeScript type checking.
