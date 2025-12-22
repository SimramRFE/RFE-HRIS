# HRIS - Human Resource Information System

Complete full-stack HRIS application with Node.js backend and React frontend.

## 🚀 Project Structure

```
HRIS/
├── backend/          # Node.js + Express + MongoDB backend
│   ├── controllers/  # Business logic
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API routes
│   ├── middleware/   # Auth middleware
│   └── server.js     # Entry point
│
└── frontend/         # React + Vite + Ant Design frontend
    ├── src/
    │   ├── Components/  # Login, Dashboard
    │   ├── Layout/      # Layout components
    │   ├── Pages/       # Employee, Attendance, etc.
    │   └── services/    # API service layer
    └── package.json
```

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

### 1. Backend Setup

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your settings:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (strong random string)
# - PORT (default: 5000)

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```powershell
# Navigate to frontend folder
cd frontend

# Install dependencies (including axios)
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
```powershell
mongod
```

3. The backend will automatically connect to `mongodb://localhost:27017/hris`

### Option 2: MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend/.env:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hris
```

## 🔐 Authentication Flow

1. **First Time Setup:**
   - Create admin user via `/api/auth/signup` endpoint
   - Use Postman or similar tool:
   ```json
   POST http://localhost:5000/api/auth/signup
   {
     "name": "Admin User",
     "email": "admin@company.com",
     "password": "Admin@123",
     "role": "admin"
   }
   ```

2. **Login:**
   - Use the login page with created credentials
   - JWT token will be stored in localStorage
   - Token is automatically included in all API requests

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `PUT /api/auth/change-password` - Change password (protected)
- `GET /api/auth/me` - Get current user (protected)

### Employees
- `GET /api/employees` - Get all employees (protected)
- `GET /api/employees/:id` - Get single employee (protected)
- `POST /api/employees` - Create employee (admin/hr only)
- `PUT /api/employees/:id` - Update employee (admin/hr only)
- `DELETE /api/employees/:id` - Delete employee (admin/hr only)
- `GET /api/employees/search?query=` - Search employees (protected)

## 🎯 Features

### Backend
- ✅ JWT Authentication
- ✅ Role-based Authorization (admin, hr, employee)
- ✅ Password Hashing (bcrypt)
- ✅ Input Validation
- ✅ Error Handling
- ✅ CORS Enabled
- ✅ Soft Delete for Employees

### Frontend
- ✅ Login/Logout
- ✅ Employee Management (CRUD)
- ✅ Search & Filter
- ✅ Comprehensive Employee Forms (40+ fields)
- ✅ Document Upload
- ✅ Responsive Design
- ✅ Protected Routes
- ✅ API Integration (replaced localStorage)

## 🔄 Migration from localStorage

The frontend has been updated to use backend APIs instead of localStorage:

**Before:**
```javascript
localStorage.setItem("employees", JSON.stringify(data));
```

**After:**
```javascript
await employeeAPI.create(data);
```

All employee data is now stored in MongoDB database.

## 🛠️ Development

### Backend Development
```powershell
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```powershell
cd frontend
npm run dev  # Uses Vite HMR
```

## 📦 Build for Production

### Backend
```powershell
cd backend
npm start
```

### Frontend
```powershell
cd frontend
npm run build
npm run preview
```

## 🧪 Testing API with Postman

1. **Create Admin User:**
```
POST http://localhost:5000/api/auth/signup
Body: { "name": "Admin", "email": "admin@test.com", "password": "Test@123", "role": "admin" }
```

2. **Login:**
```
POST http://localhost:5000/api/auth/login
Body: { "email": "admin@test.com", "password": "Test@123" }
Response: { "token": "eyJhbGc..." }
```

3. **Use Token in Headers:**
```
Authorization: Bearer eyJhbGc...
```

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 7 days
- Protected routes require valid token
- Role-based access control
- CORS configured for frontend origin
- Input validation on all endpoints

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify .env configuration
- Ensure port 5000 is not in use

### Frontend can't connect to backend
- Check if backend is running on port 5000
- Verify VITE_API_URL in frontend/.env
- Check CORS settings in backend

### Database connection fails
- Verify MongoDB connection string
- Check network access (for Atlas)
- Ensure database user has proper permissions

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hris
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎨 Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Bcrypt.js
- Express Validator

**Frontend:**
- React 19
- Vite
- Ant Design 5
- Axios
- React Router v7
- Day.js

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check MongoDB connection
4. Verify all environment variables

## 📄 License

ISC
