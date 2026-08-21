"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import Modal from "@/components/ui-components/modal";
import type { ChatMessageAttachment } from "@/api/chat/chat.model";
import {
  formatChatFileSize,
  isPdfAttachment,
} from "@/lib/chat-attachments";

type DocumentLightboxProps = {
  documents: ChatMessageAttachment[];
  selectedIndex: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
};

const DocumentLightbox = ({
  documents,
  selectedIndex,
  onClose,
  onSelect,
}: DocumentLightboxProps) => {
  const count = documents.length;
  const selected =
    selectedIndex !== null ? documents[selectedIndex] : undefined;
  const hasMultiple = count > 1;
  const hasPrevious = selectedIndex !== null && selectedIndex > 0;
  const hasNext = selectedIndex !== null && selectedIndex < count - 1;
  const isPdf = selected ? isPdfAttachment(selected) : false;

  const goToPrevious = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      onSelect(selectedIndex - 1);
    }
  }, [onSelect, selectedIndex]);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < count - 1) {
      onSelect(selectedIndex + 1);
    }
  }, [count, onSelect, selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, selectedIndex]);

  return (
    <Modal
      open={selectedIndex !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className="sm:max-w-4xl"
      containerClassname="bg-black dark:bg-black"
      childrenClassName="p-0"
    >
      {selected ? (
        <div className="relative flex min-h-[60vh] w-full flex-col">
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {selected.name || "Document"}
              </p>
              <p className="text-xs text-white/60">
                {formatChatFileSize(selected.size) || selected.mimeType}
              </p>
            </div>
            <a
              href={selected.url}
              download={selected.name}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
            >
              <Download className="size-3.5" />
              Download
            </a>
          </div>

          <div className="relative flex min-h-[60vh] flex-1 items-center justify-center px-3 pb-4">
            {isPdf ? (
              <iframe
                src={selected.url}
                title={selected.name || "PDF preview"}
                className="h-[60vh] w-full rounded-xl bg-white"
              />
            ) : (
              <div className="flex max-w-sm flex-col items-center gap-3 rounded-2xl bg-white/10 px-6 py-10 text-center text-white">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-white/10">
                  <FileText className="size-7" />
                </div>
                <p className="text-sm font-medium">
                  {selected.name || "Document"}
                </p>
                <p className="text-xs text-white/70">
                  Word files can be downloaded here. PDF files open as a full
                  preview.
                </p>
              </div>
            )}

            {hasMultiple && hasPrevious ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-black/40 p-2 transition-colors hover:bg-black/60"
                aria-label="Previous document"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
            ) : null}

            {hasMultiple && hasNext ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black/40 p-2 transition-colors hover:bg-black/60"
                aria-label="Next document"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>
            ) : null}

            {hasMultiple ? (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
                {selectedIndex + 1} / {count}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default DocumentLightbox;
