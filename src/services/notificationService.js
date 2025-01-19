import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidStyle,
  AndroidImportance,
  AndroidVisibility,
  AndroidNotificationPriority
} from '@notifee/react-native';
import {Platform} from "react-native";
import {Color} from "../constants/Color";

export const requestUserPermission = async () => {
  // Permission Firebase
  const authStatus = await messaging().requestPermission();

  // Permission Notifee pour Android 13+ (API level 33)
  if (Platform.OS === 'android') {
    await notifee.requestPermission();
  }

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
  return enabled;
};

export const getFCMToken = async () => {
  const token = await messaging().getToken();
  console.log("FCM Token : ", token);
  return token;
};

export const createNotificationChannel = async () => {
  return await notifee.createChannel({
    id: 'jobfinder',
    name: 'JobFinder Notifications',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
};

export const displayNotification = async (remoteMessage) => {
  try {
    console.log('Trying to display notification');
    const channelId = await createNotificationChannel();

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data,
      android: {
        channelId,
        color: Color.primary,
        smallIcon: 'ic_launcher',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        style: {
          type: AndroidStyle.INBOX,
        },
        priority: AndroidNotificationPriority.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        pressAction: {
          id: 'default',
        },
      },
    });
    console.log('Notification displayed successfully');
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
};

export const setupNotifications = () => {
  // Handle FCM messages when app is in foreground
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log(remoteMessage);
    await displayNotification(remoteMessage);
  });

  // Handle background messages
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    await displayNotification(remoteMessage);
  });

  // Handle notification events
  notifee.onForegroundEvent(({ type, detail }) => {
    console.log('Notification Event Type:', type);
    console.log('Notification Detail:', detail);
  });

  return unsubscribe;
};

export async function testLocalNotification() {
  try {
    const channelId = await notifee.createChannel({
      id: 'test',
      name: 'Test Channel',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: 'Test Notification',
      body: 'This is a test notification',
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
      },
    });
  } catch (error) {
    console.error('Test notification error:', error);
  }
}
