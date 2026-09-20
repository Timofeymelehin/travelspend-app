/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Trip, ExpenseItem, ExchangeRatesState } from './types';
import { DEFAULT_JAPAN_TRIP } from './data/sampleJapanTrip';
import { fetchExchangeRates, getDirectRate } from './services/currencyService';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { usePWAInstall } from './hooks/usePWAInstall';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ExpensesTableView } from './components/views/ExpensesTableView';
import { ConverterView } from './components/views/ConverterView';
import { TripsSettingsView } from './components/views/TripsSettingsView';
import { LockScreen } from './components/LockScreen';
import { SecurityModal } from './components/SecurityModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import {
  SecuritySettings,
  loadSecuritySettings,
  saveSecuritySettings,
  shouldAutoLock,
  updateLastActiveTimestamp,
} from './services/securityService';
import { checkForAppUpdates } from './services/updateService';

const STORAGE_KEY_TRIPS = 'travelspend_trips_v2';
const STORAGE_KEY_ACTIVE_TRIP = 'travelspend_active_trip_id_v2';

export default function App() {
  // Check for app updates on mount
  useEffect(() => {
    checkForAppUpdates();
  }, []);

  // Online / Offline Detection
  const isOnline = useOnlineStatus();
  const { isInstallable, install } = usePWAInstall();

  // Security & Privacy State
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(loadSecuritySettings);
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    const s = loadSecuritySettings();
    return s.isPinEnabled && !!s.pinHash;
  });
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);

  // Auto-lock on window blur / visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateLastActiveTimestamp();
      } else if (document.visibilityState === 'visible') {
        if (securitySettings.isPinEnabled && securitySettings.pinHash) {
          if (shouldAutoLock(securitySettings.autoLockMinutes)) {
            setIsLocked(true);
          }
        }
      }
    };

    const handleUserActivity = () => {
      updateLastActiveTimestamp();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [securitySettings]);

  const handleUpdateSecuritySettings = (newSettings: SecuritySettings) => {
    setSecuritySettings(newSettings);
    saveSecuritySettings(newSettings);
    if (!newSettings.isPinEnabled) {
      setIsLocked(false);
    }
  };

  const handleToggleMask = () => {
    const updated = {
      ...securitySettings,
      maskAmounts: !securitySettings.maskAmounts,
    };
    handleUpdateSecuritySettings(updated);
  };

  // Trips State from Local Storage
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRIPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading trips from storage:', e);
    }
    return [DEFAULT_JAPAN_TRIP];
  });

  const [activeTripId, setActiveTripId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_TRIP);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return DEFAULT_JAPAN_TRIP.id;
  });

  // Active Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');

  // Exchange Rates State
  const [exchangeState, setExchangeState] = useState<ExchangeRatesState>({
    base: 'USD',
    rates: { USD: 1.0, JPY: 153.2, RUB: 92.5 },
    lastUpdated: 'Загрузка...',
    isOffline: false,
  });
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  // Add / Edit Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  // Active Trip Object
  const currentTrip = useMemo(() => {
    return trips.find((t) => t.id === activeTripId) || trips[0] || DEFAULT_JAPAN_TRIP;
  }, [trips, activeTripId]);

  // Calculate Active Exchange Rate (1 localCurrency = X baseCurrency)
  const currentExchangeRate = useMemo(() => {
    return getDirectRate(
      currentTrip.localCurrency,
      currentTrip.baseCurrency,
      exchangeState.rates,
      currentTrip.customExchangeRate,
      currentTrip.useManualRate
    );
  }, [currentTrip, exchangeState.rates]);

  // Load and refresh exchange rates
  const loadRates = async () => {
    setIsRefreshingRates(true);
    try {
      const state = await fetchExchangeRates();
      setExchangeState(state);
    } catch (e) {
      console.warn('Failed to fetch exchange rates:', e);
    } finally {
      setIsRefreshingRates(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  // Save trips to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(trips));
    } catch (e) {
      console.error('Error saving trips to storage:', e);
    }
  }, [trips]);

  // Save active trip id
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_TRIP, activeTripId);
    } catch {
      // ignore
    }
  }, [activeTripId]);

  // Expense Handlers
  const handleSaveExpense = (item: ExpenseItem) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== currentTrip.id) return t;

        const exists = t.items.some((i) => i.id === item.id);
        const newItems = exists
          ? t.items.map((i) => (i.id === item.id ? item : i))
          : [item, ...t.items];

        return { ...t, items: newItems };
      })
    );
  };

  const handleDeleteExpense = (itemId: string) => {
    if (!window.confirm('Удалить эту позицию расхода?')) return;

    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== currentTrip.id) return t;
        return {
          ...t,
          items: t.items.filter((i) => i.id !== itemId),
        };
      })
    );
  };

  const handleEditExpense = (item: ExpenseItem) => {
    setEditingExpense(item);
    setIsAddModalOpen(true);
  };

  // Trip Handlers
  const handleUpdateTrip = (updatedTrip: Trip) => {
    setTrips((prev) => prev.map((t) => (t.id === updatedTrip.id ? updatedTrip : t)));
  };

  const handleCreateTrip = (newTrip: Trip) => {
    setTrips((prev) => [...prev, newTrip]);
    setActiveTripId(newTrip.id);
    setActiveTab('table');
  };

  const handleResetToJapan = () => {
    setTrips((prev) => {
      const filtered = prev.filter((t) => t.id !== DEFAULT_JAPAN_TRIP.id);
      return [DEFAULT_JAPAN_TRIP, ...filtered];
    });
    setActiveTripId(DEFAULT_JAPAN_TRIP.id);
  };

  const handleUpdateManualRate = (newRate: number, useManual: boolean) => {
    const updated: Trip = {
      ...currentTrip,
      customExchangeRate: newRate,
      useManualRate: useManual,
    };
    handleUpdateTrip(updated);
  };

  const rateDisplayText = `100 ${currentTrip.localCurrency} = ${(currentExchangeRate * 100).toFixed(1)} ${currentTrip.baseCurrency}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 0. PIN-Code Security Lock Screen */}
      {isLocked && securitySettings.pinHash && (
        <LockScreen
          pinHash={securitySettings.pinHash}
          onUnlocked={() => setIsLocked(false)}
          biometricsEnabled={securitySettings.biometricsEnabled}
        />
      )}

      {/* Offline Toast Notification when network is lost */}
      {!isOnline && (
        <div className="bg-amber-600/90 text-slate-950 font-semibold px-4 py-1 text-center text-xs flex items-center justify-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />
          <span>Офлайн-режим активен. Все данные и кэшированные курсы валют доступны без интернета.</span>
        </div>
      )}

      {/* App Header (Clean, only trip name) */}
      <Header currentTrip={currentTrip} />

      {/* Main View Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3.5 sm:px-5 py-4">
        {activeTab === 'analytics' && (
          <AnalyticsView
            trip={currentTrip}
            exchangeRate={currentExchangeRate}
            maskAmounts={securitySettings.maskAmounts}
          />
        )}

        {activeTab === 'table' && (
          <ExpensesTableView
            trip={currentTrip}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onOpenAddModal={() => {
              setEditingExpense(null);
              setIsAddModalOpen(true);
            }}
            maskAmounts={securitySettings.maskAmounts}
          />
        )}

        {activeTab === 'converter' && (
          <ConverterView
            trip={currentTrip}
            exchangeRate={currentExchangeRate}
            onUpdateManualRate={handleUpdateManualRate}
            isOnline={isOnline}
            ratesLastUpdated={
              exchangeState.isOffline
                ? 'Кэш / Офлайн'
                : 'Курс ЦБ / Live'
            }
          />
        )}

        {activeTab === 'settings' && (
          <TripsSettingsView
            currentTrip={currentTrip}
            trips={trips}
            onSelectTrip={(id) => setActiveTripId(id)}
            onUpdateTrip={handleUpdateTrip}
            onCreateTrip={handleCreateTrip}
            onResetToJapanPreset={handleResetToJapan}
            onRefreshRates={loadRates}
            isRefreshingRates={isRefreshingRates}
            ratesLastUpdated={exchangeState.lastUpdated}
            isPinEnabled={securitySettings.isPinEnabled}
            onOpenSecurity={() => setIsSecurityModalOpen(true)}
            onOpenInstallGuide={() => setIsInstallGuideOpen(true)}
          />
        )}
      </main>

      {/* Bottom Android Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => {
          setEditingExpense(null);
          setIsAddModalOpen(true);
        }}
        itemsCount={currentTrip.items.length}
      />

      {/* Add / Edit Expense Bottom-Sheet Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingExpense(null);
        }}
        onSave={handleSaveExpense}
        editingItem={editingExpense}
        baseCurrency={currentTrip.baseCurrency}
        localCurrency={currentTrip.localCurrency}
        exchangeRate={currentExchangeRate}
      />

      {/* Security & PIN Settings Modal */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        settings={securitySettings}
        onSaveSettings={handleUpdateSecuritySettings}
      />

      {/* Phone / Mobile Install Guide Modal */}
      <InstallGuideModal
        isOpen={isInstallGuideOpen}
        onClose={() => setIsInstallGuideOpen(false)}
        canDirectInstall={isInstallable}
        onDirectInstall={() => {
          setIsInstallGuideOpen(false);
          install();
        }}
      />
    </div>
  );
}
