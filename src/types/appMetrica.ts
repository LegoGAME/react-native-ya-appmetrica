/**
 * Если userProfileID не передан или не настроен вызовом setUserProfileID, то gender, name, birthDate и notificationsEnabled не будут отображаться в метрике
 *
 * Типы в customAttributes необходимо самостоятельно контролировать. Для сброса значения кастомного атрибута, передать undefined. undefined не поддерживается для counter.
 */
export type UserProfile = {
  userProfileID?: string;
  name?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: Date;
  notificationsEnabled?: boolean;
  customAttributes?: Record<
    string,
    {
      type: 'boolean' | 'number' | 'counter' | 'string';
      value: boolean | number | string | undefined;
    }
  >;
};

export type PreloadInfo = {
  trackingId: string;
  additionalInfo?: Record<string, string>;
};

export type Location = {
  latitude: number;
  longitude: number;
};

// Для тех полей, которые есть в обеих платформах, используются имена android
export type AppMetricaConfig = {
  apiKey: string;

  // Обе платформы
  appBuildNumber?: number;
  appOpenTrackingEnabled?: boolean;
  appVersion?: string;
  customHosts?: string[];
  dataSendingEnabled?: boolean;
  locationTracking?: boolean;
  maxReportsCount?: number;
  maxReportsInDatabaseCount?: number;
  preloadInfo?: PreloadInfo;
  revenueAutoTrackingEnabled?: boolean;
  sessionTimeout?: number;
  userProfileID?: string;
  location?: Location; // ios - customLocation, android - location
  logs?: boolean; // ios - areLogsEnabled, android - logs
  dispatchPeriodSeconds?: number; // ios - dispatchPeriod, android - dispatchPeriodSeconds
  sessionsAutoTrackingEnabled?: boolean; // ios - sessionsAutoTracking, android - sessionsAutoTrackingEnabled
  firstActivationAsUpdate?: boolean; // ios - handleFirstActivationAsUpdate, android - firstActivationAsUpdate

  /** @deprecated should use `dataSendingEnabled` instead */
  statisticsSending?: boolean;

  // ios
  accurateLocationTracking?: boolean;
  allowsBackgroundLocationUpdates?: boolean;
  handleActivationAsSessionStart?: boolean;

  // android
  crashReporting?: boolean; // для ios конфигурируются отдельно
  anrMonitoring?: boolean;
  anrMonitoringTimeout?: number;
  // additionalConfig?: Record<string, any>[];
  // appEnvironment?: Record<string, string>[];
  // crashTransformer?: ICrashTransformer;
  deviceType?: 'phone' | 'tablet' | 'phablet' | 'TV';
  // errorEnvironment?: Record<string, string>[];
  nativeCrashReporting?: boolean;
};

export type RevenueInfo = {
  price: number;
  currency: string;
  quantity?: number;
  productId?: string;
  /** ios only */
  transactionId?: string;
  /** Чтобы группировать покупки по OrderID, укажите его в свойстве payload. */
  payload?: Record<string, string | number | boolean | null>;
};
