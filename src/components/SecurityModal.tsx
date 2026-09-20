import React, { useState } from 'react';
import { SecuritySettings, hashPin } from '../services/securityService';
import { Shield, Lock, Eye, EyeOff, Check, KeyRound, Clock, AlertCircle } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SecuritySettings;
  onSaveSettings: (newSettings: SecuritySettings) => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [step, setStep] = useState<'menu' | 'set_pin' | 'change_pin'>('menu');
  const [pinInput, setPinInput] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [autoLockMinutes, setAutoLockMinutes] = useState(settings.autoLockMinutes);
  const [maskAmounts, setMaskAmounts] = useState(settings.maskAmounts);

  if (!isOpen) return null;

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length !== 4 || !/^\d{4}$/.test(pinInput)) {
      setErrorMessage('PIN-код должен состоять ровно из 4 цифр');
      return;
    }
    if (pinInput !== pinConfirm) {
      setErrorMessage('Коды не совпадают. Повторите ввод');
      return;
    }

    const hashed = await hashPin(pinInput);
    const updated: SecuritySettings = {
      ...settings,
      isPinEnabled: true,
      pinHash: hashed,
      autoLockMinutes,
      maskAmounts,
    };
    onSaveSettings(updated);
    setSuccessMessage('PIN-код успешно установлен!');
    setTimeout(() => {
      setSuccessMessage('');
      setStep('menu');
      setPinInput('');
      setPinConfirm('');
    }, 1200);
  };

  const handleDisablePin = () => {
    if (window.confirm('Отключить защиту PIN-кодом? Любой получит доступ к вашим расчетам.')) {
      const updated: SecuritySettings = {
        ...settings,
        isPinEnabled: false,
        pinHash: null,
      };
      onSaveSettings(updated);
      setSuccessMessage('Защита PIN-кодом отключена');
      setTimeout(() => setSuccessMessage(''), 2000);
    }
  };

  const handleToggleMask = () => {
    const next = !maskAmounts;
    setMaskAmounts(next);
    onSaveSettings({
      ...settings,
      maskAmounts: next,
    });
  };

  const handleAutoLockChange = (minutes: number) => {
    setAutoLockMinutes(minutes);
    onSaveSettings({
      ...settings,
      autoLockMinutes: minutes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Безопасность и защита</h2>
              <p className="text-xs text-slate-400">PIN-код, автоблокировка и скрытие сумм</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>

        {successMessage && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {step === 'menu' ? (
          <div className="space-y-4">
            {/* 1. PIN-Code Toggle Card */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-700/50 text-indigo-300">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Защита 4-значным PIN-кодом</h3>
                  <p className="text-[11px] text-slate-400">
                    {settings.isPinEnabled ? 'Включена (приложение защищено)' : 'Отключена'}
                  </p>
                </div>
              </div>

              {settings.isPinEnabled ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setStep('set_pin');
                      setErrorMessage('');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium"
                  >
                    Сменить
                  </button>
                  <button
                    onClick={handleDisablePin}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium"
                  >
                    Выкл
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setStep('set_pin');
                    setErrorMessage('');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition active:scale-95"
                >
                  Включить
                </button>
              )}
            </div>

            {/* 2. Privacy Mode (Eye Mask) */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-700/50 text-emerald-400">
                  {maskAmounts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Режим приватности сумм</h3>
                  <p className="text-[11px] text-slate-400">
                    Маскирует балансы (•••• ₽), чтобы не светить траты в метро и людных местах
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleMask}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  maskAmounts ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    maskAmounts ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* 3. Auto-Lock Delay */}
            {settings.isPinEnabled && (
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-750 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-white">Автоблокировка</span>
                  </div>
                  <span className="text-xs text-indigo-400 font-semibold">
                    {autoLockMinutes === 0 ? 'Сразу при сворачивании' : `Через ${autoLockMinutes} мин.`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[0, 1, 5, 15].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleAutoLockChange(mins)}
                      className={`py-1.5 rounded-xl text-xs font-medium transition ${
                        autoLockMinutes === mins
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {mins === 0 ? 'Сразу' : `${mins} мин`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Set PIN Form */
          <form onSubmit={handleSavePin} className="space-y-4">
            <p className="text-xs text-slate-300">
              Придумайте 4-значный цифровой код для входа в приложение:
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Новый 4-значный PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                required
                autoFocus
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center tracking-widest text-xl py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Подтвердите PIN-код
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                required
                value={pinConfirm}
                onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full text-center tracking-widest text-xl py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('menu');
                  setPinInput('');
                  setPinConfirm('');
                  setErrorMessage('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition"
              >
                Назад
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
              >
                Сохранить PIN
              </button>
            </div>
          </form>
        )}

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
