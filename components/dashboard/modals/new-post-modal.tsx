"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { useFeedStore } from "@/store/useFeedStore";
import { Clock } from "iconsax-reactjs";
import React, { useState } from "react";

const NewIdeaModal = () => {
  const { showNewIdeaModal, setShowNewIdeaModal } = useGeneralStateStore();
  const { addNewIdea } = useFeedStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
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
        <div className="flex flex-col gap-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            className="h-12 outline-none text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9]"
          />

          <Textarea
            placeholder="Write description here...."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            className="resize-none h-40 outline-none border-none ring-0  shadow-none    text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9]"
          />

          <div className="w-full items-center flex justify-between ">
            <ButtonV2
              className="h-10"
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !description.trim()}
            >
              <p className="text-[0.875rem]">
                {isSubmitting ? "Sharing..." : "Share your idea"}
              </p>
            </ButtonV2>

            <div className="flex items-center gap-1">
              <Clock size={13} className="text-brand-grey" />
              <p className="text-[0.875rem] text-brand-grey">
                <span className="text-brand-black">3</span> Monthly shares left
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NewIdeaModal;
