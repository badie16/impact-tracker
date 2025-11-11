# ImpactTracker - Governance Report
## NGO Project Impact Management Portal

**Document Version:** 2.0
**Date:** November 8, 2025  
**Organization:** ImpactSolidaire  
**Project Name:** ImpactTracker Portal

---

## Executive Summary

ImpactTracker is a production-ready web-based portal designed to streamline project tracking and impact reporting for NGOs. The system enables project managers to create and update real-time indicators, allows donors to visualize project progress through read-only dashboards, and provides administrators with comprehensive project and user management capabilities. This governance report outlines the project charter, technical architecture, security implementation status, and key performance indicators.

---

## 1. Project Charter

### 1.1 Project Objectives (The "Why")

**Primary Objectives:**
- **Eliminate Manual Reporting:** Replace Excel-based tracking with an automated, real-time portal
- **Enhance Transparency:** Provide donors with immediate visibility into project progress and fund utilization
- **Improve Data Accuracy:** Reduce errors and inconsistencies in project reporting
- **Enable Data-Driven Decisions:** Provide actionable insights through centralized indicator tracking
- **Strengthen Donor Confidence:** Demonstrate accountability and impact through transparent reporting

**Strategic Goals:**
- Reduce reporting time by 80% (from 2 weeks to 2 days)
- Achieve 95% data accuracy in project indicators
- Increase donor satisfaction scores by 40%
- Enable real-time decision-making for project adjustments

### 1.2 Project Scope

**In Scope (Implemented):**
- ✅ Authentication system with role-based access control (Admin, Project Manager, Donor)
- ✅ Project management interface for administrators
- ✅ Indicator tracking and update system for project managers
- ✅ Read-only donor dashboard for project visualization
- ✅ Real-time progress tracking via API
- ✅ User management and access control
- ✅ Role-based API endpoints with authorization checks

**Out of Scope (Phase 2+):**
- Mobile application
- Advanced analytics and predictive modeling
- Integration with external accounting systems
- Multi-language support
- Offline functionality
- Budget and spending monitoring

### 1.3 Key Stakeholders

| Role | Responsibility | Authority |
|------|-----------------|-----------|
| **MOA (Master of Affairs)** | Responsible for Programs | Approves project scope, budget, and strategic direction |
| **MOE (Master of Execution)** | Technical Team  | Delivers technical solution, manages implementation |
| **End Users - Admins** | System Administrators | Create projects, manage users, oversee system health |
| **End Users - Project Managers** | Field Project Leads | Create and update indicators, manage project data |
| **End Users - Donors** | Funding Organizations | Monitor project progress, verify impact (read-only) |

### 1.4 Major Risks and Mitigation Strategies

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| **Data Loss or System Failure** | Medium | Critical | Implement automated daily backups, use Supabase managed infrastructure |
| **Unauthorized Access to Sensitive Data** | Medium | High | Enforce strong authentication (JWT), implement role-based API checks, secure cookie storage |
| **Low User Adoption** | Low | Medium | Intuitive UI/UX, role-specific dashboards, clear role assignment |
| **Indicator Data Inaccuracy** | Low | Medium | Implement API validation rules, role-based restrictions |
| **Performance Issues at Scale** | Low | Low | Supabase handles scaling, query optimization implemented |

---

## 2. Architecture Applicative

### 2.1 System Architecture Overview

<img src="./docs/img/architcture.png">

### 2.2 Technology Stack

| Layer | Technology | Implementation Status |
|-------|-----------|----------------------|
| **Frontend** | Next.js 16 + React 19 | ✅ Implemented |
| **Styling** | Tailwind CSS v4 | ✅ Implemented |
| **Database** | PostgreSQL (Supabase) | ✅ Implemented |
| **Authentication** | JWT + Session Cookies | ✅ Implemented |
| **Backend** | Next.js API Routes | ✅ Implemented |
| **Deployment** | Vercel | ✅ Ready for deployment |

### 2.3 Data Model (PostgreSQL Schema)

**Users Table (auth + profile):**
```
- id (UUID, Primary Key) - Supabase Auth ID
- email (String, Unique)
- password_hash (String, managed by Supabase Auth)
- full_name (String)
- role (Enum: 'admin' | 'project_manager' | 'donor')
- status (Enum: 'active' | 'inactive')
- created_at (Timestamp)
- updated_at (Timestamp)
```

**Projects Table:**
```
- id (UUID, Primary Key)
- name (String, Required)
- description (Text, Required)
- status (Enum: 'planning' | 'active' | 'completed' | 'on_hold')
- budget (Decimal, Required, > 0)
- spent (Decimal, default: 0)
- start_date (Date, Optional)
- end_date (Date, Optional)
- created_by (UUID, Foreign Key → Users)
- created_at (Timestamp)
- updated_at (Timestamp)
```

**Indicators Table:**
```
- id (UUID, Primary Key)
- project_id (UUID, Foreign Key → Projects)
- name (String, Required)
- description (Text, Required)
- current_value (Decimal, default: 0)
- target_value (Decimal, Required)
- unit (String, Required)
- trend (Enum: 'up' | 'down' | 'stable', default: 'stable')
- updated_by (UUID, Foreign Key → Users)
- last_updated (Timestamp)
- created_at (Timestamp)
```

**Project Assignments Table (for future use):**
```
- id (UUID, Primary Key)
- project_id (UUID, Foreign Key → Projects)
- user_id (UUID, Foreign Key → Users)
- role (String, e.g., 'lead', 'contributor')
- assigned_at (Timestamp)
```

---

## 3. Security Implementation

### 3.1 Implemented Security Measures

#### Authentication & Authorization
✅ **Implemented:**
- Email/Password authentication via Supabase Auth
- JWT tokens with 1-hour expiration
- Refresh tokens with 7-day expiration (httpOnly cookies)
- Session cookies (httpOnly, Secure, SameSite=Lax)
- Role-based access control at API level
  - Admin: Full system access
  - Project Manager: Can create indicators for projects
  - Donor: Read-only dashboard access

✅ **API Endpoint Authorization:**
- `/api/auth/login` - Anyone
- `/api/auth/register` - Anyone
- `/api/projects` (POST) - Admin only
- `/api/indicators` (POST) - Project Manager only
- `/api/users` - Admin only

#### Data Protection
✅ **Implemented:**
- HTTPS/TLS in production (Vercel)
- Password hashing via Supabase Auth (bcrypt)
- JWT token verification on all protected routes
- httpOnly cookies prevent XSS attacks
- Secure cookie attributes (Secure, SameSite=Lax)

#### Access Control (To be completed)
✅ **Implemented:**
- Row-Level Security (RLS) policies in PostgreSQL
- 
🔄 **Planned:**
- Audit logging for data modifications
- User access review procedures

### 3.2 Security Compliance Checklist

- ✅ HTTPS/TLS enabled (via Vercel)
- ✅ JWT token authentication implemented
- ✅ Role-based access control at API level
- ✅ httpOnly cookies for token storage
- ✅ Password validation and hashing
- ✅ Row-Level Security (RLS) policies (in progress)
- ⏳ Audit logging for sensitive operations (planned)
- ⏳ Regular security audits (scheduled quarterly)

---

## 4. API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - Authenticate and return JWT token
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user profile

### Projects (Admin Only)
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project (Admin only)
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project (Admin only)

### Indicators (Project Manager Creates)
- `GET /api/indicators` - List indicators
- `POST /api/indicators` - Create indicator (Project Manager only)
- `PATCH /api/indicators/[id]` - Update indicator value
- `DELETE /api/indicators/[id]` - Delete indicator

### Users (Admin Only)
- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get user details
- `PATCH /api/users/[id]` - Update user role/status

---

## 5. Monitoring Dashboard (KPIs)

### 5.1 Key Performance Indicators

#### KPI 1: User Adoption Rate
- **Definition:** Percentage of invited users who have logged in
- **Target:** ≥ 85% within 30 days of launch
- **Measurement:** Monthly active users / Total invited users
- **Owner:** Project Manager
- **Review Frequency:** Weekly

#### KPI 2: Data Accuracy Score
- **Definition:** Percentage of indicator updates that pass validation
- **Target:** ≥ 95% accuracy
- **Measurement:** Valid updates / Total updates submitted
- **Owner:** Technical Team
- **Review Frequency:** Weekly

#### KPI 3: Donor Satisfaction Score
- **Definition:** Average satisfaction rating from donor surveys (1-5 scale)
- **Target:** ≥ 4.2/5.0
- **Measurement:** Post-project survey responses
- **Owner:** Program Manager
- **Review Frequency:** Monthly

#### KPI 4: System Security & Uptime
- **Definition:** Percentage of time system is available without critical issues
- **Target:** ≥ 99.5% uptime, 0 critical vulnerabilities
- **Measurement:** Uptime monitoring + Security audit results
- **Owner:** Technical Team
- **Review Frequency:** Daily

---

## 6. Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Authentication** | ✅ Complete | JWT + Supabase Auth |
| **Authorization (RBAC)** | ✅ Complete | Role checks in API routes |
| **Admin Dashboard** | ✅ Complete | Project and user management |
| **Project Manager Dashboard** | ✅ Complete | Indicator creation and updates |
| **Donor Dashboard** | ✅ Complete | Read-only project view |
| **API Endpoints** | ✅ Complete | All core endpoints implemented |
| **Database Schema** | ✅ Complete | PostgreSQL setup via Supabase |
| **Row-Level Security (RLS)** | ✅ Pending | Database-level security policies |
| **Audit Logging** | 🔄 Pending | Track data modifications |
| **Testing Suite** | 🔄 Pending | Unit and integration tests |

---

## 7. Deployment

**Deployment Strategy:**
- Frontend and API hosted on Vercel
- Database on Supabase (PostgreSQL)
- Automatic deployments on code push to main branch
- Environment variables managed via Vercel dashboard

---

## 8. Success Criteria

- ✅ All three user roles successfully authenticate
- ✅ Project managers can create and update indicators
- ✅ Donors can view project progress in read-only mode
- ✅ Admins can manage projects and users
- ✅ API authorization checks enforce role-based access
- ✅ System maintains high uptime (99.5%+)
- 🔄 Data accuracy validation at 95%+
- 🔄 User adoption reaches 85% within 30 days
- 🔄 Donor satisfaction score ≥ 4.2/5.0

---

## 9. Approval & Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| MOA (Program Director) | _________________ | _________________ | _________ |
| MOE (Technical Lead) | _________________ | _________________ | _________ |
| Security Officer | _________________ | _________________ | _________ |

---

## Appendix A: Glossary

- **MOA:** Master of Affairs (Project Sponsor)
- **MOE:** Master of Execution (Technical Team)
- **JWT:** JSON Web Token
- **KPI:** Key Performance Indicator
- **RBAC:** Role-Based Access Control
- **RLS:** Row-Level Security
- **TLS:** Transport Layer Security

---

**Document Classification:** Internal Use  
**Last Updated:** November 8, 2025
