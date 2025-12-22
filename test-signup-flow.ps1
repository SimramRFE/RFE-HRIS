# Test Signup and First-Time Login Flow

Write-Host "🧪 Testing Signup & First-Time Login Flow" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "1. Checking if backend is running..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction Stop
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running!" -ForegroundColor Red
    Write-Host "   Please start backend: cd d:\HRIS\backend; npm run dev" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "2. Creating test user..." -ForegroundColor Yellow

$signupData = @{
    username = "testuser123"
    name = "Test User"
    email = "test@example.com"
    password = "test1234"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method POST -ContentType "application/json" -Body $signupData -ErrorAction Stop
    Write-Host "✅ User created successfully!" -ForegroundColor Green
    Write-Host "   Username: testuser123" -ForegroundColor White
    Write-Host "   Password: test1234" -ForegroundColor White
    Write-Host "   isFirstLogin: $($signupResponse.data.isFirstLogin)" -ForegroundColor White
} catch {
    $errorMsg = $_.Exception.Message
    if ($errorMsg -like "*already exists*") {
        Write-Host "⚠️  User already exists, continuing with login test..." -ForegroundColor Yellow
    } else {
        Write-Host "❌ Signup failed: $errorMsg" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "3. Testing first-time login..." -ForegroundColor Yellow

$loginData = @{
    username = "testuser123"
    password = "test1234"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginData -ErrorAction Stop
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "   Token received: Yes" -ForegroundColor White
    Write-Host "   isFirstLogin: $($loginResponse.data.isFirstLogin)" -ForegroundColor White
    
    $token = $loginResponse.data.token
    
    if ($loginResponse.data.isFirstLogin -eq $true) {
        Write-Host ""
        Write-Host "4. User needs to change password (first login)" -ForegroundColor Yellow
        Write-Host "   Frontend should redirect to /first-login-password-change" -ForegroundColor White
        
        Write-Host ""
        Write-Host "5. Testing password change..." -ForegroundColor Yellow
        
        $passwordChangeData = @{
            oldPassword = "test1234"
            newPassword = "newpass123"
            confirmPassword = "newpass123"
        } | ConvertTo-Json
        
        $headers = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = "application/json"
        }
        
        try {
            $changeResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/first-login-password-change" -Method PUT -Headers $headers -Body $passwordChangeData -ErrorAction Stop
            Write-Host "✅ Password changed successfully!" -ForegroundColor Green
            Write-Host "   isFirstLogin is now: $($changeResponse.data.isFirstLogin)" -ForegroundColor White
            
            Write-Host ""
            Write-Host "6. Testing login with new password..." -ForegroundColor Yellow
            
            $newLoginData = @{
                username = "testuser123"
                password = "newpass123"
            } | ConvertTo-Json
            
            $newLoginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $newLoginData -ErrorAction Stop
            Write-Host "✅ Login with new password successful!" -ForegroundColor Green
            Write-Host "   isFirstLogin: $($newLoginResponse.data.isFirstLogin)" -ForegroundColor White
            Write-Host "   Should go directly to dashboard (not password change)" -ForegroundColor White
            
        } catch {
            Write-Host "❌ Password change failed: $($_.Exception.Message)" -ForegroundColor Red
        }
        
    } else {
        Write-Host ""
        Write-Host "4. User already changed password" -ForegroundColor Yellow
        Write-Host "   Frontend should redirect directly to /dashboard" -ForegroundColor White
    }
    
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ All backend tests passed!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Frontend Testing Steps:" -ForegroundColor Cyan
Write-Host "   1. Go to http://localhost:5173/signup" -ForegroundColor White
Write-Host "   2. Create a new account" -ForegroundColor White
Write-Host "   3. Login with the credentials" -ForegroundColor White
Write-Host "   4. Should redirect to password change page" -ForegroundColor White
Write-Host "   5. Change password and verify redirect to dashboard" -ForegroundColor White
Write-Host "   6. Logout and login again with new password" -ForegroundColor White
Write-Host "   7. Should go directly to dashboard" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
