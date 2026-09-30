import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isPrivatePath = request.nextUrl.pathname === "/" || ["/tasks", "/history", "/ajuda", "/profile"].some((path) => request.nextUrl.pathname.startsWith(path));
  if (isPrivatePath && !request.cookies.has("backend_session")) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
