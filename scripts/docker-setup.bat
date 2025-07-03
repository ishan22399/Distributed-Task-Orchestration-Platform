@echo off
REM Docker Compose Setup Script for TaskFlow Platform (Windows)
REM This script sets up the entire TaskFlow platform using Docker Compose

echo 🚀 Setting up TaskFlow Platform with Docker Compose...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Create necessary directories
if not exist "data\postgres" mkdir "data\postgres"
if not exist "data\redis" mkdir "data\redis"
if not exist "logs" mkdir "logs"

echo ✅ Created data directories

REM Copy environment file if it doesn't exist
if not exist ".env.docker" (
    (
        echo # Database Configuration
        echo DATABASE_URL=postgresql://taskflow:password@postgres:5432/taskflow
        echo.
        echo # Authentication
        echo NEXTAUTH_SECRET=docker-secret-key-change-in-production
        echo NEXTAUTH_URL=http://localhost:3000
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=docker-jwt-secret-change-in-production
        echo.
        echo # Application Settings
        echo NODE_ENV=production
        echo PORT=3000
        echo.
        echo # Redis Configuration
        echo REDIS_URL=redis://redis:6379
        echo.
        echo # Database Credentials
        echo POSTGRES_DB=taskflow
        echo POSTGRES_USER=taskflow
        echo POSTGRES_PASSWORD=password
    ) > .env.docker
    echo ✅ Created .env.docker file
)

REM Build and start the services
echo 🏗️  Building Docker images...
docker-compose build

echo 🚀 Starting services...
docker-compose up -d

REM Wait for database to be ready
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak > nul

echo 📊 Initializing database...
docker-compose exec postgres psql -U taskflow -d taskflow -f /docker-entrypoint-initdb.d/init-database.sql
docker-compose exec postgres psql -U taskflow -d taskflow -f /docker-entrypoint-initdb.d/seed-data.sql

echo 🎉 TaskFlow Platform is now running!
echo.
echo 📋 Service URLs:
echo    • TaskFlow App: http://localhost:3000
echo    • PostgreSQL: localhost:5432
echo    • Redis: localhost:6379
echo.
echo 🔧 Management Commands:
echo    • View logs: docker-compose logs -f
echo    • Stop services: docker-compose down
echo    • Restart services: docker-compose restart
echo    • Update and restart: docker-compose up -d --build

pause
