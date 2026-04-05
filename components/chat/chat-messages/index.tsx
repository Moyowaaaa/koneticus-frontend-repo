import { MessageAnimation } from "@/animations/message-animation";
import { ChatMessage } from "@/types/chat";
import { Collaborator } from "@/types";
import React, { useMemo } from "react";
import ChatBubble from "./chat-bubble";

const ChatMessages = () => {
  const dummyMessages: ChatMessage[] = [
    {
      id: 1,
      senderId: "andrea",
      text: "I am available here to spot you. On the Journey.",
      timestamp: new Date().toISOString(),
      type: "text",
    },
    {
      id: 2,
      senderId: "sandra",
      text: "I am available here to spot you. On the Journey.",
      timestamp: new Date().toISOString(),
      type: "text",
    },
  ];

  const participants = useMemo<Record<string, Collaborator>>(
    () => ({
      andrea: {
        firstName: "Andrea",
        lastName: "Smith",
        role: "Creator",
        email: "andrea@kolabs.app",
        portfolio: {
          github: "",
          behance: "",
          website: "",
          linkedin: "",
        },
      },
      sandra: {
        firstName: "Sandra",
        lastName: "Johnson",
        role: "Collaborator",
        email: "sandra@kolabs.app",
        portfolio: {
          github: "",
          behance: "",
          website: "",
          linkedin: "",
        },
      },
    }),
    [],
  );

  return (
    <div className="flex flex-col gap-5 py-4">
      {dummyMessages.map((message, index) => {
        const sender =
          participants[message.senderId as keyof typeof participants];

        return (
          <MessageAnimation key={message.id} index={index}>
            <ChatBubble message={message} sender={sender} />
          </MessageAnimation>
        );
      })}
    </div>
  );
};

export default ChatMessages;
