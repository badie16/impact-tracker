import { type NextRequest, NextResponse } from "next/server"

// Mock user database
const users: any[] = [
  {
    id: "1",
    email: "admin@impactsolidaire.org",
    password: "admin123",
    role: "admin",
    fullName: "Admin User",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, role } = await request.json()

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: String(users.length + 1),
      email,
      password,
      fullName,
      role,
    }

    users.push(newUser)

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
