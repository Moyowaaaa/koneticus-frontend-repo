import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import ProposalMessage from "../proposal-message";

interface ChatBubbleProps {
  message: string;
  isCurrentUser: boolean;
  senderName?: string;
  senderAvatar?: string;
  timestamp?: string;
  showAvatar?: boolean;
  isGrouped?: boolean;
  messageType?: "text" | "proposal";
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
  proposalData,
}: ChatBubbleProps) => {
  return (
    <div
      className={cn(
        "flex w-full gap-3",
        isCurrentUser ? "justify-end" : "justify-start",
        isGrouped && !isCurrentUser ? "ml-12" : ""
      )}
    >
      {/* Avatar for other users */}
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

      {/* Message content */}
      <div
        className={cn(
          "flex max-w-[70%] flex-col gap-1",
          isCurrentUser ? "items-end" : "items-start"
        )}
      >
        {/* Sender name for other users (only show if not grouped) */}
        {!isCurrentUser && senderName && !isGrouped && (
          <p
            className="text-xs font-medium text-brand-black
          dark:text-white
          "
          >
            {senderName}
          </p>
        )}

        {/* Message bubble */}
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
        ) : (
          <div
            className={cn(
              "relative  px-4 py-3 text-sm leading-relaxed",
              isCurrentUser
                ? "bg-lavender text-brand-black "
                : "bg-gray-100 text-brand-black dark:bg-[#80808026] text-white",
              // Tail positioning
              isCurrentUser
                ? "rounded-tt-md rounded-br-md rounded-l-md"
                : "rounded-bl-md rounded-br-md rounded-r-md"
            )}
          >
            <p className="wrap-break-word">{message}</p>
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <p className="text-xs text-brand-grey">{formatTime(timestamp)}</p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
