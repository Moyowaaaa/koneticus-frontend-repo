export type ConversationType = "dm" | "group" | "kollaboration";

export type ConversationMemberRole = "owner" | "admin" | "member";

export type MessageType = "text" | "attachment" | "poll" | "system";

export interface ConversationParticipantProfile {
  _id?: string;
  firstname?: string;
  lastname?: string;
  profilePicture?: {
    url: string;
    id?: string;
  };
}

export interface ConversationParticipant {
  _id: string;
  email?: string;
  userProfile?: ConversationParticipantProfile | null;
}

export interface ConversationMember {
  userId: string;
  role: ConversationMemberRole;
  joinedAt: string;
  unreadCount: number;
  lastReadAt: string | null;
  isMuted: boolean;
  isArchived: boolean;
  leftAt: string | null;
}

export interface ConversationLastMessage {
  text?: string;
  senderId: string;
  type: MessageType;
  createdAt: string;
}

export interface ConversationAvatar {
  url: string;
  id: string;
}

export interface Conversation {
  _id: string;
  type: ConversationType;
  participantIds: Array<string | ConversationParticipant>;
  members: ConversationMember[];
  name?: string | null;
  avatar?: ConversationAvatar | null;
  createdBy: string;
  projectId?: string | null;
  dmKey?: string | null;
  lastMessage?: ConversationLastMessage | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationsListResponse {
  conversations: Conversation[];
  pagination: {
    totalConversations: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface GetConversationsParams {
  type?: ConversationType;
  page?: number;
  limit?: number;
}

export interface ChatMessageAttachment {
  url: string;
  id: string;
  name: string;
  mimeType: string;
  size: number;
  kind: "photo" | "video" | "document" | "audio";
  thumbnail?: string;
}

export interface ChatMessagePollOption {
  id: string;
  text: string;
  voterIds: string[];
}

export interface ChatMessagePoll {
  question: string;
  options: ChatMessagePollOption[];
  allowMultiple: boolean;
  isAnonymous: boolean;
  isClosed: boolean;
  closesAt?: string | null;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content?: string;
  attachments?: ChatMessageAttachment[];
  poll?: ChatMessagePoll;
  readBy?: Array<{ userId: string; readAt: string }>;
  reactions?: Array<{
    id: string;
    userId: string;
    emoji: string;
    reactedAt: string;
  }>;
  systemEvent?: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecentMessageSender {
  _id: string;
  email?: string;
  userProfile?: ConversationParticipantProfile | null;
}

export interface RecentMessage {
  _id: string;
  conversationId: string;
  type: MessageType;
  content?: string;
  createdAt: string;
  senderId: string;
  sender?: RecentMessageSender | null;
  conversation?: Pick<
    Conversation,
    "_id" | "name" | "type" | "avatar" | "participantIds"
  > | null;
}

export interface RecentMessagesResponse {
  messages: RecentMessage[];
}

export interface ConversationMessagesResponse {
  messages: ChatMessage[];
  pagination: {
    totalMessages: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface GetConversationMessagesParams {
  conversationId: string;
  page?: number;
  limit?: number;
}

export interface SendMessagePayload {
  type?: MessageType;
  content?: string;
  attachments?: ChatMessageAttachment[];
  /** Local files to upload via multipart (preferred for chat image attach). */
  files?: File[];
  poll?: {
    question: string;
    options: string[];
    allowMultiple?: boolean;
    isAnonymous?: boolean;
    closesAt?: string | null;
  };
}

export interface SendMessageResponse {
  message: string;
  data: ChatMessage;
}

export interface CreateKollaborationPayload {
  projectId: string;
}

export interface CreateKollaborationResponse {
  message: string;
  created: boolean;
  conversation: Conversation;
}

export interface CreateDmPayload {
  recipientId: string;
}

export interface CreateDmResponse {
  message: string;
  created: boolean;
  conversation: Conversation;
}

export interface CreateGroupPayload {
  name: string;
  memberIds: string[];
  avatarFile?: File | null;
}

export interface CreateGroupResponse {
  message: string;
  created: boolean;
  conversation: Conversation;
}

export interface MarkConversationAsReadResponse {
  message: string;
  conversationId: string;
  unreadCount: number;
  lastReadAt: string;
}

export interface VotePollPayload {
  optionIds: string[];
}

export interface VotePollResponse {
  message: string;
  data: ChatMessage;
}
