const https = require('http');

async function testAPI() {
  // Test analytics endpoint
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/admin/analytics',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer admin-token-12345',
      'Content-Type': 'application/json'
    }
  };

  console.log('Testing analytics endpoint...');
  
  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Analytics Response:', data);
      
      // Now test category filtering
      testCategoryFilter();
    });
  });

  req.on('error', (e) => {
    console.error('Analytics request error:', e);
  });

  req.end();
}

function testCategoryFilter() {
  const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/admin/products?category=Brooms',
    method: 'GET',
    headers: {
      'Authorization': 'Bearer admin-token-12345',
      'Content-Type': 'application/json'
    }
  };

  console.log('Testing category filter...');
  
  const req = https.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Category Filter Response:', data);
    });
  });

  req.on('error', (e) => {
    console.error('Category filter request error:', e);
  });

  req.end();
}

testAPI();