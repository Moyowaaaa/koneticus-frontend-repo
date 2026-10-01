import SafeImage from "@/components/ui-components/safe-image";
import { ConversationType } from "@/api/chat/chat.model";

interface ConversationItemProps {
  name: string;
  avatar?: string | null;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  status?: "online" | "offline" | "away";
  isActive?: boolean;
  isMessageRequest?: boolean;
  onClick?: () => void;
  type?: ConversationType;
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
  type,
}: ConversationItemProps) => {
  const timestampLabel = formatTimestamp(lastMessageAt);
  const isKollaboration = type === "kollaboration";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-start justify-between gap-3 rounded-[0.9375rem] p-4 text-left transition-all hover:bg-lavender ${
        isActive ? "bg-lavender dark:bg-[#80808026]" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-8 w-8 min-h-8 min-w-8">
          <SafeImage
            src={avatar}
            alt={name}
            fill
            className="rounded-full object-cover"
            isKollaboration={isKollaboration ? true : false}
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
            <h1
              className="text-base  text-brand-black 
            dark:text-white
            line-clamp-1"
            >
              {name}
            </h1>
            {isMessageRequest && (
              <span className="rounded-full bg-lavender px-2 py-0.5 text-[0.625rem] font-semibold uppercase text-brand-black">
                Request
              </span>
            )}
          </div>
          <p className="text-sm text-brand-grey line-clamp-1 font-[300]">
            {lastMessage || "Send the first message"}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 min-w-max pt-1">
        {timestampLabel && (
          <p className="text-xs text-brand-black">{timestampLabel}</p>
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
