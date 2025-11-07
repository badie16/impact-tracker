"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjects } from "@/lib/hooks/use-projects"
import { useUsers } from "@/lib/hooks/use-users"
import { useAuth } from "@/lib/hooks/use-auth"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

interface Project {
  id: string
  name: string
  status: "active" | "completed" | "on_hold"
  budget: number
  spent: number
  description: string
  start_date: string
  end_date: string
}

interface User {
  id: string
  full_name: string
  email: string
  role: "admin" | "project_manager" | "donor"
  status: "active" | "inactive"
  created_at: string
}

export function AdminDashboard() {
  const { projects = [], isLoading: projectsLoading, error: projectsError, createProject, updateProject, deleteProject, mutateProjects } = useProjects()
  const { users = [], isLoading: usersLoading, error: usersError, updateUser, mutateUsers } = useUsers()
  const { logout } = useAuth()
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
  })

  const [projectErrors, setProjectErrors] = useState<Record<string, string>>({})

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "project_manager",
  })

  const [userErrors, setUserErrors] = useState<Record<string, string>>({})

  const validateProjectForm = () => {
    const errors: Record<string, string> = {}

    if (!projectForm.name.trim()) errors.name = "Project name is required"
    if (!projectForm.description.trim()) errors.description = "Description is required"
    if (!projectForm.budget || Number(projectForm.budget) <= 0) errors.budget = "Budget must be greater than 0"
    if (!projectForm.startDate) errors.startDate = "Start date is required"
    if (!projectForm.endDate) errors.endDate = "End date is required"
    if (projectForm.startDate && projectForm.endDate && projectForm.startDate > projectForm.endDate) {
      errors.endDate = "End date must be after start date"
    }

    setProjectErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateUserForm = () => {
    const errors: Record<string, string> = {}

    if (!userForm.name.trim()) errors.name = "Full name is required"
    if (!userForm.email.trim()) errors.email = "Email is required"
    if (userForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      errors.email = "Email format is invalid"
    }

    setUserErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddProject = async () => {
    const token = localStorage.getItem("auth_token")
    if (!validateProjectForm()) return

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: projectForm.name,
          description: projectForm.description,
          budget: Number(projectForm.budget),
          start_date: projectForm.startDate,
          end_date: projectForm.endDate,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to create project")

      setProjectForm({ name: "", description: "", budget: "", startDate: "", endDate: "" })
      setShowProjectForm(false)
      setMessage({ type: "success", text: "Project created successfully" })
      mutateProjects()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to create project" })
    }
  }



  const handleAddUser = async () => {
    if (!validateUserForm()) return

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: userForm.name,
          email: userForm.email,
          role: userForm.role,
        }),
      })

      if (!response.ok) throw new Error("Failed to create user")

      setUserForm({ name: "", email: "", role: "project_manager" })
      setShowUserForm(false)
      setMessage({ type: "success", text: "User created successfully" })
      mutateUsers()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to create user" })
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return

    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to delete project")

      setMessage({ type: "success", text: "Project deleted successfully" })
      mutateProjects()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to delete project" })
    }
  }


  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return

    try {
      const response = await fetch(`/api/users/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete user")

      setMessage({ type: "success", text: "User deleted successfully" })
      mutateUsers()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to delete user" })
    }
  }

  const totalBudget = (projects as Project[]).reduce((sum, p) => sum + (p.budget || 0), 0)
  const totalSpent = (projects as Project[]).reduce((sum, p) => sum + (p.spent || 0), 0)
  const activeProjects = (projects as Project[]).filter((p) => p.status === "active").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-2">Manage projects and users</p>
          </div>
          <Button onClick={logout} variant="destructive" className="gap-2 bg-red-500">
            Logout
          </Button>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded border flex items-center gap-2 ${message.type === "success"
              ? "bg-green-900/20 border-green-700 text-green-200"
              : "bg-red-900/20 border-red-700 text-red-200"
              }`}
          >
            {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {message.text}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Projects</p>
            <p className="text-3xl font-bold text-white">
              {projectsLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : (projects as Project[]).length}
            </p>
            <p className="text-green-400 text-xs mt-2">{activeProjects} active</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Budget</p>
            <p className="text-3xl font-bold text-white">${(totalBudget / 1000).toFixed(0)}K</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-white">${(totalSpent / 1000).toFixed(0)}K</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Users</p>
            <p className="text-3xl font-bold text-white">
              {usersLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : (users as User[]).length}
            </p>
          </Card>
        </div>

        {/* Tabs for Projects and Users */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="bg-slate-800 border-b border-slate-700">
            <TabsTrigger value="projects" className="text-white data-[state=active]:bg-slate-700">
              Projects
            </TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-slate-700">
              Users
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Projects</h2>
                <Button onClick={() => setShowProjectForm(!showProjectForm)} className="bg-blue-600 hover:bg-blue-700">
                  {showProjectForm ? "Cancel" : "Add Project"}
                </Button>
              </div>

              {showProjectForm && (
                <div className="mb-6 p-4 bg-slate-700 rounded space-y-3 border border-slate-600">
                  <div>
                    <Input
                      type="text"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      placeholder="Project name"
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                    {projectErrors.name && <p className="text-red-400 text-xs mt-1">{projectErrors.name}</p>}
                  </div>

                  <div>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      placeholder="Project description"
                      className="w-full bg-slate-600 border border-slate-500 text-white placeholder-slate-400 rounded px-3 py-2"
                      rows={3}
                    />
                    {projectErrors.description && (
                      <p className="text-red-400 text-xs mt-1">{projectErrors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input
                        type="number"
                        value={projectForm.budget}
                        onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                        placeholder="Budget"
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                      />
                      {projectErrors.budget && <p className="text-red-400 text-xs mt-1">{projectErrors.budget}</p>}
                    </div>
                    <div>
                      <Input
                        type="date"
                        value={projectForm.startDate}
                        onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                      />
                      {projectErrors.startDate && (
                        <p className="text-red-400 text-xs mt-1">{projectErrors.startDate}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Input
                      type="date"
                      value={projectForm.endDate}
                      onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                    {projectErrors.endDate && <p className="text-red-400 text-xs mt-1">{projectErrors.endDate}</p>}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddProject} className="bg-green-600 hover:bg-green-700">
                      Create
                    </Button>
                    <Button onClick={() => setShowProjectForm(false)} className="bg-slate-600 hover:bg-slate-500">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {projectsError && (
                <div className="mb-4 p-4 bg-red-900/20 border border-red-700 text-red-200 rounded flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Failed to load projects
                </div>
              )}

              <div className="space-y-3">
                {projectsLoading ? (
                  <div className="text-center py-8 text-slate-400">Loading projects...</div>
                ) : (projects as Project[]).length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No projects yet</div>
                ) : (
                  (projects as Project[]).map((project) => (
                    <div key={project.id} className="bg-slate-700 p-4 rounded border border-slate-600">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-white">{project.name}</h3>
                          <p className="text-sm text-slate-400">{project.description}</p>
                        </div>
                        <Button
                          onClick={() => handleDeleteProject(project.id)}
                          className="bg-red-600 hover:bg-red-700 text-xs"
                        >
                          Delete
                        </Button>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-sm">
                        <div>
                          <p className="text-slate-400">Status</p>
                          <p className="text-white font-semibold capitalize">{project.status?.replace("_", " ")}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Budget</p>
                          <p className="text-white font-semibold">${project.budget?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Spent</p>
                          <p className="text-white font-semibold">${project.spent?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Duration</p>
                          <p className="text-white font-semibold text-xs">
                            {project.start_date} to {project.end_date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Users</h2>
                <Button onClick={() => setShowUserForm(!showUserForm)} className="bg-blue-600 hover:bg-blue-700">
                  {showUserForm ? "Cancel" : "Add User"}
                </Button>
              </div>

              {showUserForm && (
                <div className="mb-6 p-4 bg-slate-700 rounded space-y-3 border border-slate-600">
                  <div>
                    <Input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      placeholder="Full name"
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                    {userErrors.name && <p className="text-red-400 text-xs mt-1">{userErrors.name}</p>}
                  </div>

                  <div>
                    <Input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="Email address"
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                    {userErrors.email && <p className="text-red-400 text-xs mt-1">{userErrors.email}</p>}
                  </div>

                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full bg-slate-600 border border-slate-500 text-white rounded px-3 py-2"
                  >
                    <option value="project_manager">Project Manager</option>
                    <option value="donor">Donor</option>
                    <option value="admin">Admin</option>
                  </select>

                  <div className="flex gap-2">
                    <Button onClick={handleAddUser} className="bg-green-600 hover:bg-green-700">
                      Create
                    </Button>
                    <Button onClick={() => setShowUserForm(false)} className="bg-slate-600 hover:bg-slate-500">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {usersError && (
                <div className="mb-4 p-4 bg-red-900/20 border border-red-700 text-red-200 rounded flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Failed to load users
                </div>
              )}

              <div className="space-y-3">
                {usersLoading ? (
                  <div className="text-center py-8 text-slate-400">Loading users...</div>
                ) : (users as User[]).length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No users yet</div>
                ) : (
                  (users as User[]).map((user) => (
                    <div key={user.id} className="bg-slate-700 p-4 rounded border border-slate-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white">{user.full_name}</h3>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700 text-xs"
                        >
                          Delete
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm mt-2">
                        <div>
                          <p className="text-slate-400">Role</p>
                          <p className="text-white font-semibold capitalize">{user.role?.replace("_", " ")}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Status</p>
                          <p
                            className={`font-semibold capitalize ${user.status === "active" ? "text-green-400" : "text-slate-400"}`}
                          >
                            {user.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Joined</p>
                          <p className="text-white font-semibold text-xs">{user.created_at?.split("T")[0]}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
