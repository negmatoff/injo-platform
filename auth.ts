// 🔐 auth.ts - Конфигурация NextAuth.js v5
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

// Глобальная переменная для Prisma Client (избегаем множественных подключений)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // Логи SQL запросов в development
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export const { 
  handlers, 
  auth, 
  signIn, 
  signOut 
} = NextAuth({
  // 🔌 Адаптер для сохранения сессий в PostgreSQL
  adapter: PrismaAdapter(prisma),
  
  // 🌐 Провайдеры авторизации
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      
      // Запрашиваем базовую информацию профиля
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      }
    })
  ],
  
  // 📄 Кастомные страницы
  pages: {
    signIn: "/auth/login",        // Страница входа
    error: "/auth/error",          // Страница ошибок
    newUser: "/dashboard",         // Перенаправление новых пользователей
  },
  
  // ⚙️ Callbacks для кастомной логики
  callbacks: {
    // Вызывается при создании JWT токена
    async jwt({ token, user }) {
      if (user) {
        // При первом входе сохраняем информацию о пользователе в токен
        token.id = user.id
        token.plan = user.plan || 'FREE'
        
        // Обновляем счетчики пользователя через Prisma
        await prisma.user.update({
          where: { id: user.id },
          data: {
            locale: 'ru', // Дефолтная локаль для ЦА
            timezone: 'Asia/Dushanbe'
          }
        })
      }
      
      return token
    },
    
    // Вызывается при создании session объекта
    async session({ session, token }) {
      // Добавляем дополнительные поля в session
      session.user.id = token.id as string
      session.user.plan = token.plan as string
      
      return session
    },
    
    // Контроль доступа к авторизации
    async authorized({ request, auth }) {
      // Защищенные routes
      const protectedPaths = ['/dashboard', '/pro', '/api/links']
      const isProtectedPath = protectedPaths.some(path => 
        request.nextUrl.pathname.startsWith(path)
      )
      
      if (isProtectedPath) {
        return !!auth // Требует авторизации
      }
      
      return true // Публичные страницы
    }
  },
  
  // 🔐 Настройки сессий
  session: {
    strategy: "jwt", // Используем JWT вместо database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  
  // 🛡️ Безопасность
  secret: process.env.NEXTAUTH_SECRET,
  
  // 🐛 Дебаг информация (только в development)
  debug: process.env.NODE_ENV === 'development',
  
  // 🎯 События для аналитики
  events: {
    async signIn(message) {
      console.log(`✅ User signed in: ${message.user.email}`)
    },
    async signOut(message) {
      console.log(`👋 User signed out: ${message.token?.email}`)
    }
  }
})

// 📤 Экспортируем Prisma для использования в API routes
export { prisma }
