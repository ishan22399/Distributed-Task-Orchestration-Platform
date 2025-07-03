#!/usr/bin/env node

/**
 * Seed Database Script
 * This script adds sample data to the TaskFlow platform database
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

async function seedDatabase() {
  console.log("🌱 Seeding TaskFlow Platform Database with sample data...")

  try {
    // Read and execute seed data script
    const seedScript = fs.readFileSync(path.join(__dirname, "seed-data.sql"), "utf8")
    await sql.unsafe(seedScript)
    console.log("✅ Sample data inserted successfully")

    console.log("🎉 Database seeding completed!")
  } catch (error) {
    console.error("❌ Database seeding failed:", error)
    process.exit(1)
  }
}

// Run the seeding
seedDatabase()
