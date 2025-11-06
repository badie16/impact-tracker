import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role } = await request.json()

    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
      return NextResponse.json({ error: "Registration failed" }, { status: 400 })
    }

    // Create user profile in public.users table
    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role,
    })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    return NextResponse.json(
      { message: "Registration successful. Please check your email to confirm." },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
