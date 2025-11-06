import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET all indicators or filter by project
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
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

// POST create new indicator
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const { project_id, name, description, target_value, unit } = body

    const { data, error } = await supabase
      .from("indicators")
      .insert({
        project_id,
        name,
        description,
        target_value,
        unit,
        current_value: 0,
        trend: "stable",
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data?.[0] }, { status: 201 })
  } catch (error) {
    console.error("Create indicator error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
