require('dotenv').config();
const axios = require('axios');

const STOCK_API_KEY = process.env.STOCK_API_KEY;
const STOCK_API_PROVIDER = process.env.STOCK_API_PROVIDER;

console.log('=== Alpha Vantage Connection Test ===\n');
console.log('Configuration:');
console.log(`- API Provider: ${STOCK_API_PROVIDER}`);
console.log(`- API Key: ${STOCK_API_KEY ? STOCK_API_KEY.substring(0, 4) + '...' + STOCK_API_KEY.substring(STOCK_API_KEY.length - 4) : 'NOT SET'}`);
console.log('\n');

async function testAlphaVantage() {
  try {
    console.log('Testing connection to Alpha Vantage API...\n');
    
    // Test 1: Get current stock price for AAPL
    console.log('Test 1: Fetching current price for AAPL...');
    const priceResponse = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: 'AAPL',
        apikey: STOCK_API_KEY
      },
      timeout: 10000
    });

    console.log('Response received:');
    console.log(JSON.stringify(priceResponse.data, null, 2));
    console.log('\n');

    // Check for errors
    if (priceResponse.data['Error Message']) {
      console.error('❌ API Error:', priceResponse.data['Error Message']);
      return false;
    }

    if (priceResponse.data['Note']) {
      console.warn('⚠️  API Warning:', priceResponse.data['Note']);
      console.log('\nThis usually means you have reached the API rate limit.');
      console.log('Alpha Vantage free tier allows 25 requests per day and 5 requests per minute.\n');
      return false;
    }

    const quote = priceResponse.data['Global Quote'];
    if (quote && quote['05. price']) {
      console.log('✅ Success! Connection to Alpha Vantage is working.\n');
      console.log('Stock Data Retrieved:');
      console.log(`- Symbol: ${quote['01. symbol']}`);
      console.log(`- Price: $${quote['05. price']}`);
      console.log(`- Change: ${quote['09. change']} (${quote['10. change percent']})`);
      console.log(`- Volume: ${quote['06. volume']}`);
      console.log(`- High: $${quote['03. high']}`);
      console.log(`- Low: $${quote['04. low']}`);
      console.log(`- Open: $${quote['02. open']}`);
      console.log(`- Previous Close: $${quote['08. previous close']}`);
      console.log('\n');
      return true;
    } else {
      console.error('❌ Invalid response format from Alpha Vantage');
      return false;
    }

  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('\nNetwork error: Cannot reach Alpha Vantage servers.');
      console.error('Please check your internet connection.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\nRequest timed out. The API might be slow or unreachable.');
    } else if (error.response) {
      console.error('HTTP Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
    
    return false;
  }
}

// Run the test
testAlphaVantage().then(success => {
  if (success) {
    console.log('=== Test Completed Successfully ===');
    process.exit(0);
  } else {
    console.log('=== Test Failed ===');
    process.exit(1);
  }
}).catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
