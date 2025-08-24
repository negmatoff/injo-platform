// ❌ src/app/auth/error/page.tsx
import Link from 'next/link'

interface ErrorPageProps {
  searchParams: { error?: string }
}

export default function AuthErrorPage({ searchParams }: ErrorPageProps) {
  const error = searchParams.error

  // Определяем сообщение ошибки
  let errorMessage = "Произошла неизвестная ошибка"
  let errorDescription = "Попробуйте войти позже или обратитесь в поддержку"

  switch (error) {
    case 'Configuration':
      errorMessage = "Ошибка конфигурации"
      errorDescription = "Проблема с настройками авторизации"
      break
    case 'AccessDenied':
      errorMessage = "Доступ запрещен"
      errorDescription = "Вы отменили авторизацию или нет разрешения"
      break
    case 'Verification':
      errorMessage = "Ошибка проверки"
      errorDescription = "Не удалось подтвердить ваш аккаунт"
      break
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          
          {/* Иконка ошибки */}
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Заголовок ошибки */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {errorMessage}
          </h1>
          <p className="text-gray-600 mb-6">
            {errorDescription}
          </p>

          {/* Показываем код ошибки для отладки */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-red-700">
                <strong>Код ошибки:</strong> {error}
              </p>
            </div>
          )}

          {/* Кнопки действий */}
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Попробовать снова
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
