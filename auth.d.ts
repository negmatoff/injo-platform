// 📝 auth.d.ts - Расширение типов NextAuth.js
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

// 🎯 Типы для Prisma (без импорта, чтобы избежать циклических зависимостей)
type PlanType = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE'

// Расширяем стандартные типы NextAuth.js нашими полями
declare module "next-auth" {
  /**
   * Session - возвращается из useSession(), auth()
   */
  interface Session {
    user: {
      /** User ID из базы данных */
      id: string
      /** Тарифный план пользователя */
      plan: PlanType
      /** Локаль пользователя (ru/en/tj) */
      locale?: string
      /** Количество созданных ссылок */
      totalLinks?: number
      /** Общее количество кликов */
      totalClicks?: number
    } & DefaultSession["user"]
  }

  /**
   * User - возвращается из базы данных и доступен в callbacks
   */
  interface User extends DefaultUser {
    id: string
    plan: PlanType
    locale?: string
    timezone?: string
    totalLinks?: number
    totalClicks?: number
    createdAt?: Date
    updatedAt?: Date
  }
}

// Расширяем JWT токен нашими полями
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    plan: PlanType
    locale?: string
  }
}
