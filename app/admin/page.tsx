"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { useAuth } from "@/lib/hooks/use-auth"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function AdminPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return <AdminDashboard />
}
