import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { registerPlugin } from '@capacitor/core';

interface AppUpdaterPlugin {
  installApk(options: { filePath: string }): Promise<void>;
}

const AppUpdater = registerPlugin<AppUpdaterPlugin>('AppUpdater');

export async function checkForAppUpdates(manual = false) {
  try {
    const appInfo = await App.getInfo();
    const currentVersion = appInfo.version; // e.g., "1.0.0"

    const repoOwner = "Timofeymelehin";
    const repoName = "travelspend-app";
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`);

    if (response.status === 404) {
      if (manual) {
        alert("Релизы на GitHub пока не найдены (404). Создайте первый релиз (Release) с прикрепленным APK-файлом в репозитории GitHub.");
      }
      return;
    }

    if (!response.ok) {
      if (manual) {
        alert("Не удалось проверить обновление. Проверьте подключение к интернету.");
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
          await downloadAndInstallApk(apkAsset.browser_download_url);
        }
      } else {
        if (manual) {
          alert(`Найдена версия ${latestVersion}, но APK файл не прикреплен к релизу в GitHub.`);
        }
      }
    } else {
      if (manual) {
        alert(`У вас установлена последняя актуальная версия (${currentVersion}).`);
      }
    }
  } catch (e) {
    console.error("Failed to check for app updates:", e);
    if (manual) {
      alert("Произошла ошибка при проверке обновлений. Проверьте подключение к интернету.");
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
