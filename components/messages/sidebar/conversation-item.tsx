import Image from "next/image";
import React from "react";

interface ConversationItemProps {
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  status?: "online" | "offline" | "away";
  isActive?: boolean;
  isMessageRequest?: boolean;
  onClick?: () => void;
}

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }

  const isThisYear = date.getFullYear() === now.getFullYear();
  return date.toLocaleDateString([], {
    month: isThisYear ? "short" : "numeric",
    day: "numeric",
  });
};

const ConversationItem = ({
  name,
  avatar,
  lastMessage,
  lastMessageAt,
  unreadCount = 0,
  status,
  isActive,
  isMessageRequest,
  onClick,
}: ConversationItemProps) => {
  const timestampLabel = formatTimestamp(lastMessageAt);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between gap-3 rounded-[0.9375rem] p-4 text-left transition-all hover:bg-lavender ${
        isActive ? "bg-lavender" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 min-h-10 min-w-10">
          <Image
            src={avatar || "/images/dummy-avatar.svg"}
            alt={name}
            fill
            className="rounded-full object-cover"
          />
          {status && (
            <span
              className={`absolute top-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${
                status === "online"
                  ? "bg-emerald-500"
                  : status === "away"
                  ? "bg-amber-400"
                  : "bg-gray-400"
              }`}
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-brand-black line-clamp-1">
              {name}
            </h1>
            {isMessageRequest && (
              <span className="rounded-full bg-lavender px-2 py-0.5 text-[0.625rem] font-semibold uppercase text-brand-black">
                Request
              </span>
            )}
          </div>
          <p className="text-sm text-brand-grey line-clamp-1">
            {lastMessage || "Send the first message"}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        {timestampLabel && (
          <p className="text-xs text-brand-grey">{timestampLabel}</p>
        )}
        {unreadCount > 0 && (
          <span className="min-w-6 rounded-full bg-brand-black px-2 py-0.5 text-center text-[0.625rem] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default ConversationItem;
