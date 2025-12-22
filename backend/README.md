# HRIS Backend API

Node.js backend for Human Resource Information System with authentication and employee management.

## Features

- ✅ User Authentication (JWT)
- ✅ Login & Signup
- ✅ Change Password
- ✅ Employee CRUD Operations
- ✅ Role-based Access Control
- ✅ MongoDB Database
- ✅ File Upload Support

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password Hashing

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hris
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

3. Start MongoDB server

4. Run the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| PUT | `/api/auth/change-password` | Change password | Private |
| GET | `/api/auth/me` | Get current user | Private |

### Employees

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/employees` | Get all employees | Private |
| GET | `/api/employees/:id` | Get single employee | Private |
| POST | `/api/employees` | Create employee | Admin/HR |
| PUT | `/api/employees/:id` | Update employee | Admin/HR |
| DELETE | `/api/employees/:id` | Delete employee | Admin/HR |
| GET | `/api/employees/search?query=` | Search employees | Private |

## Request Examples

### Signup
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "employee"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Change Password
```json
PUT /api/auth/change-password
Headers: { "Authorization": "Bearer <token>" }
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

### Create Employee
```json
POST /api/employees
Headers: { "Authorization": "Bearer <token>" }
{
  "employeeCode": "EMP001",
  "name": "Jane Smith",
  "email": "jane@company.com",
  "mobileNo": "1234567890",
  "department": "IT",
  "company": "RFE",
  "employeeStatus": "Resident",
  "role": "Developer",
  "dateOfJoining": "2024-01-01",
  ...
}
```

## User Roles

- **admin** - Full access to all features
- **hr** - Can manage employees
- **employee** - Can view employees only

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based authorization
- Input validation
- CORS enabled
- Secure headers

## Database Schema

### User Model
- name, email, password
- role (admin/hr/employee)
- isActive status
- timestamps

### Employee Model
- All employee fields from frontend
- Documents array
- Soft delete support
- Created by tracking
- timestamps

## License

ISC
