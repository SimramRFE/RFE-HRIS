# Create Admin User Script
# Run this after backend server is running

Write-Host "🔐 HRIS Admin User Creation" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "Checking if backend is running..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -ErrorAction Stop
    Write-Host "✅ Backend is running: $($healthCheck.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not running!" -ForegroundColor Red
    Write-Host "Please start the backend server first:" -ForegroundColor Yellow
    Write-Host "  cd d:\HRIS\backend" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host ""
Write-Host "📝 Enter Admin User Details:" -ForegroundColor Cyan
Write-Host ""

# Get user input
$name = Read-Host "Name (default: Admin User)"
if ([string]::IsNullOrWhiteSpace($name)) { $name = "Admin User" }

$email = Read-Host "Email (default: admin@company.com)"
if ([string]::IsNullOrWhiteSpace($email)) { $email = "admin@company.com" }

$password = Read-Host "Password (default: Admin@123)" -AsSecureString
$passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))
if ([string]::IsNullOrWhiteSpace($passwordPlain)) { $passwordPlain = "Admin@123" }

Write-Host ""
Write-Host "Creating admin user..." -ForegroundColor Yellow

# Create the user
$body = @{
    name = $name
    email = $email
    password = $passwordPlain
    role = "admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method POST -ContentType "application/json" -Body $body -ErrorAction Stop
    
    Write-Host ""
    Write-Host "✅ Admin user created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 User Details:" -ForegroundColor Cyan
    Write-Host "   Name:  $name" -ForegroundColor White
    Write-Host "   Email: $email" -ForegroundColor White
    Write-Host "   Role:  admin" -ForegroundColor White
    Write-Host ""
    Write-Host "🔑 Login Credentials:" -ForegroundColor Cyan
    Write-Host "   Email:    $email" -ForegroundColor Green
    Write-Host "   Password: $passwordPlain" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 You can now login at: http://localhost:5173" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    $errorMessage = $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd() | ConvertFrom-Json
        $errorMessage = $responseBody.message
    }
    
    Write-Host ""
    Write-Host "❌ Failed to create user!" -ForegroundColor Red
    Write-Host "Error: $errorMessage" -ForegroundColor Red
    Write-Host ""
    
    if ($errorMessage -like "*already exists*") {
        Write-Host "💡 This user already exists. You can login with:" -ForegroundColor Yellow
        Write-Host "   Email: $email" -ForegroundColor White
        Write-Host ""
    }
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
