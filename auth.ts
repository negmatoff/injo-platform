// 🔐 auth.ts - Исправленная конфигурация NextAuth.js v5
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// Глобальная переменная для Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 🔌 Адаптер для сохранения в PostgreSQL
  adapter: PrismaAdapter(prisma),

  // 🌐 Провайдеры авторизации
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
  ],

  // 📄 Кастомные страницы
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    newUser: "/dashboard",
  },

  // ⚙️ Callbacks с безопасной типизацией
  callbacks: {
    // Вызывается при создании JWT токена
    async jwt({ token, user }) {
      if (user) {
        // ✅ Безопасно получаем данные пользователя
        token.id = user.id;

        // 🔧 Безопасно проверяем наличие поля plan
        const userWithPlan = user as typeof user & { plan?: string };
        token.plan = userWithPlan.plan || "FREE";

        // Обновляем базовые данные пользователя
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              locale: "ru",
              timezone: "Asia/Dushanbe",
            },
          });
        } catch (error) {
          console.error("Error updating user:", error);
        }
      }

      return token;
    },

    // ✅ ИСПРАВЛЕНО: Формирует session для компонентов
    async session({ session, token }) {
      // Безопасно добавляем данные из токена в сессию
      if (session.user) {
        // Создаем расширенный объект пользователя
        const extendedUser = session.user as typeof session.user & {
          id: string;
          plan: string;
        };

        extendedUser.id = token.id as string;
        extendedUser.plan = (token.plan || "FREE") as string;
      }

      return session;
    },

    // Контроль доступа
    async authorized({ request, auth }) {
      const protectedPaths = ["/dashboard", "/pro", "/api/links"];
      const isProtectedPath = protectedPaths.some((path) =>
        request.nextUrl.pathname.startsWith(path)
      );

      if (isProtectedPath) {
        return !!auth;
      }

      return true;
    },
  },

  // 🔐 Настройки сессий
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },

  // 🛡️ Безопасность
  secret: process.env.NEXTAUTH_SECRET,

  // 🐛 Дебаг (только в development)
  debug: process.env.NODE_ENV === "development",

  // 🎯 События для логирования
  events: {
    async signIn(message) {
      console.log(`✅ User signed in: ${message.user.email}`);
    },
    async signOut(message) {
      // ✅ Исправлено: безопасная проверка наличия token
      const email = "token" in message ? message.token?.email : "unknown";
      console.log(`👋 User signed out: ${email}`);
    },
  },
});

// 📤 Экспортируем Prisma для API routes
export { prisma };
