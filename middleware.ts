import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localeCookie, localizedPath } from "@/lib/i18n";

/**
 * Языка браузера не спрашиваем: первый визит всегда открывает английскую версию в корне.
 * Если язык уже выбирали переключателем, корень отдаёт выбранную версию.
 * Внутренние адреса не трогаем: присланная EN-ссылка должна открыться на английском при любой cookie.
 */
export function middleware(request: NextRequest) {
  const saved = request.cookies.get(localeCookie)?.value;
  if (!isLocale(saved) || saved === defaultLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = localizedPath(saved, "/");
  return NextResponse.redirect(url);
}

export const config = { matcher: "/" };
