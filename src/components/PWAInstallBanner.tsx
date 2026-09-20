import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, X, Share, PlusSquare, Smartphone } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  if (isInstalled || dismissed) return null;

  if (isInstallable) {
    return (
      <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border-b border-indigo-500/30 px-4 py-2.5 text-xs text-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-indigo-500/30 text-indigo-300 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <p className="truncate">
              <span className="font-semibold text-white">Установите приложение на Android</span> — быстрый запуск и 100% офлайн!
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 font-semibold text-white transition active:scale-95 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Установить</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-slate-300 hover:text-white"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isIOS) {
    return (
      <>
        <div className="bg-slate-850 border-b border-slate-700/80 px-4 py-2 text-xs text-slate-300">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <Smartphone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">Добавьте на экран «Домой» для быстрого офлайн-доступа</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowIOSModal(true)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline"
              >
                Как установить?
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="p-0.5 text-slate-400 hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                  Установка на iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSModal(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <p>
                    Нажмите кнопку <strong className="text-white">Поделиться</strong> <Share className="w-4 h-4 inline text-indigo-400 mx-1" /> в панели Safari внизу.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <p>
                    Прокрутите список вниз и выберите <strong className="text-white">«На экран Домой»</strong> <PlusSquare className="w-4 h-4 inline text-indigo-400 mx-1" />.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <p>
                    Нажмите <strong className="text-white">«Добавить»</strong> в правом верхнем углу. Готово!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
