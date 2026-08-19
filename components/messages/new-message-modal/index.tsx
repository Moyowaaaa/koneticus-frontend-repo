"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SearchNormal } from "iconsax-reactjs";
import Modal from "@/components/ui-components/modal";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGlobalSearch } from "@/api/search/search.queries";
import { useCreateDM } from "@/api/chat/chat.mutations";
import type { SearchUser } from "@/api/search/search.model";
import { useAuthStore } from "@/store/useAuthStore";
import { showToast } from "@/utils/toasts";

type NewMessageModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const NewMessageModal = ({ open, onOpenChange }: NewMessageModalProps) => {
  const currentUserId = useAuthStore((state) => state.user?._id);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const { mutateAsync: createDm, isPending } = useCreateDM();

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setDebouncedQuery("");
      setPendingUserId(null);
      return;
    }
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isFetching, isError } = useGlobalSearch(debouncedQuery, {
    enabled: open,
    limit: 10,
  });

  const users = useMemo(() => {
    const results = data?.users ?? [];
    return results.filter((user) => user.authUserId !== currentUserId);
  }, [data?.users, currentUserId]);

  const hasQuery = debouncedQuery.length >= 2;

  const startConversation = async (user: SearchUser) => {
    if (isPending) return;

    setPendingUserId(user.authUserId);
    try {
      await createDm({ recipientId: user.authUserId });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to start DM:", error);
      showToast.error("Couldn't start conversation. Try again.");
    } finally {
      setPendingUserId(null);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="New message"
      className="max-w-lg"
      containerClassname="bg-white dark:bg-[#151515]"
    >
      <div className="flex flex-col gap-4 px-1 pb-2">
        <div className="flex items-center gap-3 rounded-full border border-[#E9E9E9] px-4 py-2 dark:border-[#80808026]">
          <SearchNormal size={18} color="#8C8C8C" />
          <Input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people"
            className="border-none text-sm text-brand-black shadow-none placeholder:text-brand-grey focus-visible:ring-0 dark:bg-transparent dark:text-white"
          />
        </div>

        <div className="h-[22rem] overflow-hidden rounded-2xl border border-[#E9E9E9] dark:border-[#80808026]">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-1 p-2">
              {!hasQuery ? (
                <p className="px-3 py-12 text-center text-sm text-brand-grey">
                  Search for someone to message
                </p>
              ) : isFetching && !data ? (
                <p className="px-3 py-12 text-center text-sm text-brand-grey">
                  Searching...
                </p>
              ) : isError ? (
                <p className="px-3 py-12 text-center text-sm text-brand-grey">
                  Couldn&apos;t search right now. Try again.
                </p>
              ) : users.length === 0 ? (
                <p className="px-3 py-12 text-center text-sm text-brand-grey">
                  No people found for &ldquo;{debouncedQuery}&rdquo;
                </p>
              ) : (
                users.map((user) => {
                  const name = `${user.firstname} ${user.lastname}`.trim();
                  const avatar =
                    user.profilePicture?.url || "/images/dummy-avatar.svg";
                  const roles = user.roles?.slice(0, 2).join(" · ");
                  const isStarting = pendingUserId === user.authUserId;

                  return (
                    <button
                      key={user._id}
                      type="button"
                      disabled={isPending}
                      onClick={() => void startConversation(user)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-lavender disabled:opacity-60 dark:hover:bg-[#211E1E]"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={avatar}
                          alt={name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-brand-black dark:text-white">
                          {name}
                        </p>
                        <p className="truncate text-xs text-brand-grey">
                          {isStarting
                            ? "Starting chat..."
                            : roles || user.bio || "Member"}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Modal>
  );
};

export default NewMessageModal;
