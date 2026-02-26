import { NextRequest, NextResponse } from "next/server";
import user from "@services/user";

async function GET(request: NextRequest) {
  console.log("GET /api/v1/user");
  return NextResponse.json({ message: "Hello, World!" });
}

export { GET };
