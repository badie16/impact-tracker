# ImpactTracker - NGO Project Impact Management Portal

A modern, full-stack web application for NGOs to track project progress, manage indicators, and provide transparency to donors. Built with Next.js 16, React 19, and PostgreSQL.

## Overview

ImpactTracker streamlines how NGOs report on project impact. It eliminates manual Excel tracking by providing:
- **Admins:** Full control over projects and user management
- **Project Managers:** Real-time indicator creation and updates
- **Donors:** Transparent, read-only access to project progress

## Key Features

### Authentication & Security
- Role-based access control (Admin, Project Manager, Donor)
- JWT token-based authentication
- Secure httpOnly cookie storage
- Email/password authentication

### Admin Dashboard
- Create and manage projects
- Manage user accounts and roles
- Monitor project budget and spending
- View all indicators across projects

### Project Manager Dashboard
- View assigned projects
- Create and update project indicators
- Track indicator trends (up/down/stable)
- Real-time project progress updates

### Donor Dashboard
- View funded projects
- Monitor project progress indicators
- Track budget utilization
- Read-only transparent reporting

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Frontend** | Next.js | 16 |
| **UI Library** | React | 19 |
| **Styling** | Tailwind CSS | v4 |
| **Database** | PostgreSQL (Supabase) | 15+ |
| **Auth** | Supabase Auth | - |
| **Deployment** | Vercel | - |

## Project Structure

```
impacttrackermain2/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Login/Register page
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   ├── project-manager/
│   │   └── page.tsx            # PM dashboard
│   ├── donor/
│   │   └── page.tsx            # Donor dashboard
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── logout/
│   │   │   └── me/
│   │   ├── projects/
│   │   │   └── route.ts        # Project CRUD
│   │   ├── indicators/
│   │   │   └── route.ts        # Indicator CRUD
│   │   └── users/
│   │       └── route.ts        # User management
│   └── globals.css             # Global styles
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   └── register-form.tsx
│   ├── dashboards/
│   │   ├── admin-dashboard.tsx
│   │   ├── project-manager-dashboard.tsx
│   │   └── donor-dashboard.tsx
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── server.ts          # Server-side client
│   │   └── client.ts          # Client-side client
│   └── hooks/
│       └── use-auth.ts         # Auth hook
├── public/                     # Static assets
├── GOVERNANCE_REPORT.md        # Project governance & KPIs
└── README.md                   # This file
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase project (for database & auth)
- Vercel account (for deployment)

### Installation

1. **Clone the project**
   ```bash
   git clone https://github.com/badie16/impact-tracker
   cd impact-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # For server-side operations
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up the database**
   
   Create the following tables in Supabase SQL Editor :
   Use file databse.sql
   

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login and get JWT token
POST   /api/auth/logout        - Logout and clear session
GET    /api/auth/me            - Get current user profile
```

### Projects (Admin only)
```
GET    /api/projects           - List all projects
POST   /api/projects           - Create new project
GET    /api/projects/[id]      - Get project details
PATCH  /api/projects/[id]      - Update project
DELETE /api/projects/[id]      - Delete project
```

### Indicators (Project Manager creates)
```
GET    /api/indicators         - List indicators
POST   /api/indicators         - Create indicator (PM only)
PATCH  /api/indicators/[id]    - Update indicator value
DELETE /api/indicators/[id]    - Delete indicator
```

### Users (Admin only)
```
GET    /api/users              - List all users
POST   /api/users              - Create new user
GET    /api/users/[id]         - Get user details
PATCH  /api/users/[id]         - Update user role/status
```

## Authentication & Roles

### User Roles

**Admin**
- Create and manage projects
- Create and manage users
- Assign roles to users
- View all data in the system

**Project Manager**
- View assigned projects
- Create and update indicators
- Track project progress
- Cannot manage users or create projects

**Donor**
- View funded projects (read-only)
- Monitor project progress
- Track spending vs. budget
- No edit permissions

### Login Credentials (Example)
```
Admin:
Email: admin@impacttracker.com
Password: admin

Project Manager:
Email: manager@impacttracker.com
Password: manager

Donor:
Email: donor@impacttracker.com
Password: donor
```

## Testing

The application includes role-based access control. Test each role:

1. **Admin Test**
   - Login as admin
   - Create a new project
   - Create a new user with PM role
   - View all projects and users

2. **Project Manager Test**
   - Login as PM
   - View assigned projects
   - Create a new indicator
   - Update indicator value

3. **Donor Test**
   - Login as donor
   - View projects you're assigned to
   - Verify read-only access (no edit buttons)

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

3. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

##  Monitoring & KPIs

See `GOVERNANCE_REPORT.md` for detailed KPI tracking:
- User adoption rate (target: 85%)
- Data accuracy score (target: 95%)
- Donor satisfaction (target: 4.2/5.0)
- System uptime (target: 99.5%)

## Security Features

- ✅ JWT token-based authentication
- ✅ Role-based access control (RBAC)
- ✅ httpOnly, Secure cookies
- ✅ Password hashing via Supabase Auth
- ✅ API endpoint authorization checks
- ✅ Row-Level Security (RLS) 
- 🔄 Audit logging - planned

## Roadmap

**Phase 1 (Current):** Core functionality
- Authentication & RBAC
- Project management
- Indicator tracking
- Donor dashboards

**Phase 2:** Enhanced features
- Mobile application
- Advanced analytics
- Multi-language support
- Email notifications

**Phase 3:** Integration
- External accounting system integration
- API for third-party apps
- Custom report generation


## License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Last Updated:** November 8, 2025  
**Version:** 2.0  
**Status:** Production Beta Ready
