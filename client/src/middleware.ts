// TO DO: Implementar middleware de proteção de rotas privadas - verificar autenticação Firebase
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Lógica de verificação de autenticação a ser implementada
  const isAuthenticated = false; // placeholder

  if (!isAuthenticated && request.nextUrl.pathname.startsWith("/")) {
    // Redireciona para login se não estiver autenticado
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
