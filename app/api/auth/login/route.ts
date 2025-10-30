import { type NextRequest, NextResponse } from "next/server"

// Mock user database - in production, use a real database
const users = [
  {
    id: "1",
    email: "admin@impactsolidaire.org",
    password: "admin123",
    role: "admin",
    fullName: "Admin User",
  },
  {
    id: "2",
    email: "pm@impactsolidaire.org",
    password: "pm123",
    role: "project_manager",
    fullName: "Project Manager",
  },
  {
    id: "3",
    email: "donor@impactsolidaire.org",
    password: "donor123",
    role: "donor",
    fullName: "Donor User",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // In production, create a proper JWT token
    const token = Buffer.from(JSON.stringify({ userId: user.id, email: user.email, role: user.role })).toString(
      "base64",
    )

    return NextResponse.json({
      token,
      role: user.role,
      userId: user.id,
      fullName: user.fullName,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
