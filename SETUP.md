# TaskFlow Platform - Complete Setup Guide

This guide provides comprehensive instructions to get the TaskFlow Platform running from start to finish.

## 🚀 Quick Start (Recommended)

### Option 1: Local Development (No Database Required)

```bash
# 1. Install dependencies
npm install

# 2. Set up local development environment
npm run setup

# 3. Start the development server
npm run dev
```

The application will be available at http://localhost:3000 and will use mock data.

### Option 2: Docker Compose (Full Stack)

**Windows:**
```cmd
scripts\docker-setup.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/docker-setup.sh
./scripts/docker-setup.sh
```

## 📋 Detailed Setup Instructions

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- (Optional) PostgreSQL 14.x or higher for real database
- (Optional) Docker and Docker Compose for containerized deployment

### 1. Environment Configuration

The application supports multiple environment configurations:

#### Development with Mock Data (No Database)
```bash
npm run setup
```
This creates a `.env.local` file with SQLite configuration and mock data fallback.

#### Development with PostgreSQL
```bash
# Create .env.local with your PostgreSQL connection
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow_platform"
NEXTAUTH_SECRET="your-secret-key"
JWT_SECRET="your-jwt-secret"
NODE_ENV="development"
PORT=3000
```

### 2. Database Setup (If Using Real Database)

#### Using Docker PostgreSQL
```bash
# Start PostgreSQL container
docker run --name taskflow-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=taskflow_platform \
  -p 5432:5432 -d postgres:14

# Initialize database
npm run db:setup
```

#### Using Existing PostgreSQL
```bash
# Create database
createdb taskflow_platform

# Initialize schema and data
npm run db:setup
```

### 3. Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🐳 Docker Deployment

### Using Docker Compose

1. **Automatic Setup (Recommended):**
   ```bash
   # Windows
   scripts\docker-setup.bat
   
   # Linux/Mac
   chmod +x scripts/docker-setup.sh
   ./scripts/docker-setup.sh
   ```

2. **Manual Setup:**
   ```bash
   # Build and start all services
   docker-compose up -d
   
   # Initialize database
   docker-compose exec postgres psql -U taskflow -d taskflow -f /docker-entrypoint-initdb.d/init-database.sql
   docker-compose exec postgres psql -U taskflow -d taskflow -f /docker-entrypoint-initdb.d/seed-data.sql
   ```

### Services Included

- **TaskFlow App**: Main application (port 3000)
- **PostgreSQL**: Database (port 5432)
- **Redis**: Caching and message queue (port 6379)

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run setup` | Local development setup |
| `npm run db:setup` | Initialize database schema and data |
| `npm run db:seed` | Add sample data only |
| `npm run db:reset` | Reset database completely |

## 🌟 Features

### Core Functionality
- ✅ **Dashboard**: Real-time overview of tasks, workflows, and system metrics
- ✅ **Task Management**: View, create, update, and delete tasks
- ✅ **Workflow Management**: Design and manage complex workflows
- ✅ **Worker Nodes**: Monitor distributed worker nodes
- ✅ **System Metrics**: Real-time performance monitoring
- ✅ **Mock Data Fallback**: Works without database for quick testing

### API Endpoints
- ✅ `GET /api/health` - System health check
- ✅ `GET /api/tasks` - Task management
- ✅ `GET /api/workflows` - Workflow management
- ✅ `GET /api/workers` - Worker node management
- ✅ `GET /api/metrics` - System metrics
- ✅ `GET /api/database/status` - Database status

### UI Components
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Dark/light theme support
- ✅ Interactive charts and graphs
- ✅ Real-time status updates
- ✅ Database status banner
- ✅ Comprehensive navigation

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check `DATABASE_URL` in `.env.local`
   - Ensure PostgreSQL is running
   - Verify credentials and database name

2. **Port Already in Use**
   ```bash
   # Find and kill process using port 3000
   netstat -ano | findstr :3000  # Windows
   lsof -ti:3000 | xargs kill    # Mac/Linux
   ```

3. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

4. **Docker Issues**
   ```bash
   # Reset Docker containers
   docker-compose down -v
   docker-compose up -d --build
   ```

### Mock Data vs Real Database

The application automatically detects if a database is available:

- **Database Available**: Uses real data with full functionality
- **No Database**: Falls back to mock data for demonstration
- **Check Status**: Visit `/api/health` to see current configuration

## 🚀 Production Deployment

### Environment Variables (Production)

```bash
# Required
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_SECRET="strong-secret-key"
JWT_SECRET="strong-jwt-secret"
NODE_ENV="production"

# Optional
REDIS_URL="redis://localhost:6379"
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
```

### Build and Deploy

```bash
# Build application
npm run build

# Start production server
npm start

# Or use Docker
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 📚 Additional Resources

- **API Documentation**: Available at `/api/health` for system status
- **Database Schema**: See `scripts/init-database.sql`
- **Sample Data**: See `scripts/seed-data.sql`
- **Docker Configuration**: See `docker-compose.yml`

## 🆘 Support

If you encounter any issues:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review application logs: `docker-compose logs -f` (if using Docker)
3. Check database connectivity: Visit `/api/database/status`
4. Verify environment variables in `.env.local`

The application is designed to be robust and will work with mock data even if the database is not available, making it perfect for quick demonstrations and development.
