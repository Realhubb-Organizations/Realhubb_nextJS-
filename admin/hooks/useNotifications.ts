import { useCallback } from 'react';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

export function useNotifications() {
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return Notification.permission;
    }

    const permission = await Notification.requestPermission();
    return permission;
  }, []);

  const sendNotification = useCallback(async (options: NotificationOptions) => {
    const permission = await requestPermission();

    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        if (registration.showNotification) {
          await registration.showNotification(options.title, {
            body: options.body,
            icon: options.icon,
            badge: options.badge,
            tag: options.tag,
            requireInteraction: options.requireInteraction ?? false,
          });
        }
      } else {
        new Notification(options.title, {
          body: options.body,
          icon: options.icon,
        });
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [requestPermission]);

  return {
    requestPermission,
    sendNotification,
    isSupported: 'Notification' in window,
  };
}
