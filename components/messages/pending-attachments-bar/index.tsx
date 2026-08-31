"use client";

import Image from "next/image";
import { CloseCircle } from "iconsax-reactjs";
import { FileText } from "lucide-react";
import type { PendingChatFile } from "@/lib/chat-attachments";
import {
  formatChatFileSize,
  isChatImageFile,
} from "@/lib/chat-attachments";

type PendingAttachmentsBarProps = {
  items: PendingChatFile[];
  onRemove: (index: number) => void;
  onClear: () => void;
};

const PendingAttachmentsBar = ({
  items,
  onRemove,
  onClear,
}: PendingAttachmentsBarProps) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-2 flex max-w-full items-center gap-2 overflow-x-auto rounded-[1.25rem] border border-[#E9E9E9] bg-white p-2 dark:border-[#80808026] dark:bg-[#151515]">
      {items.map((item, index) => {
        const isImage = isChatImageFile(item.file);

        return isImage ? (
          <div
            key={`${item.file.name}-${index}`}
            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl"
          >
            <Image
              src={item.url}
              alt={item.file.name || `Attachment ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-0.5 right-0.5 rounded-full bg-white/90 p-0.5 shadow"
              aria-label={`Remove ${item.file.name || "attachment"}`}
            >
              <CloseCircle size={14} className="text-red-500" variant="Bold" />
            </button>
          </div>
        ) : (
          <div
            key={`${item.file.name}-${index}`}
            className="relative flex h-14 max-w-44 shrink-0 items-center gap-2 rounded-xl border border-[#E9E9E9] bg-lavender px-2.5 dark:border-[#80808026] dark:bg-[#80808026]"
          >
            <FileText className="size-5 shrink-0 text-[#6155F5]" />
            <div className="min-w-0 pr-4">
              <p className="truncate text-xs font-medium text-brand-black dark:text-white">
                {item.file.name}
              </p>
              <p className="text-[0.625rem] text-brand-grey">
                {formatChatFileSize(item.file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-0.5 right-0.5 rounded-full bg-white/90 p-0.5 shadow"
              aria-label={`Remove ${item.file.name || "document"}`}
            >
              <CloseCircle size={14} className="text-red-500" variant="Bold" />
            </button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={onClear}
        className="ml-auto shrink-0 px-2 text-xs text-brand-grey hover:text-brand-black dark:hover:text-white"
      >
        Clear
      </button>
    </div>
  );
};

export default PendingAttachmentsBar;
