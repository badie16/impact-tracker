"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProjectManagerDashboard } from "@/components/dashboards/project-manager-dashboard"
import { useAuth } from "@/lib/hooks/use-auth"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function ProjectManagerPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!user || user.role !== "project_manager")) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user || user.role !== "project_manager") {
    return null
  }

  return <ProjectManagerDashboard />
}
