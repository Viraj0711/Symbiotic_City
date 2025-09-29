# Symbiotic City Backend API

A comprehensive Node.js/Express backend API for the Symbiotic City community sustainability platform.

## 🌟 Features

- **Authentication & Authorization**: JWT-based auth with Supabase integration
- **User Management**: Role-based access control (User, Moderator, Admin)
- **Projects**: Create and manage sustainability projects
- **Events**: Community event management and registration
- **Marketplace**: Sustainable marketplace for buying/selling
- **City Data**: Geographic data management with location services
- **Posts**: Content management system for community posts
- **Real-time Features**: Built for scalability with Supabase

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **Validation**: Joi
- **File Upload**: Multer + Sharp
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── database.ts         # Supabase configuration
│   ├── middleware/
│   │   ├── auth.ts            # Authentication middleware
│   │   ├── errorHandler.ts    # Global error handling
│   │   └── notFound.ts        # 404 handler
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   ├── users.ts           # User management
│   │   ├── projects.ts        # Project management
│   │   ├── events.ts          # Event management
│   │   ├── posts.ts           # Content management
│   │   ├── cityData.ts        # Geographic data
│   │   └── marketplace.ts     # Marketplace features
│   ├── utils/
│   │   ├── logger.ts          # Winston logger setup
│   │   └── validation.ts      # Joi validation schemas
│   └── server.ts              # Main application entry
├── package.json
├── tsconfig.json
├── .env.example
└── README.md

```text

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- PostgreSQL database (via Supabase)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:

```env
# Environment
NODE_ENV=development
PORT=3001

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 3. Database Setup

The backend uses the existing Supabase database with these tables:

- `users` - User profiles and roles
- `posts` - Community content
- `city_data` - Projects, events, marketplace items, and geographic data

Make sure your Supabase project has these tables set up as defined in `src/config/database.ts`.

### 4. Development

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### 5. Production Build

```bash
npm run build
npm start
```

## 🔗 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Password reset

### Users

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin/moderator)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id/role` - Update user role (admin)

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/join` - Join project

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `POST /api/events/:id/register` - Register for event

### Posts

- `GET /api/posts` - Get all posts
- `GET /api/posts/:identifier` - Get post by ID or slug

### Marketplace

- `GET /api/marketplace` - Get marketplace items
- `GET /api/marketplace/:id` - Get item by ID
- `POST /api/marketplace` - Create marketplace item
- `PATCH /api/marketplace/:id/sold` - Mark item as sold

### City Data

- `GET /api/city-data` - Get all city data
- `GET /api/city-data/:id` - Get city data by ID
- `POST /api/city-data` - Create city data entry

## 🔐 Authentication

The API uses Supabase Auth for authentication. Include the JWT token in the Authorization header:

```bash
Authorization: Bearer your_jwt_token_here
```

### User Roles

- **USER**: Basic user permissions
- **MODERATOR**: Can manage content and users
- **ADMIN**: Full system access

## 📝 Query Parameters

Most GET endpoints support pagination and filtering:

### Pagination

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

### Filtering

- `search`: Text search in relevant fields
- `category`: Filter by category
- `status`: Filter by status
- `type`: Filter by type

### Examples

```bash
# Get projects with pagination
GET /api/projects?page=1&limit=20

# Search projects
GET /api/projects?search=sustainability&category=Environment

# Get upcoming events
GET /api/events?upcoming=true

# Get marketplace items in price range
GET /api/marketplace?priceRange=10,100&category=Electronics
```

## 🛡️ Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable origin restrictions
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **SQL Injection Protection**: Supabase built-in protection
- **JWT Security**: Secure token handling

## 📊 Logging

Winston logger with different log levels:

- `error`: Error messages
- `warn`: Warning messages
- `info`: General information
- `debug`: Debug information

Logs are written to:

- `logs/error.log`: Error logs only
- `logs/combined.log`: All logs
- Console: Development environment

## 🚦 Health Check

Check API health:

```bash
GET /health
```

Response:

```json
{
  "status": "OK",
  "timestamp": "2025-08-14T10:30:00.000Z",
  "uptime": 3600.45,
  "environment": "development"
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Monitoring

The API includes:

- Request logging with Morgan
- Error tracking with Winston
- Performance monitoring ready
- Health check endpoint

## 🤝 Integration with Frontend

This backend is designed to work with the React frontend in the parent directory. The API endpoints match the data structures used in the frontend hooks:

- `useProjects.ts` → `/api/projects`
- `useEvents.ts` → `/api/events`
- `useMarketplace.ts` → `/api/marketplace`
- `AuthContext.tsx` → `/api/auth/*`

## 🔄 Data Flow

1. **Frontend** sends requests to API endpoints
2. **Middleware** handles authentication, validation, and logging
3. **Routes** process business logic
4. **Supabase** handles data persistence and real-time features
5. **Response** formatted and sent back to frontend

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_KEY=your_production_service_key
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=your_production_frontend_url
```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/server.js"]
```

## 📚 API Documentation

For detailed API documentation, consider setting up:

- Swagger/OpenAPI documentation
- Postman collection
- API testing suite

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Verify Supabase credentials
2. **CORS Errors**: Check CORS_ORIGIN configuration
3. **Authentication**: Ensure JWT secret matches
4. **Rate Limiting**: Adjust limits for your use case

### Debug Mode

Set `LOG_LEVEL=debug` in your `.env` file for detailed logging.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

For questions or support, please create an issue in the repository.
