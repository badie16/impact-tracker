"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { DonorDashboard } from "@/components/dashboards/donor-dashboard"
import { useAuth } from "@/lib/hooks/use-auth"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function DonorPage() {
  const router = useRouter()  
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!user || user.role !== "donor")) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user || user.role !== "donor") {
    return null
  }

  return <DonorDashboard />
}
