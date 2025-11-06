import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET all users
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update user
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { id, ...updateData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase.from("users").update(updateData).eq("id", id).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data?.[0] })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
