"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import MediaGrid from "@/components/dashboard/feed/media-grid";
import DocumentLightbox from "@/components/messages/document-lightbox";
import type { ChatMessageAttachment } from "@/api/chat/chat.model";
import type { FeedMedia } from "@/api/feed/feed.model";
import { formatChatFileSize } from "@/lib/chat-attachments";

type AttachmentMessageProps = {
  attachments: ChatMessageAttachment[];
  caption?: string;
  isCurrentUser: boolean;
  className?: string;
};

const toFeedMedia = (attachments: ChatMessageAttachment[]): FeedMedia[] =>
  attachments.map((attachment, index) => {
    const id = attachment.id || `chat-media-${index}`;
    return {
      url: attachment.url,
      id,
      _id: id,
    };
  });

const AttachmentMessage = ({
  attachments,
  caption,
  isCurrentUser,
  className,
}: AttachmentMessageProps) => {
  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState<
    number | null
  >(null);

  const photos = attachments.filter(
    (item) => item.kind === "photo" || item.mimeType?.startsWith("image/"),
  );
  const videos = attachments.filter(
    (item) => item.kind === "video" || item.mimeType?.startsWith("video/"),
  );
  const documents = attachments.filter(
    (item) =>
      item.kind === "document" ||
      (item.kind !== "photo" &&
        item.kind !== "video" &&
        item.kind !== "audio" &&
        !item.mimeType?.startsWith("image/") &&
        !item.mimeType?.startsWith("video/") &&
        !item.mimeType?.startsWith("audio/")),
  );

  if (attachments.length === 0) return null;

  const photoMedia = toFeedMedia(photos);
  const isDocumentsOnly =
    documents.length > 0 &&
    photoMedia.length === 0 &&
    videos.length === 0 &&
    !caption;

  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2",
        isDocumentsOnly
          ? ""
          : cn(
              "rounded-[12px] p-2",
              isCurrentUser
                ? "rounded-br-[4px] bg-lavender text-brand-black dark:bg-[#80808026] dark:text-white"
                : "rounded-bl-[4px] bg-gray-100 text-brand-black dark:bg-[#80808026] dark:text-white",
            ),
        className,
      )}
    >
      {photoMedia.length > 0 && (
        <div className="w-[13.5rem] max-w-full overflow-hidden sm:w-[15rem]">
          <MediaGrid
            media={photoMedia}
            alt="Chat attachment"
            sizes="240px"
            className="mt-0"
          />
        </div>
      )}

      {videos.length > 0 && (
        <div className="flex w-[13.5rem] max-w-full flex-col gap-1 sm:w-[15rem]">
          {videos.map((attachment) => (
            <div
              key={attachment.id || attachment.url}
              className="relative aspect-video overflow-hidden rounded-xl bg-black/10"
            >
              <video
                src={attachment.url}
                controls
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {documents.length > 0 && (
        <div className="flex w-[13.5rem] max-w-full flex-col gap-2 sm:w-[15rem]">
          {documents.map((attachment, index) => (
            <button
              key={attachment.id || attachment.url}
              type="button"
              onClick={() => setSelectedDocumentIndex(index)}
              className="flex items-center gap-3 rounded-xl border border-[#E9E9E9]/80 bg-white/80 p-3 text-left transition-colors hover:bg-white dark:border-[#80808026] dark:bg-[#211E1E] dark:hover:bg-[#2a2727]"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lavender text-[#6155F5] dark:bg-[#6155F5]/20">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-brand-black dark:text-white">
                  {attachment.name || "Document"}
                </p>
                <p className="text-xs text-brand-grey">
                  {formatChatFileSize(attachment.size) || attachment.mimeType}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {caption ? (
        <div className="max-w-[15rem] px-1 py-1 text-sm leading-relaxed">
          <p className="wrap-anywhere">{caption}</p>
        </div>
      ) : null}

      <DocumentLightbox
        documents={documents}
        selectedIndex={selectedDocumentIndex}
        onClose={() => setSelectedDocumentIndex(null)}
        onSelect={setSelectedDocumentIndex}
      />
    </div>
  );
};

export default AttachmentMessage;
