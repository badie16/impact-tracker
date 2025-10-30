"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Project {
  id: number
  name: string
  description: string
  status: "Active" | "Completed" | "On Hold"
  startDate: string
  endDate: string
}

interface Indicator {
  id: number
  projectId: number
  name: string
  description: string
  currentValue: number
  targetValue: number
  unit: string
  lastUpdated: string
  trend: "up" | "down" | "stable"
}

export function ProjectManagerDashboard() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Education Initiative",
      description: "Providing quality education to rural communities",
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-12-31",
    },
    {
      id: 2,
      name: "Water Wells Project",
      description: "Building sustainable water infrastructure",
      status: "Active",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
    },
  ])

  const [indicators, setIndicators] = useState<Indicator[]>([
    {
      id: 1,
      projectId: 1,
      name: "Children Enrolled",
      description: "Number of children enrolled in the program",
      currentValue: 150,
      targetValue: 200,
      unit: "students",
      lastUpdated: "2024-10-25",
      trend: "up",
    },
    {
      id: 2,
      projectId: 1,
      name: "Teachers Trained",
      description: "Number of teachers trained",
      currentValue: 12,
      targetValue: 15,
      unit: "teachers",
      lastUpdated: "2024-10-20",
      trend: "stable",
    },
    {
      id: 3,
      projectId: 2,
      name: "Wells Constructed",
      description: "Number of water wells constructed",
      currentValue: 6,
      targetValue: 10,
      unit: "wells",
      lastUpdated: "2024-10-22",
      trend: "up",
    },
    {
      id: 4,
      projectId: 2,
      name: "People Served",
      description: "Number of people with access to clean water",
      currentValue: 5000,
      targetValue: 8000,
      unit: "people",
      lastUpdated: "2024-10-25",
      trend: "up",
    },
  ])

  const [selectedProject, setSelectedProject] = useState<number>(1)
  const [showIndicatorForm, setShowIndicatorForm] = useState(false)
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null)
  const [indicatorForm, setIndicatorForm] = useState({
    name: "",
    description: "",
    currentValue: "",
    targetValue: "",
    unit: "",
  })

  const projectIndicators = indicators.filter((i) => i.projectId === selectedProject)

  const handleAddIndicator = () => {
    if (indicatorForm.name && indicatorForm.currentValue && indicatorForm.targetValue) {
      if (editingIndicator) {
        setIndicators(
          indicators.map((i) =>
            i.id === editingIndicator.id
              ? {
                  ...i,
                  name: indicatorForm.name,
                  description: indicatorForm.description,
                  currentValue: Number.parseInt(indicatorForm.currentValue),
                  targetValue: Number.parseInt(indicatorForm.targetValue),
                  unit: indicatorForm.unit,
                  lastUpdated: new Date().toISOString().split("T")[0],
                }
              : i,
          ),
        )
        setEditingIndicator(null)
      } else {
        setIndicators([
          ...indicators,
          {
            id: Math.max(...indicators.map((i) => i.id), 0) + 1,
            projectId: selectedProject,
            name: indicatorForm.name,
            description: indicatorForm.description,
            currentValue: Number.parseInt(indicatorForm.currentValue),
            targetValue: Number.parseInt(indicatorForm.targetValue),
            unit: indicatorForm.unit,
            lastUpdated: new Date().toISOString().split("T")[0],
            trend: "stable",
          },
        ])
      }
      setIndicatorForm({ name: "", description: "", currentValue: "", targetValue: "", unit: "" })
      setShowIndicatorForm(false)
    }
  }

  const handleEditIndicator = (indicator: Indicator) => {
    setEditingIndicator(indicator)
    setIndicatorForm({
      name: indicator.name,
      description: indicator.description,
      currentValue: String(indicator.currentValue),
      targetValue: String(indicator.targetValue),
      unit: indicator.unit,
    })
    setShowIndicatorForm(true)
  }

  const handleDeleteIndicator = (id: number) => {
    setIndicators(indicators.filter((i) => i.id !== id))
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↑"
      case "down":
        return "↓"
      default:
        return "→"
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Project Manager Dashboard</h1>
            <p className="text-slate-400 mt-2">Track and update project indicators</p>
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

        <Tabs defaultValue="indicators" className="w-full">
          <TabsList className="bg-slate-800 border-b border-slate-700">
            <TabsTrigger value="indicators" className="text-white data-[state=active]:bg-slate-700">
              Indicators
            </TabsTrigger>
            <TabsTrigger value="projects" className="text-white data-[state=active]:bg-slate-700">
              Projects
            </TabsTrigger>
          </TabsList>

          {/* Indicators Tab */}
          <TabsContent value="indicators" className="mt-6">
            <div className="space-y-6">
              {/* Project Selector */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Select Project</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project.id)}
                      className={`p-4 rounded border-2 text-left transition-all ${
                        selectedProject === project.id
                          ? "bg-blue-900 border-blue-500"
                          : "bg-slate-700 border-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <h3 className="font-semibold text-white">{project.name}</h3>
                      <p className="text-sm text-slate-400">{project.description}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Indicators List */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Indicators</h2>
                  <Button
                    onClick={() => {
                      setEditingIndicator(null)
                      setIndicatorForm({ name: "", description: "", currentValue: "", targetValue: "", unit: "" })
                      setShowIndicatorForm(!showIndicatorForm)
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {showIndicatorForm ? "Cancel" : "Add Indicator"}
                  </Button>
                </div>

                {showIndicatorForm && (
                  <div className="mb-6 p-4 bg-slate-700 rounded space-y-3 border border-slate-600">
                    <Input
                      type="text"
                      value={indicatorForm.name}
                      onChange={(e) => setIndicatorForm({ ...indicatorForm, name: e.target.value })}
                      placeholder="Indicator name"
                      className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    />
                    <textarea
                      value={indicatorForm.description}
                      onChange={(e) => setIndicatorForm({ ...indicatorForm, description: e.target.value })}
                      placeholder="Description"
                      className="w-full bg-slate-600 border border-slate-500 text-white placeholder-slate-400 rounded px-3 py-2"
                      rows={2}
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        type="number"
                        value={indicatorForm.currentValue}
                        onChange={(e) => setIndicatorForm({ ...indicatorForm, currentValue: e.target.value })}
                        placeholder="Current value"
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                      />
                      <Input
                        type="number"
                        value={indicatorForm.targetValue}
                        onChange={(e) => setIndicatorForm({ ...indicatorForm, targetValue: e.target.value })}
                        placeholder="Target value"
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                      />
                      <Input
                        type="text"
                        value={indicatorForm.unit}
                        onChange={(e) => setIndicatorForm({ ...indicatorForm, unit: e.target.value })}
                        placeholder="Unit (e.g., students)"
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddIndicator} className="bg-green-600 hover:bg-green-700">
                        {editingIndicator ? "Update" : "Create"}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowIndicatorForm(false)
                          setEditingIndicator(null)
                        }}
                        className="bg-slate-600 hover:bg-slate-500"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {projectIndicators.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No indicators for this project yet</p>
                  ) : (
                    projectIndicators.map((indicator) => {
                      const progress = (indicator.currentValue / indicator.targetValue) * 100
                      return (
                        <div key={indicator.id} className="bg-slate-700 p-4 rounded border border-slate-600">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-white">{indicator.name}</h3>
                                <span className={`text-lg ${getTrendColor(indicator.trend)}`}>
                                  {getTrendIcon(indicator.trend)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-400">{indicator.description}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEditIndicator(indicator)}
                                className="bg-blue-600 hover:bg-blue-700 text-xs"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteIndicator(indicator.id)}
                                className="bg-red-600 hover:bg-red-700 text-xs"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-slate-400 mb-1">
                              <span>
                                {indicator.currentValue} / {indicator.targetValue} {indicator.unit}
                              </span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-slate-600 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                          </div>

                          <p className="text-xs text-slate-400">Last updated: {indicator.lastUpdated}</p>
                        </div>
                      )
                    })
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">My Projects</h2>
              <div className="space-y-4">
                {projects.map((project) => {
                  const projectIndicators = indicators.filter((i) => i.projectId === project.id)
                  const avgProgress =
                    projectIndicators.length > 0
                      ? Math.round(
                          projectIndicators.reduce((sum, i) => sum + (i.currentValue / i.targetValue) * 100, 0) /
                            projectIndicators.length,
                        )
                      : 0

                  return (
                    <div key={project.id} className="bg-slate-700 p-4 rounded border border-slate-600">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-white text-lg">{project.name}</h3>
                          <p className="text-sm text-slate-400">{project.description}</p>
                        </div>
                        <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded text-sm">{project.status}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                        <div>
                          <p className="text-slate-400">Start Date</p>
                          <p className="text-white font-semibold">{project.startDate}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">End Date</p>
                          <p className="text-white font-semibold">{project.endDate}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Indicators</p>
                          <p className="text-white font-semibold">{projectIndicators.length}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm text-slate-400 mb-1">
                          <span>Overall Progress</span>
                          <span>{avgProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                            style={{ width: `${avgProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
