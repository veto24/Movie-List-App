// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Allow NextAuth routes to proceed without redirection
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    console.log(
      "No token found, redirecting to /sign-in from:",
      req.nextUrl.pathname
    );
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  console.log("Token found for:", req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/movies/:path*"],
};
