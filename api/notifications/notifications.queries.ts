import { useQuery } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import {
  NotificationsListResponse,
  UnreadCountResponse,
} from "./notifications.model";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (page: number, limit: number) =>
    [...notificationKeys.all, "list", page, limit] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

const getNotifications = async (
  page: number = 1,
  limit: number = 15,
): Promise<NotificationsListResponse> => {
  const response = await apiHttp.get<NotificationsListResponse>(
    `/notifications?page=${page}&limit=${limit}`,
  );
  return response.data;
};

const getUnreadNotificationCount = async (): Promise<UnreadCountResponse> => {
  const response = await apiHttp.get<UnreadCountResponse>(
    "/notifications/unread-count",
  );
  return response.data;
};

export const useGetNotifications = (
  page: number = 1,
  limit: number = 15,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: notificationKeys.list(page, limit),
    queryFn: () => getNotifications(page, limit),
    enabled: options?.enabled ?? true,
  });

export const useGetUnreadNotificationCount = (options?: {
  enabled?: boolean;
  refetchInterval?: number;
}) =>
  useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval ?? 60_000,
  });
