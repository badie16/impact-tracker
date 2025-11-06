"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useProjects } from "@/lib/hooks/use-projects"
import { useIndicators } from "@/lib/hooks/use-indicators"
import { AlertCircle, Loader2 } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  progress?: number
  budget: number
  spent: number
  status: "active" | "completed" | "on_hold"
  start_date: string
  end_date: string
}

interface Indicator {
  id: string
  project_id: string
  name: string
  value: number
  target: number
  unit: string
}

export function DonorDashboard() {
  const { projects = [], loading: projectsLoading, error: projectsError } = useProjects()
  const { indicators = [], loading: indicatorsLoading, error: indicatorsError } = useIndicators()

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "completed" | "on_hold">("all")

  const filteredProjects = (projects as Project[]).filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!selectedProject && filteredProjects.length > 0) {
    setSelectedProject(filteredProjects[0])
  }

  const totalBudget = filteredProjects.reduce((sum, p) => sum + (p.budget || 0), 0)
  const totalSpent = filteredProjects.reduce((sum, p) => sum + (p.spent || 0), 0)
  const avgProgress =
    filteredProjects.length > 0
      ? Math.round(filteredProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / filteredProjects.length)
      : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-900 text-green-200"
      case "completed":
        return "bg-blue-900 text-blue-200"
      case "on_hold":
        return "bg-yellow-900 text-yellow-200"
      default:
        return "bg-slate-700 text-slate-200"
    }
  }

  const getProjectIndicators = (projectId: string) => {
    return (indicators as Indicator[]).filter((i) => i.project_id === projectId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Donor Dashboard</h1>
            <p className="text-slate-400 mt-2">Track the impact of your donations</p>
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
            <p className="text-slate-400 text-sm mb-2">Active Projects</p>
            <p className="text-3xl font-bold text-white">
              {projectsLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : filteredProjects.length}
            </p>
            <p className="text-blue-400 text-xs mt-2">Funded by you</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Donated</p>
            <p className="text-3xl font-bold text-white">${(totalBudget / 1000).toFixed(0)}K</p>
            <p className="text-green-400 text-xs mt-2">Across all projects</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Funds Deployed</p>
            <p className="text-3xl font-bold text-white">${(totalSpent / 1000).toFixed(0)}K</p>
            <p className="text-slate-400 text-xs mt-2">
              {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of budget
            </p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-6">
            <p className="text-slate-400 text-sm mb-2">Average Progress</p>
            <p className="text-3xl font-bold text-white">{avgProgress}%</p>
            <p className="text-green-400 text-xs mt-2">Across projects</p>
          </Card>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="bg-slate-800 border-b border-slate-700">
            <TabsTrigger value="projects" className="text-white data-[state=active]:bg-slate-700">
              Projects
            </TabsTrigger>
            <TabsTrigger value="details" className="text-white data-[state=active]:bg-slate-700">
              Project Details
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Your Funded Projects</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1 rounded text-sm ${
                      viewMode === "grid" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-3 py-1 rounded text-sm ${
                      viewMode === "list" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>

              <div className="mb-6 space-y-3 bg-slate-700 p-4 rounded border border-slate-600">
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                />
                <div className="flex gap-2 flex-wrap">
                  {(["all", "active", "completed", "on_hold"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-1 rounded text-sm capitalize ${
                        statusFilter === status
                          ? "bg-blue-600 text-white"
                          : "bg-slate-600 text-slate-400 hover:bg-slate-500"
                      }`}
                    >
                      {status === "on_hold" ? "On Hold" : status}
                    </button>
                  ))}
                </div>
              </div>

              {projectsError && (
                <div className="mb-4 p-4 bg-red-900/20 border border-red-700 text-red-200 rounded flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Failed to load projects
                </div>
              )}

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectsLoading ? (
                    <div className="text-center py-8 text-slate-400">Loading projects...</div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">No projects found</div>
                  ) : (
                    filteredProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className={`p-4 rounded border-2 text-left transition-all ${
                          selectedProject?.id === project.id
                            ? "bg-blue-900 border-blue-500"
                            : "bg-slate-700 border-slate-600 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-white">{project.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(project.status)}`}>
                            {project.status?.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{project.description}</p>
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Progress</span>
                            <span>{project.progress || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-600 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                              style={{ width: `${project.progress || 0}%` }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-slate-400">Budget</p>
                            <p className="text-white font-semibold">${(project.budget / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Spent</p>
                            <p className="text-white font-semibold">${(project.spent / 1000).toFixed(0)}K</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {projectsLoading ? (
                    <div className="text-center py-8 text-slate-400">Loading projects...</div>
                  ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">No projects found</div>
                  ) : (
                    filteredProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        className={`w-full p-4 rounded border-2 text-left transition-all ${
                          selectedProject?.id === project.id
                            ? "bg-blue-900 border-blue-500"
                            : "bg-slate-700 border-slate-600 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-white">{project.name}</h3>
                            <p className="text-sm text-slate-400">{project.description}</p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(project.status)}`}>
                            {project.status?.replace("_", " ")}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-slate-400">Progress</p>
                            <p className="text-white font-semibold">{project.progress || 0}%</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Budget</p>
                            <p className="text-white font-semibold">${(project.budget / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Spent</p>
                            <p className="text-white font-semibold">${(project.spent / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-slate-400">Start</p>
                            <p className="text-white font-semibold text-xs">{project.start_date}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">End</p>
                            <p className="text-white font-semibold text-xs">{project.end_date}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Project Details Tab */}
          <TabsContent value="details" className="mt-6">
            {selectedProject ? (
              <div className="space-y-6">
                {/* Project Header */}
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.name}</h2>
                      <p className="text-slate-400">{selectedProject.description}</p>
                    </div>
                    <span className={`text-sm px-3 py-1 rounded capitalize ${getStatusColor(selectedProject.status)}`}>
                      {selectedProject.status?.replace("_", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-700 p-4 rounded">
                      <p className="text-slate-400 text-sm mb-1">Budget</p>
                      <p className="text-2xl font-bold text-white">${(selectedProject.budget / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-slate-700 p-4 rounded">
                      <p className="text-slate-400 text-sm mb-1">Spent</p>
                      <p className="text-2xl font-bold text-white">${(selectedProject.spent / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-slate-700 p-4 rounded">
                      <p className="text-slate-400 text-sm mb-1">Remaining</p>
                      <p className="text-2xl font-bold text-white">
                        ${((selectedProject.budget - selectedProject.spent) / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="bg-slate-700 p-4 rounded">
                      <p className="text-slate-400 text-sm mb-1">Progress</p>
                      <p className="text-2xl font-bold text-white">{selectedProject.progress || 0}%</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>Overall Progress</span>
                      <span>{selectedProject.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-green-500 via-green-400 to-emerald-400 h-4 rounded-full transition-all"
                        style={{ width: `${selectedProject.progress || 0}%` }}
                      />
                    </div>
                  </div>
                </Card>

                {/* Timeline */}
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Project Timeline</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-700 p-4 rounded">
                      <p className="text-slate-400 text-sm mb-1">Start Date</p>
                      <p className="text-white font-semibold">{selectedProject.start_date}</p>
                    </div>
                    <div className="bg-slate-700 p-4 rounded">
                      <p className="text-slate-400 text-sm mb-1">End Date</p>
                      <p className="text-white font-semibold">{selectedProject.end_date}</p>
                    </div>
                    <div className="bg-slate-700 p-4 rounded">
                      <p className="text-slate-400 text-sm mb-1">Duration</p>
                      <p className="text-white font-semibold">
                        {Math.round(
                          (new Date(selectedProject.end_date).getTime() -
                            new Date(selectedProject.start_date).getTime()) /
                            (1000 * 60 * 60 * 24 * 30),
                        )}{" "}
                        months
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Key Indicators */}
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Key Performance Indicators</h3>
                  {indicatorsLoading ? (
                    <div className="text-center py-8 text-slate-400">Loading indicators...</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {getProjectIndicators(selectedProject.id).length === 0 ? (
                        <div className="text-slate-400 text-sm">No indicators for this project</div>
                      ) : (
                        getProjectIndicators(selectedProject.id).map((indicator) => {
                          const progress = (indicator.value / indicator.target) * 100
                          return (
                            <div key={indicator.id} className="bg-slate-700 p-4 rounded border border-slate-600">
                              <p className="text-slate-400 text-sm mb-2">{indicator.name}</p>
                              <p className="text-2xl font-bold text-white mb-2">
                                {indicator.value} / {indicator.target}
                              </p>
                              <p className="text-xs text-slate-400 mb-2">{indicator.unit}</p>
                              <div className="w-full bg-slate-600 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full"
                                  style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                              </div>
                              <p className="text-xs text-slate-400 mt-2">{Math.round(progress)}% complete</p>
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <p className="text-slate-400 text-center py-8">Select a project to view details</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
