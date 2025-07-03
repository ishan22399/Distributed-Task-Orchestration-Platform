#!/usr/bin/env node

/**
 * API Endpoint Test Script
 * This script tests all API endpoints to ensure they're working correctly
 */

const http = require('http')
const https = require('https')
const { URL } = require('url')

const baseUrl = process.env.TEST_URL || 'http://localhost:3000'

const endpoints = [
  { path: '/api/health', method: 'GET', description: 'Health check' },
  { path: '/api/database/status', method: 'GET', description: 'Database status' },
  { path: '/api/tasks', method: 'GET', description: 'Tasks list' },
  { path: '/api/workflows', method: 'GET', description: 'Workflows list' },
  { path: '/api/workers', method: 'GET', description: 'Worker nodes list' },
  { path: '/api/metrics', method: 'GET', description: 'System metrics' },
]

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url)
    const client = parsedUrl.protocol === 'https:' ? https : http
    
    const req = client.request(parsedUrl, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data)
          resolve({
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: jsonData
          })
        } catch (error) {
          resolve({
            status: res.statusCode,
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: data
          })
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.setTimeout(5000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
    
    req.end()
  })
}

async function testEndpoint(endpoint) {
  try {
    const result = await makeRequest(`${baseUrl}${endpoint.path}`)
    
    return {
      ...endpoint,
      status: result.status,
      success: result.success,
      data: result.data
    }
  } catch (error) {
    return {
      ...endpoint,
      status: 'ERROR',
      success: false,
      error: error.message
    }
  }
}

async function runTests() {
  console.log(`🧪 Testing TaskFlow Platform API endpoints at ${baseUrl}...\n`)

  const results = []
  
  for (const endpoint of endpoints) {
    process.stdout.write(`Testing ${endpoint.description}... `)
    const result = await testEndpoint(endpoint)
    results.push(result)
    
    if (result.success) {
      console.log(`✅ ${result.status}`)
    } else {
      console.log(`❌ ${result.status} - ${result.error || 'Failed'}`)
    }
  }

  console.log('\n📊 Test Results Summary:')
  console.log('=' .repeat(50))
  
  const successful = results.filter(r => r.success).length
  const total = results.length
  
  console.log(`✅ Successful: ${successful}/${total}`)
  console.log(`❌ Failed: ${total - successful}/${total}`)
  
  if (successful === total) {
    console.log('\n🎉 All API endpoints are working correctly!')
  } else {
    console.log('\n⚠️  Some endpoints failed. Check the details above.')
  }

  // Show detailed results
  console.log('\n📋 Detailed Results:')
  results.forEach(result => {
    console.log(`\n${result.description}:`)
    console.log(`  Path: ${result.path}`)
    console.log(`  Status: ${result.status}`)
    console.log(`  Success: ${result.success}`)
    
    if (result.success && result.data) {
      if (typeof result.data === 'object' && result.data.status) {
        console.log(`  Data Status: ${result.data.status}`)
      }
      if (typeof result.data === 'object' && result.data.usingMockData !== undefined) {
        console.log(`  Using Mock Data: ${result.data.usingMockData}`)
      }
    }
    
    if (result.error) {
      console.log(`  Error: ${result.error}`)
    }
  })
}

// Run tests
runTests().catch(console.error)
