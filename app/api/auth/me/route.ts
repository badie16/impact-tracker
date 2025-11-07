import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
    try {
        const supabase = await createServerSupabaseClient()

        // Get current user from Supabase auth
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch user profile with role information
        const { data: userProfile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single()

        if (profileError || !userProfile) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 })
        }

        return NextResponse.json(userProfile)
    } catch (error) {
        console.error("Get user error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
