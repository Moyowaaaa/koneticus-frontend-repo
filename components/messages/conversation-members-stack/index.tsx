"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ConversationParticipant } from "@/api/chat/chat.model";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type MemberAvatar = {
  id: string;
  name: string;
  avatar?: string;
};

type ConversationMembersStackProps = {
  members: MemberAvatar[];
  maxVisible?: number;
  className?: string;
  size?: "sm" | "md";
};

export const getParticipantId = (
  participant: string | ConversationParticipant,
) => (typeof participant === "string" ? participant : participant._id);

export const mapParticipantToMemberAvatar = (
  participant: string | ConversationParticipant,
): MemberAvatar => {
  if (typeof participant === "string") {
    return {
      id: participant,
      name: "Member",
      avatar: "/images/dummy-avatar.svg",
    };
  }

  const profile = participant.userProfile;
  const name = profile
    ? `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim() ||
      participant.email ||
      "Member"
    : participant.email || "Member";

  return {
    id: participant._id,
    name,
    avatar: profile?.profilePicture?.url || "/images/dummy-avatar.svg",
  };
};

const ConversationMembersStack = ({
  members,
  maxVisible = 4,
  className,
  size = "md",
}: ConversationMembersStackProps) => {
  if (members.length === 0) return null;

  const visible = members.slice(0, maxVisible);
  const overflowMembers = members.slice(maxVisible);
  const overflow = overflowMembers.length;
  const dimension = size === "sm" ? "h-7 w-7" : "h-9 w-9";

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className={cn("flex items-center", className)}
        aria-label={`${members.length} members`}
      >
        <div className="flex items-center">
          {visible.map((member, index) => (
            <Tooltip key={member.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "relative shrink-0 overflow-hidden rounded-full border-2 border-white outline-none transition-transform hover:z-20 hover:scale-105 focus-visible:ring-2 focus-visible:ring-lavender dark:border-[#151515]",
                    dimension,
                    index > 0 && "-ml-2.5",
                  )}
                  style={{ zIndex: visible.length - index }}
                  aria-label={member.name}
                >
                  <Image
                    src={member.avatar || "/images/dummy-avatar.svg"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-center">
                {member.name}
              </TooltipContent>
            </Tooltip>
          ))}

          {overflow > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "relative -ml-2.5 flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-lavender text-[0.625rem] font-semibold text-brand-black outline-none transition-transform hover:z-20 hover:scale-105 focus-visible:ring-2 focus-visible:ring-lavender dark:border-[#151515] dark:bg-[#80808026] dark:text-white",
                    dimension,
                  )}
                  style={{ zIndex: 0 }}
                  aria-label={`${overflow} more members`}
                >
                  +{overflow}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-48 text-left leading-relaxed">
                {overflowMembers.map((member) => member.name).join(", ")}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ConversationMembersStack;
