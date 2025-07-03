# TaskFlow - Distributed Task Orchestration Platform

A modern, enterprise-grade task orchestration and workflow management system built with Next.js, TypeScript, and PostgreSQL.

## Features

- **Workflow Management**: Create, schedule, and monitor complex workflows
- **Task Execution**: Distributed task execution with retry logic and error handling
- **Real-time Monitoring**: Live dashboard with task status and system metrics
- **Worker Node Management**: Manage distributed worker nodes across different regions
- **Team Collaboration**: Multi-tenant architecture with team-based access control
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Radix UI

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm or yarn package manager

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-orchestration-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow_platform"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# JWT Configuration
JWT_SECRET="your-jwt-secret-here"

# Application Settings
NODE_ENV="development"
PORT=3000
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with Docker
docker run --name taskflow-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=taskflow_platform -p 5432:5432 -d postgres:14

# Wait for PostgreSQL to start, then set up the database
npm run db:setup
```

#### Option B: Using Existing PostgreSQL

1. Create a new database named `taskflow_platform`
2. Update the `DATABASE_URL` in your `.env.local` file
3. Run the database setup script:

```bash
npm run db:setup
```

### 5. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## Database Commands

- `npm run db:setup` - Initialize database schema and seed data
- `npm run db:seed` - Add sample data to existing database
- `npm run db:reset` - Drop and recreate database with fresh data

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── tasks/             # Task management pages
│   ├── workflows/         # Workflow management pages
│   └── workers/           # Worker node management pages
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── ...               # Feature-specific components
├── lib/                   # Utility libraries
│   ├── db.ts             # Database connection and queries
│   ├── db-utils.ts       # Database utilities
│   └── utils.ts          # General utilities
├── scripts/              # Database setup and management scripts
├── kubernetes/           # Kubernetes deployment files
└── public/              # Static assets
```

## API Endpoints

### Health Check
- `GET /api/health` - System health status

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Workflows
- `GET /api/workflows` - List all workflows
- `POST /api/workflows` - Create a new workflow
- `GET /api/workflows/{id}` - Get workflow details
- `PUT /api/workflows/{id}` - Update workflow
- `DELETE /api/workflows/{id}` - Delete workflow

### Workers
- `GET /api/workers` - List all worker nodes
- `POST /api/workers` - Register a new worker
- `GET /api/workers/{id}` - Get worker details
- `PUT /api/workers/{id}` - Update worker status

### Metrics
- `GET /api/metrics` - System metrics and statistics

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Deployment

### Docker Deployment

```bash
# Build the Docker image
docker build -t taskflow-platform .

# Run with Docker Compose
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Apply Kubernetes manifests
kubectl apply -f kubernetes/
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Required |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `JWT_SECRET` | JWT signing secret | Required |
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Application port | `3000` |

### Database Schema

The application uses the following main tables:

- **users**: User accounts and authentication
- **teams**: Team/organization management
- **workflows**: Workflow definitions
- **tasks**: Individual task definitions
- **task_executions**: Task execution history
- **worker_nodes**: Worker node registry
- **system_metrics**: System monitoring data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.
