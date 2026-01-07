# Smart Vehicle Management System (Auto Serve)

A comprehensive vehicle service management platform designed for automotive service centers to streamline operations, manage job cards, track inventory, and monitor team performance.

## 🚀 Features

### Core Functionality
- **Job Card Management**: Create, track, and manage vehicle service requests
- **Customer Management**: Maintain customer profiles and service history
- **Inventory Management**: Track spare parts, stock levels, and automated reorder alerts
- **Team Management**: Manage mechanics, track performance, and assign tasks
- **Labor Tracking**: Clock in/out system with real-time labor analytics
- **Stock Request System**: Mechanics request parts → Admin approves workflow
- **Communication Hub**: SMS and WhatsApp notifications for status updates
- **Analytics Dashboard**: Real-time insights on performance, revenue, and efficiency

### User Roles
- **Admin**: Full system access, team management, inventory oversight
- **Mechanic**: Job card management, stock requests, labor tracking
- **Service Center**: Multi-location support with role-based access

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **Recharts** for data visualization

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **RESTful API** architecture

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Jadhavpree/Smart-Vehicle-Management-System.git
cd Smart-Vehicle-Management-System
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autoserve
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Frontend Setup
```bash
cd auto-serve-hub
npm install
```

### 4. Database Setup
Run the index fix script (one-time setup):
```bash
cd backend
node fix-inventory-index.js
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd auto-serve-hub
npm run dev
```
Frontend will run on `http://localhost:5173`

## 👤 Default Admin Credentials

```
Email: admin@admin.com
Password: admin123
```

## 📁 Project Structure

```
auto_serve/
├── backend/
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth & validation
│   ├── config/           # Configuration files
│   └── server.js         # Entry point
│
├── auto-serve-hub/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # API client & utilities
│   │   ├── hooks/        # Custom React hooks
│   │   └── App.tsx       # Main app component
│   └── public/           # Static assets
│
└── diagrams/             # System architecture diagrams
```

## 🔑 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Reset password

### Job Cards
- `GET /api/job-cards` - Get all job cards
- `POST /api/job-cards` - Create new job card
- `PATCH /api/job-cards/:id` - Update job card
- `GET /api/job-cards/:id` - Get job card details

### Inventory
- `GET /api/inventory` - Get inventory items
- `POST /api/inventory` - Add inventory item
- `PATCH /api/inventory/:id` - Update inventory item
- `PATCH /api/inventory/:id/use` - Use inventory item
- `PATCH /api/inventory/:id/add-stock` - Add stock

### Stock Requests
- `POST /api/stock-requests` - Create stock request
- `GET /api/stock-requests/my-requests` - Get user's requests
- `PATCH /api/stock-requests/:id/status` - Update request status
- `GET /api/admin/stock-requests` - Get all requests (admin)

### Team Management
- `GET /api/team` - Get team members
- `POST /api/team` - Add team member
- `PATCH /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member

## 🔐 Authentication Flow

1. User registers/logs in
2. Backend generates JWT token with `userId` and `role`
3. Token stored in localStorage
4. Token sent in Authorization header for protected routes
5. Middleware validates token and extracts user info

## 📊 Database Schema

### Key Collections
- **users** - User accounts with roles
- **jobcards** - Service job records
- **inventories** - Spare parts inventory
- **stockrequests** - Stock request workflow
- **customers** - Customer information
- **vehicles** - Vehicle details

## 🎯 Workflow Examples

### Stock Request Workflow
1. Mechanic views inventory
2. Mechanic creates stock request with quantity and reason
3. Request appears in admin's pending requests
4. Admin reviews and approves/rejects
5. If approved, stock is allocated to mechanic
6. Mechanic receives notification

### Job Card Workflow
1. Create job card with customer and vehicle details
2. Assign mechanic and add tasks
3. Mechanic clocks in/out for labor tracking
4. Add parts used from inventory
5. Update status (pending → in-progress → completed)
6. Generate invoice and notify customer

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autoserve
JWT_SECRET=your_secret_key
```

**Frontend (vite.config.ts)**
```typescript
// API base URL is set in src/lib/api.ts
const API_BASE = 'http://localhost:5000/api';
```

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file

**JWT Token Invalid**
- Clear localStorage and login again
- Ensure JWT_SECRET is set in backend .env

**Inventory Items Not Showing**
- Run `node fix-inventory-index.js` to fix database indexes
- Logout and login again to get new token with role

**Port Already in Use**
- Change PORT in backend .env
- Update API_BASE in frontend src/lib/api.ts

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Ensure MongoDB connection string is correct
3. Deploy backend first

### Frontend Deployment (Vercel/Netlify)
1. Update API_BASE to production backend URL
2. Build: `npm run build`
3. Deploy dist folder

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Jadhav Preet** - [GitHub](https://github.com/Jadhavpree)

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for automotive service centers
- Focus on efficiency and user experience

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@autoserve.com

---

**Made with ❤️ for the automotive service industry**
