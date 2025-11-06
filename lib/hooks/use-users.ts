"use client"

import useSWR from "swr"
import type { User } from "@/lib/types"

const fetcher = async (url: string) => {
  const token = localStorage.getItem("auth_token")

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch users")
  }

  return res.json()
}

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR("/api/users", fetcher)

  const updateUser = async (id: string, updates: Partial<User>) => {
    const token = localStorage.getItem("auth_token")

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
  }
}
