# Quick Start Guide - HRIS Setup

## 🚦 Step-by-Step Setup

### Step 1: Install MongoDB (if not already installed)

**Option A: Local MongoDB**
1. Download MongoDB Community Edition: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Update `backend/.env` with your connection string

### Step 2: Configure Backend Environment

1. Open `backend/.env` file
2. Update these values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hris  # OR your Atlas connection string
JWT_SECRET=mySecretKey12345!@#  # Change this to a random secure string
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 3: Start the Backend Server

```powershell
# Open terminal in backend folder
cd d:\HRIS\backend
npm run dev
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server is running on port 5000
📍 Environment: development
```

### Step 4: Create Admin User

**Option A: Using Postman/Thunder Client**
```
POST http://localhost:5000/api/auth/signup
Headers: { "Content-Type": "application/json" }
Body:
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "Admin@123",
  "role": "admin"
}
```

**Option B: Using PowerShell**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method POST -ContentType "application/json" -Body '{"name":"Admin User","email":"admin@company.com","password":"Admin@123","role":"admin"}'
```

### Step 5: Start the Frontend

Open a **NEW terminal** window:
```powershell
# Navigate to frontend folder
cd d:\HRIS\frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 6: Login to the Application

1. Open browser and go to `http://localhost:5173`
2. Login with the credentials you created:
   - Email: `admin@company.com`
   - Password: `Admin@123`

### Step 7: Test Employee Management

1. Click on "Employees" in the sidebar
2. Click "Add Employee" button
3. Fill in the employee details
4. Save and verify the data is stored in MongoDB

---

## ✅ Verification Checklist

- [ ] MongoDB is running (check connection)
- [ ] Backend server is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] Admin user created successfully
- [ ] Can login to the application
- [ ] Can add/edit/delete employees
- [ ] Data persists after refresh (stored in database)

---

## 🔍 Testing the API

### Check Backend Health
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

Expected response:
```json
{
  "status": "OK",
  "message": "HRIS Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Login
```powershell
$body = @{
    email = "admin@company.com"
    password = "Admin@123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $body
```

---

## 🛠️ Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Check if MongoDB service is running
- For local: Start MongoDB with `mongod` command
- For Atlas: Check internet connection and whitelist your IP

### Issue: "Port 5000 already in use"
**Solution:**
- Change PORT in backend/.env to another port (e.g., 5001)
- Update VITE_API_URL in frontend/.env accordingly

### Issue: "CORS error" in browser console
**Solution:**
- Backend CORS is already configured for http://localhost:5173
- If using different port, update cors origin in backend/server.js

### Issue: "Invalid credentials" when logging in
**Solution:**
- Make sure you created the user via signup endpoint first
- Check email and password are correct
- Password must be at least 6 characters

---

## 📂 Project Files Overview

### Backend Files
- `server.js` - Main server entry point
- `models/User.js` - User authentication model
- `models/Employee.js` - Employee data model
- `controllers/authController.js` - Login, signup, password functions
- `controllers/employeeController.js` - Employee CRUD operations
- `routes/authRoutes.js` - Auth API routes
- `routes/employeeRoutes.js` - Employee API routes
- `middleware/auth.js` - JWT authentication middleware

### Frontend Files
- `src/services/api.js` - Axios API service layer
- `src/Components/Login.jsx` - Login page (updated for API)
- `src/Pages/Employee/Employee.jsx` - Employee list (uses API)
- `src/Pages/Employee/addEmployee.jsx` - Add employee form (uses API)
- `src/Pages/Employee/EditEmployee.jsx` - Edit employee form (uses API)
- `src/Pages/Employee/viewEmployee.jsx` - View employee details (uses API)

---

## 🎯 Next Steps

1. **Test all features:**
   - Add employees
   - Edit employees
   - Delete employees
   - Search employees
   - View employee details

2. **Customize:**
   - Update company name and branding
   - Modify employee fields as needed
   - Customize user roles and permissions

3. **Production Deployment:**
   - Use MongoDB Atlas for production database
   - Deploy backend to Heroku, Railway, or similar
   - Deploy frontend to Vercel, Netlify, or similar
   - Update environment variables for production URLs

---

## 📞 Need Help?

Check these resources:
1. Backend logs in terminal for error messages
2. Frontend browser console for client errors
3. MongoDB Compass to view database collections
4. API documentation in backend/README.md
5. Main README.md for comprehensive guide

---

**You're all set! 🎉**

The HRIS application is now running with:
- ✅ Backend API with authentication
- ✅ MongoDB database
- ✅ React frontend
- ✅ Full employee management
- ✅ No more localStorage - all data in database!
