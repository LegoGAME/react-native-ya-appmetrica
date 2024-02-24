import { NativeModules, Platform } from 'react-native';
import type {
  AppMetricaConfig,
  NativeImplAppMetrica,
  UserProfile,
} from './types';

const LINKING_ERROR =
  `The package 'react-native-ya-appmetrica' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AppMetrica: NativeImplAppMetrica = NativeModules.AppMetrica;
const TestError = NativeModules.TestError;

if (!AppMetrica || !TestError) {
  throw new Error(LINKING_ERROR);
}

/**
 * Инициализация и активация AppMetrica SDK
 * @param config Конфигурация SDK
 */
const activate = (config: AppMetricaConfig) => {
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
 * AppMetrica SDK не отправляет события сразу после их наступления.
 * Данные о событиях хранятся в буфере.
 * Этот метод принудительно инициирует отправку всех данных из буфера и стирает его.
 * Используйте метод после важных контрольных точек пользовательских сценариев.

***ВНИМАНИЕ: Частое использование метода может привести к увеличению исходящего интернет-трафика и энергопотребления.***
 */
const sendEventsBuffer = () => {
  AppMetrica.sendEventsBuffer();
};

/**
 * Отправка собственного события
 * @param name Имя события
 * @param attributes вложенные параметры в виде пар "ключ-значение"
 */
const reportEvent = (name: string, attributes?: Record<string, unknown>) => {
  AppMetrica.reportEvent(name, attributes);
};

/**
 * Отправка сообщения об ошибке
 * @param error Экземпляр ошибки. Поле message будет использовано как ключ в отчёте об ошибках.
 */
const reportError = (error: Error) => {
  AppMetrica.reportError(error.message, error.stack);
};

const pauseSession = () => {
  AppMetrica.pauseSession();
};

const resumeSession = () => {
  AppMetrica.resumeSession();
};

const reportAppOpen = (deeplink: string) => {
  AppMetrica.reportAppOpen(deeplink);
};

/**
 * Установить собственный userID для пользователя. Максимум 200 символов.
 */
const setUserProfileID = (userID: string) => {
  AppMetrica.setUserProfileID(userID);
};

const reportUserProfile = (
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

const setStatisticsSending = (enabled: boolean) => {
  AppMetrica.setStatisticsSending(enabled);
};

const setLocationTracking = (enabled: boolean) => {
  AppMetrica.setLocationTracking(enabled);
};

/**
 * Спровоцировать критическую ошибку, вызывающую падение приложения.
 *
 * ***Правильно работает только на iOS. На Android выбрасывается обычная ошибка JS.***
 */
const criticalError = () => {
  if (Platform.OS === 'android') {
    throw new Error('Not implemented for android');
  } else if (Platform.OS === 'ios') {
    TestError.criticalError();
  }
};

export default {
  activate,
  sendEventsBuffer,
  reportEvent,
  reportError,
  pauseSession,
  resumeSession,
  reportAppOpen,
  setUserProfileID,
  reportUserProfile,
  setStatisticsSending,
  setLocationTracking,

  criticalError,
};
