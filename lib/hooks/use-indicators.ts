"use client"

import useSWR from "swr"
import type { Indicator } from "@/lib/types"

const fetcher = async (url: string) => {
  const token = localStorage.getItem("auth_token")

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch indicators")
  }

  return res.json()
}

export function useIndicators(projectId?: string) {
  const url = projectId ? `/api/indicators?project_id=${projectId}` : "/api/indicators"
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)
  const createIndicator = async (indicator: Omit<Indicator, "id" | "created_at" | "updated_at" | "last_updated">) => {
    const token = localStorage.getItem("auth_token")
    const response = await fetch("/api/indicators", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(indicator),
    })

    if (!response.ok) {
      throw new Error("Failed to create indicator")
    }

    mutate()
  }

  const updateIndicator = async (id: string, updates: Partial<Indicator>) => {
    const token = localStorage.getItem("auth_token")

    const response = await fetch(`/api/indicators/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      throw new Error("Failed to update indicator")
    }

    mutate()
  }

  const deleteIndicator = async (id: string) => {
    const token = localStorage.getItem("auth_token")

    const response = await fetch(`/api/indicators/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete indicator")
    }

    mutate()
  }

  return {
    indicators: data?.data || [],
    isLoading,
    error,
    createIndicator,
    updateIndicator,
    deleteIndicator,
    mutateIndicators: mutate,
  }
}
