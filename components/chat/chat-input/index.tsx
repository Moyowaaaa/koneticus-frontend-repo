"use client";

import ButtonV2 from "@/components/ui-components/button";
import EmojiPickerButton from "@/components/ui-components/emoji-picker";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSendMessage } from "@/api/chat/chat.mutations";
import ImageUploadModal, {
  type SelectedImageItem,
} from "@/components/dashboard/modals/image-upload-modal";
import CreatePollModal, {
  type CreatePollPayload,
} from "@/components/messages/create-poll-modal";
import AttachMenu from "@/components/messages/attach-menu";
import PendingAttachmentsBar from "@/components/messages/pending-attachments-bar";
import {
  CHAT_DOCUMENT_ACCEPT,
  MAX_CHAT_ATTACHMENTS,
  isChatImageFile,
  pickChatDocuments,
  type PendingChatFile,
} from "@/lib/chat-attachments";
import { showToast } from "@/utils/toasts";
import { Smile } from "lucide-react";
import React, { useRef, useState } from "react";

type ChatInputProps = {
  className?: string;
  conversationId?: string | null;
  disabled?: boolean;
};

const ChatInput = ({
  className,
  conversationId,
  disabled = false,
}: ChatInputProps) => {
  const [messageText, setMessageText] = useState("");
  const [pendingFiles, setPendingFiles] = useState<PendingChatFile[]>([]);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const { mutate: sendMessage, isPending } = useSendMessage();

  const canCompose = Boolean(conversationId) && !disabled;
  const pendingImages = pendingFiles.filter((item) =>
    isChatImageFile(item.file),
  );
  const pendingDocuments = pendingFiles.filter(
    (item) => !isChatImageFile(item.file),
  );
  const imageSlots = MAX_CHAT_ATTACHMENTS - pendingDocuments.length;

  const revokePending = (items: PendingChatFile[]) => {
    items.forEach((item) => {
      if (item.url.startsWith("blob:")) {
        URL.revokeObjectURL(item.url);
      }
    });
  };

  const clearPendingFiles = () => {
    setPendingFiles((prev) => {
      revokePending(prev);
      return [];
    });
  };

  const handleSendMessage = () => {
    const content = messageText.trim();
    const hasFiles = pendingFiles.length > 0;
    if ((!content && !hasFiles) || !conversationId || !canCompose) return;

    const files = pendingFiles.map((item) => item.file);
    const previewSnapshot = pendingFiles;

    setMessageText("");
    setPendingFiles([]);

    sendMessage(
      {
        conversationId,
        payload: hasFiles
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
          setPendingFiles(previewSnapshot);
        },
        onSuccess: () => {
          revokePending(previewSnapshot);
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
    setPendingFiles((prev) => {
      const documents = prev.filter((item) => !isChatImageFile(item.file));
      revokePending(prev.filter((item) => isChatImageFile(item.file)));
      return [...documents, ...images].slice(0, MAX_CHAT_ATTACHMENTS);
    });
  };

  const handleDocumentsSelected = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { accepted, error } = pickChatDocuments(
      event.target.files ?? [],
      MAX_CHAT_ATTACHMENTS - pendingFiles.length,
    );

    if (error) showToast.error(error);

    if (accepted.length > 0) {
      setPendingFiles((prev) => [
        ...prev,
        ...accepted.map((file) => ({
          file,
          url: URL.createObjectURL(file),
        })),
      ]);
    }

    event.target.value = "";
  };

  const handleRemovePending = (index: number) => {
    setPendingFiles((prev) => {
      const target = prev[index];
      if (target?.url.startsWith("blob:")) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleCreatePoll = (poll: CreatePollPayload) => {
    if (!conversationId || !canCompose) return;

    sendMessage(
      {
        conversationId,
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
    canCompose &&
    (messageText.trim().length > 0 || pendingFiles.length > 0) &&
    !isPending;

  return (
    <>
      <div
        className={cn("absolute bottom-0 left-0 w-full min-w-0 p-4", className)}
      >
        <PendingAttachmentsBar
          items={pendingFiles}
          onRemove={handleRemovePending}
          onClear={clearPendingFiles}
        />

        <div className="relative flex max-w-full items-center rounded-[1.875rem] border border-[#E9E9E9] bg-white p-1 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-[#80808026] dark:bg-[#151515]">
          <Input
            ref={inputRef}
            placeholder={
              canCompose ? "Write a message.." : "Start team chat to message"
            }
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!canCompose}
            className="w-full min-w-0 border-none bg-transparent text-base text-brand-black outline-none placeholder:text-brand-grey dark:bg-transparent dark:text-white dark:placeholder:text-[#808080]"
          />
          <EmojiPickerButton
            onEmojiSelect={handleEmojiSelect}
            shouldCloseOnEmojiSelect={false}
          >
            <button
              type="button"
              aria-label="Open emoji picker"
              disabled={!canCompose}
              className="mr-1 flex size-9 shrink-0 items-center justify-center rounded-full text-brand-grey transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10"
            >
              <Smile className="size-5" />
            </button>
          </EmojiPickerButton>
          
          <AttachMenu
            disabled={!canCompose}
            canAttachImages={imageSlots > 0}
            canAttachDocuments={pendingFiles.length < MAX_CHAT_ATTACHMENTS}
            canCreatePoll={!isPending}
            onAttachImages={() => setShowImageUploadModal(true)}
            onAttachDocuments={() => documentInputRef.current?.click()}
            onCreatePoll={() => setShowPollModal(true)}
          />
          
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

      <input
        ref={documentInputRef}
        type="file"
        accept={CHAT_DOCUMENT_ACCEPT}
        multiple
        className="hidden"
        onChange={handleDocumentsSelected}
      />

      <ImageUploadModal
        open={showImageUploadModal}
        onOpenChange={setShowImageUploadModal}
        onImagesSelect={handleImagesSelect}
        maxImages={Math.max(imageSlots, 1)}
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

export default ChatInput;
