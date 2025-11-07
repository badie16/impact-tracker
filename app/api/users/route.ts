import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

// GET all users
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    // Vérification utilisateur
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })    
    // Vérification rôle admin
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
    if (profileError || !userProfile) return NextResponse.json({ error: "User profile not found" }, { status: 404 })
    if (userProfile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })    
    // Récupérer les utilisateurs
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, created_at")
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

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


// export async function POST(request: NextRequest) {
//   try {
//     const supabase = await createServerSupabaseClient()
//     const cookieStore = await cookies()
//     const token = cookieStore.get("auth_token")?.value

//     const { data: { user }, error: userError } = await supabase.auth.getUser(token)
//     if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

//     const { data: userProfile, error: profileError } = await supabase
//       .from("users")
//       .select("role")
//       .eq("id", user.id)
//       .single()
//     if (profileError || !userProfile) return NextResponse.json({ error: "User profile not found" }, { status: 404 })
//     if (userProfile.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

//     const body = await request.json()
//     const { full_name, email, password, role } = body
//     if (!full_name || !email || !password || !role) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     const hashedPassword = await bcrypt.hash(password, 10)

//     const { data, error } = await supabase
//       .from("users")
//       .insert({
//         full_name,
//         email,
//         password: hashedPassword,
//         role,
//       })
//       .select("id, username, email, role, created_at") // ne pas renvoyer le password

//     if (error) return NextResponse.json({ error: error.message }, { status: 400 })

//     return NextResponse.json({ data: data?.[0] }, { status: 201 })
//   } catch (error) {
//     console.error("Add user error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
