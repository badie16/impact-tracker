import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

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
    const projectId = (await params).id
    const body = await request.json()

    const { data, error } = await supabase.from("projects").update(body).eq("id", projectId).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

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
    const projectId = (await params).id

    const { error } = await supabase.from("projects").delete().eq("id", projectId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Project deleted" })
  } catch (error) {
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
