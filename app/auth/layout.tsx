// 📄 src/app/auth/layout.tsx
import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

// 🎨 Общий лейаут для страниц авторизации
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* Хедер с логотипом */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">

          {/* Логотип injo.me */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">in</span>
            </div>
            <span className="text-xl font-bold text-gray-900">injo.me</span>
          </div>

          {/* Переключатель языка (опционально) */}
          <div className="text-sm text-gray-600">
            RU | EN
          </div>

        </div>
      </header>

      {/* Основной контент */}
      <main className="relative z-0">
        {children}
      </main>

      {/* Футер */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-sm text-gray-500">
        © 2024 injo.me - Короткие ссылки для Центральной Азии
      </footer>
    </div>
  )
}
