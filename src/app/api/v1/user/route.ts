import { NextRequest, NextResponse } from "next/server";
import user from "@services/user";

async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const email = searchParams.get("email");

    if (!id && !email) {
      return NextResponse.json(
        { error: "Passe outro id ou e-mail como parâmetro" },
        { status: 400 },
      );
    }

    let userData;

    if (id) {
      userData = await user.getById(id);
    } else if (email) {
      userData = await user.getByEmail(email);
    }

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("GET /api/v1/user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, image, password } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nome e e-mail é necessário" },
        { status: 400 },
      );
    }

    const newUser = await user.create({
      name,
      email,
      image,
      password,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("POST /api/v1/user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, image } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID do  usuário é necessário" },
        { status: 400 },
      );
    }

    if (!name && !image) {
      return NextResponse.json(
        { error: "Forneça pelo menos o 'nome' ou a 'imagem' para atualizar." },
        { status: 400 },
      );
    }

    const updatedUser = await user.update(id, {
      ...(name && { name }),
      ...(image && { image }),
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/v1/user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export { GET, POST, PATCH };
