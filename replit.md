# RKAS Management System (eRKAS Pro)

## Overview
This is a comprehensive School Budget Planning and Management Web Application called "eRKAS Pro" designed for Indonesian schools. The system manages RKAS (Rencana Kegiatan dan Anggaran Sekolah - School Activity and Budget Plan) with hierarchical data structure supporting budget fields, standards, activities, and quarterly allocations.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: TailwindCSS with custom color variables for eRKAS branding
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle with PostgreSQL dialect
- **Database Provider**: Neon serverless PostgreSQL with connection pooling
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Uploads**: Multer middleware for handling file uploads with type validation

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle with type-safe queries and migrations
- **File Storage**: Local filesystem with organized upload directory structure
- **Database Schema**: Hierarchical structure with proper foreign key relationships

## Key Components

### Authentication and Authorization
- **Role-based Access Control**: Three user roles (super_admin, operator, viewer)
- **JWT Token Management**: Secure token storage in localStorage with automatic refresh
- **Default Admin Credentials**: admin@rkas.com / 123456
- **Protected Routes**: Route-level protection based on user roles

### Database Schema Design
The system implements a hierarchical structure:
- **Users**: Role-based user management with school assignments
- **RKAS Fields** (Bidang): Top-level budget categories
- **RKAS Standards**: Sub-categories under each field
- **RKAS Activities**: Individual budget items with quarterly allocations
- **Files**: Document attachments linked to activities
- **Audit Logs**: Activity tracking for compliance

### Budget Management Features
- **Full CRUD Operations**: Complete Create, Read, Update, Delete functionality for all data
- **Period-based Filtering**: Both quarterly (TW1-TW4) and monthly (Januari-Desember) views
- **Real-time Calculations**: Automatic budget utilization and remaining balance computation
- **Form Validation**: Comprehensive Zod schema validation with error handling
- **Data Persistence**: Local storage with automatic save/load functionality
- **Interactive UI**: Clickable buttons, modal forms, and confirmation dialogs
- **Multi-currency Support**: Indonesian Rupiah formatting
- **Multi-year Planning**: Budget years 2022-2030 with dynamic year selection

### User Interface Features
- **Hierarchical Navigation**: Expandable sidebar with RKAS and Master Data submenus
- **Dashboard Cards**: 8-card layout (4x2 grid) matching reference design
- **Interactive Forms**: Modal dialogs with comprehensive validation and error handling
- **Confirmation Dialogs**: AlertDialog components for destructive actions (delete)
- **Period Selector**: Advanced filtering with quarterly and monthly options
- **Real-time Updates**: Optimistic UI updates with loading states and toast notifications
- **Clean Login**: Removed credential hints for production-ready appearance
- **School Branding**: SMPN 25 Jakarta header with school number logo

### File Management System
- **Supported Formats**: PDF, DOCX, JPG, PNG with 10MB size limit
- **Category Organization**: Files organized by categories and activities
- **Secure Upload**: File type validation and secure storage
- **Access Control**: Role-based file access permissions

## Data Flow

### Client-Server Communication
1. **Authentication Flow**: Login → JWT token → Protected API access
2. **Data Fetching**: TanStack Query manages server state with caching
3. **Form Submission**: React Hook Form → Zod validation → API request
4. **Real-time Updates**: Optimistic updates with query invalidation

### Database Operations
1. **Connection Management**: Neon serverless with WebSocket fallback
2. **Query Execution**: Drizzle ORM with type-safe operations
3. **Transaction Support**: Atomic operations for data consistency
4. **Migration System**: Schema versioning with drizzle-kit

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI component primitives
- **bcrypt**: Password hashing for security
- **jsonwebtoken**: JWT token management
- **multer**: File upload handling

### Development Dependencies
- **vite**: Fast build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR
- **TypeScript Compilation**: Real-time type checking
- **Database Push**: Direct schema sync with drizzle-kit
- **Environment Variables**: DATABASE_URL and JWT_SECRET required

### Production Build
- **Frontend Build**: Vite optimized build to dist/public
- **Backend Bundle**: esbuild creates single server bundle
- **Static Assets**: Frontend served from Express static middleware
- **Database Migrations**: Production-ready migration system

### Environment Requirements
- **Node.js**: ES modules support required
- **Database**: PostgreSQL connection string in DATABASE_URL
- **File System**: Write access for uploads directory
- **Memory**: Sufficient for file upload processing

## Recent Changes (January 27, 2025)

### Database Integration Completed
- **PostgreSQL Migration**: Successfully migrated from localStorage to PostgreSQL database
- **Persistent Data Storage**: All RKAS activities and budget items now stored in database
- **Cross-User Data Sharing**: Data persists across different users and sessions
- **Database Schema**: Created comprehensive schema with proper UUID primary keys
- **API Endpoints**: Full REST API implementation for activities and budget items
- **Period Filter Persistence**: User period preferences saved to database with fallback to localStorage

### Enhanced CRUD Implementation
- **Database Hooks**: New useKegiatanDB and useAnggaranDB hooks for database operations
- **Real-time Sync**: Automatic data synchronization across all users
- **Error Handling**: Comprehensive database error handling with user-friendly messages
- **Transaction Safety**: Proper database transactions for data consistency
- **Type Safety**: Full TypeScript integration with database models

### User Experience Improvements
- **Persistent Filters**: Period filter settings now saved per user
- **Shared Data**: All users see the same data (no more isolated localStorage)
- **Real-time Updates**: Changes immediately visible to all users
- **Professional UI**: Removed demo credentials for production-ready appearance
- **Loading States**: Visual feedback during database operations

The application now provides a production-ready RKAS management system with persistent PostgreSQL storage, shared data across users, and saved filter preferences - meeting the requirement for data that doesn't disappear between different users.

## Deployment Status (January 28, 2025)

### Production Ready Features
- **Build System**: Production build completed successfully with optimized bundles
- **Database Ready**: PostgreSQL schema deployed and functional
- **Authentication**: Secure JWT-based auth with admin@rkas.com access
- **Optional Budget Fields**: Total Anggaran fields made optional with delete functionality
- **Error Handling**: All TypeScript errors resolved for clean deployment
- **Performance**: Optimized frontend bundle (757KB) with efficient chunking

### Deployment Instructions for Replit
1. **Auto-Deploy Available**: System configured for Replit auto-deployment
2. **Environment**: All required environment variables (DATABASE_URL) configured
3. **Production Scripts**: `npm run build` and `npm start` ready for production
4. **File Structure**: Static assets served from `/dist/public`
5. **Database**: Persistent PostgreSQL with proper schema and data

The eRKAS Pro system is now fully deployment-ready with professional features and zero technical errors.