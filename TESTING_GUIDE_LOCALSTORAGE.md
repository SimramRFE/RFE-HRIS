# Testing Guide - LocalStorage Removal

## Quick Test Steps

### Test 1: Admin Login & Dashboard

1. **Start the servers:**
```powershell
# Terminal 1 - Backend
cd D:\HRIS\backend
npm start

# Terminal 2 - Frontend
cd D:\HRIS\frontend
npm run dev
```

2. **Clear browser storage:**
- Open DevTools (F12)
- Application → Local Storage
- Right-click → Clear

3. **Login as Admin:**
- Go to http://localhost:5173
- Login with admin credentials
- **Verify:** Only `token` and `auth` in localStorage (no `user` object)

4. **Check Dashboard:**
- Header should show: "Welcome, [Your Name]"
- Name fetched from database via API
- Open Network tab: Should see `GET /api/auth/me` request

5. **Test Logout:**
- Click logout
- **Verify:** All localStorage cleared
- Redirected to login page

### Test 2: Manager Login & Dashboard

1. **Clear browser storage again**

2. **Login as Manager:**
- Go to http://localhost:5173/login
- Switch to "Manager Login" tab
- Login with manager username/password
- **Verify:** Only `managerToken` and `managerAuth` in localStorage

3. **Check Manager Dashboard:**
- Should show: "Welcome, [Manager Name]!"
- Team name, budget, department all displayed
- Open Network tab: Should see `GET /api/auth/manager-me` request

4. **Test Logout:**
- Click logout
- **Verify:** All localStorage cleared

### Test 3: Data Freshness

1. **Login as Admin**

2. **Keep browser open**

3. **Update user in database:**
- Use MongoDB Compass or CLI
- Change user's name
```javascript
db.users.updateOne(
  { username: "admin" },
  { $set: { name: "New Admin Name" } }
)
```

4. **Refresh browser page**
- Header should immediately show new name
- Demonstrates: Data comes from database, not localStorage

### Test 4: Token Expiry

1. **Login as Admin**

2. **Manually expire token:**
- DevTools → Application → Local Storage
- Delete the `token` value

3. **Refresh page or navigate**
- Should auto-logout
- Redirected to login
- Demonstrates: 401 handling works

### Test 5: Network Failure

1. **Login as Admin**

2. **Go offline:**
- DevTools → Network → Throttling → Offline

3. **Refresh page**
- Should show error message
- Demonstrates: Error handling works

4. **Go online again:**
- Refresh page
- Dashboard loads normally

## Expected API Calls

### Admin Dashboard Load
```
Request: GET /api/auth/me
Headers: Authorization: Bearer [token]
Response: {
  "success": true,
  "data": {
    "id": "...",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true
  }
}
```

### Manager Dashboard Load
```
Request: GET /api/auth/manager-me
Headers: Authorization: Bearer [managerToken]
Response: {
  "success": true,
  "data": {
    "id": "...",
    "username": "manager1",
    "teamName": "Development Team",
    "employeeName": "John Doe",
    "employeeCode": "EMP001",
    "department": "IT",
    "budgetAllocated": 50000,
    "budgetSpent": 12500,
    "role": "Team Manager",
    "isActive": true
  }
}
```

## Troubleshooting

### Issue: "Not authorized" error on dashboard
**Solution:**
- Clear localStorage
- Login again
- Check token is being sent in request headers

### Issue: Name not showing in header
**Solution:**
- Check backend is running
- Check `/api/auth/me` endpoint returns data
- Check console for errors

### Issue: Infinite redirect loop
**Solution:**
- Clear all localStorage
- Check auth routes in App.jsx
- Verify token validation middleware

### Issue: Manager dashboard not loading
**Solution:**
- Verify manager exists in database
- Check `/api/auth/manager-me` endpoint
- Ensure managerToken is in localStorage

## Browser DevTools Checks

### Before Login (Clean State)
```
localStorage:
  (empty)
```

### After Admin Login
```
localStorage:
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  auth: "true"
```

### After Manager Login
```
localStorage:
  managerToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  managerAuth: "true"
```

### Network Tab - Dashboard Load
```
Name: me
Status: 200
Type: xhr
Response: { success: true, data: {...} }
```

## Performance Check

### Metrics to Monitor
- Dashboard load time: Should be < 500ms
- API response time: Should be < 200ms
- No localStorage read/write operations (except auth tokens)
- Network waterfall: Single API call on load

### Before (With localStorage)
- Dashboard: Instant (data from localStorage)
- Data freshness: Potentially stale
- Sync issues: Possible

### After (With API)
- Dashboard: ~200-500ms (one API call)
- Data freshness: Always current
- Sync issues: None

## Success Criteria

✅ No user/manager data objects in localStorage
✅ Username displays correctly in header
✅ Data loads from database on every page load
✅ Auto-logout on invalid/expired token
✅ Loading states show during data fetch
✅ Error messages display on network failure
✅ Logout clears all auth data
✅ No console errors
✅ No infinite redirect loops

## Rollback (If Needed)

If you need to revert changes:

```bash
git log --oneline
git revert [commit-hash]
```

Or restore previous versions of:
- `frontend/src/Components/Login.jsx`
- `frontend/src/Layout/DashboardLayout.jsx`
- `frontend/src/Components/UserLogin.jsx`
- `frontend/src/Components/ManagerDashboard.jsx`
- `frontend/src/Layout/ManagerDashboardContent.jsx`
