import { handlers } from "@/auth"

// NextAuth.js автоматически обрабатывает все маршруты:
// GET /api/auth/signin - страница входа
// POST /api/auth/signin - обработка входа
// GET /api/auth/signout - выход
// POST /api/auth/signout - обработка выхода
// GET /api/auth/session - текущая сессия
// GET /api/auth/providers - список провайдеров
// GET /api/auth/callback/[provider] - OAuth callback

export const { GET, POST } = handlers
