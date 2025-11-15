# Supabase Connection Troubleshooting

## Common Issues and Solutions

### 1. Connection Error: SSL Required

**Solution**: The configuration has been updated to automatically enable SSL for Supabase connections. Make sure you're using the latest `backend/config/database.js`.

### 2. IP Address Not Whitelisted

**Error**: `Connection refused` or `timeout`

**Solution**:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **Database**
3. Scroll to **Connection pooling** or **Network restrictions**
4. Add your IP address or enable "Allow all IPs" for development
5. Wait a few minutes for changes to propagate

### 3. Password with Special Characters

**Error**: `password authentication failed`

**Solution**: If your password contains special characters (like `@`, `#`, `%`, etc.), they need to be URL-encoded in the connection string:

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `/` → `%2F`
- `?` → `%3F`

Example:
```
# Original password: P@ssw0rd#123
# Encoded: P%40ssw0rd%23123
DATABASE_URL=postgresql://postgres:P%40ssw0rd%23123@project.supabase.co:5432/postgres
```

### 4. Test Your Connection

Run the test script to diagnose connection issues:

```bash
cd backend
node test-connection.js
```

This will:
- Test the database connection
- Show detailed error messages
- Provide troubleshooting steps

### 5. Verify Connection String Format

Your connection string should look like:
```
postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

Make sure:
- No spaces in the connection string
- Password is properly encoded if it has special characters
- The project reference is correct (found in Supabase dashboard)

### 6. Check Supabase Project Status

1. Go to your Supabase dashboard
2. Ensure your project is **Active** (not paused)
3. Free tier projects may pause after inactivity
4. Click "Restore" if the project is paused

### 7. Connection Pooling

Supabase offers connection pooling. You can use:
- **Direct connection**: `postgresql://...` (port 5432)
- **Pooled connection**: `postgresql://...` (port 6543) - Better for serverless

For this application, use the direct connection (port 5432).

### 8. Environment Variables

Make sure your `.env` file is in the `backend/` directory and contains:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres
```

**Important**: Never commit your `.env` file to git!

## Quick Test

1. **Test connection**:
   ```bash
   cd backend
   node test-connection.js
   ```

2. **Start server**:
   ```bash
   npm run dev
   ```

3. **Check logs** for detailed error messages

## Still Having Issues?

1. Double-check your connection string in Supabase dashboard
2. Try resetting your database password
3. Verify your project is not paused
4. Check Supabase status page for outages
5. Review the error message from `test-connection.js` for specific guidance

