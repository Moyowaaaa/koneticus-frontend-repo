"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import TagInput from "@/components/ui-components/tag-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
// import { useFeedStore } from "@/store/useFeedStore";
import {
  Clock,
  Image as ImageIcon,
  CloseCircle,
  People,
} from "iconsax-reactjs";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ImageUploadModal from "./image-upload-modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProject } from "@/api/projects/project.mutations";
import { toast } from "sonner";

const NewIdeaModal = () => {
  const { showNewIdeaModal, setShowNewIdeaModal } = useGeneralStateStore();
  const { mutate: createProject, isPending: isSubmitting } = useCreateProject();

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Define Zod schema
  const createProjectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    requiredRoles: z.array(z.string()),
    teamSize: z.number().min(1, "Team size must be at least 1"),
    media: z.any().optional(), // File handling is manual or via controlled input
  });

  type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      requiredRoles: [],
      teamSize: 1,
    },
  });

  const selectedRoles = watch("requiredRoles");
  const teamSize = watch("teamSize");

  // Team size selection state
  const [isTeamSizeOpen, setIsTeamSizeOpen] = useState(false);
  const teamSizeOptions = [1, 2, 3, 4, 5];

  // Image upload modal state
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
    }
  };

  const handleRemoveImage = React.useCallback(() => {
    setSelectedFile(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, [imagePreviewUrl]);

  const handleImageButtonClick = () => {
    // Temporarily hide the create modal while picking an image.
    // Form state must be preserved across this swap.
    setShowNewIdeaModal(false);
    setShowImageUploadModal(true);
  };

  const handleImageFromModal = (imageUrl: string, file: File) => {
    setSelectedFile(file);
    setImagePreviewUrl(imageUrl);
  };

  // Only discard the draft when the create flow is fully dismissed —
  // not when we briefly close New Idea to show the image picker.
  useEffect(() => {
    if (!showNewIdeaModal && !showImageUploadModal) {
      reset();
      setSelectedFile(null);
      setImagePreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
      setIsTeamSizeOpen(false);
    }
  }, [showNewIdeaModal, showImageUploadModal, reset]);

  const onSubmit = (data: CreateProjectFormValues) => {
    // Prepare payload
    const payload = {
      ...data,
      media: selectedFile ? [selectedFile] : undefined,
    };

    createProject(payload, {
      onSuccess: () => {
        toast.success("Project created successfully!");
        setShowNewIdeaModal(false);
      },
      onError: (error) => {
        toast.error("Failed to create project. Please try again.");
        console.error("Submission error:", error);
      },
    });
  };

  const handleModalClose = (open: boolean) => {
    if (!isSubmitting && !showImageUploadModal) {
      setShowNewIdeaModal(open);
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
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="flex flex-col gap-1">
            <span className="sr-only">Idea title</span>
            <Input
              {...register("title")}
              placeholder="Title"
              disabled={isSubmitting}
              className="h-12 outline-none 
              dark:bg-[#211E1E]
              text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9] dark:border-b-[#80808026]"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1">
            <span className="sr-only">Idea description</span>
            <Textarea
              {...register("description")}
              placeholder="Write description here...."
              disabled={isSubmitting}
              className="resize-none h-40
              
              dark:bg-[#211E1E]
              outline-none border-none ring-0  shadow-none    text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9]"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
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
            onTagsChange={(tags) => setValue("requiredRoles", tags)}
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
                disabled={isSubmitting}
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
                  dark:border-[white]
                  rounded-[0.375rem]
                  flex flex-col items-center justify-center
                  cursor-pointer hover:bg-gray-100 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add image to your idea"
              >
                <ImageIcon
                  size={16}
                  className="dark:text-white text-brand-black"
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
                    disabled:opacity-50 
                    min-h-[3rem] max-h-[3rem]
                    disabled:cursor-not-allowed"
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
                          setValue("teamSize", size);
                          setIsTeamSizeOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-[0.875rem]
                            flex flex-col items-center
                          hover:bg-gray-100 dark:hover:bg-[#2a2727] transition-colors
                          ${
                            teamSize === size
                              ? "text-brand-purple font-medium"
                              : "text-brand-black dark:text-white"
                          }
                          ${size === 1 ? "rounded-t-[0.875rem]" : ""}
                          ${size === 5 ? "rounded-b-[0.875rem]" : ""}
                          `}
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
                <span className="text-brand-black dark:text-white">3</span>{" "}
                Monthly shares left
              </p>
            </div>
          </div>
        </form>
      </Modal>

      {/* Image Upload Modal */}
      <ImageUploadModal
        open={showImageUploadModal}
        onOpenChange={(open) => {
          setShowImageUploadModal(open);
          if (!open) {
            setShowNewIdeaModal(true);
          }
        }}
        onImageSelect={handleImageFromModal}
        initialImage={imagePreviewUrl}
      />
    </>
  );
};

export default NewIdeaModal;
