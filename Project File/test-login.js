const fetch = require('node-fetch').default;

async function testLogin() {
  try {
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: 'pavani@gmail.com', 
        password: 'pavani123' 
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    const data = await response.text();
    console.log('Response body:', data);
    
    try {
      const jsonData = JSON.parse(data);
      console.log('Parsed JSON:', jsonData);
    } catch (e) {
      console.log('Not valid JSON');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testLogin(); 