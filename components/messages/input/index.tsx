import ButtonV2 from "@/components/ui-components/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useChatStore } from "@/store/useChatStore";

const MessagesInput = () => {
  const [messageText, setMessageText] = useState("");
  const { currentConversationId, currentUserId, addMessage } = useChatStore();

  const handleSendMessage = () => {
    if (!messageText.trim() || !currentConversationId) return;

    addMessage(currentConversationId, {
      senderId: currentUserId,
      text: messageText.trim(),
      content: messageText.trim(),
      type: "text",
    });

    setMessageText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={
        "w-full  mx-auto absolute bottom-0 flex items-center justify-center"
      }
    >
      <div
        className="
      w-10/12
      relative flex items-center rounded-[1.875rem] border border-[#E9E9E9] bg-white p-1 transition-all focus-within:border-primary
             dark:border-[#80808026]
      dark:bg-[#151515]
      focus-within:ring-2 focus-within:ring-primary/20"
      >
        <Input
          placeholder="Write a message.."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full
                  placeholder:text-brand-grey
                  dark:placeholder:text-[#808080]
                  bg-transparent dark:bg-transparent text-base text-brand-black dark:text-white placeholder:text-grey outline-none border-none"
        />
        <ButtonV2
          variant="default"
          className="px-6 min-h-max! py-3"
          onClick={handleSendMessage}
          disabled={!messageText.trim() || !currentConversationId}
        >
          <p className="text-base"> Send </p>
        </ButtonV2>
      </div>
    </div>
  );
};

export default MessagesInput;
