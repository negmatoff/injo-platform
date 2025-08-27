// 📝 types/api.ts - TypeScript типы для Links API

import { Link, User, PlanType } from "@prisma/client";

// 🔗 Основные типы ссылок
export interface LinkWithStats extends Link {
  clickCount: number;
  uniqueClicks: number;
  lastClickAt: Date | null;
  qrCodeUrl?: string;
}

// 📝 Типы для создания ссылки
export interface CreateLinkRequest {
  originalUrl: string;
  title?: string;
  description?: string;
  customSlug?: string;
  tags?: string[];
  expiresAt?: string; // ISO date string
  password?: string;
}

export interface CreateLinkResponse {
  success: boolean;
  data?: {
    link: LinkWithStats;
    shortUrl: string;
    qrCodeUrl: string;
  };
  error?: string;
}

// 📝 Типы для обновления ссылки
export interface UpdateLinkRequest {
  title?: string;
  description?: string;
  originalUrl?: string;
  tags?: string[];
  isActive?: boolean;
  expiresAt?: string | null;
  password?: string | null;
}

// 📝 Типы для списка ссылок
export interface GetLinksQuery {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: "createdAt" | "clickCount" | "title";
  sortOrder?: "asc" | "desc";
  tag?: string;
}

export interface GetLinksResponse {
  success: boolean;
  data?: {
    links: LinkWithStats[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  error?: string;
}

// 🎯 Лимиты тарифных планов
export const PLAN_LIMITS = {
  FREE: {
    maxLinks: 5,
    customSlug: false,
    passwordProtection: false,
    analytics: 7, // дней истории
    qrCustomization: false,
  },
  PRO: {
    maxLinks: 100,
    customSlug: true,
    passwordProtection: true,
    analytics: 30,
    qrCustomization: true,
  },
  BUSINESS: {
    maxLinks: 1000,
    customSlug: true,
    passwordProtection: true,
    analytics: 90,
    qrCustomization: true,
  },
  ENTERPRISE: {
    maxLinks: Infinity,
    customSlug: true,
    passwordProtection: true,
    analytics: 365,
    qrCustomization: true,
  },
} as const;

// 🔧 Утилитарные типы
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// 🔐 Типы авторизации
export interface AuthenticatedUser {
  id: string;
  email: string;
  plan: PlanType;
  totalLinks: number;
}

// 📊 Типы для аналитики (будущее развитие)
export interface LinkAnalytics {
  totalClicks: number;
  uniqueClicks: number;
  clicksByDay: { date: string; clicks: number }[];
  topCountries: { country: string; clicks: number }[];
  topDevices: { device: string; clicks: number }[];
  topReferrers: { referrer: string; clicks: number }[];
}
