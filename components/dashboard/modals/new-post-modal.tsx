"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { useFeedStore } from "@/store/useFeedStore";
import { Clock } from "iconsax-reactjs";
import React, { useEffect, useRef, useState } from "react";

const NewIdeaModal = () => {
  const { showNewIdeaModal, setShowNewIdeaModal } = useGeneralStateStore();
  const { addNewIdea } = useFeedStore();

  const titleInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (showNewIdeaModal) {
      titleInputRef.current?.focus();
    }
  }, [showNewIdeaModal]);

  useEffect(() => {
    if (!showNewIdeaModal) return;

    const handleEnterSubmit = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.key !== "Enter" || target?.tagName === "TEXTAREA") {
        return;
      }

      event.preventDefault();
      formRef.current?.requestSubmit();
    };

    window.addEventListener("keydown", handleEnterSubmit);
    return () => window.removeEventListener("keydown", handleEnterSubmit);
  }, [showNewIdeaModal]);

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!title.trim() || !description.trim()) {
      // Basic validation - you can enhance this
      alert("Please fill in both title and description");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add the new idea to the feed
      addNewIdea(title.trim(), description.trim());

      // Reset form
      setTitle("");
      setDescription("");

      // Close modal
      setShowNewIdeaModal(false);
    } catch (error) {
      console.error("Error posting idea:", error);
      alert("Failed to post idea. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = (open: boolean) => {
    if (!isSubmitting) {
      setShowNewIdeaModal(open);
      if (!open) {
        // Reset form when modal closes
        setTitle("");
        setDescription("");
      }
    }
  };

  return (
    <>
      <Modal
        open={showNewIdeaModal}
        onOpenChange={handleModalClose}
        title="New Idea"
        className="flex flex-col gap-4"
      >
        <form
          ref={formRef}
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          <label className="flex flex-col gap-1">
            <span className="sr-only">Idea title</span>
            <Input
              ref={titleInputRef}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className="h-12 outline-none text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9]"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="sr-only">Idea description</span>
            <Textarea
              placeholder="Write description here...."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="resize-none h-40 outline-none border-none ring-0  shadow-none    text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9]"
            />
          </label>

          <div className="w-full items-center flex justify-between">
            <ButtonV2
              className="h-10"
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim()}
            >
              <p className="text-[0.875rem]">
                {isSubmitting ? "Sharing..." : "Share your idea"}
              </p>
            </ButtonV2>

            <div className="flex items-center gap-1" aria-live="polite">
              <Clock size={13} className="text-brand-grey" />
              <p className="text-[0.875rem] text-brand-grey">
                <span className="text-brand-black">3</span> Monthly shares left
              </p>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default NewIdeaModal;
