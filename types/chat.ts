export interface ChatMessage {
  id: string | number;
  conversationId?: string; // Optional - can be derived from context
  senderId: string | number; // user_id from API
  content?: string; // HTML content from TipTap (null for post/attachment messages)
  text?: string; // Plain text version
  timestamp: Date | string; // created_at from API
  type: "text" | "post" | "attachment" | "call" | "system";
  isRead?: boolean; // Derived from activities
  isPinned?: boolean;
  pinnedAt?: Date | string;
  isForwarded?: boolean;
  //    post?: ChatPostData; // Simplified post data
  //   attachments?: ChatAttachment[];
  reactions?: Array<{
    id?: string | number; // reaction ID for deletion
    userId: string | number;
    emoji: string;
    type?: string; // reaction_type from API
  }>;
}
