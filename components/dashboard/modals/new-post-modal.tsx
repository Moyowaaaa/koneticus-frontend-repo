"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import TagInput from "@/components/ui-components/tag-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { useFeedStore } from "@/store/useFeedStore";
import {
  Clock,
  Image as ImageIcon,
  CloseCircle,
  People,
} from "iconsax-reactjs";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ImageUploadModal from "./image-upload-modal";

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

  // Team size selection state
  const [teamSize, setTeamSize] = useState<number>(1);
  const [isTeamSizeOpen, setIsTeamSizeOpen] = useState(false);
  const teamSizeOptions = [1, 2, 3, 4, 5];

  // Image upload modal state
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);

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
    setShowImageUploadModal(true);
  };

  const handleImageFromModal = (imageUrl: string, file: File) => {
    setSelectedImage(file);
    setImagePreviewUrl(imageUrl);
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
        teamSize,
        imagePreviewUrl || undefined
      );

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedRoles([]);
      setTeamSize(1);
      setIsTeamSizeOpen(false);
      setShowImageUploadModal(false);
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
        setTeamSize(1);
        setIsTeamSizeOpen(false);
        setShowImageUploadModal(false);
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

              {/* Team Size Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsTeamSizeOpen(!isTeamSizeOpen)}
                  disabled={isSubmitting}
                  className="h-[2rem] px-3
                    border border-[#E9E9E9] dark:border-[#80808026]
                    rounded-full
                    flex items-center gap-2
                    cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a2727] transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Select team size"
                  aria-expanded={isTeamSizeOpen}
                  aria-haspopup="listbox"
                >
                  <People
                    size={16}
                    className="text-brand-black dark:text-white"
                  />
                  <span className="text-[0.875rem] text-brand-black dark:text-white">
                    Team ({teamSize})
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      isTeamSizeOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isTeamSizeOpen && (
                  <div
                    className="absolute bottom-full mb-2 left-0 bg-white dark:bg-[#211E1E]
                      border border-[#E9E9E9] dark:border-[#80808026] rounded-[1.25rem] shadow-lg
                      py-1 min-w-[78px]
                      flex flex-col items-center
                      max-w-[78px] z-50"
                    role="listbox"
                    aria-label="Team size options"
                  >
                    {teamSizeOptions.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setTeamSize(size);
                          setIsTeamSizeOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-[0.875rem]
                            flex flex-col items-center
                          hover:bg-gray-100 dark:hover:bg-[#2a2727] transition-colors
                          ${
                            teamSize === size
                              ? "text-brand-purple font-medium"
                              : "text-brand-black dark:text-white"
                          }`}
                        role="option"
                        aria-selected={teamSize === size}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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

      {/* Image Upload Modal */}
      <ImageUploadModal
        open={showImageUploadModal}
        onOpenChange={setShowImageUploadModal}
        onImageSelect={handleImageFromModal}
        initialImage={imagePreviewUrl}
      />
    </>
  );
};

export default NewIdeaModal;
