# AutoServe Pro - Complete System Documentation

## System Overview
AutoServe Pro is a complete vehicle service management system with React frontend, Node.js backend, and MongoDB database.

## Completed Features

### 1. Authentication System
- Role-based authentication (customer, service center/mechanic, admin)
- JWT token-based authentication
- Automatic role-based redirects after login
- Secure password storage with bcrypt

### 2. Database Architecture
**Models Created:**
- User (customers, mechanics, admins)
- Vehicle (linked to users)
- Booking (linked to vehicles and customers)
- JobCard (linked to bookings)
- Invoice (linked to job cards, customers, vehicles, service centers)
- Review (linked to bookings, customers, service centers, vehicles)
- Inventory (spare parts management)
- StockRequest (service center inventory requests)

**Data Flow:**
Users → Vehicles → Bookings → JobCards → Invoices
Bookings → Reviews

### 3. Customer Features
- Vehicle registration with complete details
- Service booking with date/time selection
- Real-time booking status tracking with progress indicators
- Service history view
- Review and rating submission for completed services
- Profile management with password updates
- Empty states for new customers

**Status Flow:**
pending → confirmed → job_card_created → in_service → ready_for_billing → paid

### 4. Service Center Features
- Real-time booking dashboard
- Booking approval/rejection
- Job card creation and management
- Invoice generation with service center details
- Inventory management
- Stock request system
- Profile management

### 5. Admin Features
- Comprehensive dashboard with real-time analytics
- User management (customers, service centers, admins)
- Mechanic performance tracking
- Reviews and ratings management
- Inventory oversight
- Stock request approval system
- Real-time statistics and charts

### 6. Real-Time Features
- Auto-refresh every 30 seconds
- Status change notifications
- Live data updates across all dashboards
- Real-time review display

### 7. Email System (Optional)
- Email infrastructure built with nodemailer
- Invoice email templates
- Ready for activation with email credentials
- Currently shows success toast without sending actual emails

## API Endpoints

### Authentication
- POST /api/auth/register - User registration
- POST /api/auth/login - User login

### Vehicles
- GET /api/vehicles - Get user's vehicles
- POST /api/vehicles - Register new vehicle

### Bookings
- GET /api/bookings - Get user's bookings
- POST /api/bookings - Create new booking
- PATCH /api/bookings/:id/status - Update booking status

### Job Cards
- GET /api/jobcards - Get job cards
- POST /api/jobcards - Create job card
- GET /api/jobcards/:id - Get specific job card

### Invoices
- GET /api/invoices - Get invoices
- POST /api/invoices - Create invoice
- GET /api/invoices/:id - Get specific invoice
- POST /api/invoices/:id/send-email - Send invoice email

### Reviews
- POST /api/reviews - Submit review
- GET /api/reviews/all - Get all reviews (admin)
- GET /api/reviews/my-reviews - Get customer's reviews

### Admin
- GET /api/admin/stats - Dashboard statistics
- GET /api/admin/users - All users with details
- GET /api/admin/mechanics - Mechanic performance data

### Service Center
- GET /api/servicecenter/bookings - Service center bookings
- GET /api/servicecenter/stats - Service center statistics

### Inventory
- GET /api/inventory - Get inventory items
- POST /api/inventory - Add inventory item

### Stock Requests
- GET /api/stock-requests - Get stock requests
- POST /api/stock-requests - Create stock request
- PATCH /api/stock-requests/:id - Update stock request status

## Frontend Pages

### Public
- / - Landing page
- /auth - Login/Register

### Customer
- /customer - Customer dashboard
- /vehicle/register - Vehicle registration
- /booking - Service booking
- /review/:bookingId - Submit review
- /profile - Profile management

### Service Center
- /service-center - Service center dashboard
- /job-card/:id - Job card details
- /invoice/:id - Invoice details
- /inventory - Inventory management
- /profile - Profile management

### Admin
- /admin - Admin dashboard
- /admin/users - User management
- /admin/mechanics - Mechanic performance
- /reviews - Reviews and ratings
- /inventory - Inventory management
- /database - Database viewer

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/autoserve
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:5173
```

## Key Technical Decisions

1. **User Isolation**: Each customer only sees their own data through proper API filtering
2. **Real-Time Updates**: 30-second auto-refresh + focus event refresh
3. **Status Tracking**: Comprehensive booking status flow with progress indicators
4. **Empty States**: Helpful empty states guide new users through first-time setup
5. **Role-Based Access**: Proper authentication middleware on all protected routes
6. **Data Relationships**: Proper MongoDB references between collections
7. **Invoice Personalization**: Each service center's invoices show their own details

## Recent Updates

### Review and Rating System
- Customers can rate completed services (paid status)
- Star rating (1-5) with comment
- Reviews stored with booking, customer, service center, and vehicle details
- Admin can view all reviews in real-time
- Auto-calculated rating statistics and breakdown

### Admin Dashboard Enhancements
- Real-time user data (customers, service centers, admins)
- Mechanic performance tracking with job counts
- Live review and rating display
- Auto-refresh functionality

### User Management
- Real-time user list with role filtering
- Customer vehicle and booking counts
- Service center job card and completion counts
- Search and filter capabilities

## Known Issues & Future Enhancements

1. Email system requires real credentials to send actual emails
2. Monthly comparison charts in mechanic performance need historical data
3. Payment processing is currently mocked
4. Review helpful/reply features not yet implemented

## Installation & Setup

1. Install dependencies:
   ```
   cd auto-serve-hub && npm install
   cd ../backend && npm install
   ```

2. Start MongoDB:
   ```
   net start MongoDB
   ```

3. Start application:
   ```
   # Backend
   cd backend && npm run dev
   
   # Frontend
   cd auto-serve-hub && npm run dev
   ```

4. Access:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## Testing Credentials

Create users through /auth page with different roles:
- Customer: Select "Customer" role
- Service Center: Select "Service Center / Mechanic" role
- Admin: Select "Administrator" role
