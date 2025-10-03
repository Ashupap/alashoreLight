# Overview

This is a full-stack web application for Alashore Marine Exports Pvt. Ltd., a seafood exporting company. The application features a modern, responsive website showcasing the company's seafood products, with an admin panel for content management. It's built as a React frontend with an Express.js backend, using PostgreSQL for data storage.

# Recent Changes

**October 3, 2025**
- **Removed AI-powered SEO analysis feature**:
  - Eliminated unreliable Open Router AI integration due to free tier rate limits and response parsing issues
  - Cleaned up backend endpoint and frontend UI components
  - Maintained core SEO settings functionality with modern tag-based keyword interface
  - Website settings now focus on manual SEO configuration without AI analysis

**September 3, 2025**
- **Implemented complete email notification system for inquiries**:
  - Gmail SMTP integration using Gmail App Password for secure authentication
  - Dual email system: admin notifications + customer confirmations
  - Professional HTML email templates with Alashore Marine branding
  - Non-blocking async email delivery for optimal performance
  - Production-ready email service with proper error handling

**August 27, 2025**
- Successfully migrated project from Replit Agent with PostgreSQL database setup and schema deployment
- Enhanced company logo with improved visibility, brightness/contrast filters, and smooth animations
- **Completed comprehensive image optimization strategy across entire website**:
  - Replaced all img tags with PerformanceImage components for lazy loading and better performance
  - Optimized all Unsplash URLs with proper compression parameters (q=85, format optimization)
  - Implemented responsive image sizing with appropriate srcset for different screen sizes
  - Added priority loading for above-the-fold images (hero sections, first 3 product cards)
  - Created specialized CriticalImage component for immediate loading of critical assets
  - Developed comprehensive imageOptimization utilities and custom hooks
  - Optimized certification logos, leadership photos, award images, and blog post featured images
  - Enhanced Core Web Vitals through proper image loading strategies

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend is built with React 18 and TypeScript, using Vite as the build tool. The architecture follows modern React patterns:

- **Component Structure**: Organized into sections (hero, about, products, testimonials, contact), layout components (header, footer), and UI components using shadcn/ui
- **State Management**: Uses TanStack Query (React Query) for server state management and caching
- **Routing**: Client-side routing with Wouter for a lightweight routing solution
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Animations**: Framer Motion for smooth animations and transitions
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
The backend follows a REST API pattern built with Express.js:

- **Server Structure**: Modular route handling with separate files for different concerns
- **Database Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **Authentication**: Replit Auth integration with session-based authentication using express-session
- **API Design**: RESTful endpoints for blog posts, products, testimonials, and inquiries
- **Email Service**: Gmail SMTP integration for inquiry notifications and customer confirmations
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes

## Data Storage
PostgreSQL database with Drizzle ORM providing:

- **Schema Management**: Type-safe schema definitions in shared/schema.ts
- **Migrations**: Database migrations handled through drizzle-kit
- **Connection Pooling**: Neon serverless PostgreSQL with connection pooling
- **Session Storage**: PostgreSQL-backed session storage for authentication

Key database tables:
- Users (for authentication)
- Blog posts (with publishing status)
- Products (seafood catalog)
- Testimonials (customer reviews)
- Inquiries (contact form submissions)
- Sessions (authentication sessions)

## Authentication and Authorization
- **Authentication Provider**: Replit Auth (OpenID Connect)
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Authorization**: Role-based access with admin-only routes
- **Security**: HTTPS enforcement, secure cookies, CSRF protection

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with TypeScript support
- **Express.js**: Backend web framework with middleware support
- **Vite**: Frontend build tool and development server
- **Node.js**: Runtime environment

### Database and ORM
- **PostgreSQL**: Primary database (Neon serverless)
- **Drizzle ORM**: Type-safe database toolkit
- **@neondatabase/serverless**: Serverless PostgreSQL client

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built React components with Radix UI primitives
- **Framer Motion**: Animation library
- **Lucide Icons**: Icon library

### State Management and Data Fetching
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation library

### Authentication
- **Replit Auth**: OpenID Connect authentication provider
- **Passport.js**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Email and Communication
- **Nodemailer**: Email sending library with Gmail SMTP support
- **Gmail SMTP**: Secure email delivery using Gmail App Passwords
- **HTML Email Templates**: Professional branded email layouts

### Development and Build Tools
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Autoprefixer
- **tsx**: TypeScript execution for development

## Environment Variables
Required environment variables for production deployment:

### Database Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`: Database credentials

### Authentication
- `SESSION_SECRET`: Secure session encryption key

### Email Service
- `GMAIL_USER`: Gmail address for sending emails
- `GMAIL_APP_PASSWORD`: Gmail App Password (not regular password)
- `NOTIFICATION_EMAIL`: Email address to receive admin notifications

### Application
- `NODE_ENV`: Set to 'production' for production deployment
- `PORT`: Server port (default: 4000 for production)