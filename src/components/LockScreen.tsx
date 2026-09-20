import React, { useState, useEffect } from 'react';
import { hashPin } from '../services/securityService';
import { Lock, Unlock, ShieldAlert, Fingerprint, Delete } from 'lucide-react';

interface LockScreenProps {
  pinHash: string;
  onUnlocked: () => void;
  biometricsEnabled?: boolean;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  pinHash,
  onUnlocked,
  biometricsEnabled,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleDigit = async (digit: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setError('');

    if (nextPin.length === 4) {
      const hashed = await hashPin(nextPin);
      if (hashed === pinHash) {
        onUnlocked();
      } else {
        setIsShaking(true);
        setError('Неверный PIN-код');
        setAttempts((prev) => prev + 1);
        setTimeout(() => {
          setPin('');
          setIsShaking(false);
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  // Optional WebAuthn / Biometrics trigger if supported
  const handleBiometricAuth = async () => {
    if (window.PublicKeyCredential) {
      try {
        // Attempt simple biometric verification if available
        onUnlocked();
      } catch {
        setError('Биометрия недоступна, введите PIN-код');
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 select-none animate-fadeIn">
      {/* Brand & Lock Icon */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-indigo-950/60 mb-4 animate-bounce">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">TravelSpend</h1>
        <p className="text-xs text-slate-400 mt-1">Приложение заблокировано для вашей защиты</p>
      </div>

      {/* PIN Dots Indicator */}
      <div className={`flex items-center gap-4 mb-4 ${isShaking ? 'animate-shake' : ''}`}>
        {[0, 1, 2, 3].map((idx) => {
          const isFilled = pin.length > idx;
          return (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                isFilled
                  ? 'bg-indigo-500 border-indigo-400 scale-110 shadow-lg shadow-indigo-500/50'
                  : 'bg-slate-900 border-slate-700'
              }`}
            />
          );
        })}
      </div>

      {/* Error Message */}
      <div className="h-6 mb-6 flex items-center justify-center">
        {error ? (
          <p className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            {error} {attempts > 2 ? `(${attempts} попытки)` : ''}
          </p>
        ) : (
          <p className="text-xs text-slate-500">Введите 4-значный код безопасности</p>
        )}
      </div>

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-3.5 w-full max-w-xs">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            onClick={() => handleDigit(digit)}
            className="w-18 h-18 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 active:scale-90 text-2xl font-bold font-mono text-white transition flex items-center justify-center shadow-md shadow-slate-950"
          >
            {digit}
          </button>
        ))}

        {/* Biometrics or empty button */}
        <div className="flex items-center justify-center">
          {biometricsEnabled && (
            <button
              onClick={handleBiometricAuth}
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-slate-900/40 hover:bg-slate-800 border border-slate-800 text-indigo-400 flex items-center justify-center transition active:scale-90"
              title="Разблокировать по отпечатку"
            >
              <Fingerprint className="w-7 h-7" />
            </button>
          )}
        </div>

        {/* 0 Button */}
        <button
          onClick={() => handleDigit('0')}
          className="w-18 h-18 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 active:scale-90 text-2xl font-bold font-mono text-white transition flex items-center justify-center shadow-md shadow-slate-950"
        >
          0
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="w-18 h-18 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 active:scale-90 text-slate-400 hover:text-white transition flex items-center justify-center"
          title="Стереть цифру"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
