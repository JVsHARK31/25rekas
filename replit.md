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

### Completed CRUD Implementation
- **Full Data Management**: All buttons are now functional with complete CRUD operations
- **Form Components**: Created KegiatanForm and AnggaranForm with validation
- **Data Hooks**: Implemented useKegiatan and useAnggaran hooks with localStorage persistence
- **UI Components**: Added Textarea, Form, and AlertDialog components
- **Interactive Tables**: All action buttons (Create, Edit, Delete) are now clickable and functional
- **Period Filtering**: Enhanced filtering system supporting both quarterly and monthly views
- **Login Cleanup**: Removed credential hints for professional appearance

### Technical Improvements
- **Data Persistence**: Local storage integration for client-side data management
- **Error Handling**: Comprehensive error states and user feedback via toast notifications
- **Form Validation**: Zod schema validation with proper error messages
- **Loading States**: Visual feedback during CRUD operations
- **Confirmation Dialogs**: Safety measures for destructive actions

The application now provides a complete, functional RKAS management system with full CRUD capabilities, professional UI interactions, and comprehensive period-based filtering suitable for Indonesian school budget management requirements.