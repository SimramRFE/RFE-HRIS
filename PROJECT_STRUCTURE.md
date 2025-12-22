# HRIS Project Structure

```
d:\HRIS\
│
├── 📄 README.md                    # Main project documentation
├── 📄 QUICK_START.md              # Step-by-step setup guide
├── 📄 SETUP_SUMMARY.md            # Complete summary of changes
├── 🔧 start-servers.ps1           # Script to start both servers
├── 🔧 create-admin.ps1            # Script to create admin user
│
├── 📁 backend/                    # Node.js Backend
│   ├── 📄 package.json           # Dependencies (Express, MongoDB, JWT, etc.)
│   ├── 📄 server.js              # Main Express server
│   ├── 📄 .env                   # Environment variables (MongoDB, JWT secret)
│   ├── 📄 .gitignore             # Git ignore rules
│   ├── 📄 README.md              # Backend API documentation
│   │
│   ├── 📁 models/                # MongoDB Schemas
│   │   ├── User.js               # User authentication model
│   │   └── Employee.js           # Employee data model (40+ fields)
│   │
│   ├── 📁 controllers/           # Business Logic
│   │   ├── authController.js    # signup, login, changePassword, getMe
│   │   └── employeeController.js # CRUD operations for employees
│   │
│   ├── 📁 routes/                # API Routes
│   │   ├── authRoutes.js        # /api/auth/* endpoints
│   │   └── employeeRoutes.js    # /api/employees/* endpoints
│   │
│   └── 📁 middleware/            # Express Middleware
│       └── auth.js               # JWT verification & authorization
│
└── 📁 frontend/                   # React Frontend
    ├── 📄 package.json           # Dependencies (React, Ant Design, Axios)
    ├── 📄 .env                   # API URL configuration
    ├── 📄 vite.config.js         # Vite configuration
    ├── 📄 index.html             # HTML entry point
    │
    └── 📁 src/
        ├── 📄 main.jsx           # React entry point
        ├── 📄 App.jsx            # Main app component
        │
        ├── 📁 services/          # API Layer
        │   └── api.js            # ✨ NEW - Axios API service (auth, employees)
        │
        ├── 📁 Components/        # React Components
        │   ├── Login.jsx         # ✅ UPDATED - API integration, JWT login
        │   └── Dashboard.jsx     # Main dashboard
        │
        ├── 📁 Layout/            # Layout Components
        │   ├── DashboardLayout.jsx # Main layout with sidebar
        │   └── DashboardContent.jsx # Content area
        │
        └── 📁 Pages/             # Page Components
            ├── Attendance.jsx    # Attendance tracking
            ├── Leave.jsx         # Leave management
            ├── Payroll.jsx       # Payroll
            ├── Performance.jsx   # Performance reviews
            ├── Profile.jsx       # User profile
            ├── Settings.jsx      # App settings
            │
            └── 📁 Employee/      # Employee Management
                ├── Employee.jsx       # ✅ UPDATED - List view with API
                ├── addEmployee.jsx    # ✅ UPDATED - Add form with API
                ├── EditEmployee.jsx   # ✅ UPDATED - Edit form with API
                └── viewEmployee.jsx   # ✅ UPDATED - Detail view with API
```

---

## 🎨 Color Legend

- ✨ **NEW** - Newly created file
- ✅ **UPDATED** - Modified to use backend API (removed localStorage)
- 📁 - Directory/Folder
- 📄 - File
- 🔧 - Executable script

---

## 📊 File Statistics

### Backend
- **Total Files:** 13
- **Models:** 2
- **Controllers:** 2
- **Routes:** 2
- **Middleware:** 1
- **Config:** 4
- **Documentation:** 1

### Frontend (Updated)
- **New Files:** 1 (api.js)
- **Updated Files:** 5 (Login, Employee, addEmployee, EditEmployee, viewEmployee)
- **Dependencies Added:** 1 (axios)

### Root Files
- **Documentation:** 3 (README, QUICK_START, SETUP_SUMMARY)
- **Scripts:** 2 (start-servers.ps1, create-admin.ps1)

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ React Components (Login, Employee, etc.)               │ │
│  └──────────────────┬─────────────────────────────────────┘ │
│                     │                                        │
│                     ↓                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ API Service (src/services/api.js)                      │ │
│  │ • authAPI: login, signup, changePassword               │ │
│  │ • employeeAPI: CRUD operations                         │ │
│  │ • Axios with JWT interceptors                          │ │
│  └──────────────────┬─────────────────────────────────────┘ │
└────────────────────┼────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS (JWT in headers)
                     │
┌────────────────────▼────────────────────────────────────────┐
│                        BACKEND                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Express Server (server.js)                             │ │
│  │ • CORS enabled                                         │ │
│  │ • JSON parsing                                         │ │
│  └──────────────────┬─────────────────────────────────────┘ │
│                     │                                        │
│                     ↓                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Middleware (auth.js)                                   │ │
│  │ • Verify JWT token                                     │ │
│  │ • Check user role                                      │ │
│  └──────────────────┬─────────────────────────────────────┘ │
│                     │                                        │
│                     ↓                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Routes                                                 │ │
│  │ • /api/auth/* → authController                         │ │
│  │ • /api/employees/* → employeeController                │ │
│  └──────────────────┬─────────────────────────────────────┘ │
│                     │                                        │
│                     ↓                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Controllers                                            │ │
│  │ • Business logic                                       │ │
│  │ • Data validation                                      │ │
│  └──────────────────┬─────────────────────────────────────┘ │
│                     │                                        │
│                     ↓                                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Models (Mongoose)                                      │ │
│  │ • User schema                                          │ │
│  │ • Employee schema                                      │ │
│  └──────────────────┬─────────────────────────────────────┘ │
└────────────────────┼────────────────────────────────────────┘
                     │
                     │ MongoDB Driver
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      DATABASE                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ MongoDB                                                │ │
│  │ ├── users collection                                  │ │
│  │ └── employees collection                              │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
1. User Signup/Login (Frontend)
           ↓
2. POST to /api/auth/login
           ↓
3. Backend validates credentials
           ↓
4. Generate JWT token
           ↓
5. Return token + user data
           ↓
6. Frontend stores token in localStorage
           ↓
7. Subsequent requests include token in headers
           ↓
8. Backend verifies token on protected routes
           ↓
9. Allow/Deny based on token validity
```

---

## 📡 API Endpoints

### Public Endpoints (No Auth Required)
```
POST /api/auth/signup       - Register new user
POST /api/auth/login        - Login user
GET  /api/health            - Health check
```

### Protected Endpoints (Auth Required)
```
PUT  /api/auth/change-password  - Change password
GET  /api/auth/me               - Get current user
GET  /api/employees             - List employees
GET  /api/employees/:id         - Get employee
GET  /api/employees/search      - Search employees
```

### Admin/HR Only Endpoints
```
POST   /api/employees           - Create employee
PUT    /api/employees/:id       - Update employee
DELETE /api/employees/:id       - Delete employee
```

---

## 🚀 Deployment Architecture

### Development
```
Frontend: http://localhost:5173  (Vite dev server)
Backend:  http://localhost:5000  (Node.js Express)
Database: mongodb://localhost:27017/hris (Local MongoDB)
```

### Production (Recommended)
```
Frontend: Vercel/Netlify         (Static hosting)
Backend:  Heroku/Railway         (Node.js hosting)
Database: MongoDB Atlas          (Cloud database)
```

---

## 📦 Package.json Scripts

### Backend
```json
{
  "start": "node server.js",       // Production
  "dev": "nodemon server.js"       // Development with auto-reload
}
```

### Frontend
```json
{
  "dev": "vite",                   // Development server
  "build": "vite build",           // Production build
  "preview": "vite preview"        // Preview production build
}
```

---

This structure provides a clean, scalable, and maintainable codebase for the HRIS application! 🎉
