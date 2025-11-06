// Database type definitions

export type UserRole = "admin" | "project_manager" | "donor"

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "active" | "completed" | "paused"
  budget: number
  spent: number
  start_date: string
  end_date: string | null
  created_by: string
  created_at: string
  updated_at: string
}

export interface Indicator {
  id: string
  project_id: string
  name: string
  description: string
  target_value: number
  current_value: number
  unit: string
  trend: "up" | "down" | "stable"
  last_updated: string
  created_at: string
  updated_at: string
}

export interface Donation {
  id: string
  donor_id: string
  project_id: string
  amount: number
  status: "pending" | "confirmed" | "completed"
  created_at: string
  updated_at: string
}

export interface ProjectAssignment {
  id: string
  user_id: string
  project_id: string
  role: "manager" | "contributor"
  assigned_at: string
}

export type AuthResponse = {
  token: string
  user: User
}

export type ApiResponse<T> = {
  data?: T
  error?: string
  status: number
}
