import { Collaborator } from "@/types";
import { ChatMessage } from "@/types/chat";
import Image from "next/image";
import React from "react";

interface ChatBubbleProps {
  message: ChatMessage;
  sender?: Collaborator;
}

const ChatBubble = ({ message, sender }: ChatBubbleProps) => {
  const isCreator = sender?.role === "Creator";
  const bubbleBg = isCreator
    ? "bg-[#F4F3FF] text-brand-black"
    : "bg-[#F4F4F4] text-brand-black";
  const nameColor = isCreator ? "text-[#7A67F9]" : "text-brand-black";
  const messageText = message.text ?? message.content ?? "";

  return (
    <div className="flex items-start gap-2">
      <div className="relative h-[1.5rem] w-[1.5rem]">
        <Image
          src={"/images/dummy-avatar.svg"}
          alt="avatar"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className={`text-sm  ${nameColor} dark:text-white`}>
            {sender
              ? `${sender.firstName} ${sender.lastName}`
              : "Unknown Member"}
          </p>
          {sender?.role && (
            <span
              className={`text-xs  font-medium
            ${
              sender.role === "Creator"
                ? "text-[#AEA8F7]"
                : "text-brand-grey hidden"
            }
            `}
            >
              ({sender.role})
            </span>
          )}
        </div>

        <div
          className={`w-max max-w-70 rounded-b-3xl rounded-tr-3xl px-4 py-3 ${bubbleBg}`}
        >
          <p className="text-sm leading-relaxed">{messageText}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
