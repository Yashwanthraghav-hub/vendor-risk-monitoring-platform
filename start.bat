@echo off
echo ===================================================
echo   Vendor Risk Monitoring Platform Launcher
echo ===================================================
echo.
echo Installing dependencies for root, backend, and frontend...
call npm.cmd run install:all
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Dependency installation failed!
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo Starting frontend and backend concurrently...
call npm.cmd start
pause
