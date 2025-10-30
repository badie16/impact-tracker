"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Project {
  id: number
  name: string
  status: "Active" | "Completed" | "On Hold"
  budget: number
  spent: number
  description: string
  startDate: string
  endDate: string
}

interface User {
  id: number
  name: string
  email: string
  role: "admin" | "project_manager" | "donor"
  status: "Active" | "Inactive"
  joinDate: string
}

export function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Education Initiative",
      status: "Active",
      budget: 50000,
      spent: 37500,
      description: "Providing quality education to rural communities",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
    },
    {
      id: 2,
      name: "Water Wells Project",
      status: "Active",
      budget: 75000,
      spent: 45000,
      description: "Building sustainable water infrastructure",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
    },
  ])

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John PM",
      email: "john@example.com",
      role: "project_manager",
      status: "Active",
      joinDate: "2024-01-10",
    },
    {
      id: 2,
      name: "Jane Donor",
      email: "jane@example.com",
      role: "donor",
      status: "Active",
      joinDate: "2024-01-15",
    },
  ])

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
  })
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "project_manager",
  })

  const handleAddProject = () => {
    if (projectForm.name && projectForm.budget && projectForm.startDate && projectForm.endDate) {
      setProjects([
        ...projects,
        {
          id: projects.length + 1,
          name: projectForm.name,
          description: projectForm.description,
          status: "Active",
          budget: Number.parseInt(projectForm.budget),
          spent: 0,
          startDate: projectForm.startDate,
          endDate: projectForm.endDate,
        },
      ])
      setProjectForm({ name: "", description: "", budget: "", startDate: "", endDate: "" })
      setShowProjectForm(false)
    }
  }

  const handleAddUser = () => {
    if (userForm.name && userForm.email) {
      setUsers([
        ...users,
        {
          id: users.length + 1,
          name: userForm.name,
          email: userForm.email,
          role: userForm.role as "admin" | "project_manager" | "donor",
          status: "Active",
          joinDate: new Date().toISOString().split("T")[0],
        },
      ])
      setUserForm({ name: "", email: "", role: "project_manager" })
      setShowUserForm(false)
    }
  }

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter((p) => p.id !== id))
  }

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0)
  const activeProjects = projects.filter((p) => p.status === "Active").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-2">Manage projects and users</p>
          </div>
          <Button
            onClick={() => {
              localStorage.clear()
              window.location.href = "/"
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            Logout
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Projects</p>
            <p className="text-3xl font-bold text-white">{projects.length}</p>
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
            <p className="text-3xl font-bold text-white">{users.length}</p>
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
                  Add Project
                </Button>
              </div>

              {showProjectForm && (
                <div className="mb-6 p-4 bg-slate-700 rounded space-y-3 border border-slate-600">
                  <Input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    placeholder="Project name"
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Project description"
                    className="w-full bg-slate-600 border border-slate-500 text-white placeholder-slate-400 rounded px-3 py-2"
                    rows={3}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      value={projectForm.budget}
                      onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                      placeholder="Budget"
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                    <Input
                      type="text"
                      value={projectForm.startDate}
                      onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                      placeholder="Start date (YYYY-MM-DD)"
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                  </div>
                  <Input
                    type="text"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                    placeholder="End date (YYYY-MM-DD)"
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
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

              <div className="space-y-3">
                {projects.map((project) => (
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
                        <p className="text-white font-semibold">{project.status}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Budget</p>
                        <p className="text-white font-semibold">${project.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Spent</p>
                        <p className="text-white font-semibold">${project.spent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Duration</p>
                        <p className="text-white font-semibold text-xs">
                          {project.startDate} to {project.endDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Users</h2>
                <Button onClick={() => setShowUserForm(!showUserForm)} className="bg-blue-600 hover:bg-blue-700">
                  Add User
                </Button>
              </div>

              {showUserForm && (
                <div className="mb-6 p-4 bg-slate-700 rounded space-y-3 border border-slate-600">
                  <Input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    placeholder="Full name"
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
                  <Input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="Email address"
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                  />
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

              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="bg-slate-700 p-4 rounded border border-slate-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{user.name}</h3>
                        <p className="text-sm text-slate-400">{user.email}</p>
                      </div>
                      <Button onClick={() => handleDeleteUser(user.id)} className="bg-red-600 hover:bg-red-700 text-xs">
                        Delete
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm mt-2">
                      <div>
                        <p className="text-slate-400">Role</p>
                        <p className="text-white font-semibold capitalize">{user.role.replace("_", " ")}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Status</p>
                        <p className="text-green-400 font-semibold">{user.status}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Joined</p>
                        <p className="text-white font-semibold">{user.joinDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
