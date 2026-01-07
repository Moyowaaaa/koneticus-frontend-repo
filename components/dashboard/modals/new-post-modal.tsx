"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import TagInput from "@/components/ui-components/tag-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { useFeedStore } from "@/store/useFeedStore";
import { Clock, Image as ImageIcon, CloseCircle } from "iconsax-reactjs";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const NewIdeaModal = () => {
  const { showNewIdeaModal, setShowNewIdeaModal } = useGeneralStateStore();
  const { addNewIdea } = useFeedStore();

  const titleInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Role selection state
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleImageButtonClick = () => {
    imageInputRef.current?.click();
  };

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
      // Add the new idea to the feed (pass image URL if one was selected)
      addNewIdea(
        title.trim(),
        description.trim(),
        selectedRoles,
        imagePreviewUrl || undefined
      );

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedRoles([]);
      handleRemoveImage();

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
        setSelectedRoles([]);
        handleRemoveImage();
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
              className="h-12 outline-none 
              dark:bg-[#211E1E]
              text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9] dark:border-b-[#80808026]"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="sr-only">Idea description</span>
            <Textarea
              placeholder="Write description here...."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="resize-none h-40
              
              dark:bg-[#211E1E]
              outline-none border-none ring-0  shadow-none    text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9]"
            />
          </label>

          {/* Image Preview Section */}
          {imagePreviewUrl && (
            <div className="relative w-full">
              <div className="relative w-full h-40 rounded-lg overflow-hidden border border-[#E9E9E9]">
                <Image
                  src={imagePreviewUrl}
                  alt="Selected image preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Remove selected image"
              >
                <CloseCircle
                  size={20}
                  className="text-red-500"
                  variant="Bold"
                />
              </button>
            </div>
          )}

          {/* Hidden file input for image selection */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            aria-hidden="true"
          />

          <TagInput
            selectedTags={selectedRoles}
            onTagsChange={setSelectedRoles}
            placeholder="Enter tags e.g Designer"
            disabled={isSubmitting}
          />

          <div className="w-full items-center flex justify-between">
            <div className="flex items-center gap-4">
              <ButtonV2
                className="h-[2.5rem] 
                min-h-[2.5rem]
                max-h-[2.5rem]! max-w-[8.625rem]! w-[8.625rem]!"
                type="submit"
                disabled={isSubmitting || !title.trim() || !description.trim()}
              >
                <p className="text-[0.875rem]">
                  {isSubmitting ? "Sharing..." : "Share your idea"}
                </p>
              </ButtonV2>

              <button
                type="button"
                onClick={handleImageButtonClick}
                disabled={isSubmitting}
                className="h-[2rem] w-[2rem] 
                  border-2 border-brand-black
                  rounded-[0.375rem]
                  flex flex-col items-center justify-center
                  cursor-pointer hover:bg-gray-100 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add image to your idea"
              >
                <ImageIcon
                  size={16}
                  className="text-brand-black"
                  fontWeight={"bold"}
                />
              </button>
            </div>

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
