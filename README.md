# Fullstack Vehicle Service Management System - Auto Serve

## Candidate Information
**Candidate Name:** Pratiksha Mohan Jadhav  
**Project Title:** Smart Vehicle Management System (Auto Serve)  
**Submission Date:** January 2025  
**Repository:** https://github.com/Jadhavpree/Smart-Vehicle-Management-System

---

## Technology Stack

### Backend
- **Framework:** Node.js with Express.js
- **Language:** JavaScript (ES6+)
- **Database:** MongoDB
- **ORM:** Mongoose ODM
- **Package Manager:** npm
- **Additional Libraries:**
  - jsonwebtoken (JWT authentication)
  - bcryptjs (password hashing)
  - dotenv (environment variables)
  - cors (cross-origin resource sharing)

### Frontend
- **Framework:** React 18.3.1
- **Language:** TypeScript
- **Build Tool:** Vite
- **UI Library:** Radix UI + shadcn/ui components
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (useState, useEffect)
- **Form Handling:** Controlled components with validation
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Notifications:** Sonner toast notifications

---

## Project Structure

```
auto_serve/
├── backend/                    # Node.js Express backend
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js            # User model with roles
│   │   ├── Inventory.js       # Inventory/parts model
│   │   ├── StockRequest.js    # Stock request model
│   │   ├── JobCard.js         # Service job model
│   │   └── Vehicle.js         # Vehicle model
│   ├── routes/                 # API route handlers
│   │   ├── auth.js            # Authentication routes
│   │   ├── inventory.js       # Inventory CRUD routes
│   │   ├── stockRequests.js   # Stock request routes
│   │   ├── team.js            # Team management routes
│   │   └── admin.js           # Admin-specific routes
│   ├── middleware/             # Custom middleware
│   │   └── auth.js            # JWT verification middleware
│   ├── config/                 # Configuration files
│   ├── .env                    # Environment variables
│   ├── server.js              # Express app entry point
│   └── package.json
│
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── pages/             # Page components
│   │   │   ├── Auth.tsx       # Login/Register page
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── InventoryManagement.tsx
│   │   │   └── TeamManagement.tsx
│   │   ├── lib/               # Utility functions
│   │   │   ├── api.ts         # API service layer
│   │   │   └── utils.ts       # Helper functions
│   │   ├── hooks/             # Custom React hooks
│   │   │   └── use-toast.ts   # Toast notification hook
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # React entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

## Features

### Core Functionality
✅ **User Authentication & Authorization**
- JWT-based secure authentication
- Role-based access control (Admin, Mechanic)
- Password hashing with bcrypt
- Protected routes and API endpoints

✅ **Inventory Management**
- CRUD operations for spare parts
- Real-time stock level tracking
- Low stock alerts (currentStock ≤ reorderLevel)
- Category-based organization
- SKU management with compound unique indexes

✅ **Stock Request System**
- Mechanic-to-Admin workflow
- Request creation with quantity, reason, and priority
- Admin approval/rejection with notes
- Status tracking (pending, approved, rejected, fulfilled)
- Real-time updates

✅ **Team Management**
- Add, update, and remove team members
- Role assignment and management
- Performance tracking
- Active/inactive status management

✅ **Responsive Design**
- Mobile-friendly interface
- Adaptive layouts for all screen sizes
- Touch-optimized controls

✅ **Real-time Updates**
- Auto-refresh functionality
- Optimistic UI updates
- Toast notifications for user feedback

✅ **Error Handling**
- Comprehensive error handling on both frontend and backend
- User-friendly error messages
- Validation at multiple layers

---

## Setup and Installation

### Prerequisites
- **Node.js** 16+ and npm
- **MongoDB** 5.0+
- **Git**
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Database Setup

1. **Install MongoDB** and start the service:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

2. **Create Database** (MongoDB will create it automatically on first connection):
```bash
# Connect to MongoDB shell
mongosh

# Switch to database (creates if doesn't exist)
use autoserve
```

3. **Run Index Fix Script** (one-time setup):
```bash
cd backend
node fix-inventory-index.js
```

This script creates a compound unique index on `sku` and `serviceCenter` fields to allow same SKU across different service centers while preventing duplicates within the same center.

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file** in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autoserve
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. **Start the backend server:**
```bash
npm start
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/reset-password` | Reset password | No |

**Sample Login Request:**
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**Sample Login Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@admin.com",
    "role": "admin"
  }
}
```

### Inventory Management
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/inventory` | Get all inventory items | Yes | All |
| POST | `/api/inventory` | Add new inventory item | Yes | All |
| PATCH | `/api/inventory/:id` | Update inventory item | Yes | All |
| DELETE | `/api/inventory/:id` | Delete inventory item | Yes | Admin |
| PATCH | `/api/inventory/:id/add-stock` | Add stock to item | Yes | All |
| PATCH | `/api/inventory/:id/use` | Use/reduce stock | Yes | All |
| GET | `/api/inventory/low-stock` | Get low stock items | Yes | All |

**Sample Inventory Item:**
```json
{
  "partName": "Engine Oil 5W-30",
  "sku": "OIL-5W30-5L",
  "category": "lubricants",
  "currentStock": 50,
  "reorderLevel": 10,
  "unitPrice": 25.99,
  "supplier": "AutoParts Co."
}
```

### Stock Request System
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/stock-requests/my-requests` | Get user's requests | Yes | Mechanic |
| POST | `/api/stock-requests` | Create stock request | Yes | Mechanic |
| PATCH | `/api/stock-requests/:id/status` | Update request status | Yes | Admin |
| GET | `/api/admin/stock-requests` | Get all requests | Yes | Admin |

**Sample Stock Request:**
```json
{
  "inventoryItemId": "507f1f77bcf86cd799439012",
  "requestedQuantity": 5,
  "reason": "Needed for urgent customer job",
  "priority": "high"
}
```

### Team Management
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/team` | Get team members | Yes | Admin |
| POST | `/api/team` | Add team member | Yes | Admin |
| PATCH | `/api/team/:id` | Update team member | Yes | Admin |
| DELETE | `/api/team/:id` | Delete team member | Yes | Admin |
| GET | `/api/team/:id/performance` | Get member performance | Yes | Admin |

---

## Running the Application

### Development Mode

1. **Start MongoDB:**
```bash
# Ensure MongoDB is running
mongosh --eval "db.version()"
```

2. **Start Backend:**
```bash
cd backend
npm start
```
Backend runs on: `http://localhost:5000`

3. **Start Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

4. **Access Application:**
Open `http://localhost:5173` in your browser

### Default Admin Credentials
```
Email: admin@admin.com
Password: admin123
```

---

## Build for Production

### Backend
```bash
cd backend
npm install --production
node server.js
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

The build output will be in the `frontend/dist` directory.

---

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  role: String (enum: ['admin', 'mechanic']),
  phone: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Collection
```javascript
{
  _id: ObjectId,
  partName: String,
  sku: String,
  category: String (enum: ['lubricants', 'brakes', 'filters', 'engine', 'fluids']),
  currentStock: Number (min: 0),
  reorderLevel: Number (min: 0),
  unitPrice: Number (min: 0),
  supplier: String,
  description: String,
  serviceCenter: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}

// Compound Unique Index
Index: { sku: 1, serviceCenter: 1 } unique
```

### Stock Request Collection
```javascript
{
  _id: ObjectId,
  inventoryItem: ObjectId (ref: 'Inventory'),
  requestedBy: ObjectId (ref: 'User'),
  requestedQuantity: Number (min: 1),
  reason: String (minlength: 10),
  priority: String (enum: ['low', 'medium', 'high', 'critical']),
  status: String (enum: ['pending', 'approved', 'rejected', 'fulfilled']),
  adminNotes: String,
  approvedBy: ObjectId (ref: 'User'),
  approvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Assumptions and Design Decisions

### Architecture Decisions
1. **RESTful API Design:** Following REST principles for predictable and scalable API structure
2. **JWT Authentication:** Stateless authentication for easy horizontal scaling
3. **Role-Based Access Control:** Two-tier system (Admin/Mechanic) for security and workflow management
4. **MongoDB:** NoSQL database chosen for flexible schema and rapid development
5. **Compound Indexes:** SKU + serviceCenter index allows multi-tenant support

### Business Logic
1. **Stock Request Workflow:** Mechanic → Request → Admin → Approval/Rejection
2. **Inventory Filtering:** Admins see all inventory, mechanics see only their service center
3. **Low Stock Alerts:** Triggered when currentStock ≤ reorderLevel
4. **Auto-Assignment:** serviceCenter field auto-assigned from JWT token (prevents spoofing)

### Security Measures
1. **Password Hashing:** bcrypt with 10 salt rounds
2. **JWT Expiration:** 7-day token expiry
3. **Protected Routes:** All API endpoints require valid JWT token
4. **Input Validation:** Both frontend and backend validation
5. **CORS Configuration:** Properly configured for development environment

---

## Limitations

### Current Version Limitations
❌ **No Pagination:** All records loaded at once (suitable for small-medium datasets)
❌ **No Advanced Search:** Basic filtering only
❌ **No File Upload:** Product/vehicle images not supported
❌ **No Email Notifications:** Only in-app notifications
❌ **No Unit Tests:** Test cases not implemented
❌ **No API Documentation:** Swagger/OpenAPI not integrated
❌ **No Audit Logging:** User actions not logged
❌ **No Data Export:** Cannot export reports to PDF/Excel
❌ **No Multi-language Support:** English only

---

## Pending Enhancements

### High Priority
- [ ] Unit and Integration Tests (Jest, Supertest)
- [ ] API Documentation with Swagger
- [ ] Pagination for large datasets
- [ ] Advanced search and filtering
- [ ] Email notifications for stock approvals

### Medium Priority
- [ ] File upload for vehicle/product images
- [ ] Data export (PDF, Excel)
- [ ] Audit logging system
- [ ] Performance analytics dashboard
- [ ] Mobile app (React Native)

### Low Priority
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Caching with Redis

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solutions:**
- Ensure MongoDB is running: `mongosh --eval "db.version()"`
- Check MONGODB_URI in `.env` file
- Verify database name is correct
- Check if MongoDB service is started

#### 2. Port Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

Then update frontend API URL in `frontend/src/lib/api.ts`:
```typescript
const API_BASE = 'http://localhost:5001/api'
```

#### 3. JWT Token Invalid
**Error:** `401 Unauthorized - Token is not valid`

**Solutions:**
- Clear browser localStorage and login again
- Ensure JWT_SECRET is set in backend `.env`
- Check token expiration (default 7 days)
- Verify token format in Authorization header

#### 4. CORS Issues
**Error:** `Access to fetch blocked by CORS policy`

**Solutions:**
- Ensure backend CORS is configured correctly
- Check if both servers are running on expected ports
- Verify frontend origin is allowed in backend CORS config

#### 5. Inventory Items Not Showing
**Error:** Items added but not visible in list

**Solutions:**
```bash
# Run index fix script
cd backend
node fix-inventory-index.js

# Logout and login again to get new token with role
```

---

## Screenshots

### Desktop Interface

#### Dashboard - Admin View
![Admin Dashboard](screenshots/admin-dashboard.png)
*Main dashboard showing inventory overview, pending requests, and team statistics*

#### Inventory Management
![Inventory List](screenshots/inventory-list.png)
*Inventory listing with stock levels, categories, and low stock alerts*

#### Add Inventory Item
![Add Inventory](screenshots/add-inventory.png)
*Form for adding new inventory items with validation*

#### Stock Request Workflow
![Stock Requests](screenshots/stock-requests.png)
*Pending stock requests with approve/reject actions*

#### Team Management
![Team Management](screenshots/team-management.png)
*Team member management with performance metrics*

### Mobile Responsive Design

#### Mobile Dashboard
![Mobile Dashboard](screenshots/mobile-dashboard.png)
*Responsive design optimized for mobile devices*

---

## Testing

### Manual Testing Checklist

#### Authentication
- [ ] User registration with valid data
- [ ] User login with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] JWT token stored in localStorage
- [ ] Protected routes redirect to login when not authenticated
- [ ] Logout clears token and redirects to login

#### Inventory Management
- [ ] View all inventory items
- [ ] Add new inventory item
- [ ] Edit existing inventory item
- [ ] Delete inventory item (admin only)
- [ ] Add stock to existing item
- [ ] Low stock items show warning badge
- [ ] Search/filter inventory items

#### Stock Request System
- [ ] Mechanic can create stock request
- [ ] Request appears in admin's pending list
- [ ] Admin can approve request
- [ ] Admin can reject request with notes
- [ ] Mechanic sees updated status
- [ ] Priority badges display correctly

#### Role-Based Access
- [ ] Admin can access all features
- [ ] Mechanic cannot access admin routes
- [ ] Data filtered by service center for mechanics
- [ ] Admin sees all data across centers

### API Testing with Postman/curl

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@admin.com","password":"admin123"}'

# Get inventory (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/inventory \
  -H "Authorization: Bearer TOKEN"

# Create inventory item
curl -X POST http://localhost:5000/api/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"partName":"Test Part","sku":"TEST-001","category":"lubricants","currentStock":10,"reorderLevel":5,"unitPrice":29.99,"supplier":"Test Supplier"}'
```

---

## Performance Considerations

### Backend Optimization
- **Database Indexing:** Compound index on `sku` and `serviceCenter`
- **Query Optimization:** Using Mongoose lean() for read-only operations
- **Connection Pooling:** MongoDB connection pool for efficient database access
- **Middleware Caching:** JWT verification results cached per request

### Frontend Optimization
- **Code Splitting:** Lazy loading of route components
- **Bundle Size:** Optimized with Vite for fast loading
- **Memoization:** React.memo for expensive components
- **Debouncing:** Search inputs debounced to reduce API calls

---

## Security Considerations

### Implemented Security Measures
✅ **Authentication:** JWT-based secure authentication
✅ **Password Security:** bcrypt hashing with salt rounds
✅ **Input Validation:** Both client-side and server-side validation
✅ **SQL Injection Prevention:** Using Mongoose parameterized queries
✅ **XSS Prevention:** React escapes output by default
✅ **CORS Configuration:** Properly configured for development
✅ **Role-Based Access:** Middleware checks user roles
✅ **Token Expiration:** JWT tokens expire after 7 days

### Recommended Additional Security
- [ ] Rate limiting to prevent brute force attacks
- [ ] HTTPS in production
- [ ] Content Security Policy headers
- [ ] Input sanitization library
- [ ] Security headers (Helmet.js)
- [ ] API request logging
- [ ] Two-factor authentication

---

## Deployment Guide

### Backend Deployment (Heroku/Railway/Render)

1. **Set environment variables:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoserve
JWT_SECRET=production_secret_key_very_long_and_random
NODE_ENV=production
```

2. **Deploy:**
```bash
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)

1. **Update API URL** in `frontend/src/lib/api.ts`:
```typescript
const API_BASE = 'https://your-backend-url.com/api'
```

2. **Build and deploy:**
```bash
npm run build
# Deploy dist folder to Vercel/Netlify
```

---

## Contact

**Developer:** Pratiksha Mohan Jadhav  
**Email:** 008pratiksha@gmail.com  
**GitHub:** https://github.com/Jadhavpree  
**LinkedIn:** [Your LinkedIn Profile]

For any questions, issues, or feature requests, please:
- Create an issue on GitHub
- Email directly
- Submit a pull request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgments

- Built with modern web technologies
- Designed for automotive service centers
- Focus on efficiency and user experience
- Inspired by real-world service center workflows

---

**Made with ❤️ for the automotive service industry**

**Submission Date:** January 2025
