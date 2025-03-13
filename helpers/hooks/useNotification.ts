import { useState, useCallback, useEffect } from 'react';
import logoUrl from 'assets/icons/logo.svg';

interface NotificationState {
  permission: NotificationPermission;
  supported: boolean;
  requested: boolean;
  showModal: boolean;
  isEnabled: boolean; // New state to track our custom enabled/disabled state
}

const NOTIFICATION_PREFERENCE_KEY = 'notification-preference';
const NOTIFICATION_ENABLED_KEY = 'notification-enabled';

export const useNotification = () => {
  const [notificationState, setNotificationState] = useState<NotificationState>({
    permission: 'default',
    supported: false,
    requested: false,
    showModal: false,
    isEnabled: localStorage.getItem(NOTIFICATION_ENABLED_KEY) !== 'false', // Default to true unless explicitly set to false
  });

  // Check if notifications are supported
  useEffect(() => {
    const isNotificationSupported = 'Notification' in window;
    setNotificationState((prev) => ({
      ...prev,
      supported: isNotificationSupported,
      permission: isNotificationSupported ? Notification.permission : 'denied',
    }));
  }, []);

  const showWelcomeNotification = useCallback(() => {
    if (Notification.permission === 'granted' && notificationState.isEnabled) {
      new Notification('Notifications Enabled!', {
        body: "You'll now receive notifications for new messages.",
        icon: logoUrl,
      });
    }
  }, [notificationState.isEnabled]);

  const requestPermission = useCallback(async () => {
    if (!notificationState.supported) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationState((prev) => ({
        ...prev,
        permission,
        requested: true,
        showModal: false,
        isEnabled: true,
      }));

      localStorage.setItem(NOTIFICATION_ENABLED_KEY, 'true');

      if (permission === 'granted') {
        showWelcomeNotification();
      }

      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [notificationState.supported, showWelcomeNotification]);

  const toggleNotifications = useCallback(() => {
    const newEnabledState = !notificationState.isEnabled;
    setNotificationState((prev) => ({
      ...prev,
      isEnabled: newEnabledState,
    }));
    localStorage.setItem(NOTIFICATION_ENABLED_KEY, newEnabledState.toString());
  }, [notificationState.isEnabled]);

  // Function to actually send a notification
  const sendNotification = useCallback(
    (title: string, body: string) => {
      if (
        notificationState.supported &&
        notificationState.permission === 'granted' &&
        notificationState.isEnabled // Only send if our custom enabled state is true
      ) {
        new Notification(title, {
          body,
          icon: logoUrl,
        });
      }
    },
    [notificationState.supported, notificationState.permission, notificationState.isEnabled]
  );

  const checkAndRequestPermission = useCallback(() => {
    if (!notificationState.supported) return;

    if (Notification.permission === 'default' && !notificationState.requested) {
      setNotificationState((prev) => ({ ...prev, showModal: true }));
    }
  }, [notificationState.supported, notificationState.requested]);

  const handleModalClose = useCallback(() => {
    setNotificationState((prev) => ({ ...prev, showModal: false }));
  }, []);

  // Initialize notification check when hook is mounted
  useEffect(() => {
    checkAndRequestPermission();
  }, [checkAndRequestPermission]);

  return {
    isSupported: notificationState.supported,
    permission: notificationState.permission,
    showModal: notificationState.showModal,
    isEnabled: notificationState.isEnabled,
    requestPermission,
    handleModalClose,
    toggleNotifications,
    sendNotification,
  };
};
