# 📱 Инструкция по сборке нативного Android APK (TravelSpend)

Этот проект полностью настроен для компиляции в нативное Android-приложение (`.apk` / `.aab`).

---

## 🚀 Вариант А: Автоматическая сборка APK через GitHub Actions (в облаке, без Android Studio)

В репозитории настроен GitHub Action `.github/workflows/build-android-apk.yml`.
Как только вы экспортируете код в свой GitHub:
1. Откройте ваш репозиторий на **GitHub**.
2. Перейдите во вкладку **Actions** сверху.
3. Выберите воркфлоу **"Build Android APK"** и нажмите **"Run workflow"**.
4. Через 2-3 минуты в секции **Artifacts** появится готовый файл **`travelspend-release.apk`**, который можно сразу скачать на телефон и установить!

---

## 💻 Вариант Б: Сборка на компьютере через Android Studio

### 1. Требования
* Node.js 18+
* [Android Studio](https://developer.android.com/studio) (с установленным Android SDK)

### 2. Команды для сборки:
```bash
# Клонируйте ваш репозиторий:
git clone <URL_ВАШЕГО_РЕПОЗИТОРИЯ>
cd <ПАПКА_ПРОЕКТА>

# Установите зависимости:
npm install

# Установите Capacitor CLI и Android платформу:
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli

# Соберите проект и добавьте Android платформу:
npm run build
npx cap add android
npx cap sync android

# Откройте нативный проект в Android Studio:
npx cap open android
```

### 3. Получение APK в Android Studio:
1. В верхнем меню Android Studio нажмите:
   **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**.
2. После сборки появится уведомление: *«APK(s) generated successfully»*.
3. Нажмите **locate** — в папке `android/app/build/outputs/apk/debug/` будет лежать готовый установочный файл **`app-debug.apk`**.
4. Скиньте файл на телефон через Telegram/провод и установите!
