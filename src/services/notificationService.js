import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidStyle,
  AndroidImportance, AndroidVisibility,
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

export const initializeNotificationChannels = async () => {
  try {
    await notifee.createChannel({
      id: 'jobfinder',
      name: 'JobFinder Notifications',
      importance: AndroidImportance.HIGH,
      lightColor: Color.secondary,
      sound: 'default',
    });
    console.log('Notification channel created');
  } catch (error) {
    console.error('Error creating notification channel:', error);
  }
};


export const getFCMToken = async () => {
  const token = await messaging().getToken();
  console.log("FCM Token : ", token);
  return token;
};

export const displayNotification = async (remoteMessage) => {
  try {
    console.log('Trying to display notification');

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      android: {
        channelId: 'jobfinder',
        importance: AndroidImportance.HIGH,
        color : '#1000ff',
        style: {
          type: AndroidStyle.BIGTEXT,
          text: remoteMessage.notification?.body
        },
      },
    });

    /*await notifee.displayNotification({
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
          type: AndroidStyle.BIGTEXT,
        },
        priority: 'high',
        visibility: AndroidVisibility.PUBLIC,
        pressAction: {
          id: 'default',
        },
      },
    });*/
    console.log('Notification displayed successfully');
  } catch (error) {
    console.warn('Error displaying notification:', error);
  }
};

export const setupNotifications = () => {
  // Handle FCM messages when app is in foreground
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage);
    await displayNotification(remoteMessage);  // Display notification in foreground
  });

  // Handle background messages
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message received:', remoteMessage);
    // No need to call displayNotification here as the system will automatically
    // create the notification in the background
    return Promise.resolve();
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
      lightColor : Color.secondary
    });

    await notifee.displayNotification({
      title: 'Test Notification',
      body: 'This is a test notification',
      android: {
        channelId,
        color : Color.secondary,
        style: { type: AndroidStyle.BIGTEXT, text: 'Large volume of text shown in the expanded stateLarge volume of text shown in the expanded stateLarge volume of text shown in the expanded stateLarge volume of text shown in the expanded state' },
      },
    });
  } catch (error) {
    console.error('Test notification error:', error);
  }
}
