"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useAuth } from "@/lib/hooks/use-auth"
import { redirect } from "next/navigation"
export default function Home() {
  const [isLogin, setIsLogin] = useState(true)
  const { user, loading } = useAuth()
  console.log("user", user)
  if (loading) {
    return <div>Loading...</div>
  }
  if (user) {
    const dashboardMap: Record<string, string> = {
      admin: "/admin",
      project_manager: "/project-manager",
      donor: "/donor",
    }
    const redirectPath = dashboardMap[user.role] || "/dashboard"
    // redirect(redirectPath)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">ImpactTracker</h1>
          <p className="text-slate-400">NGO Project Impact Management Portal</p>
        </div>

        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </main>
  )
}
