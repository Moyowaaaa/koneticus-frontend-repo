"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessagePoll } from "@/api/chat/chat.model";

const subscribePollExpiry = (
  closesAtMs: number | null,
  onStoreChange: () => void,
) => {
  if (closesAtMs == null) return () => {};

  const remaining = closesAtMs - Date.now();
  if (remaining <= 0) return () => {};

  const timeoutId = window.setTimeout(onStoreChange, remaining);
  return () => window.clearTimeout(timeoutId);
};

const usePollExpired = (closesAt?: string | null) => {
  const closesAtMs = closesAt ? new Date(closesAt).getTime() : null;

  return useSyncExternalStore(
    (onStoreChange) => subscribePollExpiry(closesAtMs, onStoreChange),
    () => closesAtMs != null && closesAtMs <= Date.now(),
    () => false,
  );
};

type PollMessageProps = {
  poll: ChatMessagePoll;
  currentUserId?: string | null;
  isCurrentUser?: boolean;
  disabled?: boolean;
  onVote?: (optionId: string) => void;
  className?: string;
};

const PollMessage = ({
  poll,
  currentUserId,
  isCurrentUser = false,
  disabled = false,
  onVote,
  className,
}: PollMessageProps) => {
  const totalVotes = poll.options.reduce(
    (sum, option) => sum + (option.voterIds?.length ?? 0),
    0,
  );

  const hasVoted = Boolean(
    currentUserId &&
      poll.options.some((option) => option.voterIds?.includes(currentUserId)),
  );

  const showResults = hasVoted || poll.isClosed;
  const isExpired = usePollExpired(poll.closesAt);
  const isInteractive = !poll.isClosed && !isExpired && !disabled && !!onVote;

  return (
    <div
      className={cn(
        "w-full min-w-[16rem] max-w-[22rem] rounded-2xl border p-4",
        isCurrentUser
          ? "border-lavender bg-lavender text-brand-black"
          : "border-gray-200 bg-gray-100 text-brand-black dark:border-[#80808026] dark:bg-[#80808026] dark:text-white",
        className,
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-wide text-brand-grey">
            Poll
          </p>
          <h4 className="mt-1 text-sm font-semibold leading-5">{poll.question}</h4>
        </div>
        {(poll.isClosed || isExpired) && (
          <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[0.625rem] font-medium text-brand-grey dark:bg-black/20">
            Closed
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {poll.options.map((option) => {
          const voteCount = option.voterIds?.length ?? 0;
          const percent =
            totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
          const isSelected = Boolean(
            currentUserId && option.voterIds?.includes(currentUserId),
          );

          return (
            <button
              key={option.id}
              type="button"
              disabled={!isInteractive}
              onClick={() => onVote?.(option.id)}
              className={cn(
                "relative w-full overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-colors",
                isSelected
                  ? "border-brand-black bg-white dark:border-white dark:bg-[#151515]"
                  : "border-transparent bg-white/60 dark:bg-black/20",
                isInteractive && "hover:border-brand-black/40 cursor-pointer",
                !isInteractive && "cursor-default",
              )}
            >
              {showResults && (
                <span
                  className={cn(
                    "absolute inset-y-0 left-0 bg-brand-black/10 dark:bg-white/10",
                    isSelected && "bg-brand-black/15 dark:bg-white/15",
                  )}
                  style={{ width: `${percent}%` }}
                />
              )}

              <span className="relative z-10 flex items-center justify-between gap-3">
                <span className="text-sm font-medium wrap-anywhere">
                  {option.text}
                </span>
                {showResults && (
                  <span className="shrink-0 text-xs text-brand-grey">
                    {percent}%
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-[0.6875rem] text-brand-grey">
        <span>
          {totalVotes} vote{totalVotes === 1 ? "" : "s"}
          {poll.allowMultiple ? " · multiple choice" : ""}
          {poll.isAnonymous ? " · anonymous" : ""}
        </span>
        {!showResults && isInteractive && (
          <span>Tap an option to vote</span>
        )}
      </div>
    </div>
  );
};

export default PollMessage;
