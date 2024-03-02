# react-native-ya-appmetrica

Обёртка библиотеки [AppMetrica](https://appmetrica.yandex.com/ru/about) для iOS и Android.
За основу взята [официальная библиотека](https://github.com/yandexmobile/react-native-appmetrica) от Яндекс. Переписана на Kotlin и Swift.

Версии нативных библиотек:

iOS 5.0.0

Android 6.2.1 [maven](https://mvnrepository.com/artifact/io.appmetrica.analytics/analytics)

> [!WARNING]
> Бибилиотека находится в разработке.
> До появления версии 1.0.0 работа может быть нестабильной.
> Могут отсутствовать некоторые методы, предоставляемые нативными библиотеками.
> До версии 1.0.0 любое минорное обновление может внести обратно-несовместимые изменения. В связи с этим, лучше зафиксировать точную версию в package.json. Для обновления следуйте руководству по миграции.

## История изменений

### 0.2.0 01.03.2024

- Обновление библиотеки для iOS до версии 5.0.0.
- `AppMetricaConfig.statisticsSending` помечен как `deprecated`. Будет удалён в версии 1.0.0.
- В `AppMetricaConfig` добавлено большинство полей, существующих в нативных библиотеках. Не добавлены для Android `additionalConfig`, `appEnvironment`, `crashTransformer`, `errorEnvironment`.


## Установка

```sh
npm install react-native-ya-appmetrica
```

### iOS

```bash
npx pod-install
```

## Миграция

### 0.1.0 -> 0.2.0

Изменить импорт библиотеки

```ts
// Старый вариант
import AppMetrica from 'react-native-ya-appmetrica';
// Новый вариант
import * as AppMetrica from 'react-native-ya-appmetrica';
```

В функции активации AppMetrica заменить имя поля `statisticsSending` на `dataSendingEnabled`.

```ts
AppMetrica.activate({
  ...,
  dataSendingEnabled: true,
  ...,
});
```

...

## Использование

Минимальный пример использования библиотеки смотрите в [example](https://github.com/LegoGAME/react-native-ya-appmetrica/tree/main/example).

```ts
import * as AppMetrica from 'react-native-ya-appmetrica';
```

### Инициализация

Выполнить инициализацию библиотеки в App.tsx или index.js. Некоторые параметры уникальны для платформы. Если они не могут быть использованы, то будут проигнорированы.

```ts
AppMetrica.activate({apiKey: 'API_KEY'});
```

| Параметр | Описание | По умолчанию | iOS | Android |
|---|---|---|---|---|
| apiKey | API-ключ AppMetrica. | undefined | ✅ | ✅ |
| appBuildNumber | Номер сборки. | undefined | ✅ | ✅ |
| appOpenTrackingEnabled | Отслеживание открытий приложения через deeplink. Не влияет переход по deeplink при уже открытом приложении. | true | ✅ | ✅ |
| appVersion | Версия приложения, отображаемая в метрике. Если не указано, будет отправляться информация из info.plist и AndroidManifest.xml. | undefined | ✅ | ✅ |
| customHosts | URL-адреса прокси-серверов для AppMetrica, которые будут использоваться для startup запросов. | undefined | ✅ | ✅ |
| ~~statisticsSending~~ | Разрешить отправку статистики. | true | ✅ | ✅ |
| dataSendingEnabled | Разрешить отправку статистики. | true | ✅ | ✅ |
| locationTracking | Включает/отключает отправку информации о местоположении устройства. | true | ✅ | ✅ |
| maxReportsCount | Максимальный размер буфера для отчетов. | 7 | 🚫 | ✅ |
| maxReportsInDatabaseCount | Максимальное число отчетов об ошибках, которое хранится во внутренней БД. | 1000 | ✅ | ✅ |
| preloadInfo | Информация для отслеживания предустановленных приложений. | undefined | ✅ | ✅ |
| revenueAutoTrackingEnabled | Включает/выключает автоматический сбор информации об In-App покупках. | true | ✅ | ✅ |
| sessionTimeout | Длительность сессии в секундах. Минимальное значение - 10. | 10 | ✅ | ✅ |
| userProfileID | ID профиля пользователя. Максимум 200 символов. | undefined | ✅ | ✅ |
| location | На iOS передается в аргумент `customLocation`. Устанавливает собственную информацию о местоположении устройства. | undefined | ✅ | ✅ |
| logs | На iOS передается в аргумент `areLogsEnabled`. Включить / выключить логирование. Записи отображаются только в терминале Xcode и Android studio. | true | ✅ | ✅ |
| dispatchPeriodSeconds | На iOS передается в аргумент `dispatchPeriod`. Установите пользовательский период отправки. Интервал в секундах между отправкой событий на сервер. | 90 | ✅ | ✅ |
| sessionsAutoTrackingEnabled | На iOS передается в аргумент `sessionsAutoTracking`. Включает/отключает автоматическое отслеживание жизненного цикла приложений. | true | ✅ | ✅ |
| firstActivationAsUpdate | На iOS передается в аргумент `handleFirstActivationAsUpdate`. Указывает, следует ли считать первую активацию AppMetrica обновлением приложения или установкой нового приложения. true - первый запуск как обновление. false - первый запуск как установка. | false | ✅ | ✅ |
| accurateLocationTracking | Включить/отключить точный поиск местоположения для внутреннего менеджера местоположений. | false | ✅ | 🚫 |
| allowsBackgroundLocationUpdates | Включить/отключить отслеживание фоновых обновлений местоположения. | false | ✅ | 🚫 |
| handleActivationAsSessionStart | Определяет инициализацию AppMetrica как начало пользовательской сессии. | false | ✅ | 🚫 |
| crashReporting | Отслеживание аварийных остановок приложения. | true | 🚫 | ✅ |
| anrMonitoring | Указывает, включен ли мониторинг ANR. | false | 🚫 | ✅ |
| anrMonitoringTimeout | Таймаут в секундах, по истечении которого фиксируется факт ANR. | 5 | 🚫 | ✅ |
| deviceType | Тип устройства в зависимости от размера экрана: phone, tablet, phablet, TV. | undefined | 🚫 | ✅ |
| nativeCrashReporting | Отслеживание нативных аварийных остановок приложения. | true | 🚫 | ✅ |


На Android отслеживание крэшей настраивается через параметры при активации библиотеки. Для настройки на iOS необходимо вызвать функцию `configureCrashes`. Данная функция выполняется только на iOS. При запуске приложения на Android она игнорируется. [Документация.](https://appmetrica.yandex.ru/docs/ru/sdk/ios/analytics/migration-io-5-0-0#crash)

```ts
AppMetrica.configureCrashes({
  autoCrashTracking: true,
  applicationNotRespondingDetection: true,
  applicationNotRespondingPingInterval: 0.1,
  // ...,
});
```

### Методы

Отправка своего события

```ts
AppMetrica.reportEvent('SomeEvent');
AppMetrica.reportEvent('SomeEventWithAttrs', {attrOne: 'one', arrtTwo: {aram: 'zamzam'}});
```

Отправка информации об ошибке

```ts
try {
  // что-то, что бросает исключение
}
catch (error) {
  if (error instanceof Error) {
    AppMetrica.reportError(error);
  }
}
```

Немедленно отправить все накопленные события в AppMetrica.

```ts
AppMetrica.sendEventsBuffer();
```

Приостановить и продолжить сессию.

```ts
AppMetrica.pauseSession();
AppMetrica.resumeSession();
```

Отправить информацию об открытии приложения через deeplink. **Не обрабатывается автоматически.** Необходимо вызывать самостоятельно в методе-обраотчике открытия приложения.

```ts
AppMetrica.reportAppOpen("myapp://some/deep/link");
```

Установить собственный id пользователя в AppMetrica. Максимум 200 символов. Id следует указывать во время инициализации библиотеки, если это возможно. Если для текушего устройства уже создан профиль пользователя, то при установке нового Id, будет создан новый профиль. appmetrica_device_id у таких профилей будет одинаковым.

```ts
AppMetrica.setUserProfileID("myOwnUserId");
```

Отправить расширенную информацию о профиле пользователя.
Все поля опциональные.

Поле `customAttributes` заполняется объектом, где:
- ключ - наименование кастомного поля в профиле пользователя
- поле `type` в значениии - тип кастомного атрибута. Может быть `boolean, number, counter, string`. Соответствие значений указанному типу необходимо контролировать самостоятельно. Для сброса значения **(!!!кроме `counter`!!!)**, следует передать `undefined`. Поле `counter` сбрасывается передачей `0` в поле `value`.

```ts
AppMetrica.reportUserProfile({
  userProfileID: 'qwerty',
  name: 'Иван Иванов',
  gender: 'male',
  birthDate: new Date(1992, 6, 13),
  notificationsEnabled: true,
  customAttributes: {
    is_premium: { type: 'boolean', value: true },
    login_count: { type: 'counter', value: 4 },
    last_payment: { type: 'number', value: 554.343 },
    car: { type: 'string', value: 'Lada Vesta' },
  },
});
```

Переключить отправку статистики в AppMetrica.

```ts
AppMetrica.setStatisticsSending(true);
```

Переключить отслеживание местоположения. При выключенном местоположении, оно будет определяться на основании ip-адреса.

```ts
AppMetrica.setLocationTracking(true);
```

Вызвать ошибку для тестирования отчёта о крэшах.
На iOS приложение вылетит.
На Android будет выброшено обычное исключение JS.

```ts
AppMetrica.criticalError();
```

<!-- ## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow. -->

## TODO
- [ ] описать все существующие параметры инициализации библиотеки
- [ ] настройка крэш-плагина для работы nativeCrashReporting в Android
- [ ] добавить PUSH SDK

## License

MIT

---

Создано с помощью [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
