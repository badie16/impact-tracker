import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET all projects or filter by user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const userId = request.headers.get("x-user-id")

    let query = supabase.from("projects").select("*")

    // If userId provided, filter by user's projects
    if (userId) {
      query = supabase
        .from("projects")
        .select("projects.*")
        .join("project_assignments", "projects.id = project_assignments.project_id")
        .eq("project_assignments.user_id", userId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST create new project
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const userId = request.headers.get("x-user-id")
    const body = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, description, budget, start_date, end_date, status } = body

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        budget,
        start_date,
        end_date,
        status: status || "planning",
        created_by: userId,
        spent: 0,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
