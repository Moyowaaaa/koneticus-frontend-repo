import ButtonV2 from "@/components/ui-components/button";
import { Input } from "@/components/ui/input";
import React from "react";

const MessagesInput = () => {
  return (
    <div
      className={
        "w-full  mx-auto absolute bottom-0 flex items-center justify-center"
      }
    >
      <div
        className="
      w-10/12
      relative flex items-center rounded-[1.875rem] border border-[#E9E9E9] bg-white p-1 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
      >
        <Input
          placeholder="Write a message.."
          className="w-full
                  placeholder:text-brand-grey
                  bg-transparent text-base text-brand-black placeholder:text-grey outline-none border-none "
        />
        <ButtonV2 variant="default" className="px-6 min-h-max! py-3">
          <p className="text-base"> Send </p>
        </ButtonV2>
      </div>
    </div>
  );
};

export default MessagesInput;
