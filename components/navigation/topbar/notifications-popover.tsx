"use client";

import * as React from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  useGetNotifications,
  useGetUnreadNotificationCount,
} from "@/api/notifications/notifications.queries";
import { useMarkNotificationAsRead } from "@/api/notifications/notifications.mutations";
import type { Notification } from "@/api/notifications/notifications.model";
import { formatTimeAgo } from "@/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";

export type NotificationItem = {
  id: string;
  userName: string;
  avatarUrl?: string;
  message: string;
  time: string;
  isRead: boolean;
  actionLabel?: string;
  href?: string;
  conversationId?: string;
};

type NotificationsPopoverProps = {
  onSeeAll?: () => void;
};

const getActorDisplay = (notification: Notification) => {
  const actor = notification.actorId;

  if (typeof actor === "object" && actor?.userProfile) {
    const { firstname, lastname, profilePicture } = actor.userProfile;
    return {
      userName: `${firstname} ${lastname}`.trim() || "Someone",
      avatarUrl: profilePicture?.url,
    };
  }

  return {
    userName: notification.title || "Kollabs",
    avatarUrl: undefined,
  };
};

const getNotificationDeepLink = (
  notification: Notification,
): Pick<NotificationItem, "actionLabel" | "href" | "conversationId"> => {
  const { type, meta } = notification;
  const projectId = meta?.projectId;
  const conversationId = meta?.conversationId;

  if (type === "new_message" && conversationId) {
    return {
      actionLabel: "Open chat",
      href: "/dashboard/messages",
      conversationId,
    };
  }

  if (type === "collaboration_started") {
    if (projectId) {
      return {
        actionLabel: "Open project",
        href: `/dashboard/projects/ongoing/${projectId}`,
      };
    }
    if (conversationId) {
      return {
        actionLabel: "Open chat",
        href: "/dashboard/messages",
        conversationId,
      };
    }
  }

  if (
    (type === "collab_request_received" ||
      type === "collab_request_accepted" ||
      type === "collab_request_rejected" ||
      type.startsWith("project_")) &&
    projectId
  ) {
    return {
      actionLabel: "View",
      href: `/dashboard/projects/ongoing/${projectId}`,
    };
  }

  if (projectId) {
    return {
      actionLabel: "View",
      href: `/dashboard/projects/ongoing/${projectId}`,
    };
  }

  if (conversationId) {
    return {
      actionLabel: "Open chat",
      href: "/dashboard/messages",
      conversationId,
    };
  }

  return {};
};

const mapNotificationToItem = (
  notification: Notification,
): NotificationItem => {
  const { userName, avatarUrl } = getActorDisplay(notification);
  const deepLink = getNotificationDeepLink(notification);

  return {
    id: notification._id,
    userName,
    avatarUrl,
    message: notification.body || notification.title,
    time: formatTimeAgo(notification.createdAt),
    isRead: notification.isRead,
    ...deepLink,
  };
};

const NotificationsPopover = ({ onSeeAll }: NotificationsPopoverProps) => {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setCurrentConversation = useChatStore(
    (state) => state.setCurrentConversation,
  );
  const [hasHydrated, setHasHydrated] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setHasHydrated(useAuthStore.persist.hasHydrated());
    return useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
  }, []);

  const canFetch = hasHydrated && (isAuthenticated || !!token);

  const { data: unreadData } = useGetUnreadNotificationCount({
    enabled: canFetch,
    refetchInterval: 30_000,
  });

  const { data, isLoading, isError } = useGetNotifications(1, 15, {
    enabled: canFetch && open,
  });

  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const unreadCount =
    unreadData?.unreadNotificationCount ?? data?.unreadNotificationCount ?? 0;
  const notifications = (data?.notifications ?? []).map(mapNotificationToItem);

  const handleAction = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }

    if (!item.href) return;

    if (item.conversationId) {
      setCurrentConversation(item.conversationId);
    }

    setOpen(false);
    router.push(item.href);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#7B3FE4] px-1 font-sora text-[0.625rem] font-semibold leading-none text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-122 max-w-[calc(100vw-2rem)] rounded-tl-[1.875rem] rounded-bl-[1.875rem] rounded-br-[1.875rem] rounded-tr-none border border-[#e9e9e9e9] bg-white p-0 shadow-lg dark:border-[#80808026] dark:bg-[#111111]"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <p className="font-sora text-[1.25rem] font-semibold leading-7 text-brand-black dark:text-white">
            Notifications
          </p>
          <button
            type="button"
            onClick={onSeeAll}
            className="font-sora text-base font-normal leading-[1.62] text-brand-black transition-opacity hover:opacity-70 dark:text-white"
          >
            See all
          </button>
        </div>

        <div className="h-px w-full bg-[#e9e9e9] dark:bg-[#80808026]" />

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
              <p className="font-sora text-sm font-light text-brand-grey">
                Loading notifications...
              </p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
              <p className="font-sora text-sm font-light text-brand-grey">
                Couldn&apos;t load notifications.
              </p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
              <p className="font-sora text-sm font-light text-brand-grey">
                You have no notifications yet.
              </p>
            </div>
          ) : (
            notifications.map((item, index) => (
              <React.Fragment key={item.id}>
                <NotificationRow
                  item={item}
                  onAction={() => handleAction(item)}
                />
                {index < notifications.length - 1 && (
                  <div className="mx-6 h-px bg-[#e9e9e9] dark:bg-[#80808026]" />
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const NotificationRow = ({
  item,
  onAction,
}: {
  item: NotificationItem;
  onAction: () => void;
}) => {
  const isClickable = Boolean(item.href);

  return (
    <div
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? onAction : undefined}
      onKeyDown={
        isClickable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onAction();
              }
            }
          : undefined
      }
      className={`flex flex-col gap-2 px-6 py-4 ${
        item.isRead ? "opacity-70" : ""
      } ${isClickable ? "cursor-pointer transition-colors hover:bg-[#f7f7f7] dark:hover:bg-[#1a1a1a]" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full">
            <Image
              src={item.avatarUrl || "/images/dummy-avatar.svg"}
              alt={item.userName}
              fill
              className="object-cover"
            />
          </div>
          <p className="font-sora text-base font-normal leading-[1.62] text-brand-black dark:text-white">
            {item.userName}
          </p>
        </div>
        <p className="font-sora text-sm font-light leading-5 text-brand-grey">
          {item.time}
        </p>
      </div>

      <p className="pl-8 font-sora text-sm font-light leading-5 text-brand-grey">
        {item.message}
      </p>

      {item.actionLabel && (
        <div className="pl-8">
          <Button
            type="button"
            variant="outline"
            onClick={(event) => {
              event.stopPropagation();
              onAction();
            }}
            className="h-7.5 w-auto min-w-17 rounded-full border-brand-grey bg-white px-4.25 py-1.25 font-sora text-sm font-normal leading-5 text-brand-black hover:bg-[#f7f7f7] dark:bg-transparent dark:text-white dark:hover:bg-[#1a1a1a]"
          >
            {item.actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
