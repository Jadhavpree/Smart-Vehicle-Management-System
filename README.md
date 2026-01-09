# Smart Vehicle Management System - Auto Serve

## Candidate Information
**Name:** Pratiksha Mohan Jadhav  
**Submission Date:** January 2025  
**Repository:** https://github.com/Jadhavpree/Smart-Vehicle-Management-System

---

## Overview
A fullstack vehicle service management platform for automotive service centers to manage inventory, track stock requests, and coordinate team operations with role-based access control.

---

## Technology Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt  
**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router

---

## Features

- ✅ JWT Authentication with role-based access (Admin/Mechanic)
- ✅ Inventory Management with low stock alerts
- ✅ Stock Request System (Mechanic → Admin approval workflow)
- ✅ Team Management with performance tracking
- ✅ Responsive design for all devices
- ✅ Real-time updates and notifications

---

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB 5.0+

### Installation

**1. Clone Repository**
```bash
git clone https://github.com/Jadhavpree/Smart-Vehicle-Management-System.git
cd Smart-Vehicle-Management-System
```

**2. Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autoserve
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

**3. Frontend Setup**
```bash
cd frontend
npm install
```

**4. Database Setup**
```bash
# Start MongoDB
net start MongoDB

# Run index fix (one-time)
cd backend
node fix-inventory-index.js
```

### Run Application

**Backend** (Terminal 1):
```bash
cd backend
npm start
# Runs on http://localhost:5000
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Default Login:**
```
Email: admin@admin.com
Password: admin123
```

---

## Project Structure

```
auto_serve/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # UI components
    │   ├── pages/       # Page components
    │   ├── lib/         # API & utilities
    │   └── App.tsx      # Main app
    └── package.json
```

---

## Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - User login

### Inventory
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Add inventory item
- `PATCH /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item (Admin only)

### Stock Requests
- `POST /api/stock-requests` - Create request (Mechanic)
- `GET /api/stock-requests/my-requests` - Get user's requests
- `PATCH /api/stock-requests/:id/status` - Approve/Reject (Admin)
- `GET /api/admin/stock-requests` - Get all requests (Admin)

### Team Management
- `GET /api/team` - Get team members (Admin)
- `POST /api/team` - Add member (Admin)
- `PATCH /api/team/:id` - Update member (Admin)
- `DELETE /api/team/:id` - Delete member (Admin)

---

## Database Schema

**Users:** Authentication with roles (admin/mechanic)  
**Inventory:** Parts with SKU, stock levels, reorder alerts  
**Stock Requests:** Mechanic requests with admin approval workflow  
**Compound Index:** `{sku: 1, serviceCenter: 1}` for multi-tenant support

---

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongosh --eval "db.version()"`
- Check MONGODB_URI in `.env`

**Port Already in Use:**
- Change PORT in backend `.env`
- Update API_BASE in `frontend/src/lib/api.ts`

**Inventory Not Showing:**
- Run `node fix-inventory-index.js`
- Logout and login again

**JWT Token Invalid:**
- Clear browser localStorage
- Login again

---

## Design Decisions

- **JWT Authentication:** Stateless auth for scalability
- **Role-Based Access:** Admin sees all data, Mechanics see only their service center
- **Compound Index:** Allows same SKU across different service centers
- **RESTful API:** Standard HTTP methods for predictable endpoints

---

## Security Features

✅ bcrypt password hashing  
✅ JWT token expiration (7 days)  
✅ Protected API routes  
✅ Input validation (frontend + backend)  
✅ Role-based authorization  
✅ CORS configuration

---

## Contact

**Developer:** Pratiksha Mohan Jadhav  
**Email:** 008pratiksha@gmail.com  
**GitHub:** https://github.com/Jadhavpree

---

## License

MIT License

---

**Made with ❤️ for the automotive service industry**
