import ChatInput from "@/components/chat/chat-input";
import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { useChatStore } from "@/store/useChatStore";
import MessagesInput from "../input";
import { Messages } from "iconsax-reactjs";
import { MesssagesBox } from "../messages-box/messages-box";

const MessagesChatbox = () => {
  const illustrationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const conversations = useChatStore((state) => state.conversations);

  const MessagesAndConversations = conversations;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        illustrationRef.current,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
        }
      );

      gsap.to(illustrationRef.current, {
        y: -6,
        repeat: -1,
        yoyo: true,
        duration: 4,
        ease: "sine.inOut",
      });

      gsap.fromTo(
        messageRef.current,
        { opacity: 0, y: 4 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative h-full w-full p-6 md:h-[calc(100dvh-190px)] ">
      {MessagesAndConversations.length === 0 ? (
        <div className="flex h-full w-full min-h-[30rem] flex-col items-center justify-center gap-6 text-center">
          <div
            ref={illustrationRef}
            className="relative flex h-36 w-36 items-center justify-center rounded-4xl bg-linear-to-b from-lavender/50 to-white "
          >
            <div className="absolute inset-3 rounded-[1.7rem] bg-white/70 dark:bg-[#80808026] blur-xl" />
            <Image
              src={"/images/messages-empty-state.svg"}
              alt="empty conversation illustration"
              width={120}
              height={152}
              className="relative "
            />
          </div>

          <p
            ref={messageRef}
            className="text-sm leading-5 text-brand-black dark:text-white"
          >
            There are no messages
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col relative h-full">
          <MesssagesBox />
        </div>
      )}
      <MessagesInput />
    </div>
  );
};

export default MessagesChatbox;
