@echo off
REM Chat App Quick Start Script

echo Starting Chat Application Setup...
echo.

REM Install server dependencies
echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies
    pause
    exit /b 1
)

REM Install client dependencies
echo.
echo Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd server
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd client
echo   npm start
echo.
echo Make sure MongoDB is running on localhost:27017
echo.
echo Default JWT_SECRET in .env is for development only!
echo Change it in production.
echo.
pause
