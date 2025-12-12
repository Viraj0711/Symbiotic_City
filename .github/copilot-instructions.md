# Symbiotic City - AI Coding Agent Instructions

## Architecture Overview
Full-stack TypeScript sustainability platform with **PostgreSQL (Supabase)** backend and React frontend. Migrated from MongoDB - see [backend/DATABASE_MIGRATION.md](../backend/DATABASE_MIGRATION.md) for details.

**Stack**: React 18 + Vite | Express.js + PostgreSQL (pg) | JWT Auth | Tailwind CSS

**Data Flow**: Frontend → API Client (`lib/supabase.ts`) → Express Routes → PostgreSQL Models → Supabase DB

## Critical Patterns & Conventions

### Database Layer (PostgreSQL via node-postgres)
- **Connection**: Use `pool` from `backend/src/config/database.ts` for all queries
- **Model Pattern**: Static class methods (see `backend/src/models/User.ts`):
  ```typescript
  static async create(data: Partial<IUser>): Promise<IUser>
  static async findById(id: string): Promise<IUser | null>
  static async update(id: string, data: Partial<IUser>): Promise<IUser | null>
  ```
- **Field Naming**: Database uses `snake_case` (e.g., `created_at`, `is_active`), NOT camelCase
- **IDs**: UUIDs, not ObjectIds. Schema interfaces defined in `config/database.ts` (IUser, IProject, IEvent, etc.)
- **JSONB Fields**: Complex objects stored as JSONB: `site_owner_data`, `preferences`, `wallet`, `pricing`, `specifications`

### Authentication & Authorization
- **Middleware**: `authenticateToken` in `backend/src/middleware/auth.ts` extracts JWT and attaches `req.user`
- **Role Helpers**: Use `requireRole(['ADMIN', 'SELLER'])`, `requireSiteOwner`, etc. for protected routes
- **Token Storage**: Frontend stores JWT in localStorage via `api.setToken()` in `frontend/src/lib/supabase.ts`
- **Password Hashing**: Always use `bcrypt.hash(password, 12)` - see User model

### Frontend Patterns
- **API Client**: ALWAYS use singleton `api` from `lib/supabase.ts` - never direct fetch
  ```typescript
  import { api } from '../lib/supabase';
  await api.login(email, password); // Auto-manages token
  ```
- **Custom Hooks**: Data fetching via hooks (see `hooks/useProjects.ts`, `useEvents.ts`, `useMarketplace.ts`)
  - Return `{ data, loading, error, refetch }` pattern
  - Transform DB snake_case to frontend camelCase
- **Routing**: React Router v7 in `App.tsx` - nested routes for `/auth/*`, `/marketplace/product/:id`
- **Context Providers**: Wrap order in `App.tsx`: `LanguageProvider > AuthProvider > SearchProvider > Router`

### API Route Structure (Backend)
- **Endpoint Pattern**: `router.METHOD('/path', [validators], [auth], handler)`
- **Validation**: Use `express-validator` for input validation (see `routes/auth.ts` lines 24-49)
- **Error Handling**: PostgreSQL errors auto-handled in `server.ts` global error middleware
  - `23505` → 409 Conflict (duplicate)
  - `23503` → 400 Bad Request (foreign key)
- **Response Format**: Always `{ message: string, data: object }` for success

### Development Workflow
```bash
# Root commands (uses concurrently)
npm run dev              # Start both servers (backend:3001, frontend:5173)
npm run build            # Build both for production
npm run install:all      # Install all dependencies

# Backend-specific (run in backend/)
npm run dev              # tsx watch (hot reload)
npm run migrate          # Run SQL migrations
npm test:db              # Test DB connection
npm run seed             # Seed test data

# Frontend-specific (run in frontend/)
npm run dev              # Vite dev server
npm run build            # Production build
```

### Environment Variables
**Backend `.env`** (required):
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.XXXXX.supabase.co:5432/postgres
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
PORT=3001
```

**Frontend `.env`**:
```
VITE_API_URL=http://localhost:3001/api
```

## Common Tasks

### Adding New Database Model
1. Define interface in `config/database.ts` (e.g., `IMyModel`)
2. Create migration SQL in `migrations/00X_add_model.sql`
3. Create model class in `models/MyModel.ts` with static methods
4. Add route in `routes/myModel.ts` and register in `server.ts`

### Adding Protected Route
```typescript
// backend/src/routes/myRoute.ts
router.post('/action', authenticateToken, async (req: AuthenticatedRequest, res) => {
  const userId = req.user!.id; // TypeScript knows user exists
  // ... logic
});
```

### Creating Custom Hook (Frontend)
```typescript
// Follow pattern in hooks/useProjects.ts
export const useMyData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/my-endpoint`);
      const data = await response.json();
      setData(data.items); // Transform if needed
    } catch (err) { /* handle */ }
  };
  
  return { data, loading, error, refetch: fetchData };
};
```

## Key Files Reference
- **Server Entry**: `backend/src/server.ts` - middleware stack, route registration, error handlers
- **DB Connection**: `backend/src/config/database.ts` - pool config, schema interfaces
- **Auth Middleware**: `backend/src/middleware/auth.ts` - JWT verification, role checks
- **Frontend Entry**: `frontend/src/main.tsx` → `App.tsx` - context setup, routing
- **API Client**: `frontend/src/lib/supabase.ts` - centralized HTTP client with token management

## Migration Notes
This project migrated from MongoDB to PostgreSQL in Dec 2024. When working with legacy code/comments:
- `_id` → `id` (UUID strings)
- `mongoose.Schema` → PostgreSQL tables
- Embedded docs → JSONB columns
- See [DATABASE_MIGRATION.md](../backend/DATABASE_MIGRATION.md) for full mapping

## Security Guidelines (CRITICAL - ALWAYS FOLLOW)

### Input Validation
- **ALWAYS** validate UUIDs with regex before DB queries: `/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`
- **NEVER** trust client input - validate types, ranges, and formats
- Use `express-validator` for request validation

### Mass Assignment Protection
- **NEVER** use `...req.body` spread operator
- **ALWAYS** whitelist fields explicitly:
  ```typescript
  const { title, description, price } = req.body;
  await Model.update(id, { title, description, price });
  ```

### Authentication & Authorization
- **NEVER** allow ADMIN/MODERATOR in registration roles
- **ALWAYS** check ownership before updates: `if (resource.owner_id !== req.user.id) return 403`
- **NEVER** log sensitive data (emails, passwords, tokens, payment IDs)

### Payment Security
- **ALWAYS** calculate prices server-side from database
- **NEVER** trust client-provided amounts
- **ALWAYS** validate stock availability before orders

### Password Security
- **ALWAYS** use `bcrypt.hash(password, 12)` - never less than 12 rounds
- **NEVER** use predictable passwords for OAuth users - use `crypto.randomBytes(32).toString('hex')`

### Rate Limiting
- Authentication endpoints have strict limits (5 attempts/15min)
- Use specific rate limiters from server.ts: `authLimiter`, `registerLimiter`

### Logging
- **NEVER** use `console.log` for sensitive data in production code
- Use structured logging (Winston recommended)
- OK for dev-only utilities (test-connection.ts, etc.)
