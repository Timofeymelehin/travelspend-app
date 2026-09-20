import React, { useState } from 'react';
import { Smartphone, Download, Check, Share, PlusSquare, ExternalLink, QrCode } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  canDirectInstall: boolean;
  onDirectInstall: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
  canDirectInstall,
  onDirectInstall,
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'qr'>('android');
  const currentUrl = window.location.href;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Установка на телефон</h2>
              <p className="text-xs text-slate-400">Работает как нативное приложение без Play Market</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {/* Platform Tabs */}
        <div className="flex rounded-2xl bg-slate-800/80 p-1 border border-slate-700/60">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🤖 Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🍏 iPhone</span>
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📱 Ссылка / QR</span>
          </button>
        </div>

        {/* Android Tab */}
        {activeTab === 'android' && (
          <div className="space-y-3 text-xs">
            {canDirectInstall && (
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white">Установить в 1 клик</h4>
                  <p className="text-[11px] text-indigo-300">Браузер готов к прямой установке</p>
                </div>
                <button
                  onClick={onDirectInstall}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs flex items-center gap-1.5 shadow transition active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Установить</span>
                </button>
              </div>
            )}

            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-750">
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs">
                  1
                </div>
                <div>
                  <span className="font-semibold text-white">Откройте ссылку в браузере Google Chrome</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Откройте адрес приложения на вашем Android смартфоне.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-750">
                <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs">
                  2
                </div>
                <div>
                  <span className="font-semibold text-white">Нажмите на три точки меню (⋮) в правом верхнем углу Chrome</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    В открывшемся системном меню выберите пункт:
                  </p>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-700 text-indigo-200 font-bold text-[11px]">
                    <Download className="w-3 h-3" />
                    <span>«Установить приложение» или «Добавить на главный экран»</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-750">
                <div className="w-6 h-6 rounded-full bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                  3
                </div>
                <div>
                  <span className="font-semibold text-white">Готово! Иконка появится на рабочем столе</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Приложение откроется на весь экран без рамок браузера и будет полноценно работать без интернета.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* iPhone (iOS) Tab */}
        {activeTab === 'ios' && (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-750">
              <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs">
                1
              </div>
              <div>
                <span className="font-semibold text-white">Откройте сайт в Safari</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  На iPhone установка PWA поддерживается через браузер Safari.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-750">
              <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs">
                2
              </div>
              <div>
                <span className="font-semibold text-white">Нажмите кнопку «Поделиться»</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Иконка квадрат со стрелочкой вверх (в нижней панели Safari):
                </p>
                <div className="mt-1 inline-flex items-center gap-1 text-sky-400 font-bold text-[11px]">
                  <Share className="w-3.5 h-3.5" />
                  <span>Поделиться (Share)</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-800/60 border border-slate-750">
              <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs">
                3
              </div>
              <div>
                <span className="font-semibold text-white">Выберите «На экран "Домой"»</span>
                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-700 text-indigo-200 font-bold text-[11px]">
                  <PlusSquare className="w-3 h-3" />
                  <span>На экран «Домой» (Add to Home Screen)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QR Tab */}
        {activeTab === 'qr' && (
          <div className="space-y-3 text-xs text-center">
            <p className="text-slate-300">
              Отсканируйте камерой смартфона или скопируйте ссылку, чтобы открыть приложение прямо на телефоне:
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block mx-auto shadow-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  currentUrl
                )}`}
                alt="QR Code"
                className="w-40 h-40 mx-auto"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono truncate"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentUrl);
                  alert('Ссылка скопирована в буфер обмена!');
                }}
                className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs shrink-0"
              >
                Копировать
              </button>
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
