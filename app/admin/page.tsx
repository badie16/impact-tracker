"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    
    const role = localStorage.getItem("role")
    if (role !== "admin") {
      router.push("/")
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  if (!isAuthorized) return null

  return <AdminDashboard />
}
