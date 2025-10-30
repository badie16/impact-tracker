"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DonorDashboard } from "@/components/dashboards/donor-dashboard"

export default function DonorPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("role")
    if (role !== "donor") {
      router.push("/")
    } else {
      setIsAuthorized(true)
    }
  }, [router])

  if (!isAuthorized) return null

  return <DonorDashboard />
}
