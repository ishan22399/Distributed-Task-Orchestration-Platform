"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Database, CheckCircle, RefreshCw } from "lucide-react"

interface DatabaseStatus {
  status: string
  schema?: {
    allTablesExist: boolean
    missingTables: string[]
    existingTables: string[]
  }
}

export function DatabaseStatusBanner() {
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/database/status")
      const data = await response.json()
      setDbStatus(data)
    } catch (error) {
      console.error("Failed to check database status:", error)
      setDbStatus({ status: "error" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  if (loading) {
    return (
      <Alert>
        <RefreshCw className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking Database Status...</AlertTitle>
        <AlertDescription>Verifying database connection and schema.</AlertDescription>
      </Alert>
    )
  }

  if (!dbStatus || dbStatus.status === "error") {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Database Connection Error</AlertTitle>
        <AlertDescription>
          Unable to connect to the database. Please check your connection settings.
          <Button variant="outline" size="sm" className="ml-2 bg-transparent" onClick={checkDatabaseStatus}>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (dbStatus.schema && !dbStatus.schema.allTablesExist) {
    return (
      <Alert variant="destructive">
        <Database className="h-4 w-4" />
        <AlertTitle>Database Schema Incomplete</AlertTitle>
        <AlertDescription>
          Missing tables: {dbStatus.schema.missingTables.join(", ")}. The application is using mock data. Please run the
          database initialization scripts.
          <Button variant="outline" size="sm" className="ml-2 bg-transparent" onClick={checkDatabaseStatus}>
            Refresh
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (dbStatus.schema?.allTablesExist) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Database Ready</AlertTitle>
        <AlertDescription className="text-green-700">
          All database tables are properly configured and ready for use.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}
