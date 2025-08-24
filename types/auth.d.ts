// 📝 auth.d.ts - Расширение типов NextAuth.js
import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"
import { PlanType } from "@prisma/client"

// Расширяем стандартные типы NextAuth.js нашими полями
declare module "next-auth" {
  /**
   * Тип Session возвращается useSession(), auth()
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
    } & DefaultSession["user"]
  }

  /**
   * Тип User возвращается из базы данных
   */
  interface User extends DefaultUser {
    id: string
    plan: PlanType
    locale?: string
    totalLinks?: number
    totalClicks?: number
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
