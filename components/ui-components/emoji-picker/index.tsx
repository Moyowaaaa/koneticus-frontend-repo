"use client";

import { useEffect, useState } from "react";
import { EmojiPicker } from "frimousse";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
  shouldCloseOnEmojiSelect?: boolean;
  children?: React.ReactNode;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function EmojiPickerButton({
  onEmojiSelect,
  shouldCloseOnEmojiSelect,
  className,
  children,
  onOpenChange,
}: EmojiPickerButtonProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiSelect = (emoji: { emoji: string; label?: string }) => {
    onEmojiSelect(emoji.emoji);
    if (shouldCloseOnEmojiSelect) handleOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setOpen(false);
      onOpenChange?.(false);
    } else {
      setOpen(true);
      onOpenChange?.(true);
    }
  };

  useEffect(() => {
    if (!open) return;

    let viewport: HTMLElement | null = null;
    let handleWheel: ((e: WheelEvent) => void) | null = null;

    const timeoutId = setTimeout(() => {
      viewport = document.querySelector("[frimousse-viewport]") as HTMLElement;

      if (viewport) {
        handleWheel = (e: WheelEvent) => {
          const { scrollTop, scrollHeight, clientHeight } = viewport!;
          const isScrollable = scrollHeight > clientHeight;

          if (isScrollable) {
            const isAtTop = scrollTop === 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

            if (
              (!isAtTop && e.deltaY < 0) ||
              (!isAtBottom && e.deltaY > 0) ||
              (!isAtTop && !isAtBottom)
            ) {
              viewport!.scrollTop += e.deltaY;
              e.preventDefault();
              e.stopPropagation();
            }
          }
        };

        viewport.addEventListener("wheel", handleWheel, { passive: false });
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (viewport && handleWheel) {
        viewport.removeEventListener("wheel", handleWheel);
      }
    };
  }, [open]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children || (
          <button
            type="button"
            className={cn(
              "flex size-[31px] items-center justify-center rounded-[10px] bg-black/5 transition-colors dark:bg-white/10",
              className,
            )}
          >
            <div className="flex size-3.5 items-center justify-center text-sm">
              😁
            </div>
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="z-10000 w-auto rounded-2xl border border-[#E9E9E9] p-1 shadow-lg duration-0 ease-in-out dark:border-[#80808026] dark:bg-[#151515]"
        align="end"
        side="top"
        sideOffset={8}
        collisionPadding={12}
        onEscapeKeyDown={() => {
          setOpen(false);
        }}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="h-[435px] w-[352px]"
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <EmojiPicker.Root
            onEmojiSelect={handleEmojiSelect}
            className="isolate flex h-full w-full flex-col"
          >
            <EmojiPicker.Search
              placeholder="Search emojis..."
              className="z-10 mx-2 mt-2 appearance-none rounded-md border border-[#E9E9E9] bg-neutral-100 px-2.5 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none dark:border-[#80808026] dark:bg-neutral-800 dark:text-white"
            />
            <EmojiPicker.Viewport className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain outline-hidden">
              <EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
                Loading emojis...
              </EmojiPicker.Loading>
              <EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
                No emoji found
              </EmojiPicker.Empty>
              <EmojiPicker.List
                className="select-none pb-1.5"
                components={{
                  CategoryHeader: ({ category, ...props }) => (
                    <div
                      className="sticky top-0 z-10 bg-white px-3 pt-3 pb-1.5 text-xs font-medium text-brand-grey dark:bg-[#151515] dark:text-neutral-400"
                      {...props}
                    >
                      {category.label}
                    </div>
                  ),
                  Row: ({ children, ...props }) => (
                    <div className="flex scroll-my-1.5 gap-1 px-1.5" {...props}>
                      {children}
                    </div>
                  ),
                  Emoji: ({ emoji, ...props }) => (
                    <button
                      type="button"
                      className="flex size-8 items-center justify-center rounded-md text-lg transition-colors hover:bg-black/5 data-active:bg-black/5 dark:hover:bg-white/10 dark:data-active:bg-neutral-800"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleEmojiSelect(emoji);
                      }}
                      title={emoji.label || emoji.emoji}
                      {...props}
                    >
                      {emoji.emoji}
                    </button>
                  ),
                }}
              />
            </EmojiPicker.Viewport>
          </EmojiPicker.Root>
        </div>
      </PopoverContent>
    </Popover>
  );
}
