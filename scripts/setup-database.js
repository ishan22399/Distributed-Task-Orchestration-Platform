#!/usr/bin/env node

/**
 * Database Setup Script
 * This script initializes the TaskFlow platform database with sample data
 */

const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

// Load environment variables
require("dotenv").config({ path: ".env.local" })

const sql = neon(process.env.DATABASE_URL)

async function initDatabase() {
  console.log("🚀 Initializing TaskFlow Platform Database...")

  try {
    // Read and execute init database script
    const initScript = fs.readFileSync(path.join(__dirname, "init-database.sql"), "utf8")
    await sql.unsafe(initScript)
    console.log("✅ Database schema created successfully")

    // Read and execute seed data script
    const seedScript = fs.readFileSync(path.join(__dirname, "seed-data.sql"), "utf8")
    await sql.unsafe(seedScript)
    console.log("✅ Sample data inserted successfully")

    console.log("🎉 Database setup completed!")
    console.log("📊 You can now start the application with: npm run dev")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    process.exit(1)
  }
}

// Run the setup
initDatabase()
