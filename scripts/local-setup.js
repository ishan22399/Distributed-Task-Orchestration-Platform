#!/usr/bin/env node

/**
 * Local Development Setup Script
 * This script sets up a local SQLite database for development
 */

const fs = require("fs")
const path = require("path")

// Create .env.local if it doesn't exist
const envPath = path.join(__dirname, "..", ".env.local")
if (!fs.existsSync(envPath)) {
  const envContent = `# Database Configuration (SQLite for local development)
DATABASE_URL="file:./data/taskflow.db"

# Authentication
NEXTAUTH_SECRET="dev-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# JWT Configuration
JWT_SECRET="dev-jwt-secret-change-in-production"

# Application Settings
NODE_ENV="development"
PORT=3000
`
  
  fs.writeFileSync(envPath, envContent)
  console.log("✅ Created .env.local file with local development settings")
}

// Create data directory for SQLite
const dataDir = path.join(__dirname, "..", "data")
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
  console.log("✅ Created data directory for local database")
}

console.log("🎉 Local development setup completed!")
console.log("\n📋 Next steps:")
console.log("1. Update DATABASE_URL in .env.local if using PostgreSQL")
console.log("2. Run 'npm run dev' to start the development server")
console.log("3. Visit http://localhost:3000 to access the application")
console.log("\n💡 The application will use mock data if database is not available")
