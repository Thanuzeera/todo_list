@echo off
echo Setting up Todo App...
echo.

echo Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ../frontend
npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b 1
)

cd ..

echo.
echo Setup completed successfully!
echo.
echo Next steps:
echo 1. Set up your MySQL database using backend/database.sql
echo 2. Update backend/.env with your database credentials
echo 3. Run start.bat to start both servers
echo.
echo Press any key to exit...
pause > nul
