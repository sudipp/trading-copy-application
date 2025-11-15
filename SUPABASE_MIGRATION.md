# Supabase Migration Guide

This project has been migrated from local PostgreSQL to Supabase (managed PostgreSQL).

## What Changed

1. **Database Configuration** (`backend/config/database.js`)
   - Now supports Supabase connection string (`DATABASE_URL`)
   - Supports SSL connections (required for Supabase)
   - Falls back to individual parameters if connection string is not provided

2. **Environment Variables** (`backend/.env.example`)
   - Added `DATABASE_URL` for Supabase connection string
   - Updated to use Supabase connection parameters
   - Added `DB_SSL=true` for secure connections

## Setting Up Supabase

### Step 1: Create Supabase Account
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

### Step 2: Get Connection String
1. In your Supabase project, go to **Settings** > **Database**
2. Scroll down to **Connection string**
3. Select **URI** format
4. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres`)

### Step 3: Update Environment Variables
1. Copy `backend/.env.example` to `backend/.env`
2. Add your Supabase connection string:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
   ```

### Alternative: Use Individual Parameters
If you prefer individual parameters:
```env
DB_HOST=[PROJECT-REF].supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[YOUR-PASSWORD]
DB_SSL=true
```

## Benefits of Supabase

- **Managed Database**: No need to install or maintain PostgreSQL locally
- **Automatic Backups**: Built-in backup and recovery
- **SSL/TLS**: Secure connections by default
- **Free Tier**: Generous free tier for development
- **Dashboard**: Web-based database management interface
- **Real-time**: Built-in real-time subscriptions (can be used alongside Socket.io)

## Migration Notes

- All existing Sequelize models work without changes
- Database schema will be created automatically on first run (development mode)
- For production, consider using Supabase migrations or Sequelize migrations
- SSL is automatically enabled in production mode

## Troubleshooting

### Connection Issues
- Ensure your IP is allowed in Supabase (Settings > Database > Connection pooling)
- Check that SSL is enabled (`DB_SSL=true` or use `DATABASE_URL`)
- Verify your password doesn't contain special characters that need URL encoding

### SSL Certificate Errors
- The configuration uses `rejectUnauthorized: false` for development
- For production, consider using proper SSL certificates

## Next Steps

1. Update your `.env` file with Supabase credentials
2. Start the backend server: `npm run dev`
3. The database tables will be created automatically
4. Verify connection in Supabase dashboard

