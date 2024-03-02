import type { AppMetricaConfig, UserProfile } from './appMetrica';
import type { CrashesConfiguration } from './crashes';

/**
 * Интерфейс для вызова нативных методов react-native-ya-appmetrica.
 */
export interface NativeImplAppMetrica {
  activate(config: AppMetricaConfig, onError?: (error: string) => void): void;
  configureCrashes(config: CrashesConfiguration): void;
  reportEvent(eventName: string, attributes?: Record<string, unknown>): void;
  sendEventsBuffer(): void;
  pauseSession(): void;
  resumeSession(): void;
  reportAppOpen(deeplink: string): void;
  setUserProfileID(id: string): void;
  reportUserProfile(
    profile: Omit<UserProfile, 'birthDate'> & { birthDate?: number[] }, // в натив передается массив [дд, мм, гггг]
    onError?: (error: string) => void
  ): void;
  setStatisticsSending(enabled: boolean): void;
  setLocationTracking(enabled: boolean): void;
}

export type NativeImplCrashes = {
  configureCrashes(config: CrashesConfiguration): void;
  reportError(errorName: string, stackTrace?: string): void;
  criticalError: () => void;
};
