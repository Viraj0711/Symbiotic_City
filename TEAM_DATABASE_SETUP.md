# 🔐 Secure Team Database Setup Guide

## ⚠️ IMPORTANT: Database Security

**NEVER commit actual database credentials to Git!** This guide shows you how to securely share database access with your team.

## 🏗️ Setup Options for Team Members

### Option 1: Shared MongoDB Atlas Cluster (Recommended)
1. **Create Individual MongoDB Atlas Accounts**
   - Each team member signs up at https://cloud.mongodb.com/
   - Create their own free cluster OR

2. **Share Access to Your Cluster (Secure Method)**
   - Go to MongoDB Atlas Dashboard
   - Project Settings → Access Manager
   - Invite team members with their email addresses
   - Give them appropriate roles (Read/Write for developers)

### Option 2: Individual Development Databases
Each team member creates their own MongoDB Atlas cluster for development.

## 🔑 Environment Setup for Team Members

### Step 1: Copy Environment Template
```bash
cp backend/.env.example backend/.env
```

### Step 2: Configure Database Connection
Edit `backend/.env` and replace:
```bash
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.u5ka6i9.mongodb.net/symbiotic_city?retryWrites=true&w=majority&appName=Cluster0
```

With your actual MongoDB Atlas connection string.

### Step 3: Get Your Connection String
1. Login to MongoDB Atlas
2. Go to Database → Connect
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials

## 🛡️ Security Best Practices

### What to NEVER commit:
- ❌ Actual database passwords
- ❌ API keys
- ❌ JWT secrets for production
- ❌ Email passwords

### What IS safe to commit:
- ✅ `.env.example` with placeholder values
- ✅ Database schema files
- ✅ Configuration templates
- ✅ Documentation

## 🚀 Quick Start for New Team Members

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Symbiotic_City
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB Atlas credentials
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 🔧 Database Access Methods

### Individual Clusters (Most Secure)
- Each developer has their own MongoDB Atlas cluster
- No credential sharing needed
- Independent development environments

### Shared Development Cluster
- One shared cluster for the team
- Each member gets invited access
- Shared development data

### Production Database
- Separate production cluster
- Limited access (only deployment systems)
- Environment-specific credentials

## 📋 Team Onboarding Checklist

- [ ] Team member creates MongoDB Atlas account
- [ ] Add team member to project (if using shared cluster)
- [ ] Team member copies `.env.example` to `.env`
- [ ] Team member configures their database connection
- [ ] Test connection by running `npm run dev`
- [ ] Verify backend shows "✅ MongoDB Connected"

## 🆘 Troubleshooting

### Connection Issues
1. Check username/password in connection string
2. Verify IP address is whitelisted in MongoDB Atlas
3. Check if cluster is in the same region
4. Ensure database name matches (`symbiotic_city`)

### Authentication Errors
- Double-check username and password
- Make sure user has database access permissions
- Verify the database user exists in MongoDB Atlas

## 🔒 Production Deployment

For production, use environment-specific credentials:
- Production MongoDB cluster with restricted access
- Strong JWT secrets
- Proper API key management
- Regular credential rotation

---

**Remember: Security is everyone's responsibility! Never commit sensitive credentials.**