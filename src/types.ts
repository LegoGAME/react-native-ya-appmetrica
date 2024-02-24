/**
 * Интерфейс для вызова нативных методов react-native-ya-appmetrica.
 */
export interface NativeImplAppMetrica {
  activate(config: AppMetricaConfig, onError?: (error: string) => void): void;
  reportError(errorName: string, stackTrace?: string): void;
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

/**
 * @param apiKey - API-ключ AppMetrica.
 * @param userProfileID - ID профиля пользователя. Максимум 200 символов.
 * @param appVersion - Версия приложения, отображаемая в метрике. Если не указано, будет отправляться информация из info.plist и AndroidManifest.xml.
 * @param logs - Логирование. По умолчанию true.
 * @param sessionTimeout - Длительность сессии в секундах. Если не передано - 10. Это минимальное значение.
 * @param crashReporting - Отслеживание аварийных остановок приложения. По умолчанию true.
 * @param nativeCrashReporting - Android. Отслеживание нативных аварийных остановок приложения. По умолчанию true.
 * @param appOpenTrackingEnabled - Отслеживание открытий приложения через deeplink. Не влияет переход по deeplink при уже открытом приложении. По умолчанию true.
 * @param handleActivationAsSessionStart - iOS. Определяет инициализацию AppMetrica как начало пользовательской сессии. По умолчанию false.
 * @param firstActivationAsUpdate - Указывает, следует ли считать первую активацию AppMetrica обновлением приложения или установкой нового приложения. true - первый запуск как обновление. false - первый запуск как установка. По умолчанию false.
 * @param maxReportsInDatabaseCount - Максимальное число отчетов об ошибках, которое хранится во внутренней БД.. По умолчанию 1000.
 * @param maxReportsCount - Android. Максимальный размер буфера для отчетов. По умолчанию 7.
 * @param statisticsSending - Разрешить отправку статистики. По умолчанию true.
 * @param locationTracking - Разрешить отслеживание местоположения. По умолчанию true.
 */
export type AppMetricaConfig = {
  apiKey: string;
  userProfileID?: string;
  appVersion?: string;
  logs?: boolean;
  sessionTimeout?: number;
  crashReporting?: boolean;
  nativeCrashReporting?: boolean;
  appOpenTrackingEnabled?: boolean;
  handleActivationAsSessionStart?: boolean;
  firstActivationAsUpdate?: boolean;
  maxReportsInDatabaseCount?: number;
  maxReportsCount?: number;
  statisticsSending?: boolean;
  locationTracking?: boolean;
};
