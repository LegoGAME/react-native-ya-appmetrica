import { useEffect, useState } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import * as AppMetrica from 'react-native-ya-appmetrica';
import type { SystemInfo } from '../../src/types';
import MyButton from './components/MyButton';
import InfoArg from './components/InfoArg';

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

export default function App() {
  const [info, setInfo] = useState<SystemInfo>();

  useEffect(() => {
    AppMetrica.getSystemInfo((v) => {
      setInfo(v);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.info}>
        <InfoArg title="Device id" text={info?.appmetrica_device_id} />
        <InfoArg title="Library version" text={info?.library_version} />
        <InfoArg title="UUID" text={info?.uuid} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <MyButton
          text="sendEventsBuffer"
          description="Send all cached events to AppMetrica"
          onPress={AppMetrica.sendEventsBuffer}
        />
        <MyButton
          text="Critical error"
          description="Raise a test critical application error"
          onPress={AppMetrica.criticalError}
        />
        <MyButton
          text="ReportError"
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
              userProfileID: `user ${Platform.OS}`,
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
        <MyButton
          text="reportRevenue"
          onPress={() =>
            AppMetrica.reportRevenue({
              price: 99.99,
              currency: 'RUB',
              payload: { OrderID: `${Platform.OS} users`, other: 'test' },
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    marginVertical: 10,
    marginHorizontal: 15,
    gap: 5,
    borderWidth: 1,
    borderColor: '#757474',
    padding: 10,
    borderRadius: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
    marginTop: 10,
    gap: 10,
    marginHorizontal: 15,
  },
});
