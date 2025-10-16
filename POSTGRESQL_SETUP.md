# 🌱 Symbiotic City - PostgreSQL Migration Guide

## 🎯 Quick Start

### 1️⃣ Configure Database Connection

Open `backend/.env` and add your Supabase password:

```bash
DATABASE_URL=postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.zdulngziarpuxosavptm.supabase.co:5432/postgres
```

**Important**: Replace `YOUR_ACTUAL_PASSWORD` with your real Supabase database password.

### 2️⃣ Test Database Connection

```bash
cd backend
npm run test:db
```

This will verify your connection and show what tables exist.

### 3️⃣ Run Database Migration

Create all tables and schema:

```bash
npm run migrate
```

You should see:

✅ Migration completed successfully!
📊 Database schema has been initialized.

### 4️⃣ Start the Application

From the root directory:

```bash
cd ..
npm run dev
```

Or from the backend directory:

```bash
npm run dev
```

## 📊 What Changed

### Database: MongoDB → PostgreSQL (Supabase)

| Aspect | Before (MongoDB) | After (PostgreSQL) |
|--------|------------------|-------------------|
| **Database** | MongoDB Atlas | Supabase (PostgreSQL) |
| **ORM/Client** | Mongoose | node-postgres (pg) |
| **ID Format** | ObjectId | UUID v4 |
| **Field Names** | camelCase | snake_case |
| **Geolocation** | GeoJSON | JSONB |
| **Connection** | mongodb:// | postgresql:// |

### Key Benefits

- ✅ **ACID Transactions**: Full database transaction support
- ✅ **Strong Typing**: PostgreSQL enforces strict data types
- ✅ **SQL Power**: Complex joins and advanced queries
- ✅ **Free Hosting**: Supabase generous free tier
- ✅ **Managed Service**: Automatic backups and monitoring
- ✅ **Real-time**: Supabase provides real-time subscriptions (future use)

## 🗄️ Database Schema

### Tables

1. **users** - User accounts and authentication
2. **projects** - Community sustainability projects
3. **events** - Community events and gatherings
4. **energy_products** - Marketplace energy products
5. **orders** - Product orders and transactions
6. **product_reviews** - User product reviews
7. **purchases** - User purchase history

### Example: User Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Testing the Migration

### 1. Test Connection

```bash
cd backend
npm run test:db
```

Expected output:

✅ Connection successful!
📊 Database Information:
   Version: PostgreSQL 15.x
   Database: postgres
   User: postgres
📋 Existing Tables:

   1. users
   2. projects
   3. events
   ...

### 2. Test API Endpoints

**Register a User:**

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Health Check:**

```bash
curl http://localhost:3001/health
```

## 📝 Available Scripts

### Backend

```bash
npm run dev        # Start development server
npm run test:db    # Test database connection
npm run migrate    # Run database migrations
npm run build      # Build for production
npm run start      # Start production server
```

### Root (Full Stack)

```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run install:all      # Install all dependencies
```

## 🔧 Configuration Files Updated

- ✅ `backend/.env` - Database connection string
- ✅ `backend/src/config/database.ts` - PostgreSQL connection
- ✅ `backend/src/models/*` - All models converted
- ✅ `backend/src/routes/auth.ts` - Authentication routes
- ✅ `backend/src/server.ts` - Server configuration
- ✅ `backend/package.json` - Dependencies and scripts

## 🚨 Troubleshooting

### Connection Refused

**Problem**: Can't connect to database

**Solution**:

1. Check DATABASE_URL has the correct password
2. Verify Supabase project is active
3. Check internet connection
4. Ensure SSL is enabled

### Migration Fails

**Problem**: Migration script errors

**Solution**:

1. Verify you're connected to the database
2. Drop existing tables if re-running:

   ```sql
   DROP TABLE IF EXISTS users, projects, events, energy_products, orders CASCADE;
   ```

3. Run migration again: `npm run migrate`

### Module Not Found

**Problem**: Missing dependencies

**Solution**:

```bash
cd backend
npm install
```

### Port Already in Use

**Problem**: Port 3001 is busy

**Solution**:

```bash
# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force

# Or change PORT in .env
PORT=3002
```

## 📚 Documentation

- **Migration Details**: `backend/DATABASE_MIGRATION.md`
- **SQL Schema**: `backend/src/migrations/001_initial_schema.sql`
- **Migration Summary**: `MIGRATION_COMPLETE.md`

## 🎓 Learning Resources

- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [Supabase Docs](https://supabase.com/docs)
- [node-postgres Guide](https://node-postgres.com/)
- [SQL vs NoSQL](https://www.mongodb.com/nosql-explained/nosql-vs-sql)

## ✅ Migration Checklist

- [x] Uninstall MongoDB dependencies
- [x] Install PostgreSQL client (pg)
- [x] Create database configuration
- [x] Create SQL migration scripts
- [x] Convert all models to PostgreSQL
- [x] Update authentication routes
- [x] Update error handling
- [x] Update environment variables
- [x] Create migration documentation
- [ ] **Add your Supabase password to .env**
- [ ] **Run database migration**
- [ ] **Test all endpoints**

## 🌟 Next Steps

1. **Add Supabase Password**: Update `backend/.env`
2. **Run Migration**: `npm run migrate`
3. **Start Development**: `npm run dev`
4. **Test Authentication**: Try register/login
5. **Create Test Data**: Add some users and projects
6. **Frontend Integration**: Update frontend API calls if needed

---

**Status**: 🟢 Migration Complete - Ready for Configuration  
**Database**: PostgreSQL via Supabase  
**Date**: October 16, 2025
