# react-native-ya-appmetrica

Обертка библиотеки [AppMetrica](https://appmetrica.yandex.com/ru/about) для iOS и Android.
За основу взята [официальная библиотека](https://github.com/yandexmobile/react-native-appmetrica) от Яндекс. Переписана на Kotlin и Swift.

> [!WARNING]
> Бибилиотека находится в разработке.
> До появления версии 1.0.0 работа может быть нестабильной.
> Так же, могут отсутствовать некоторые методы, предоставляемые нативными библиотеками.

## Установка

```sh
npm install react-native-ya-appmetrica
```

### iOS

```bash
npx pod-install
```

## Использование

Минимальный пример использования библиотеки смотри в [example](https://github.com/LegoGAME/react-native-ya-appmetrica/tree/main/example).

```ts
import AppMetrica from 'react-native-ya-appmetrica';
```

### Инициализация

Выполнить инициализацию библиотеки в App.tsx или index.js. Некоторые параметры уникальны для платформы. Если они не могут быть использованы, то будут проигнорированы.

| Параметр | Описание | По умолчанию | iOS | Android |
|---|---|---|---|---|
| apiKey | API-ключ AppMetrica. | undefined | ✅ | ✅ |
| userProfileID | ID профиля пользователя. Максимум 200 символов. | undefined | ✅ | ✅ |
| appVersion | Версия приложения, отображаемая в метрике. Если не указано, будет отправляться информация из info.plist и AndroidManifest.xml. | undefined | ✅ | ✅ |
| logs | Включить / выключить логирование. Записи отображаются только в терминале Xcode и Android studio. | true | ✅ | ✅ |
| sessionTimeout | Длительность сессии в секундах. Минимальное значение - 10. | 10 | ✅ | ✅ |
| crashReporting | Отслеживание аварийных остановок приложения. | true | ✅ | ✅ |
| nativeCrashReporting | Отслеживание нативных аварийных остановок приложения. | true | 🚫 | ✅ |
| appOpenTrackingEnabled | Отслеживание открытий приложения через deeplink. Не влияет переход по deeplink при уже открытом приложении. | true | ✅ | ✅ |
| handleActivationAsSessionStart | Определяет инициализацию AppMetrica как начало пользовательской сессии. | false | ✅ | 🚫 |
| firstActivationAsUpdate | Указывает, следует ли считать первую активацию AppMetrica обновлением приложения или установкой нового приложения. true - первый запуск как обновление. false - первый запуск как установка. | false | ✅ | ✅ |
| maxReportsInDatabaseCount | Максимальное число отчетов об ошибках, которое хранится во внутренней БД. | 1000 | ✅ | ✅ |
| maxReportsCount | Максимальный размер буфера для отчетов. | 7 | 🚫 | ✅ |
| statisticsSending | Разрешить отправку статистики. | true | ✅ | ✅ |
| locationTracking | Включает/отключает отправку информации о местоположении устройства. | true | ✅ | ✅ |

```ts
AppMetrica.activate({apiKey: 'API_KEY'});
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
