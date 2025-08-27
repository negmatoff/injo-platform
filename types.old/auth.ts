// 📝 src/types/auth.ts - Дополнительные типы для авторизации

import { PlanType } from "@prisma/client"

/** Лимиты тарифных планов */
export const PLAN_LIMITS = {
  FREE: {
    links: 5,
    qrCodes: 2,
    bioPages: 1,
    customSlug: false,
    analytics: 'basic',
    support: 'community'
  },
  PRO: {
    links: 100,
    qrCodes: 50,
    bioPages: 5,
    customSlug: true,
    analytics: 'advanced',
    support: 'email'
  },
  BUSINESS: {
    links: 1000,
    qrCodes: 500,
    bioPages: 20,
    customSlug: true,
    analytics: 'pro',
    support: 'priority'
  },
  ENTERPRISE: {
    links: Infinity,
    qrCodes: Infinity,
    bioPages: Infinity,
    customSlug: true,
    analytics: 'enterprise',
    support: 'dedicated'
  }
} as const

/** Проверка лимитов пользователя */
export function canCreateLink(
  userPlan: keyof typeof PLAN_LIMITS,
  currentLinks: number
): boolean {
  const limit = PLAN_LIMITS[userPlan].links
  return limit === Infinity || currentLinks < limit
}

/** Типы для компонентов */
export interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
  plan: PlanType
  totalLinks: number
  totalClicks: number
}
