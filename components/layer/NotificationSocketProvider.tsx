"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type {
  Notification,
  NotificationsListResponse,
  UnreadCountResponse,
} from "@/api/notifications/notifications.model";
import { notificationKeys } from "@/api/notifications/notifications.queries";
import { connectChatSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { showToast } from "@/utils/toasts";
import { useThemeStore } from "@/store/useThemeStore";

type NotificationEvent = {
  notification: Notification;
};

const upsertNotification = (
  old: NotificationsListResponse | undefined,
  notification: Notification,
): NotificationsListResponse | undefined => {
  if (!old) return old;
  if (old.notifications.some((existing) => existing._id === notification._id)) {
    return old;
  }

  return {
    ...old,
    notifications: [notification, ...old.notifications],
    unreadNotificationCount: old.unreadNotificationCount + 1,
    pagination: {
      ...old.pagination,
      totalNotifications: old.pagination.totalNotifications + 1,
    },
  };
};

const subscribeAuthHydration = (onStoreChange: () => void) =>
  useAuthStore.persist.onFinishHydration(onStoreChange);

const NotificationSocketProvider = () => {
  const queryClient = useQueryClient();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasHydrated = useSyncExternalStore(
    subscribeAuthHydration,
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  useEffect(() => {
    if (!hasHydrated) return;
    // ChatSocketProvider owns connect/disconnect; only listen while authed.
    if (!isAuthenticated || !token) return;

    const socket = connectChatSocket();

    const onNewNotification = ({ notification }: NotificationEvent) => {
      if (!notification?._id) return;

      queryClient.setQueriesData<NotificationsListResponse>(
        { queryKey: [...notificationKeys.all, "list"] },
        (old) => upsertNotification(old, notification),
      );

      queryClient.setQueryData<UnreadCountResponse>(
        notificationKeys.unreadCount(),
        (old) =>
          old
            ? {
                unreadNotificationCount: old.unreadNotificationCount + 1,
              }
            : old,
      );

      void queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });

      showToast.info(notification.title, {
        description: notification.body,
        duration: 4000,
        position: "top-right",
        style: {
          borderRadius: 0,
          marginTop: "5rem",
          zIndex: 9999,
          backgroundColor: isDark ? "#80808026" : "white",
          color: !isDark ? "black" : "white",
        },
      });
    };

    socket.on("notification:new", onNewNotification);

    return () => {
      socket.off("notification:new", onNewNotification);
    };
  }, [hasHydrated, isAuthenticated, token, queryClient]);

  return null;
};

export default NotificationSocketProvider;
