"use client";

import { useState, type ReactNode } from "react";
import { Chart2, Image as ImageIcon } from "iconsax-reactjs";
import { FileText, Paperclip } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AttachMenuProps = {
  disabled?: boolean;
  canAttachImages?: boolean;
  canAttachDocuments?: boolean;
  canCreatePoll?: boolean;
  onAttachImages: () => void;
  onAttachDocuments: () => void;
  onCreatePoll: () => void;
};

const AttachMenu = ({
  disabled = false,
  canAttachImages = true,
  canAttachDocuments = true,
  canCreatePoll = true,
  onAttachImages,
  onAttachDocuments,
  onCreatePoll,
}: AttachMenuProps) => {
  const [open, setOpen] = useState(false);

  const runAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Attach"
          aria-haspopup="menu"
          disabled={disabled}
          className="ml-1 flex size-9 shrink-0 items-center justify-center rounded-full text-brand-grey transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/10"
        >
          <Paperclip className="size-[18px]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="z-10000 w-56 rounded-2xl border border-[#E9E9E9] p-1.5 shadow-lg dark:border-[#80808026] dark:bg-[#151515]"
        align="end"
        side="top"
        sideOffset={8}
        collisionPadding={12}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div role="menu" className="flex flex-col">
          <AttachMenuItem
            icon={<ImageIcon size={18} />}
            label="Photos"
            description="JPG, PNG, and more"
            disabled={!canAttachImages}
            onSelect={() => runAction(onAttachImages)}
          />
          <AttachMenuItem
            icon={<FileText className="size-[18px]" />}
            label="Documents"
            description="PDF, DOC, DOCX"
            disabled={!canAttachDocuments}
            onSelect={() => runAction(onAttachDocuments)}
          />
          <AttachMenuItem
            icon={<Chart2 size={18} />}
            label="Poll"
            description="Ask a question"
            disabled={!canCreatePoll}
            onSelect={() => runAction(onCreatePoll)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

const AttachMenuItem = ({
  icon,
  label,
  description,
  disabled,
  onSelect,
}: {
  icon: ReactNode;
  label: string;
  description: string;
  disabled?: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    role="menuitem"
    disabled={disabled}
    onClick={onSelect}
    className={cn(
      "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors",
      "hover:bg-black/5 dark:hover:bg-white/10",
      "disabled:pointer-events-none disabled:opacity-40",
    )}
  >
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-lavender text-[#6155F5] dark:bg-[#80808026]">
      {icon}
    </span>
    <span className="min-w-0">
      <span className="block text-sm font-medium text-brand-black dark:text-white">
        {label}
      </span>
      <span className="block text-xs text-brand-grey">{description}</span>
    </span>
  </button>
);

export default AttachMenu;
