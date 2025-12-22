# HRIS Installation Verification Script

Write-Host "🔍 HRIS Installation Verification" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not installed!" -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm installed: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not installed!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check Backend folder
Write-Host "Checking backend folder..." -ForegroundColor Yellow
if (Test-Path "d:\HRIS\backend") {
    Write-Host "✅ Backend folder exists" -ForegroundColor Green
    
    # Check backend dependencies
    if (Test-Path "d:\HRIS\backend\node_modules") {
        Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Backend dependencies not installed" -ForegroundColor Yellow
        Write-Host "   Run: cd d:\HRIS\backend; npm install" -ForegroundColor White
        $allGood = $false
    }
} else {
    Write-Host "❌ Backend folder not found!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check Frontend folder
Write-Host "Checking frontend folder..." -ForegroundColor Yellow
if (Test-Path "d:\HRIS\frontend") {
    Write-Host "✅ Frontend folder exists" -ForegroundColor Green
    
    # Check frontend dependencies
    if (Test-Path "d:\HRIS\frontend\node_modules") {
        Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Frontend dependencies not installed" -ForegroundColor Yellow
        Write-Host "   Run: cd d:\HRIS\frontend; npm install" -ForegroundColor White
        $allGood = $false
    }
} else {
    Write-Host "❌ Frontend folder not found!" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check Backend files
Write-Host "Checking backend files..." -ForegroundColor Yellow
$backendFiles = @(
    "d:\HRIS\backend\package.json",
    "d:\HRIS\backend\server.js",
    "d:\HRIS\backend\.env",
    "d:\HRIS\backend\models\User.js",
    "d:\HRIS\backend\models\Employee.js",
    "d:\HRIS\backend\controllers\authController.js",
    "d:\HRIS\backend\controllers\employeeController.js",
    "d:\HRIS\backend\routes\authRoutes.js",
    "d:\HRIS\backend\routes\employeeRoutes.js",
    "d:\HRIS\backend\middleware\auth.js"
)

$missingBackendFiles = 0
foreach ($file in $backendFiles) {
    if (!(Test-Path $file)) {
        if ($missingBackendFiles -eq 0) {
            Write-Host "❌ Missing backend files:" -ForegroundColor Red
        }
        Write-Host "   - $file" -ForegroundColor Red
        $missingBackendFiles++
        $allGood = $false
    }
}

if ($missingBackendFiles -eq 0) {
    Write-Host "All backend files present" -ForegroundColor Green
}

Write-Host ""

# Check Frontend files
Write-Host "Checking frontend API integration..." -ForegroundColor Yellow
$frontendFiles = @(
    "d:\HRIS\frontend\src\services\api.js",
    "d:\HRIS\frontend\.env"
)

$missingFrontendFiles = 0
foreach ($file in $frontendFiles) {
    if (!(Test-Path $file)) {
        if ($missingFrontendFiles -eq 0) {
            Write-Host "❌ Missing frontend files:" -ForegroundColor Red
        }
        Write-Host "   - $file" -ForegroundColor Red
        $missingFrontendFiles++
        $allGood = $false
    }
}

if ($missingFrontendFiles -eq 0) {
    Write-Host "✅ API service files present" -ForegroundColor Green
}

Write-Host ""

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoCheck = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($mongoCheck) {
        Write-Host "✅ MongoDB is running on port 27017" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB not detected on port 27017" -ForegroundColor Yellow
        Write-Host "   You can either:" -ForegroundColor White
        Write-Host "   1. Install MongoDB locally and start it" -ForegroundColor White
        Write-Host "   2. Use MongoDB Atlas (cloud)" -ForegroundColor White
        Write-Host "   Update MONGODB_URI in backend/.env" -ForegroundColor White
    }
} catch {
    Write-Host "⚠️  Cannot check MongoDB status" -ForegroundColor Yellow
}

Write-Host ""

# Check if axios is installed in frontend
Write-Host "Checking axios in frontend..." -ForegroundColor Yellow
$packageJsonPath = "d:\HRIS\frontend\package.json"
if (Test-Path $packageJsonPath) {
    $packageJson = Get-Content $packageJsonPath | ConvertFrom-Json
    if ($packageJson.dependencies.axios) {
        Write-Host "✅ Axios installed: $($packageJson.dependencies.axios)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Axios not found in package.json" -ForegroundColor Yellow
        Write-Host "   Run: cd d:\HRIS\frontend; npm install axios" -ForegroundColor White
        $allGood = $false
    }
}

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host ""
    Write-Host "🎉 All checks passed! Your HRIS setup is ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Ensure MongoDB is running" -ForegroundColor White
    Write-Host "   2. Run: .\start-servers.ps1" -ForegroundColor White
    Write-Host "   3. Run: .\create-admin.ps1" -ForegroundColor White
    Write-Host "   4. Open: http://localhost:5173" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "⚠️  Some issues detected. Please fix them before starting." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 Common Fixes:" -ForegroundColor Cyan
    Write-Host "   Missing dependencies:" -ForegroundColor White
    Write-Host "     cd d:\HRIS\backend; npm install" -ForegroundColor Gray
    Write-Host "     cd d:\HRIS\frontend; npm install" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Install MongoDB:" -ForegroundColor White
    Write-Host "     https://www.mongodb.com/try/download/community" -ForegroundColor Gray
    Write-Host "     OR use MongoDB Atlas (cloud)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
