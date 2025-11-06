"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/hooks/use-auth"

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            required
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-200 px-4 py-2 rounded text-sm">{error}</div>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <button type="button" onClick={onSwitchToRegister} className="text-blue-400 hover:text-blue-300">
            Register here
          </button>
        </div>
      </form>
    </Card>
  )
}
