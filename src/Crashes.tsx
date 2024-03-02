import { NativeModules, Platform } from 'react-native';
import { LINKING_ERROR } from './constants';
import type { NativeImplCrashes } from './types/_native';
import type { CrashesConfiguration } from './types';

const AppMetricaCrashes: NativeImplCrashes = NativeModules.AppMetricaCrashes;

if (!AppMetricaCrashes) {
  throw new Error(LINKING_ERROR);
}

/**
 * Настройка стратегии отправки крэшей для iOS. Вызов функции не имеет эффекта на Android.
 */
export const configureCrashes = (config: CrashesConfiguration): void => {
  if (Platform.OS === 'ios') {
    AppMetricaCrashes.configureCrashes(config);
  }
};

/**
 * Отправка сообщения об ошибке
 * @param error Экземпляр ошибки. Поле message будет использовано как ключ в отчёте об ошибках.
 */
export const reportError = (error: Error) => {
  AppMetricaCrashes.reportError(error.message, error.stack);
};

/**
 * Спровоцировать критическую ошибку, вызывающую падение приложения.
 *
 * ***Правильно работает только на iOS. На Android выбрасывается обычная ошибка JS.***
 */
export const criticalError = () => {
  if (Platform.OS === 'android') {
    throw new Error('Not implemented for android');
  } else if (Platform.OS === 'ios') {
    AppMetricaCrashes.criticalError();
  }
};
