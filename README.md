# 🌱 Symbiotic City

A modern full-stack web application for building sustainable communities through collaboration, project sharing, and resource exchange.

## 🚀 Features

- **🔐 User Authentication**: Secure JWT-based authentication with MongoDB Atlas
- **👥 Community Projects**: Browse and participate in sustainability projects
- **📅 Events Management**: Organize and join community events
- **🛒 Marketplace**: Trade and share resources within the community
- **📱 Responsive Design**: Modern UI built with React and Tailwind CSS
- **🔍 Search & Filter**: Find projects, events, and marketplace items easily
- **👤 User Profiles**: Personalized profiles with avatar support

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Context API** for state management

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **MongoDB Atlas** for cloud database
- **Mongoose** for ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS & Security** middleware

## 📦 Project Structure

Symbiotic_City/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React Context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # API client and utilities
│   │   └── utils/          # Helper functions
│   ├── public/             # Static assets
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Viraj0711/Symbiotic_City.git
   cd Symbiotic_City
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   ```

3. **Environment Setup**

   **Backend (.env)**

   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

   **Frontend (.env)**

   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Start Development Servers**

   ```bash
   # From root directory - runs both frontend and backend
   npm run dev
   ```

   Or start them separately:

   ```bash
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from frontend directory)
   npm run dev
   ```

5. **Access the Application**
   - Frontend: <http://localhost:5173>
   - Backend API: <http://localhost:3001>

## 🔧 Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm start` - Start production servers

### Frontend Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## 🗄️ Database Schema

### User Model

```typescript
{
  name: string;
  email: string;
  password: string; // bcrypt hashed
  avatar?: string;
  bio?: string;
  location?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Project Model

```typescript
{
  title: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  category: string;
  tags: string[];
  authorId: ObjectId;
  participants: ObjectId[];
  location?: GeoJSON;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Events

- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event by ID

### Marketplace

- `GET /api/marketplace` - Get all marketplace items
- `POST /api/marketplace` - Create new listing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

### Viraj Jadav

- GitHub: [@Viraj0711](https://github.com/Viraj0711)

## 🙏 Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries
- MongoDB Atlas for providing cloud database services
- Vercel/Netlify for hosting solutions

---

### Built with ❤️ for sustainable communities
