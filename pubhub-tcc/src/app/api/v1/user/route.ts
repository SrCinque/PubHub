import { NextRequest, NextResponse } from "next/server";
import user from "@services/user";

async function GET(request: NextRequest) {
    return NextResponse.json({ message: "Hello, World!" });
}

export { GET };