"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"

interface UseAuthReturn {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string, role: string) => Promise<void>
  logout: () => void
}

export function useAuth(): UseAuthReturn {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log("chicking for user")
    // Check if user is logged in
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")
    if (token && userData) {
      setUser(JSON.parse(userData))

    }
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("login data", data)
      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      localStorage.setItem("auth_token", data.token)
      localStorage.setItem("refresh_token", data.refreshToken)
      localStorage.setItem("user_data", JSON.stringify(data.user))

      setUser(data.user)

      // Redirect based on role
      const dashboardMap: Record<string, string> = {
        admin: "/admin",
        project_manager: "/project-manager",
        donor: "/donor",
      }
      const redirectPath = dashboardMap[data.user.role] || "/dashboard"
      router.push(redirectPath)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, fullName: string, role: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    // Clear localStorage
    localStorage.removeItem("auth_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_data")
    setUser(null)

    // Clear cookies via API
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }

    router.push("/")
  }

  return { user, loading, login, register, logout }
}
