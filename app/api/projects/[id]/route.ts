import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

// GET single project
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const projectId = (await params).id

    const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Get project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update project
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    if (userProfile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const projectId = params.id
    const body = await request.json()
    const { name, description, budget, start_date, end_date, status } = body

    const updateData: any = {}
    if (name) updateData.name = name
    if (description) updateData.description = description
    if (budget != null && budget > 0) updateData.budget = budget
    if (status) updateData.status = status
    const formatDate = (d: string) => {
      const date = new Date(d)
      return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0]
    }
    if (start_date) updateData.start_date = formatDate(start_date)
    if (end_date) updateData.end_date = formatDate(end_date)

    const { data, error } = await supabase.from("projects").update(updateData).eq("id", projectId).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ data: data?.[0] })
  } catch (error) {
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE project
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    if (userProfile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const projectId = params.id
    const { error } = await supabase.from("projects").delete().eq("id", projectId)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ message: "Project deleted" })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

