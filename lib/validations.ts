// ✅ lib/validations.ts - Zod схемы валидации для API

import { z } from "zod";

// 🌐 Валидация URL
export const urlSchema = z
  .string()
  .min(1, "URL обязателен")
  .url("Невалидный URL")
  .max(2048, "URL слишком длинный")
  .refine((url) => {
    // Запрещаем ссылки на самих себя
    const forbiddenDomains = ["injo.me", "injo.pro", "localhost"];
    const domain = new URL(url).hostname.toLowerCase();
    return !forbiddenDomains.some((forbidden) => domain.includes(forbidden));
  }, "Нельзя сокращать ссылки на injo.me");

// 🏷️ Валидация кастомного slug
export const customSlugSchema = z
  .string()
  .min(3, "Минимум 3 символа")
  .max(50, "Максимум 50 символов")
  .regex(/^[a-zA-Z0-9\_-]+$/, "Только латиница, цифры, дефис и подчеркивание")
  .refine((slug) => {
    // Запрещенные зарезервированные слова
    const reserved = [
      "api",
      "auth",
      "admin",
      "dashboard",
      "pro",
      "www",
      "mail",
      "ftp",
      "blog",
      "help",
      "support",
      "about",
      "terms",
      "privacy",
      "contact",
      "login",
      "register",
    ];
    return !reserved.includes(slug.toLowerCase());
  }, "Этот slug зарезервирован");

// 📝 Схема создания ссылки
export const createLinkSchema = z.object({
  originalUrl: urlSchema,
  title: z.string().max(200, "Максимум 200 символов").optional(),
  description: z.string().max(500, "Максимум 500 символов").optional(),
  customSlug: customSlugSchema.optional(),
  tags: z.array(z.string().max(30)).max(10, "Максимум 10 тегов").optional(),
  expiresAt: z
    .string()
    .datetime("Невалидная дата")
    .refine((date) => new Date(date) > new Date(), "Дата должна быть в будущем")
    .optional(),
  password: z
    .string()
    .min(4, "Минимум 4 символа")
    .max(50, "Максимум 50 символов")
    .optional(),
});

// 📝 Схема обновления ссылки
export const updateLinkSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  originalUrl: urlSchema.optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
  password: z.string().min(4).max(50).nullable().optional(),
});

// 📄 Схема пагинации
export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Должно быть числом")
    .transform(Number)
    .pipe(z.number().min(1))
    .default("1"),
  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .pipe(z.number().min(1).max(50))
    .default("10"),
  search: z.string().max(100).optional(),
  sortBy: z.enum(["createdAt", "clickCount", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  tag: z.string().max(30).optional(),
});

// 🔧 Утилитарные функции валидации
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      return { success: false, error: message };
    }
    return { success: false, error: "Ошибка валидации" };
  }
}
