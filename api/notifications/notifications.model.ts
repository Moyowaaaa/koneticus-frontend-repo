export type NotificationType =
  | "test"
  | "project_created"
  | "project_updated"
  | "project_deleted"
  | "project_archived"
  | "project_unarchived"
  | "project_completed"
  | "project_uncompleted"
  | "collab_request_received"
  | "collab_request_accepted"
  | "collab_request_rejected";

export interface NotificationActorProfile {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: {
    url: string;
    id: string;
  };
}

export interface NotificationActor {
  _id: string;
  email?: string;
  userProfile?: NotificationActorProfile;
}

export interface NotificationMeta {
  projectId?: string;
  collabRequestId?: string;
}

export interface Notification {
  _id: string;
  recipientId: string;
  actorId: NotificationActor | string;
  type: NotificationType;
  title: string;
  body?: string;
  isRead: boolean;
  meta?: NotificationMeta;
  readAt: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsListResponse {
  notifications: Notification[];
  unreadNotificationCount: number;
  pagination: {
    totalNotifications: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface UnreadCountResponse {
  unreadNotificationCount: number;
}
