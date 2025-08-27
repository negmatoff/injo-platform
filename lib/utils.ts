// 🔧 lib/utils.ts - Утилиты для работы с ссылками

import { prisma } from "@/auth";

// 🎯 Base62 алфавит для генерации slug
const BASE62_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

// 🔢 Генерация случайного Base62 slug
export function generateRandomSlug(length: number = 6): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * BASE62_ALPHABET.length);
    result += BASE62_ALPHABET[randomIndex];
  }
  return result;
}

// 🔍 Генерация уникального slug с проверкой в БД
export async function generateUniqueSlug(customSlug?: string): Promise<string> {
  // Если предоставлен кастомный slug, проверяем его уникальность
  if (customSlug) {
    const existing = await prisma.link.findUnique({
      where: { slug: customSlug },
    });
    if (existing) {
      throw new Error("Этот slug уже занят");
    }
    return customSlug;
  }

  // Генерируем случайный slug
  let attempts = 0;
  const maxAttempts = 10;
  while (attempts < maxAttempts) {
    // Увеличиваем длину если много попыток
    const length = 6 + Math.floor(attempts / 3);
    const slug = generateRandomSlug(length);
    // Проверяем уникальность
    const existing = await prisma.link.findUnique({
      where: { slug },
    });
    if (!existing) {
      return slug;
    }
    attempts++;
  }
  throw new Error("Не удалось сгенерировать уникальный slug");
}

// 🌐 Получение домена для короткой ссылки
export function getShortUrl(slug: string, domain: string = "injo.me"): string {
  // В development используем localhost
  if (process.env.NODE_ENV === "development") {
    return `http://localhost:3000/${slug}`;
  }
  // В production используем реальный домен
  return `https://${domain}/${slug}`;
}

// 🔐 Хеширование пароля для защищенных ссылок
import { hash, compare } from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword);
}

// 📊 Утилиты для работы с аналитикой
export function extractDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "unknown";
  }
}

export function getClientIp(request: Request): string {
  // Получаем IP из заголовков Vercel/Cloudflare
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return realIp || "127.0.0.1";
}

// 🎯 Проверка лимитов тарифного плана
import { PLAN_LIMITS } from "@/types/api";
import { PlanType } from "@prisma/client";

export function canCreateLink(
  userPlan: PlanType,
  currentCount: number
): boolean {
  const limit = PLAN_LIMITS[userPlan].maxLinks;
  return limit === Infinity || currentCount < limit;
}

export function canUseCustomSlug(userPlan: PlanType): boolean {
  return PLAN_LIMITS[userPlan].customSlug;
}

export function canUsePasswordProtection(userPlan: PlanType): boolean {
  return PLAN_LIMITS[userPlan].passwordProtection;
}

// 🔗 Утилиты для работы с QR кодами (будем использовать в следующих версиях)
export function getQrCodeUrl(shortUrl: string): string {
  // Используем QR Server API для генерации QR кода
  const size = 200;
  const encodedUrl = encodeURIComponent(shortUrl);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}`;
}
