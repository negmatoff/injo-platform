import { auth } from "@/auth"
 
export default auth((req) => {
  // Проверяем защищенные маршруты
  const protectedPaths = ['/dashboard', '/pro', '/settings']
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  )
  
  // Если защищенный путь и пользователь не авторизован
  if (isProtectedPath && !req.auth) {
    return Response.redirect(new URL('/auth/login', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}