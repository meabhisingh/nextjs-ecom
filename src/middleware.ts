import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname, origin } = req.nextUrl;

  const isPrivate = pathname.includes("profile") || pathname.includes("orders");
  const notAllowed = !req.auth && isPrivate;
  const loggedInAndAccessingLogin = req.auth && pathname === "/auth/signin";

  if (loggedInAndAccessingLogin) {
    const newUrl = new URL("/profile", origin);
    return Response.redirect(new URL(newUrl));
  }

  if (notAllowed) {
    const newUrl = new URL("/auth/signin", origin);
    newUrl.searchParams.set("redirect", pathname);
    return Response.redirect(newUrl);
  }

  return NextResponse.next();
});

export const runtime = "nodejs";

export const config = {
  matcher: [
    "/((?!api|static|.*\\..*|_next).*)",
    "/profile/:path*",
    "/orders/:path*",
    "/auth/signin",
  ],
};
