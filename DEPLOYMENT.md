# Инструкция по развертыванию

## Настройка для динамического рендеринга

Приложение настроено как **динамическое Next.js приложение** с использованием:
- `export const dynamic = 'force-dynamic'` в `src/app/page.tsx`
- `output: 'standalone'` в `next.config.js`
- Клиентские компоненты с управлением состоянием (`"use client"`)

## Развертывание на Netlify

1. **Подключите репозиторий к Netlify:**
   - Войдите в Netlify Dashboard
   - Выберите "Add new site" → "Import an existing project"
   - Подключите ваш Git репозиторий

2. **Настройки сборки (автоматически из `netlify.toml`):**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 20

3. **Переменные окружения (если нужны):**
   - Добавьте в Netlify Dashboard → Site settings → Environment variables

4. **Развертывание:**
   - Netlify автоматически развернет приложение при push в main ветку
   - Или нажмите "Deploy site" для ручного развертывания

## Развертывание на Vercel

1. **Подключите репозиторий:**
   - Войдите в Vercel Dashboard
   - Выберите "Add New Project"
   - Импортируйте ваш Git репозиторий

2. **Настройки (автоматически определяются):**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Развертывание:**
   - Vercel автоматически развернет приложение

## Локальная проверка перед развертыванием

```bash
# Установка зависимостей
npm install

# Сборка проекта
npm run build

# Запуск production сервера
npm start
```

## Важные замечания

- Приложение использует **динамический рендеринг**, поэтому требует Node.js сервер
- Не используйте статический экспорт (`next export`)
- Убедитесь, что хостинг поддерживает Next.js Server Components
- Для Netlify требуется плагин `@netlify/plugin-nextjs`

