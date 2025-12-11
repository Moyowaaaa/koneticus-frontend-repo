import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: string;
  isCurrentUser: boolean;
  senderName?: string;
  senderAvatar?: string;
  timestamp?: string;
  showAvatar?: boolean;
  isGrouped?: boolean; // For consecutive messages from same sender
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
          <p className="text-xs font-medium text-brand-black">{senderName}</p>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isCurrentUser
              ? "bg-lavender text-brand-black"
              : "bg-gray-100 text-brand-black",
            // Tail positioning
            isCurrentUser ? "rounded-br-md" : "rounded-bl-md"
          )}
        >
          <p className="wrap-break-word">{message}</p>
        </div>

        {/* Timestamp */}
        {timestamp && (
          <p className="text-xs text-brand-grey">{formatTime(timestamp)}</p>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
