# HRIS Startup Script
# This script starts both backend and frontend servers

Write-Host "🚀 Starting HRIS Application..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running (for local installation)
Write-Host "📊 Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $mongoCheck = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($mongoCheck) {
        Write-Host "✅ MongoDB is running on port 27017" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB may not be running locally (using Atlas?)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Cannot check MongoDB status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting servers in new windows..." -ForegroundColor Cyan
Write-Host ""

# Start Backend Server
Write-Host "🔧 Starting Backend Server (Port 5000)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\HRIS\backend'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Magenta; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server (Port 5173)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\HRIS\frontend'; Write-Host '🎨 Frontend Server Starting...' -ForegroundColor Blue; npm run dev"

Write-Host ""
Write-Host "✅ Servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Important Information:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Please wait 10-15 seconds for servers to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Once started, open your browser to:" -ForegroundColor Cyan
Write-Host "   http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Default Admin Credentials (after signup):" -ForegroundColor Cyan
Write-Host "   Email: admin@company.com" -ForegroundColor White
Write-Host "   Password: Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Check QUICK_START.md for setup instructions" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
