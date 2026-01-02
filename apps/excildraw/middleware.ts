import { NextRequest, NextResponse } from "next/server";
export function middleware(req: NextRequest) {
  const token = localStorage.getItem("token");
  console.log(token);
  
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/canvas/:path*"], // Protect these routes
};