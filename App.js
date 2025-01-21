import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from './src/navigator/MainNavigator';
import Toast from "react-native-toast-message";
import store from './src/redux/store';
import {
  requestUserPermission,
  getFCMToken,
  setupNotifications,
  testLocalNotification,
  initializeNotificationChannels
} from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    const initNotifications = async () => {
      await requestUserPermission();
      await getFCMToken();
      await initializeNotificationChannels();
      const unsubscribe = setupNotifications();
      return unsubscribe;
    };

    const unsubscribe = initNotifications();
    testLocalNotification(); // This will now handle both displaying and storing the notification

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
      <Toast />
    </Provider>
  );
}
