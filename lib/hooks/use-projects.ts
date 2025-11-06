"use client"
import type { Project } from "@/lib/types"
import useSWR from "swr"

const fetcher = async (url: string) => {
  const token = localStorage.getItem("auth_token")
  const userId = localStorage.getItem("user_id")

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "x-user-id": userId || "",
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch projects")
  }

  return res.json()
}

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR("/api/projects", fetcher)

  const createProject = async (project: Omit<Project, "id" | "created_at" | "updated_at">) => {
    const token = localStorage.getItem("auth_token")
    const userId = localStorage.getItem("user_id")

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-user-id": userId || "",
      },
      body: JSON.stringify(project),
    })

    if (!response.ok) {
      throw new Error("Failed to create project")
    }

    mutate()
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const token = localStorage.getItem("auth_token")

    const response = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error("Failed to update project")
    }

    mutate()
  }

  const deleteProject = async (id: string) => {
    const token = localStorage.getItem("auth_token")

    const response = await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete project")
    }

    mutate()
  }

  return {
    projects: data?.data || [],
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject,
  }
}
