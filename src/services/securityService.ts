export interface SecuritySettings {
  isPinEnabled: boolean;
  pinHash: string | null; // SHA-256 hex or salted hash
  autoLockMinutes: number; // 0 = immediately, 1, 5, 15, 30
  biometricsEnabled: boolean;
  maskAmounts: boolean; // privacy mode to hide totals on screen in public
}

const STORAGE_SECURITY_KEY = 'travelspend_security_config_v1';
const STORAGE_LAST_ACTIVE_KEY = 'travelspend_security_last_active';

export async function hashPin(pin: string): Promise<string> {
  const enc = new TextEncoder().encode(`travelspend_salt_${pin}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function loadSecuritySettings(): SecuritySettings {
  try {
    const raw = localStorage.getItem(STORAGE_SECURITY_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load security settings:', e);
  }
  return {
    isPinEnabled: false,
    pinHash: null,
    autoLockMinutes: 1,
    biometricsEnabled: false,
    maskAmounts: false,
  };
}

export function saveSecuritySettings(settings: SecuritySettings): void {
  try {
    localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save security settings:', e);
  }
}

export function updateLastActiveTimestamp(): void {
  localStorage.setItem(STORAGE_LAST_ACTIVE_KEY, Date.now().toString());
}

export function getLastActiveTimestamp(): number {
  const val = localStorage.getItem(STORAGE_LAST_ACTIVE_KEY);
  return val ? parseInt(val, 10) : 0;
}

export function shouldAutoLock(autoLockMinutes: number): boolean {
  if (autoLockMinutes === 0) return true; // always lock immediately
  const lastActive = getLastActiveTimestamp();
  if (!lastActive) return true;
  const elapsedMinutes = (Date.now() - lastActive) / (1000 * 60);
  return elapsedMinutes >= autoLockMinutes;
}
