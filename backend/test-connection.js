/**
 * Test script to verify Supabase database connection
 * Run with: node test-connection.js
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

console.log('Testing database connection...');
console.log('Connection string:', DATABASE_URL.replace(/:[^:@]+@/, ':****@')); // Hide password

const isSupabase = DATABASE_URL.includes('supabase.co');

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: isSupabase ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection successful!');
    return sequelize.query('SELECT version();');
  })
  .then(([results]) => {
    console.log('✅ Database version:', results[0].version);
    console.log('\nConnection test passed!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection failed!');
    console.error('\nError details:');
    console.error('Message:', err.message);
    if (err.original) {
      console.error('Original error:', err.original.message);
      console.error('Code:', err.original.code);
    }
    
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Verify DATABASE_URL in .env file is correct');
    console.error('2. Check Supabase project is active (not paused)');
    console.error('3. Ensure your IP address is whitelisted:');
    console.error('   - Go to Supabase Dashboard > Settings > Database');
    console.error('   - Check "Connection pooling" settings');
    console.error('   - Add your IP to allowed IPs or use "Allow all IPs" for development');
    console.error('4. If password contains special characters, ensure they are URL-encoded');
    console.error('5. Try resetting your database password in Supabase');
    
    process.exit(1);
  });

