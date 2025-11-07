# ImpactTracker - NGO Project Management Platform

A comprehensive web application for managing NGO projects, tracking impact indicators, and managing stakeholders (Admins, Project Managers, Donors).

## Overview

ImpactTracker enables organizations to:
- **Manage Projects**: Create, track, and manage development projects
- **Track Indicators**: Define and update key performance indicators for projects
- **Manage Stakeholders**: Handle admin, project manager, and donor user roles
- **Monitor Impact**: Visualize project progress and financial metrics

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT
- **Styling**: Tailwind CSS v4 with shadcn/ui
- **Data Fetching**: SWR for client-side caching
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── api/                    # API routes for CRUD operations
│   │   ├── auth/              # Authentication endpoints
│   │   ├── projects/          # Project management endpoints
│   │   ├── indicators/        # Indicator management endpoints
│   │   └── users/             # User management endpoints
│   ├── admin/                 # Admin dashboard page
│   ├── donor/                 # Donor dashboard page
│   ├── project-manager/       # Project manager dashboard page
│   └── page.tsx              # Landing/login page
├── components/
│   ├── dashboards/           # Dashboard components
│   ├── auth/                 # Authentication forms
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── hooks/               # Custom React hooks (useAuth, useProjects, etc.)
│   ├── supabase/            # Supabase client utilities
│   └── types.ts             # TypeScript type definitions
└── middleware.ts            # Token refresh and auth protection
```

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Supabase account

### Installation

1. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Set up environment variables** in Vercel or `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Create database schema** in Supabase SQL editor (see SQL schema below)

4. **Run development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

## Database Schema

The application uses the following tables:

### users
- `id` (UUID, primary key)
- `email` (text, unique)
- `full_name` (text)
- `role` (text: 'admin', 'project_manager', 'donor')
- `status` (text: 'active', 'inactive')
- `created_at` (timestamp)

### projects
- `id` (UUID, primary key)
- `name` (text)
- `description` (text)
- `budget` (numeric)
- `spent` (numeric)
- `status` (text: 'active', 'completed', 'on_hold')
- `start_date` (date)
- `end_date` (date)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### indicators
- `id` (UUID, primary key)
- `project_id` (UUID, foreign key → projects.id)
- `name` (text)
- `description` (text)
- `current_value` (numeric)
- `target_value` (numeric)
- `unit` (text)
- `trend` (text: 'up', 'down', 'stable')
- `last_updated` (timestamp)
- `created_at` (timestamp)

### donations
- `id` (UUID, primary key)
- `donor_id` (UUID, foreign key → users.id)
- `project_id` (UUID, foreign key → projects.id)
- `amount` (numeric)
- `donation_date` (timestamp)

## Key Features

## User Roles

### Admin
- Full system access
- Manage all projects
- Create and manage users
- View all financial data

### Project Manager
- Manage assigned projects
- Create and update indicators
- Track project progress
- Update project status

### Donor
- View funded projects
- Track donation impact
- View project indicators
- See financial deployment status

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Indicators
- `GET /api/indicators` - List indicators
- `POST /api/indicators` - Create indicator
- `PUT /api/indicators/[id]` - Update indicator
- `DELETE /api/indicators/[id]` - Delete indicator

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Code Quality
- TypeScript for type safety
- Tailwind CSS for consistent styling
- shadcn/ui for accessible components

## Security Features

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) policies
- **Token Refresh**: Automatic token refresh via middleware
- **Password Hashing**: Handled by Supabase Auth
- **HTTPS Only**: Secure cookie transmission

## Performance Optimizations

- **SWR Caching**: Client-side data caching with automatic revalidation
- **Server Components**: Utilized for initial data fetching
- **Code Splitting**: Dynamic imports for dashboard components
- **Image Optimization**: Next.js built-in image optimization

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
git push origin main
```

## Troubleshooting

### Authentication Issues
- Ensure Supabase environment variables are set correctly
- Check if user exists in Supabase auth
- Verify RLS policies allow user access

### Data Not Loading
- Check browser console for API errors
- Verify Supabase connection
- Ensure valid JWT token in localStorage

### Styling Issues
- Clear browser cache
- Rebuild Tailwind CSS: `npm run build`
- Check for conflicting global styles

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Contact the development team

---

**Last Updated**: November 2025
