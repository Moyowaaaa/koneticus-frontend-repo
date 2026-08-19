import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import ProposalMessage from "../proposal-message";
import PollMessage from "../poll-message";
import AttachmentMessage from "../attachment-message";
import type {
  ChatMessageAttachment,
  ChatMessagePoll,
} from "@/api/chat/chat.model";

interface ChatBubbleProps {
  message: string;
  isCurrentUser: boolean;
  senderName?: string;
  senderAvatar?: string;
  timestamp?: string;
  showAvatar?: boolean;
  isGrouped?: boolean;
  messageType?: "text" | "proposal" | "poll" | "attachment";
  currentUserId?: string | null;
  poll?: ChatMessagePoll;
  onPollVote?: (optionId: string) => void;
  pollVoteDisabled?: boolean;
  attachments?: ChatMessageAttachment[];
  proposalData?: {
    title: string;
    content: string;
    type: "proposal" | "request";
    onViewProfile?: () => void;
    onCollaborate?: () => void;
    onReject?: () => void;
  };
}

const formatTime = (timestamp?: string) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const ChatBubble = ({
  message,
  isCurrentUser,
  senderName,
  senderAvatar,
  timestamp,
  showAvatar = true,
  isGrouped = false,
  messageType = "text",
  currentUserId,
  poll,
  onPollVote,
  pollVoteDisabled,
  attachments,
  proposalData,
}: ChatBubbleProps) => {
  const hasAttachments = Boolean(attachments && attachments.length > 0);

  return (
    <div
      className={cn(
        "flex w-full min-w-0 gap-3",
        isCurrentUser ? "justify-end" : "justify-start",
        isGrouped && !isCurrentUser ? "pl-12" : "",
      )}
    >
      {!isCurrentUser && showAvatar && !isGrouped && (
        <div className="flex flex-col items-center">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src={senderAvatar || "/images/dummy-avatar.svg"}
              alt={senderName || "User"}
              fill
              className="rounded-full object-cover"
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex max-w-[75%] min-w-0 flex-col gap-1 md:max-w-[70%]",
          isCurrentUser ? "items-end" : "items-start",
        )}
      >
        {!isCurrentUser && senderName && !isGrouped && (
          <p className="text-xs font-medium text-brand-black dark:text-white">
            {senderName}
          </p>
        )}

        {messageType === "proposal" && proposalData ? (
          <ProposalMessage
            senderName={senderName || "Unknown User"}
            senderAvatar={senderAvatar}
            title={proposalData.title}
            content={proposalData.content}
            type={proposalData.type}
            onViewProfile={proposalData.onViewProfile}
            onCollaborate={proposalData.onCollaborate}
            onReject={proposalData.onReject}
            className="max-w-[400px]"
          />
        ) : messageType === "poll" && poll ? (
          <PollMessage
            poll={poll}
            currentUserId={currentUserId}
            isCurrentUser={isCurrentUser}
            disabled={pollVoteDisabled}
            onVote={onPollVote}
          />
        ) : hasAttachments ? (
          <AttachmentMessage
            attachments={attachments!}
            caption={message}
            isCurrentUser={isCurrentUser}
          />
        ) : (
          <div
            className={cn(
              "relative px-4 py-3 text-sm leading-relaxed",
              isCurrentUser
                ? "bg-lavender text-brand-black"
                : "bg-gray-100 text-brand-black dark:bg-[#80808026] dark:text-white",
              isCurrentUser
                ? "rounded-tt-md rounded-br-md rounded-l-md"
                : "rounded-bl-md rounded-br-md rounded-r-md",
            )}
          >
            <p className="wrap-anywhere">{message}</p>
          </div>
        )}

        {timestamp && (
          <p className="text-xs text-brand-grey">{formatTime(timestamp)}</p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
