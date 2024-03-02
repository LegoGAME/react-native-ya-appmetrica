import * as React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as AppMetrica from 'react-native-ya-appmetrica';

AppMetrica.activate({
  apiKey: 'API_KEY',
  logs: true,
  appBuildNumber: 10,
  appVersion: '2.0.0',
  sessionTimeout: 120,
  location: {
    latitude: 43.1056,
    longitude: 131.874,
  },
});

AppMetrica.configureCrashes({
  autoCrashTracking: true,
  applicationNotRespondingDetection: true,
  applicationNotRespondingPingInterval: 0.1,
});

const MyButton = ({ text, onPress }: { text: string; onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        try {
          onPress();
        } catch (error) {
          if (error instanceof Error) {
            console.log(error.message);
            AppMetrica.reportError(error);
          }
        }
      }}
      style={styles.button}
    >
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AppMetrica</Text>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MyButton
          text="sendEventsBuffer"
          onPress={AppMetrica.sendEventsBuffer}
        />
        <MyButton text="Critical error" onPress={AppMetrica.criticalError} />
        {/* @ts-ignore undefined для тестирования отправки ошибки*/}
        <MyButton text="onPress is undefined" onPress={undefined} />
        <MyButton
          text="ReportCustomError"
          onPress={() => AppMetrica.reportError(new Error('this is joke'))}
        />
        <MyButton
          text="sendEvent"
          onPress={() => AppMetrica.reportEvent('testEvent', { test: 'test' })}
        />
        <MyButton
          text="sendEventWithDeepAttrs"
          onPress={() =>
            AppMetrica.reportEvent('SomeEventWithAttrs', {
              attrOne: 'one',
              arrtTwo: { aram: 'zamzam' },
            })
          }
        />
        <MyButton
          text="reportUserProfile"
          onPress={() => {
            AppMetrica.reportUserProfile({
              userProfileID: 'qwerty123',
              name: 'Иван Иванов',
              gender: 'male',
              birthDate: new Date(1992, 6, 13),
              notificationsEnabled: true,
              customAttributes: {
                is_premium: { type: 'boolean', value: true },
                login_count: { type: 'counter', value: 4 },
                price: { type: 'number', value: 554.343 },
                car: { type: 'string', value: 'Lada Vesta' },
              },
            });
          }}
        />
        <MyButton
          text="setStatisticsSending"
          onPress={() => AppMetrica.setStatisticsSending(true)}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginTop: 60,
    marginBottom: 15,
  },
  scrollContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#FF0060',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 7,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
  },
});
