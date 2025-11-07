"use client"

import useSWR from "swr"
import type { User } from "@/lib/types"

const fetcher = async (url: string) => {
  const token = localStorage.getItem("auth_token")
  if (!token) throw new Error("No auth token found")

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Failed to fetch users")

  return data
}


export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR("/api/users", fetcher)

  const updateUser = async (id: string, updates: Partial<User>) => {
    const token = localStorage.getItem("auth_token")
    if (!token) throw new Error("No auth token found")

    const response = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, ...updates }),
    })

    if (!response.ok) {
      throw new Error("Failed to update user")
    }

    mutate()
  }

  return {
    users: data?.data || [],
    isLoading,
    error,
    updateUser,
    mutateUsers: mutate,
  }
}
