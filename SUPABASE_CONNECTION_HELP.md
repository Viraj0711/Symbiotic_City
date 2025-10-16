# 🔧 Supabase Connection Troubleshooting

## Current Issue: Connection Timeout

You're experiencing connection timeouts which typically means:

1. ❌ The Supabase project might be paused
2. ❌ The connection string format might be incorrect
3. ❌ Firewall/network blocking the connection

## ✅ Solution: Get the Correct Connection String

### Step 1: Access Your Supabase Dashboard

1. Go to: <https://app.supabase.com/>
2. Sign in with your account
3. Select your project: `nzobbewbakkeydvzhggb`

### Step 2: Get the Connection String

1. Click on **"Settings"** (gear icon on the left sidebar)
2. Click on **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section

### Step 3: Choose Connection Type

You'll see two options:

#### Option A: **Direct Connection** (Session Mode)

Host: db.nzobbewbakkeydvzhggb.supabase.co
Port: 5432

Use this format:

postgresql://postgres:viraj7930@db.nzobbewbakkeydvzhggb.supabase.co:5432/postgres

#### Option B: **Connection Pooling** (Transaction Mode) - RECOMMENDED

Host: aws-0-[region].pooler.supabase.com
Port: 6543

Use this format:

postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres

### Step 4: Update Your .env File

1. Open `backend/.env`
2. Replace the `DATABASE_URL` line with the EXACT string from your Supabase dashboard
3. Make sure you select "Transaction" mode for pooling if using Option B

### Step 5: Verify Project is Active

**IMPORTANT**: Free tier Supabase projects pause after 7 days of inactivity

1. In your Supabase dashboard, check if you see:
   - ⚠️ "This project has been paused"
   - 🟢 Green status indicator = Active
   - 🔴 Red/Paused status = Need to restore

2. If paused, click **"Restore project"** button

### Step 6: Test Again

```bash
npm run test:db
```

## 🎯 Quick Checklist

- [ ] Supabase project is active (not paused)
- [ ] Password has NO square brackets: `viraj7930` not `[viraj7930]`
- [ ] Using exact connection string from Supabase dashboard
- [ ] Firewall/antivirus not blocking port 5432 or 6543
- [ ] Internet connection is working

## 🔍 Common Issues

### Issue: "Connection timeout"

**Solution**: Project might be paused. Go to Supabase dashboard and restore it.

### Issue: "Tenant or user not found"

**Solution**: Incorrect connection pooler format. Use the exact string from dashboard.

### Issue: "Password authentication failed"

**Solution**:

1. Verify password in Supabase Settings > Database
2. Reset database password if needed
3. Update .env file with new password

## 📞 Get Your Exact Connection String

Run this in your Supabase SQL Editor to verify database is accessible:

```sql
SELECT version();
```

If this works in Supabase but not locally, it's a connection string format issue.

## 🆘 Alternative: Use Supabase Client Library

If direct PostgreSQL connection continues to fail, we can switch to using the Supabase JavaScript client which handles authentication automatically:

```bash
npm install @supabase/supabase-js
```

This would require a small code change but is often more reliable for Supabase projects.

## ✨ Once Connected

After fixing the connection:

```bash
# Test connection
npm run test:db

# Run migration to create tables
npm run migrate

# Start the server
npm run dev
```

---

**Your Project Details:**

- Project Ref: `nzobbewbakkeydvzhggb`
- Region: Check your Supabase dashboard
- Password: `viraj7930` (update if changed)
