import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

// GET all indicators or filter by project
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const projectId = request.nextUrl.searchParams.get("project_id")
    let query = supabase.from("indicators").select("*")

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    const { data, error } = await query    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Get indicators error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profileError || !userProfile) return NextResponse.json({ error: "User profile not found" }, { status: 404 })

    if (userProfile.role != "project_manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { project_id, name, description, target_value, unit } = body
    if (!project_id || !name || !description || target_value == null || !unit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    const { data, error } = await supabase
      .from("indicators")
      .insert({
        project_id,
        name,
        description,
        target_value,
        current_value: 0,
        unit,       
        trend: "stable",
      })
      .select()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error("Create indicator error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
