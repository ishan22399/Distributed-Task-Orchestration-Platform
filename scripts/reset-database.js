#!/usr/bin/env node

/**
 * Reset Database Script
 * This script drops and recreates the TaskFlow platform database
 */

const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

// Load environment variables
require("dotenv").config({ path: ".env.local" })

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set")
  console.log("Please create a .env.local file with your database connection string")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function resetDatabase() {
  console.log("🔄 Resetting TaskFlow Platform Database...")

  try {
    // Drop all tables
    console.log("🗑️  Dropping existing tables...")
    await sql`
      DROP TABLE IF EXISTS audit_logs CASCADE;
      DROP TABLE IF EXISTS system_metrics CASCADE;
      DROP TABLE IF EXISTS task_executions CASCADE;
      DROP TABLE IF EXISTS workflow_executions CASCADE;
      DROP TABLE IF EXISTS tasks CASCADE;
      DROP TABLE IF EXISTS workflows CASCADE;
      DROP TABLE IF EXISTS team_members CASCADE;
      DROP TABLE IF EXISTS teams CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS worker_nodes CASCADE;
      
      DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
    `
    console.log("✅ Existing tables dropped successfully")

    // Read and execute init database script
    const initScript = fs.readFileSync(path.join(__dirname, "init-database.sql"), "utf8")
    await sql.unsafe(initScript)
    console.log("✅ Database schema recreated successfully")

    // Read and execute seed data script
    const seedScript = fs.readFileSync(path.join(__dirname, "seed-data.sql"), "utf8")
    await sql.unsafe(seedScript)
    console.log("✅ Sample data inserted successfully")

    console.log("🎉 Database reset completed!")
  } catch (error) {
    console.error("❌ Database reset failed:", error)
    process.exit(1)
  }
}

// Run the reset
resetDatabase()
