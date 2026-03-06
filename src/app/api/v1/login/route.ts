import { NextRequest, NextResponse } from "next/server";
import user from "@services/user";

async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios" },
      { status: 400 },
    );
  }

  try {
    const authenticatedUser = await user.authenticate(email, password);
  } catch (error) {
    console.error("POST /api/v1/auth/login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
