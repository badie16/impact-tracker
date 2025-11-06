import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

// GET single indicator
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const indicatorId = (await params).id

    const { data, error } = await supabase.from("indicators").select("*").eq("id", indicatorId).single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Get indicator error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT update indicator
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const indicatorId = (await params).id
    const body = await request.json()

    // Update last_updated timestamp
    const updateData = {
      ...body,
      last_updated: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("indicators").update(updateData).eq("id", indicatorId).select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data: data?.[0] })
  } catch (error) {
    console.error("Update indicator error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE indicator
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerSupabaseClient()
    const indicatorId = (await params).id

    const { error } = await supabase.from("indicators").delete().eq("id", indicatorId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Indicator deleted" })
  } catch (error) {
    console.error("Delete indicator error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
