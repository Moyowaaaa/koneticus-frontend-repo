import ButtonV2 from "@/components/ui-components/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

const ChatInput = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute bottom-0 p-4 w-full left-0", className)}>
      <div
        className="relative flex items-center rounded-[1.875rem] border border-[#E9E9E9] bg-white 
        dark:border-[#80808026]
      dark:bg-[#151515]
      p-1 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
      >
        <Input
          placeholder="Write a message.."
          className="w-full
                  placeholder:text-brand-grey
                  dark:placeholder:text-[#808080]
                  bg-transparent dark:bg-transparent text-base text-brand-black dark:text-white placeholder:text-grey outline-none border-none"
        />
        <ButtonV2 variant="default" className="px-6 min-h-max! py-3">
          <p className="text-base"> Send </p>
        </ButtonV2>
      </div>
    </div>
  );
};

export default ChatInput;
