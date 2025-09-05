# Symbiotic City - Complete Project Setup

This project consists of a **React frontend** and a **Node.js/Express backend** for a community sustainability platform.

## 🏗️ Project Structure

```text
Symbiotic_City-main/
├── backend/                 # Node.js/Express API server
│   ├── src/                # Source code
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
├── src/                    # React frontend source
├── package.json            # Frontend dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Supabase account** and project
- **Git** (for version control)

### 1. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_KEY=your_service_key

# Start development server
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Setup Frontend

```bash
# Navigate to frontend directory (from root)
cd ..

# Install dependencies
npm install

# Copy environment template (if needed)
cp .env.example .env

# Add your Supabase credentials to .env
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_anon_key

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 3. Verify Setup

1. **Backend Health Check**: Visit `http://localhost:3001/health`
2. **Frontend**: Visit `http://localhost:5173`
3. **Integration**: Test login/registration from frontend

## 🗄️ Database Setup

Your Supabase project needs these tables:

### Users Table

```sql
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('USER', 'ADMIN', 'MODERATOR')) DEFAULT 'USER',
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Posts Table

```sql
CREATE TABLE posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  slug TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')) DEFAULT 'DRAFT',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  tags JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### City Data Table

```sql
CREATE TABLE city_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL NOT NULL,
  longitude DECIMAL NOT NULL,
  properties JSONB,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔗 API Integration

The frontend components are already configured to work with the backend:

- **AuthContext** → `/api/auth/*`
- **useProjects** → `/api/projects`
- **useEvents** → `/api/events`
- **useMarketplace** → `/api/marketplace`

## 🛠️ Development Workflow

### Running Both Services

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
npm run dev
```

### Environment Variables

**Frontend (.env):**

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Backend (.env):**

```env
NODE_ENV=development
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:5173
```

## 📱 Features

### Frontend Features

- **Modern React 18** with TypeScript
- **Tailwind CSS** for styling
- **Supabase Auth** integration
- **React Router** for navigation
- **React Hook Form** with validation
- **Responsive design**

### Backend Features

- **RESTful API** with Express.js
- **JWT Authentication** with Supabase
- **Role-based access control**
- **Input validation** with Joi
- **File upload** support
- **Rate limiting** and security
- **Comprehensive logging**

### Data Management

- **Projects**: Sustainability projects with progress tracking
- **Events**: Community events with registration
- **Marketplace**: Sustainable product marketplace
- **Posts**: Community content management
- **Users**: Profile and role management
- **Geographic Data**: Location-based features

## 🔐 Authentication Flow

1. **User Registration**: Frontend → Backend → Supabase Auth
2. **User Login**: Supabase Auth → Backend validation → JWT token
3. **Protected Routes**: JWT token validation on each request
4. **Role Permissions**: Admin/Moderator access control

## 🚀 Deployment

### Production Environment Variables

Update both frontend and backend `.env` files for production:

- Use production Supabase URLs
- Set strong JWT secrets
- Configure proper CORS origins
- Enable production logging

### Build Commands

**Frontend:**

```bash
npm run build
```

**Backend:**

```bash
npm run build
npm start
```

## 📚 Documentation

- **Backend API**: See `backend/README.md` for detailed API documentation
- **Frontend Components**: Explore `src/components/` for React components
- **Database Schema**: Check `src/lib/supabase.ts` for type definitions

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Check backend CORS_ORIGIN matches frontend URL
2. **Auth Issues**: Verify Supabase keys match between frontend/backend
3. **Database Errors**: Ensure all required tables exist in Supabase
4. **Port Conflicts**: Backend (3001) and Frontend (5173) ports must be free

### Debug Mode

Set environment variables for debugging:

- Backend: `LOG_LEVEL=debug`
- Frontend: Check browser console for errors

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions or issues:

1. Check the documentation in `backend/README.md`
2. Review common troubleshooting steps above
3. Create an issue in the repository
4. Join our community discussions
