// Test script to verify CORS configuration
import fetch from 'node-fetch';

const testUrls = [
  'http://localhost:3000',
  'https://your-railway-app.up.railway.app', // Replace with your actual Railway URL
];

const testEndpoints = [
  '/health',
  '/test',
  '/api/movies'
];

async function testCORS() {
  console.log('🧪 Testing CORS configuration...\n');

  for (const baseUrl of testUrls) {
    console.log(`📍 Testing: ${baseUrl}`);
    
    for (const endpoint of testEndpoints) {
      const url = `${baseUrl}${endpoint}`;
      
      try {
        // Test OPTIONS request (preflight)
        console.log(`  🔍 Testing OPTIONS ${endpoint}...`);
        const optionsResponse = await fetch(url, {
          method: 'OPTIONS',
          headers: {
            'Origin': 'https://movies-tv-shows-flame.vercel.app',
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type,Authorization'
          }
        });
        
        console.log(`    ✅ OPTIONS Status: ${optionsResponse.status}`);
        console.log(`    ✅ CORS Headers: ${optionsResponse.headers.get('access-control-allow-origin') || 'none'}`);
        
        // Test actual GET request
        console.log(`  🔍 Testing GET ${endpoint}...`);
        const getResponse = await fetch(url, {
          method: 'GET',
          headers: {
            'Origin': 'https://movies-tv-shows-flame.vercel.app'
          }
        });
        
        console.log(`    ✅ GET Status: ${getResponse.status}`);
        
      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
      }
    }
    
    console.log('');
  }
  
  console.log('✅ CORS testing complete!');
}

// Run the test
testCORS().catch(console.error); 