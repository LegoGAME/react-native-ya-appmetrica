export type CrashesConfiguration = {
  /** Если этот параметр включен, крэши будут автоматически отправляться в AppMetrca */
  autoCrashTracking?: boolean;
  /** Используйте этот параметр для включения или отключения отслеживания неявных сбоев, например, OOM крэшей */
  probablyUnhandledCrashReporting?: boolean;
  /** Эта настройка позволяет указать массив номеров UNIX-сигналов из sys/signal.h, которые будут проигнорированы системой отслеживания сбоев */
  ignoredCrashSignals?: number[];
  /** Эта настройка включает обнаружение ситуации, когда основной поток приложения перестает отвечать (ANR) */
  applicationNotRespondingDetection?: boolean;
  /** Устанавливает интервал времени, который будет ожидать watchdog, прежде чем сообщить о состоянии "Приложение не отвечает" (ANR) */
  applicationNotRespondingWatchdogInterval?: number;
  /** Устанавливает частоту, с которой watchdog будет проверять состояние "Приложение не отвечает" (ANR) */
  applicationNotRespondingPingInterval?: number;
};
