const { Sequelize } = require('sequelize');
require('dotenv').config();

// Support both Supabase connection string and individual parameters
let sequelize;

if (process.env.DATABASE_URL) {
  // Use Supabase connection string (recommended)
  // Supabase always requires SSL connections
  const isSupabase = process.env.DATABASE_URL.includes('supabase.co');
  
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: isSupabase ? {
        require: false,
        rejectUnauthorized: false
      } : (process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false)
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Fallback to individual parameters (for local PostgreSQL or Supabase with individual params)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      protocol: 'postgres',
      dialectOptions: {
        ssl: (process.env.DB_SSL === 'true' || process.env.DB_HOST?.includes('supabase.co')) ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = { sequelize };

