# Fix Supabase Connection Timeout

## The Issue
You're getting `ETIMEDOUT` which means Supabase is blocking your connection because your IP address is not whitelisted.

## Quick Fix (5 minutes)

### Step 1: Whitelist Your IP in Supabase

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Settings** (gear icon in sidebar)
4. **Click on "Database"** in the settings menu
5. **Scroll down to "Connection pooling"** or **"Network restrictions"**
6. **Find "Allowed IP addresses"** or **"IP Allowlist"**
7. **Add your current IP address**:
   - Option A: Click "Add current IP" or "Allow my IP"
   - Option B: Manually add your IP (you can find it at https://whatismyipaddress.com)
   - Option C: For development, enable "Allow all IPs" (0.0.0.0/0) - **Only for development!**

### Step 2: Wait and Retry

- Wait 1-2 minutes for changes to propagate
- Run the test again: `node test-connection.js`

### Step 3: Alternative - Use Connection Pooling Port

If direct connection still doesn't work, try using Supabase's connection pooling port (6543):

1. In Supabase Dashboard > Settings > Database
2. Look for "Connection string" section
3. Select "Connection pooling" tab
4. Copy the connection string (uses port 6543)
5. Update your `.env` file with this connection string

## Still Not Working?

### Check These:

1. **Is your project paused?**
   - Go to Supabase dashboard
   - Check if project shows "Paused" status
   - Click "Restore" if paused

2. **Firewall/VPN Issues**
   - Try disabling VPN if you're using one
   - Check if your firewall is blocking port 5432
   - Try from a different network

3. **Password Encoding**
   - If your password has special characters, make sure they're URL-encoded
   - Example: `@` becomes `%40`

4. **Connection String Format**
   - Should be: `postgresql://postgres:[PASSWORD]@[PROJECT].supabase.co:5432/postgres`
   - No spaces, no quotes

## Test After Fixing

```bash
cd backend
node test-connection.js
```

You should see: `✅ Database connection successful!`

