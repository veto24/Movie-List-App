import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";

export async function GET() {
  return NextResponse.json({ success: true });
}

// Define the Zod schema for user input validation with error messages
const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, password } = userSchema.parse(body);

    const emailExists = await prisma.user.findUnique({ where: { email } });

    if (emailExists) {
      return NextResponse.json(
        { error: "Email already exists", user: null },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const { password: passwordResult, ...rest } = newUser;

    return NextResponse.json(
      {
        user: rest,
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
