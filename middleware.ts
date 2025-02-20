// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  console.log("Token found for:", req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/movies/:path*"],
};
