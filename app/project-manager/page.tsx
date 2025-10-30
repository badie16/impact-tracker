"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProjectManagerDashboard } from "@/components/dashboards/project-manager-dashboard"

export default function ProjectManagerPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "project_manager") {
      router.push("/")
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  if (!isAuthorized) return null

  return <ProjectManagerDashboard />
}
