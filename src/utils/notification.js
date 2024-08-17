import { Notifier, NotifierComponents } from "react-native-notifier";
import { Easing } from "react-native-reanimated";
import { StatusBar } from "react-native";


export const NotificationColors = {
  error: '#E03737',
  warn: '#FFAC00',
  info: '#007BFF',
  success: '#00B104',
};

export function SuccessNotification(title, description) {
  Notifier.showNotification({
    title: title,
    description: description,
    Component: NotifierComponents.Notification,
    componentProps: {
      titleStyle: {
        color: NotificationColors.success,
      },
      containerStyle: {
        borderRadius: 20,
        padding: 10,
      },
    },
  });
}

export function ErrorNotification(title, description) {
  Notifier.showNotification({
    title: title,
    description: description,
    Component: NotifierComponents.Notification,
    componentProps: {
      titleStyle: {
        color: NotificationColors.error,
      },
      containerStyle: {
        borderRadius: 20,
        padding: 10,
      },
    },
  });
}

export function WarnNotification(title, description, duration = 2000) {
  Notifier.showNotification({
    title: title,
    description: description,
    duration: duration,
    Component: NotifierComponents.Notification,
    componentProps: {
      titleStyle: {
        color: NotificationColors.warn,
      },
      containerStyle: {
        borderRadius: 20,
        padding: 10,
      },
    },
  });
}

export function SuccessAlert(title, description) {
  Notifier.showNotification({
    title: title,
    description: description,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: 'success',
    },
  });
}

export function WarnAlert(title, description) {
  Notifier.showNotification({
    title: title,
    description: description,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: 'warn',
    },
  });
}

export function ErrorAlert(title, description) {
  // StatusBar.setBackgroundColor(NotificationColors.error);
  // StatusBar.setBarStyle('light-content');

  Notifier.showNotification({
    title: title,
    description: description,
    Component: NotifierComponents.Alert,
    componentProps: {
      alertType: 'error',
    },
    // onHidden: () => {
    //   setTimeout(() => {
    //     StatusBar.setBackgroundColor('#FFFFFF');
    //     StatusBar.setBarStyle('dark-content');
    //   }, 300);
    // },
  });
}
