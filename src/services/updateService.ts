import { Capacitor, registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';

interface AppUpdaterPlugin {
  installApk(options: { filePath: string }): Promise<void>;
}

const AppUpdater = registerPlugin<AppUpdaterPlugin>('AppUpdater');

const STORAGE_KEY_LAST_CHECK = 'travelspend_last_update_check';
const STORAGE_KEY_DISMISSED_VERSION = 'travelspend_dismissed_version';

/**
 * Compare two semver strings: returns 1 if vA > vB, -1 if vA < vB, 0 if equal
 */
function compareSemver(vA: string, vB: string): number {
  const cleanA = vA.replace(/[^0-9.]/g, '').split('.').map(Number);
  const cleanB = vB.replace(/[^0-9.]/g, '').split('.').map(Number);

  const maxLen = Math.max(cleanA.length, cleanB.length, 3);
  for (let i = 0; i < maxLen; i++) {
    const numA = cleanA[i] || 0;
    const numB = cleanB[i] || 0;
    if (numA > numB) return 1;
    if (numA < numB) return -1;
  }
  return 0;
}

export async function checkForAppUpdates(manual = false) {
  // If offline, avoid unnecessary network attempts
  if (!navigator.onLine) {
    if (manual) {
      alert("Отсутствует интернет-соединение. Подключитесь к сети для проверки обновлений.");
    }
    return;
  }

  // Rate-limiting for auto checks: do not spam the user or GitHub API on every re-render/tab switch
  if (!manual) {
    const lastCheck = localStorage.getItem(STORAGE_KEY_LAST_CHECK);
    const now = Date.now();
    // Check at most once per hour automatically
    if (lastCheck && now - Number(lastCheck) < 60 * 60 * 1000) {
      return;
    }
    localStorage.setItem(STORAGE_KEY_LAST_CHECK, now.toString());
  }

  try {
    let currentVersion = "1.1.0";
    try {
      if (Capacitor.isNativePlatform()) {
        const appInfo = await App.getInfo();
        if (appInfo?.version) {
          currentVersion = appInfo.version;
        }
      }
    } catch {
      currentVersion = "1.1.0";
    }

    const repoOwner = "Timofeymelehin";
    const repoName = "travelspend-app";
    
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
        alert("Релизы на GitHub пока не найдены.");
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
    const latestVersion = latestTag.replace(/^v/i, '').trim();

    // STRICT CHECK: Only trigger if latestVersion is strictly GREATER than currentVersion
    const isNewer = compareSemver(latestVersion, currentVersion) > 0;

    if (isNewer) {
      // If the user already dismissed this specific version in automatic mode, don't nag repeatedly
      if (!manual) {
        const dismissedVersion = localStorage.getItem(STORAGE_KEY_DISMISSED_VERSION);
        if (dismissedVersion === latestVersion) {
          return;
        }
      }

      const apkAsset = release.assets?.find((asset: any) => asset.name.endsWith('.apk'));
      if (apkAsset && apkAsset.browser_download_url) {
        const confirmUpdate = window.confirm(
          `Доступна новая версия ${latestVersion} (у вас ${currentVersion}).\n\nОбновить приложение сейчас?`
        );

        if (confirmUpdate) {
          if (Capacitor.isNativePlatform()) {
            await downloadAndInstallApk(apkAsset.browser_download_url);
          } else {
            window.location.href = apkAsset.browser_download_url;
          }
        } else {
          // User clicked cancel: remember dismissal so it won't ask again on every launch
          localStorage.setItem(STORAGE_KEY_DISMISSED_VERSION, latestVersion);
        }
      } else {
        if (manual) {
          alert(`Найдена версия ${latestVersion}, но APK файл еще формируется в GitHub Actions.`);
        }
      }
    } else {
      if (manual) {
        alert(`У вас уже установлена актуальная версия (${currentVersion}). Обновление не требуется.`);
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
      return;
    }
  } catch (error) {
    console.error("Failed to download or install APK automatically:", error);
  }

  // Fallback: open APK in mobile browser so Android native package installer takes over
  const shouldOpenBrowser = window.confirm(
    "Не удалось запустить автоустановщик внутри приложения.\nОткрыть прямую ссылку на APK в браузере для быстрой загрузки?"
  );
  if (shouldOpenBrowser) {
    window.location.href = apkUrl;
  }
}
