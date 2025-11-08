import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
// GET all projects or filter by user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const userId = request.headers.get("x-user-id")

    let query = supabase.from("projects").select("*")

    // If userId provided, filter by user's projects
    // if (userId) {
    //   query = supabase
    //     .from("projects")
    //     .select("projects.*")
    //     .join("project_assignments", "projects.id = project_assignments.project_id")
    //     .eq("project_assignments.user_id", userId)
    // }

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
    //  Create the Supabase client on the server side
    const supabase = await createServerSupabaseClient()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    //  Verify the user via the JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    //  Verify the user's role
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    }
    if (userProfile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    //  Get and validate the body
    const body = await request.json()
    const { name, description, budget, start_date, end_date, status } = body

    if (!name || !description || budget == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify and format the dates
    const formatDate = (dateStr: string | undefined) => {
      if (!dateStr) return null
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return null
      return date.toISOString().split("T")[0]
    }

    const formattedStartDate = formatDate(start_date)
    const formattedEndDate = formatDate(end_date)
    if (start_date && !formattedStartDate) {
      return NextResponse.json({ error: "Invalid start_date" }, { status: 400 })
    }
    if (end_date && !formattedEndDate) {
      return NextResponse.json({ error: "Invalid end_date" }, { status: 400 })
    }
    if (budget <= 0) {
      return NextResponse.json({ error: "Budget must be greater than 0" }, { status: 400 })
    }
    //  Insert the project into Supabase
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name,
        description,
        budget,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        status: status || "planning",
        created_by: user.id,
        spent: 0,
      })
      .select()

    if (error) {
      console.error("Insert project error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


