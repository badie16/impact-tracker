-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'project_manager', 'donor')) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'paused')) DEFAULT 'planning',
  budget DECIMAL(15, 2) NOT NULL,
  spent DECIMAL(15, 2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indicators table
CREATE TABLE IF NOT EXISTS indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(15, 2) NOT NULL,
  current_value DECIMAL(15, 2) DEFAULT 0,
  unit TEXT NOT NULL,
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')) DEFAULT 'stable',
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create project_assignments table
CREATE TABLE IF NOT EXISTS project_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('manager', 'contributor')) NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, project_id)
);

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON projects(created_by);
CREATE INDEX IF NOT EXISTS idx_indicators_project_id ON indicators(project_id);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_project_id ON donations(project_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_user_id ON project_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_project_assignments_project_id ON project_assignments(project_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read all users but can only update their own profile
CREATE POLICY "Users can read all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policy: Admins can do anything with projects
-- Project managers can see and edit their own projects
-- Donors can only read projects they're associated with
CREATE POLICY "Enable project access based on role" ON projects
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM project_assignments
      WHERE project_id = projects.id
      AND user_id = auth.uid()
    )
  );

-- RLS Policy: Indicators follow project permissions
CREATE POLICY "Enable indicator access based on project role" ON indicators
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_id
      AND (
        auth.jwt() ->> 'role' = 'admin'
        OR created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM project_assignments
          WHERE project_id = projects.id
          AND user_id = auth.uid()
        )
      )
    )
  );

-- RLS Policy: Donations follow project permissions
CREATE POLICY "Enable donation access based on role" ON donations
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin'
    OR donor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM projects
      WHERE id = project_id
      AND (
        created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM project_assignments
          WHERE project_id = projects.id
          AND user_id = auth.uid()
        )
      )
    )
  );
