# 🎯 MongoDB Atlas Team Access Setup

## Step 1: Invite Team Members to Your Atlas Project

1. **Go to MongoDB Atlas Dashboard**
   - Login to https://cloud.mongodb.com/
   - Navigate to your project (where cluster0 is located)

2. **Access Project Settings**
   - Click "Project Settings" in the left sidebar
   - Go to "Access Manager" tab

3. **Invite Team Members**
   - Click "Invite Users"
   - Enter each team member's email address
   - Assign role: **"Project Data Access Admin"** or **"Project Read and Write"**
   - Send invitations

4. **Add IP Addresses**
   - Go to "Network Access" in the left sidebar
   - Add your team members' IP addresses OR
   - For development: Add `0.0.0.0/0` (Allow access from anywhere - less secure but easier for dev)

## Step 2: Each Team Member Setup

### After receiving Atlas invitation:

1. **Accept MongoDB Atlas Invitation**
   - Check email and accept the project invitation
   - Login to MongoDB Atlas

2. **Get Connection String**
   - Go to Database → Connect → "Connect your application"
   - Copy the connection string
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.u5ka6i9.mongodb.net/symbiotic_city`

3. **Create Database User Credentials**
   - Go to "Database Access" in Atlas
   - Create a new database user with username/password
   - Grant "Read and write to any database" permissions

4. **Setup Local Environment**
   ```bash
   # Copy the environment template
   cp backend/.env.example backend/.env
   
   # Edit backend/.env with YOUR OWN credentials:
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.u5ka6i9.mongodb.net/symbiotic_city?retryWrites=true&w=majority&appName=Cluster0
   ```

## Step 3: Team Development Workflow

### What Each Developer Does:
1. Clone the repository
2. Copy `.env.example` to `.env`
3. Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with their Atlas credentials
4. Never commit their `.env` file

### What Gets Committed:
- ✅ Code changes
- ✅ Schema updates
- ✅ `.env.example` template
- ❌ Never actual `.env` files with credentials

## Security Benefits:
- ✅ Everyone accesses the same database/cluster
- ✅ Individual user credentials (auditable)
- ✅ No credentials in code repository
- ✅ Easy to revoke access for team members
- ✅ Atlas provides access logs and monitoring

## Quick Team Onboarding Checklist:
- [ ] Invite team member to Atlas project
- [ ] Team member accepts invitation
- [ ] Team member creates database user in Atlas
- [ ] Team member copies `.env.example` to `.env`
- [ ] Team member adds their credentials to `.env`
- [ ] Test connection: `npm run dev`
- [ ] Verify: "✅ MongoDB Connected" appears in console