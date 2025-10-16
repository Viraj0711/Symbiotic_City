# Database Migration: MongoDB to PostgreSQL (Supabase)

## Overview

This project has been migrated from MongoDB to PostgreSQL using Supabase as the database provider.

## Changes Made

### 1. Dependencies

- **Removed**: `mongoose`, `mongodb`, `@types/mongoose`
- **Added**: `pg`, `@types/pg` (PostgreSQL client for Node.js)

### 2. Database Connection

- **File**: `backend/src/config/database.ts`
- **Changed**: From Mongoose connection to PostgreSQL connection pool
- **Connection String**: Uses `DATABASE_URL` environment variable

### 3. Data Models

All models have been converted from Mongoose schemas to PostgreSQL-compatible classes:

- `User.ts` - User authentication and profiles
- `Project.ts` - Community projects
- `Order.ts` - Marketplace orders
- `EnergyProduct.ts` - Energy products listing

### 4. Database Schema

- **Location**: `backend/src/migrations/001_initial_schema.sql`
- **Tables Created**:
  - users
  - projects
  - events
  - energy_products
  - orders
  - product_reviews
  - purchases

### 5. Field Naming Convention

Changed from camelCase to snake_case (PostgreSQL convention):

- `_id` → `id` (UUID)
- `createdAt` → `created_at`
- `updatedAt` → `updated_at`
- `isActive` → `is_active`
- `emailVerified` → `email_verified`
- etc.

## Setup Instructions

### 1. Update Environment Variables

Replace your `.env` file with the new PostgreSQL connection:

\`\`\`bash
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.zdulngziarpuxosavptm.supabase.co:5432/postgres
\`\`\`

**Note**: Replace `[YOUR-PASSWORD]` with your actual Supabase database password.

### 2. Run Database Migration

Execute the SQL migration to create all tables:

\`\`\`bash
npm run migrate
\`\`\`

This will:

- Create all necessary tables
- Set up indexes for performance
- Create triggers for automatic `updated_at` timestamps
- Enable UUID extension

### 3. Start the Server

\`\`\`bash
npm run dev
\`\`\`

## Key Differences

### MongoDB vs PostgreSQL

| Feature | MongoDB | PostgreSQL |
|---------|---------|------------|
| ID Type | ObjectId | UUID |
| Embedded Docs | Native | JSONB |
| Arrays | Native | Array types |
| Geolocation | GeoJSON | JSONB (future: PostGIS) |
| Queries | Mongoose methods | SQL queries |

### JSONB Fields

Complex nested objects are stored as JSONB:

- `site_owner_data`
- `preferences`
- `wallet`
- `pricing`
- `availability`
- `specifications`
- `delivery`
- `location`

## API Changes

### No Breaking Changes

The REST API endpoints remain the same. All changes are internal to the backend.

### Response Format

- `_id` is now `id`
- All field names use snake_case in the database
- Timestamps are PostgreSQL TIMESTAMPTZ

## Migration Benefits

1. **ACID Compliance**: Full transaction support
2. **Better Type Safety**: PostgreSQL enforces data types strictly
3. **Powerful Queries**: SQL joins and complex queries
4. **JSON Support**: JSONB for flexible schema parts
5. **Scalability**: Supabase provides managed PostgreSQL with backups
6. **Free Tier**: Generous free tier from Supabase

## Troubleshooting

### Connection Issues

- Verify your DATABASE_URL is correct
- Check Supabase project is active
- Ensure SSL is enabled (required for Supabase)

### Migration Errors

- Drop all tables and re-run migration
- Check PostgreSQL version compatibility

### Query Errors

- Remember: PostgreSQL is case-sensitive
- Use prepared statements ($1, $2) instead of string concatenation

## Next Steps

1. **Test all endpoints**: Verify authentication, CRUD operations
2. **Data seeding**: Create initial test data
3. **Performance tuning**: Add additional indexes if needed
4. **Backup strategy**: Configure Supabase backups

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [node-postgres (pg) Documentation](https://node-postgres.com/)
