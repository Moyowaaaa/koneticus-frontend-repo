"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Add, SearchNormal, Trash } from "iconsax-reactjs";
import Modal from "@/components/ui-components/modal";
import ButtonV2 from "@/components/ui-components/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGlobalSearch } from "@/api/search/search.queries";
import { useCreateGroup } from "@/api/chat/chat.mutations";
import type { SearchUser } from "@/api/search/search.model";
import { useAuthStore } from "@/store/useAuthStore";
import { showToast } from "@/utils/toasts";

type CreateGroupModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CreateGroupModal = (props: CreateGroupModalProps) => (
  <CreateGroupModalContent key={props.open ? "open" : "closed"} {...props} />
);

const CreateGroupModalContent = ({ open, onOpenChange }: CreateGroupModalProps) => {
  const currentUserId = useAuthStore((state) => state.user?._id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<SearchUser[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { mutateAsync: createGroup, isPending } = useCreateGroup();

  const resetForm = () => {
    setName("");
    setSearchQuery("");
    setDebouncedQuery("");
    setSelectedMembers([]);
    setAvatarFile(null);
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

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

  const selectedIds = useMemo(
    () => new Set(selectedMembers.map((member) => member.authUserId)),
    [selectedMembers],
  );

  const users = useMemo(() => {
    const results = data?.users ?? [];
    return results.filter(
      (user) =>
        user.authUserId !== currentUserId && !selectedIds.has(user.authUserId),
    );
  }, [data?.users, currentUserId, selectedIds]);

  const hasQuery = debouncedQuery.length >= 2;
  const canCreate =
    name.trim().length > 0 && selectedMembers.length > 0 && !isPending;

  const addMember = (user: SearchUser) => {
    setSelectedMembers((prev) => {
      if (prev.some((member) => member.authUserId === user.authUserId)) {
        return prev;
      }
      return [...prev, user];
    });
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const removeMember = (authUserId: string) => {
    setSelectedMembers((prev) =>
      prev.filter((member) => member.authUserId !== authUserId),
    );
  };

  const onPickAvatar = (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast.error("Please choose an image file");
      return;
    }

    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    setAvatarFile(file);
  };

  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreate = async () => {
    if (!canCreate) return;

    try {
      await createGroup({
        name: name.trim(),
        memberIds: selectedMembers.map((member) => member.authUserId),
        avatarFile,
      });
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to create group:", error);
      showToast.error("Couldn't create group. Try again.");
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="New group"
      className="max-w-lg"
      containerClassname="bg-white dark:bg-[#151515]"
      primaryAction={
        <ButtonV2
          type="button"
          variant="dark"
          className="w-full"
          disabled={!canCreate}
          onClick={() => void handleCreate()}
        >
          {isPending ? "Creating..." : "Create group"}
        </ButtonV2>
      }
    >
      <div className="flex flex-col gap-4 px-1 pb-2">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lavender text-sm font-medium text-brand-black transition hover:opacity-90 dark:bg-[#80808026] dark:text-white"
          >
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Group avatar"
                fill
                className="object-cover"
              />
            ) : (
              <Add size={22} />
            )}
          </button>
          <div className="min-w-0 flex-1">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group name"
              className="rounded-2xl border-[#E9E9E9] text-brand-black dark:border-[#80808026] dark:bg-transparent dark:text-white"
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-medium text-primary"
              >
                {avatarPreview ? "Change photo" : "Add photo"}
              </button>
              {avatarPreview ? (
                <button
                  type="button"
                  onClick={clearAvatar}
                  className="text-xs text-brand-grey hover:text-red-500"
                >
                  Remove
                </button>
              ) : null}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onPickAvatar(e.target.files?.[0])}
          />
        </div>

        {selectedMembers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedMembers.map((member) => {
              const label = `${member.firstname} ${member.lastname}`.trim();
              return (
                <span
                  key={member.authUserId}
                  className="inline-flex items-center gap-1.5 rounded-full bg-lavender px-2.5 py-1 text-xs text-brand-black dark:bg-[#80808026] dark:text-white"
                >
                  {label}
                  <button
                    type="button"
                    aria-label={`Remove ${label}`}
                    onClick={() => removeMember(member.authUserId)}
                    className="rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10"
                  >
                    <Trash size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        ) : null}

        <div className="flex items-center gap-3 rounded-full border border-[#E9E9E9] px-4 py-2 dark:border-[#80808026]">
          <SearchNormal size={18} color="#8C8C8C" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Add people"
            className="border-none text-sm text-brand-black shadow-none placeholder:text-brand-grey focus-visible:ring-0 dark:bg-transparent dark:text-white"
          />
        </div>

        <div className="h-[16rem] overflow-hidden rounded-2xl border border-[#E9E9E9] dark:border-[#80808026]">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-1 p-2">
              {!hasQuery ? (
                <p className="px-3 py-10 text-center text-sm text-brand-grey">
                  Search and add at least one person
                </p>
              ) : isFetching && !data ? (
                <p className="px-3 py-10 text-center text-sm text-brand-grey">
                  Searching...
                </p>
              ) : isError ? (
                <p className="px-3 py-10 text-center text-sm text-brand-grey">
                  Couldn&apos;t search right now. Try again.
                </p>
              ) : users.length === 0 ? (
                <p className="px-3 py-10 text-center text-sm text-brand-grey">
                  No people found for &ldquo;{debouncedQuery}&rdquo;
                </p>
              ) : (
                users.map((user) => {
                  const label = `${user.firstname} ${user.lastname}`.trim();
                  const avatar =
                    user.profilePicture?.url || "/images/dummy-avatar.svg";
                  const roles = user.roles?.slice(0, 2).join(" · ");

                  return (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => addMember(user)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-lavender dark:hover:bg-[#211E1E]"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={avatar}
                          alt={label}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-brand-black dark:text-white">
                          {label}
                        </p>
                        <p className="truncate text-xs text-brand-grey">
                          {roles || user.bio || "Member"}
                        </p>
                      </div>
                      <Add size={18} className="shrink-0 text-primary" />
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

export default CreateGroupModal;
