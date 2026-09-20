import { Capacitor, registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';

interface AppUpdaterPlugin {
  installApk(options: { filePath: string }): Promise<void>;
}

const AppUpdater = registerPlugin<AppUpdaterPlugin>('AppUpdater');

export async function checkForAppUpdates(manual = false) {
  // If running in browser preview or offline, avoid unnecessary network errors
  if (!navigator.onLine) {
    if (manual) {
      alert("Отсутствует интернет-соединение. Подключитесь к сети для проверки обновлений.");
    }
    return;
  }

  // Automatic check is only intended for the native mobile app (Capacitor), not the web development preview
  if (!manual && !Capacitor.isNativePlatform()) {
    return;
  }

  try {
    let currentVersion = "1.0.0";
    try {
      if (Capacitor.isNativePlatform()) {
        const appInfo = await App.getInfo();
        if (appInfo?.version) {
          currentVersion = appInfo.version;
        }
      }
    } catch {
      currentVersion = "1.0.0";
    }

    const repoOwner = "Timofeymelehin";
    const repoName = "travelspend-app";
    
    // Add timeout to prevent hanging fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    }).finally(() => clearTimeout(timeoutId));

    if (response.status === 404) {
      if (manual) {
        alert("Релизы на GitHub пока не найдены. Сборка первого релиза будет сформирована в репозитории.");
      }
      return;
    }

    if (!response.ok) {
      if (manual) {
        alert(`Не удалось проверить обновление (код ответа GitHub: ${response.status}).`);
      }
      return;
    }

    const release = await response.json();
    const latestTag = release.tag_name || "";
    const latestVersion = latestTag.replace('v', '');

    if (latestVersion && latestVersion !== currentVersion) {
      const apkAsset = release.assets?.find((asset: any) => asset.name.endsWith('.apk'));
      if (apkAsset && apkAsset.browser_download_url) {
        const confirmUpdate = window.confirm(`Доступна новая версия ${latestVersion} (у вас ${currentVersion}). Обновить приложение?`);
        if (confirmUpdate) {
          if (Capacitor.isNativePlatform()) {
            await downloadAndInstallApk(apkAsset.browser_download_url);
          } else {
            window.location.href = apkAsset.browser_download_url;
          }
        }
      } else {
        if (manual) {
          alert(`Найдена версия ${latestVersion}, но APK файл еще формируется в GitHub Actions.`);
        }
      }
    } else {
      if (manual) {
        alert(`У вас установлена последняя актуальная версия (${currentVersion}).`);
      }
    }
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      if (manual) alert("Время ожидания ответа от GitHub истекло. Проверьте интернет-соединение.");
      return;
    }
    console.warn("Could not check for app updates:", e);
    if (manual) {
      alert("Не удалось связаться с сервером GitHub. Проверьте подключение к сети.");
    }
  }
}

async function downloadAndInstallApk(apkUrl: string) {
  try {
    const downloadResult = await Filesystem.downloadFile({
      url: apkUrl,
      path: 'update.apk',
      directory: Directory.Cache,
    });

    if (downloadResult.path) {
      await AppUpdater.installApk({ filePath: downloadResult.path });
    }
  } catch (error) {
    console.error("Failed to download or install APK:", error);
    alert("Не удалось установить обновление автоматически. Пожалуйста, скачайте APK с GitHub.");
  }
}
