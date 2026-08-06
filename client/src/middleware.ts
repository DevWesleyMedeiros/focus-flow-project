// TO DO: Implementar middleware de proteção de rotas privadas - verificar autenticação Firebase
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthenticated = false; // placeholder
  const isPrivatePath =
    pathname === "/" ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/history") ||
    pathname.startsWith("/ajuda") ||
    pathname.startsWith("/profile");

  if (!isAuthenticated && isPrivatePath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
