/**
 * Rate Limiting Demo Script
 * 
 * This script demonstrates the rate limiting functionality
 * by making multiple requests to test endpoints.
 * 
 * Run with: npx tsx demo/rate-limit-demo.ts
 */

import { RateLimiter } from "../core/utils/RateLimiter";

console.log("=== Rate Limiting Demo ===\n");

// Create a rate limiter instance
const rateLimiter = new RateLimiter(5, 10000); // 5 requests per 10 seconds for demo

console.log("Configuration: 5 requests per 10 seconds\n");

// Simulate requests from the same IP
const testIP = "192.168.1.100";

console.log(`Simulating requests from IP: ${testIP}\n`);

for (let i = 1; i <= 7; i++) {
  const result = rateLimiter.checkLimit(testIP);
  
  console.log(`Request ${i}:`);
  console.log(`  Allowed: ${result.allowed}`);
  console.log(`  Limit: ${result.limit}`);
  console.log(`  Remaining: ${result.remaining}`);
  console.log(`  Reset: ${new Date(result.reset).toISOString()}`);
  
  if (!result.allowed) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    console.log(`  ⚠️  Rate limit exceeded! Retry after ${retryAfter} seconds`);
  } else {
    console.log(`  ✓ Request allowed`);
  }
  console.log();
}

// Test endpoint-specific limits
console.log("\n=== Testing Endpoint-Specific Limits ===\n");

const customLimiter = new RateLimiter(100, 15 * 60 * 1000);
customLimiter.setEndpointLimit("/api/auth/login", 3, 10000); // 3 per 10 sec

const testIP2 = "192.168.1.101";

console.log("Default limit: 100 requests per 15 minutes");
console.log("Login endpoint limit: 3 requests per 10 seconds\n");

for (let i = 1; i <= 5; i++) {
  const result = customLimiter.checkLimit(testIP2, "/api/auth/login");
  
  console.log(`Login Request ${i}:`);
  console.log(`  Allowed: ${result.allowed}`);
  console.log(`  Limit: ${result.limit}`);
  console.log(`  Remaining: ${result.remaining}`);
  
  if (!result.allowed) {
    console.log(`  ⚠️  Rate limit exceeded!`);
  } else {
    console.log(`  ✓ Request allowed`);
  }
  console.log();
}

console.log("\n=== Demo Complete ===");
