# AutoServe - Vehicle Service Management System

## Project Overview

AutoServe is a comprehensive vehicle service management system designed to streamline automotive service operations. It provides tools for booking services, managing job cards, tracking inventory, and handling customer relationships.

## Features

- **Customer Portal**: Vehicle registration, service booking, and tracking
- **Service Center Dashboard**: Job management, inventory tracking, and customer communication
- **Admin Panel**: User management, analytics, and system oversight
- **Real-time Database Viewer**: Live data monitoring and management
- **Review & Rating System**: Customer feedback and service quality tracking

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd auto_serve

# Install frontend dependencies
cd auto-serve-hub
npm install

# Install backend dependencies
cd ../backend
npm install

# Start the development servers
# Backend (from backend directory)
npm start

# Frontend (from auto-serve-hub directory)
npm run dev
```

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- React Hook Form
- Zod validation

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Email Service Integration

## Project Structure

```
auto_serve/
├── auto-serve-hub/          # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── lib/             # Utilities and API client
│   │   └── hooks/           # Custom React hooks
│   └── public/              # Static assets
├── backend/                 # Backend API server
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Authentication & validation
│   └── services/            # Business logic
└── docs/                    # Documentation
```

## License

This project is proprietary software developed for automotive service management.
