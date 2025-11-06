"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/hooks/use-auth"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "project_manager",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      await register(formData.email, formData.password, formData.fullName, formData.role)
      setSuccess("Registration successful! Please sign in.")
      setTimeout(() => onSwitchToLogin(), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Full Name</label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded px-3 py-2"
          >
            <option value="project_manager">Project Manager</option>
            <option value="donor">Donor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Confirm Password</label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            required
          />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-200 px-4 py-2 rounded text-sm">{error}</div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-700 text-green-200 px-4 py-2 rounded text-sm">
            {success}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <div className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <button type="button" onClick={onSwitchToLogin} className="text-blue-400 hover:text-blue-300">
            Sign in here
          </button>
        </div>
      </form>
    </Card>
  )
}
