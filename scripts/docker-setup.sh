#!/bin/bash

# Docker Compose Setup Script for TaskFlow Platform
# This script sets up the entire TaskFlow platform using Docker Compose

echo "🚀 Setting up TaskFlow Platform with Docker Compose..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p logs

# Set proper permissions
chmod 755 data/postgres
chmod 755 data/redis
chmod 755 logs

echo "✅ Created data directories"

# Copy environment file if it doesn't exist
if [ ! -f .env.docker ]; then
    cat > .env.docker << EOF
# Database Configuration
DATABASE_URL=postgresql://taskflow:password@postgres:5432/taskflow

# Authentication
NEXTAUTH_SECRET=docker-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=docker-jwt-secret-change-in-production

# Application Settings
NODE_ENV=production
PORT=3000

# Redis Configuration
REDIS_URL=redis://redis:6379

# Database Credentials
POSTGRES_DB=taskflow
POSTGRES_USER=taskflow
POSTGRES_PASSWORD=password
EOF
    echo "✅ Created .env.docker file"
fi

# Build and start the services
echo "🏗️  Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
until docker-compose exec postgres pg_isready -U taskflow -d taskflow; do
    sleep 2
done

echo "📊 Initializing database..."
docker-compose exec postgres psql -U taskflow -d taskflow -f /docker-entrypoint-initdb.d/init-database.sql
docker-compose exec postgres psql -U taskflow -d taskflow -f /docker-entrypoint-initdb.d/seed-data.sql

echo "🎉 TaskFlow Platform is now running!"
echo ""
echo "📋 Service URLs:"
echo "   • TaskFlow App: http://localhost:3000"
echo "   • PostgreSQL: localhost:5432"
echo "   • Redis: localhost:6379"
echo ""
echo "🔧 Management Commands:"
echo "   • View logs: docker-compose logs -f"
echo "   • Stop services: docker-compose down"
echo "   • Restart services: docker-compose restart"
echo "   • Update and restart: docker-compose up -d --build"
