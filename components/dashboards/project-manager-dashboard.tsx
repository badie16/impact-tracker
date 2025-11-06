"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProjects } from "@/lib/hooks/use-projects"
import { useIndicators } from "@/lib/hooks/use-indicators"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on_hold"
  start_date: string
  end_date: string
}

interface Indicator {
  id: string
  project_id: string
  name: string
  description: string
  currentValue: number
  targetValue: number
  unit: string
  lastUpdated: string
  trend: "up" | "down" | "stable"
}

export function ProjectManagerDashboard() {
  const { projects = [], loading: projectsLoading, error: projectsError } = useProjects()
  const {
    indicators = [],
    loading: indicatorsLoading,
    error: indicatorsError,
    mutate: mutateIndicators,
  } = useIndicators()

  const [selectedProject, setSelectedProject] = useState<string>("")
  const [showIndicatorForm, setShowIndicatorForm] = useState(false)
  const [editingIndicator, setEditingIndicator] = useState<Indicator | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [indicatorForm, setIndicatorForm] = useState({
    name: "",
    description: "",
    currentValue: "",
    targetValue: "",
    unit: "",
  })
  const [indicatorErrors, setIndicatorErrors] = useState<Record<string, string>>({})

  if (!selectedProject && (projects as Project[]).length > 0) {
    setSelectedProject((projects as Project[])[0].id)
  }

  const projectIndicators = (indicators as Indicator[]).filter((i) => i.project_id === selectedProject)

  const validateIndicatorForm = () => {
    const errors: Record<string, string> = {}

    if (!indicatorForm.name.trim()) errors.name = "Indicator name is required"
    if (!indicatorForm.currentValue) errors.currentValue = "Current value is required"
    if (!indicatorForm.targetValue) errors.targetValue = "Target value is required"
    if (Number(indicatorForm.targetValue) <= 0) errors.targetValue = "Target must be greater than 0"
    if (!indicatorForm.unit.trim()) errors.unit = "Unit is required"

    setIndicatorErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddIndicator = async () => {
    if (!validateIndicatorForm()) return

    try {
      const response = await fetch("/api/indicators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: selectedProject,
          name: indicatorForm.name,
          description: indicatorForm.description,
          current_value: Number(indicatorForm.currentValue),
          target_value: Number(indicatorForm.targetValue),
          unit: indicatorForm.unit,
        }),
      })

      if (!response.ok) throw new Error("Failed to create indicator")

      setIndicatorForm({ name: "", description: "", currentValue: "", targetValue: "", unit: "" })
      setShowIndicatorForm(false)
      setMessage({ type: "success", text: "Indicator created successfully" })
      mutateIndicators()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to create indicator" })
    }
  }

  const handleDeleteIndicator = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this indicator?")) return

    try {
      const response = await fetch(`/api/indicators/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete indicator")

      setMessage({ type: "success", text: "Indicator deleted successfully" })
      mutateIndicators()
      setTimeout(() => setMessage(null), 3000)
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to delete indicator" })
    }
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

        {message && (
          <div
            className={`mb-6 p-4 rounded border flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-900/20 border-green-700 text-green-200"
                : "bg-red-900/20 border-red-700 text-red-200"
            }`}
          >
            {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {message.text}
          </div>
        )}

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
                {projectsLoading ? (
                  <div className="text-center py-4 text-slate-400">Loading projects...</div>
                ) : (projects as Project[]).length === 0 ? (
                  <div className="text-center py-4 text-slate-400">No projects assigned</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(projects as Project[]).map((project) => (
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
                )}
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
                    <div>
                      <Input
                        type="text"
                        value={indicatorForm.name}
                        onChange={(e) => setIndicatorForm({ ...indicatorForm, name: e.target.value })}
                        placeholder="Indicator name"
                        className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                      />
                      {indicatorErrors.name && <p className="text-red-400 text-xs mt-1">{indicatorErrors.name}</p>}
                    </div>

                    <div>
                      <textarea
                        value={indicatorForm.description}
                        onChange={(e) => setIndicatorForm({ ...indicatorForm, description: e.target.value })}
                        placeholder="Description"
                        className="w-full bg-slate-600 border border-slate-500 text-white placeholder-slate-400 rounded px-3 py-2"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Input
                          type="number"
                          value={indicatorForm.currentValue}
                          onChange={(e) => setIndicatorForm({ ...indicatorForm, currentValue: e.target.value })}
                          placeholder="Current value"
                          className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                        />
                        {indicatorErrors.currentValue && (
                          <p className="text-red-400 text-xs mt-1">{indicatorErrors.currentValue}</p>
                        )}
                      </div>

                      <div>
                        <Input
                          type="number"
                          value={indicatorForm.targetValue}
                          onChange={(e) => setIndicatorForm({ ...indicatorForm, targetValue: e.target.value })}
                          placeholder="Target value"
                          className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                        />
                        {indicatorErrors.targetValue && (
                          <p className="text-red-400 text-xs mt-1">{indicatorErrors.targetValue}</p>
                        )}
                      </div>

                      <div>
                        <Input
                          type="text"
                          value={indicatorForm.unit}
                          onChange={(e) => setIndicatorForm({ ...indicatorForm, unit: e.target.value })}
                          placeholder="Unit (e.g., students)"
                          className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                        />
                        {indicatorErrors.unit && <p className="text-red-400 text-xs mt-1">{indicatorErrors.unit}</p>}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleAddIndicator} className="bg-green-600 hover:bg-green-700">
                        Create
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

                {indicatorsError && (
                  <div className="mb-4 p-4 bg-red-900/20 border border-red-700 text-red-200 rounded flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Failed to load indicators
                  </div>
                )}

                <div className="space-y-4">
                  {indicatorsLoading ? (
                    <div className="text-center py-8 text-slate-400">Loading indicators...</div>
                  ) : projectIndicators.length === 0 ? (
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
                            <Button
                              onClick={() => handleDeleteIndicator(indicator.id)}
                              className="bg-red-600 hover:bg-red-700 text-xs"
                            >
                              Delete
                            </Button>
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
                {projectsLoading ? (
                  <div className="text-center py-8 text-slate-400">Loading projects...</div>
                ) : (projects as Project[]).length === 0 ? (
                  <div className="text-center py-8 text-slate-400">No projects assigned</div>
                ) : (
                  (projects as Project[]).map((project) => {
                    const projectIndicators = (indicators as Indicator[]).filter((i) => i.project_id === project.id)
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
                          <span className="bg-blue-900 text-blue-200 px-3 py-1 rounded text-sm capitalize">
                            {project.status?.replace("_", " ")}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                          <div>
                            <p className="text-slate-400">Start Date</p>
                            <p className="text-white font-semibold">{project.start_date}</p>
                          </div>
                          <div>
                            <p className="text-slate-400">End Date</p>
                            <p className="text-white font-semibold">{project.end_date}</p>
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
                  })
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
