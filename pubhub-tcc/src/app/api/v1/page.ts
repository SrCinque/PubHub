import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {


  return '<h1>Olá, esse é um projeto autoral de Filipe Cinque!</h1>' //NextResponse.json({ message: "Hello, World!" });
}