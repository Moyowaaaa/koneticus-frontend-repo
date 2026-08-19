"use client";

import ButtonV2 from "@/components/ui-components/button";
import EmojiPickerButton from "@/components/ui-components/emoji-picker";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/store/useChatStore";
import { useSendMessage } from "@/api/chat/chat.mutations";
import ImageUploadModal, {
  type SelectedImageItem,
} from "@/components/dashboard/modals/image-upload-modal";
import CreatePollModal, {
  type CreatePollPayload,
} from "@/components/messages/create-poll-modal";
import { Chart2, CloseCircle, Image as ImageIcon } from "iconsax-reactjs";
import { Smile } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef } from "react";

const MAX_CHAT_IMAGES = 4;

const MessagesInput = () => {
  const [messageText, setMessageText] = useState("");
  const [pendingImages, setPendingImages] = useState<SelectedImageItem[]>([]);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentConversationId = useChatStore(
    (state) => state.currentConversationId,
  );
  const { mutate: sendMessage, isPending } = useSendMessage();

  const clearPendingImages = () => {
    setPendingImages((prev) => {
      prev.forEach((image) => {
        if (image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
      return [];
    });
  };

  const handleSendMessage = () => {
    const content = messageText.trim();
    const hasImages = pendingImages.length > 0;
    if ((!content && !hasImages) || !currentConversationId) return;

    const files = pendingImages.map((image) => image.file);
    const previewSnapshot = pendingImages;

    setMessageText("");
    setPendingImages([]);

    sendMessage(
      {
        conversationId: currentConversationId,
        payload: hasImages
          ? {
              type: "attachment",
              content: content || undefined,
              files,
            }
          : {
              type: "text",
              content,
            },
      },
      {
        onError: () => {
          setMessageText(content);
          setPendingImages(previewSnapshot);
        },
        onSuccess: () => {
          previewSnapshot.forEach((image) => {
            if (image.url.startsWith("blob:")) {
              URL.revokeObjectURL(image.url);
            }
          });
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const input = inputRef.current;
    if (!input) {
      setMessageText((prev) => prev + emoji);
      return;
    }

    const start = input.selectionStart ?? messageText.length;
    const end = input.selectionEnd ?? messageText.length;
    const next = messageText.slice(0, start) + emoji + messageText.slice(end);

    setMessageText(next);

    requestAnimationFrame(() => {
      const cursor = start + emoji.length;
      input.focus();
      input.setSelectionRange(cursor, cursor);
    });
  };

  const handleImagesSelect = (images: SelectedImageItem[]) => {
    setPendingImages((prev) => {
      prev.forEach((image) => {
        if (image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
      return images.slice(0, MAX_CHAT_IMAGES);
    });
  };

  const handleRemovePending = (index: number) => {
    setPendingImages((prev) => {
      const target = prev[index];
      if (target?.url.startsWith("blob:")) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCreatePoll = (poll: CreatePollPayload) => {
    if (!currentConversationId) return;

    sendMessage(
      {
        conversationId: currentConversationId,
        payload: {
          type: "poll",
          poll: {
            question: poll.question,
            options: poll.options,
            allowMultiple: poll.allowMultiple,
            isAnonymous: poll.isAnonymous,
          },
        },
      },
      {
        onSuccess: () => setShowPollModal(false),
      },
    );
  };

  const canSend =
    Boolean(currentConversationId) &&
    (messageText.trim().length > 0 || pendingImages.length > 0) &&
    !isPending;

  return (
    <>
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full min-w-0 flex-col justify-end gap-2 px-2 pb-1">
        {pendingImages.length > 0 && (
          <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-[1.25rem] border border-[#E9E9E9] bg-white p-2 dark:border-[#80808026] dark:bg-[#151515]">
            {pendingImages.map((image, index) => (
              <div
                key={`${image.file.name}-${index}`}
                className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl"
              >
                <Image
                  src={image.url}
                  alt={`Attachment ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePending(index)}
                  className="absolute top-0.5 right-0.5 rounded-full bg-white/90 p-0.5 shadow"
                  aria-label={`Remove attachment ${index + 1}`}
                >
                  <CloseCircle
                    size={14}
                    className="text-red-500"
                    variant="Bold"
                  />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={clearPendingImages}
              className="ml-auto shrink-0 px-2 text-xs text-brand-grey hover:text-brand-black dark:hover:text-white"
            >
              Clear
            </button>
          </div>
        )}

        <div className="relative flex w-full max-w-full items-center rounded-[1.875rem] border border-[#E9E9E9] bg-white p-1 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-[#80808026] dark:bg-[#151515]">
          <Input
            ref={inputRef}
            placeholder="Write a message.."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!currentConversationId}
            className="w-full min-w-0 border-none bg-transparent text-base text-brand-black outline-none placeholder:text-brand-grey dark:bg-transparent dark:text-white dark:placeholder:text-brand-grey"
          />

          <button
            type="button"
            aria-label="Attach images"
            disabled={!currentConversationId}
            onClick={() => setShowImageUploadModal(true)}
            className="ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-brand-grey transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10"
          >
            <ImageIcon size={18} />
          </button>

          <button
            type="button"
            aria-label="Create poll"
            disabled={!currentConversationId || isPending}
            onClick={() => setShowPollModal(true)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-brand-grey transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10"
          >
            <Chart2 size={18} />
          </button>

          <EmojiPickerButton
            onEmojiSelect={handleEmojiSelect}
            shouldCloseOnEmojiSelect={false}
          >
            <button
              type="button"
              aria-label="Open emoji picker"
              className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-full text-brand-grey transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              <Smile className="size-5" />
            </button>
          </EmojiPickerButton>
          <ButtonV2
            variant="default"
            className="min-h-max! shrink-0 px-6 py-3"
            onClick={handleSendMessage}
            disabled={!canSend}
          >
            <p className="text-base">Send</p>
          </ButtonV2>
        </div>
      </div>

      <ImageUploadModal
        open={showImageUploadModal}
        onOpenChange={setShowImageUploadModal}
        onImagesSelect={handleImagesSelect}
        maxImages={MAX_CHAT_IMAGES}
        initialImages={pendingImages}
        title="Chat attachments"
        uploadHint="Add up to 4 images to your message"
        showShareQuota={false}
      />

      <CreatePollModal
        open={showPollModal}
        onOpenChange={setShowPollModal}
        onCreate={handleCreatePoll}
        isSubmitting={isPending}
      />
    </>
  );
};

export default MessagesInput;
