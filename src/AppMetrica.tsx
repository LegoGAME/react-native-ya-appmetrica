import { NativeModules, Platform } from 'react-native';
import { LINKING_ERROR } from './constants';
import type { NativeImplAppMetrica } from './types/_native';
import type { AppMetricaConfig, RevenueInfo, UserProfile } from './types';

const AppMetrica: NativeImplAppMetrica = NativeModules.AppMetrica;

if (!AppMetrica) {
  throw new Error(LINKING_ERROR);
}

// Активация и инициализация AppMetrica.
export const activate = (config: AppMetricaConfig): void => {
  if (
    Object.keys(config).includes('statisticsSending') &&
    Object.keys(config).includes('dataSendingEnabled')
  ) {
    throw new Error(
      'Both statisticsSending and dataSendingEnabled are specified. Use only dataSendingEnabled. statisticsSending is deprecated.'
    );
  }

  if (Platform.OS === 'ios' && config.crashReporting !== undefined) {
    console.warn(
      'crashReporting is ignored for iOS. Call configureCrashes for configure crash reporting.'
    );
  }

  if (Object.keys(config).includes('statisticsSending')) {
    config.dataSendingEnabled = config.statisticsSending;
    console.warn(
      'statisticsSending is deprecated. Use dataSendingEnabled instead.'
    );
  }

  if (Platform.OS === 'ios') {
    AppMetrica.activate(config, (error) => {
      throw new Error(error);
    });
  } else if (Platform.OS === 'android') {
    // android самостоятельно бросает исключение в react native при некорректном ключе
    AppMetrica.activate(config);
  } else {
    throw new Error(
      `react-native-ya-appmetrica does not support platform - ${Platform.OS}`
    );
  }
};

/**
 * Отправка собственного события
 * @param name Имя события
 * @param attributes вложенные параметры в виде пар "ключ-значение"
 */
export const reportEvent = (
  name: string,
  attributes?: Record<string, unknown>
) => {
  AppMetrica.reportEvent(name, attributes);
};

/**
 * AppMetrica SDK не отправляет события сразу после их наступления.
 * Данные о событиях хранятся в буфере.
 * Этот метод принудительно инициирует отправку всех данных из буфера и стирает его.
 * Используйте метод после важных контрольных точек пользовательских сценариев.

***ВНИМАНИЕ: Частое использование метода может привести к увеличению исходящего интернет-трафика и энергопотребления.***
 */
export const sendEventsBuffer = () => {
  AppMetrica.sendEventsBuffer();
};

export const pauseSession = () => {
  AppMetrica.pauseSession();
};

export const resumeSession = () => {
  AppMetrica.resumeSession();
};

export const reportAppOpen = (deeplink: string) => {
  AppMetrica.reportAppOpen(deeplink);
};

/**
 * Установить собственный userID для пользователя. Максимум 200 символов.
 */
export const setUserProfileID = (userID: string) => {
  AppMetrica.setUserProfileID(userID);
};

export const reportUserProfile = (
  profile: UserProfile,
  onError?: (error: string) => void
) => {
  let { birthDate, ...otherProfile } = profile;
  let newDate: number[] | undefined;

  if (birthDate) {
    newDate = [
      birthDate.getDate(),
      birthDate.getMonth() + 1,
      birthDate.getFullYear(),
    ];
  }

  AppMetrica.reportUserProfile(
    { ...otherProfile, birthDate: newDate },
    (error) => {
      if (onError) {
        onError(error);
      } else {
        throw new Error(error);
      }
    }
  );
};

export const setStatisticsSending = (enabled: boolean) => {
  AppMetrica.setStatisticsSending(enabled);
};

export const setLocationTracking = (enabled: boolean) => {
  AppMetrica.setLocationTracking(enabled);
};

export const reportRevenue = (
  revenue: RevenueInfo,
  onError?: (error: string) => void
) => {
  AppMetrica.reportRevenue(revenue, (error) => {
    if (onError) {
      onError(error);
    } else {
      throw new Error(error);
    }
  });
};
