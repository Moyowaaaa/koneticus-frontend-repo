"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import TagInput from "@/components/ui-components/tag-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import {
  Clock,
  Image as ImageIcon,
  CloseCircle,
  People,
} from "iconsax-reactjs";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ImageUploadModal, {
  type SelectedImageItem,
} from "./image-upload-modal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateProject } from "@/api/projects/project.mutations";
import { toast } from "sonner";

const MAX_IDEA_IMAGES = 4;

const NewIdeaModal = () => {
  const { showNewIdeaModal, setShowNewIdeaModal } = useGeneralStateStore();
  const { mutate: createProject, isPending: isSubmitting } = useCreateProject();

  const createProjectSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    requiredRoles: z.array(z.string()),
    teamSize: z.number().min(1, "Team size must be at least 1"),
    media: z.any().optional(),
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

  const [isTeamSizeOpen, setIsTeamSizeOpen] = useState(false);
  const teamSizeOptions = [1, 2, 3, 4, 5];

  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<SelectedImageItem[]>([]);

  const clearSelectedImages = React.useCallback(() => {
    setSelectedImages((prev) => {
      prev.forEach((image) => {
        if (image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
      return [];
    });
  }, []);

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => {
      const target = prev[index];
      if (target?.url.startsWith("blob:")) {
        URL.revokeObjectURL(target.url);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleImageButtonClick = () => {
    setShowNewIdeaModal(false);
    setShowImageUploadModal(true);
  };

  const handleImagesFromModal = (images: SelectedImageItem[]) => {
    setSelectedImages((prev) => {
      prev.forEach((image) => {
        if (image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
      return images.slice(0, MAX_IDEA_IMAGES);
    });
  };

  useEffect(() => {
    if (!showNewIdeaModal && !showImageUploadModal) {
      reset();
      clearSelectedImages();
      setIsTeamSizeOpen(false);
    }
  }, [showNewIdeaModal, showImageUploadModal, reset, clearSelectedImages]);

  const onSubmit = (data: CreateProjectFormValues) => {
    const payload = {
      ...data,
      media:
        selectedImages.length > 0
          ? selectedImages.map((image) => image.file)
          : undefined,
    };

    createProject(payload, {
      onSuccess: () => {
        toast.success("Project created successfully!");
      },
      onError: (error) => {
        toast.error("Failed to create project. Please try again.");
        console.error("Submission error:", error);
      },
    });

    setShowNewIdeaModal(false);
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

          {selectedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {selectedImages.map((image, index) => (
                <div
                  key={`${image.file.name}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-lg border border-[#E9E9E9]"
                >
                  <Image
                    src={image.url}
                    alt={`Selected image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1.5 right-1.5 rounded-full bg-white p-1 shadow-md transition-colors hover:bg-gray-100"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <CloseCircle
                      size={18}
                      className="text-red-500"
                      variant="Bold"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

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
                aria-label="Add images to your idea"
              >
                <ImageIcon
                  size={16}
                  className="dark:text-white text-brand-black"
                  fontWeight={"bold"}
                />
              </button>

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

      <ImageUploadModal
        open={showImageUploadModal}
        onOpenChange={(open) => {
          setShowImageUploadModal(open);
          if (!open) {
            setShowNewIdeaModal(true);
          }
        }}
        onImagesSelect={handleImagesFromModal}
        maxImages={MAX_IDEA_IMAGES}
        initialImages={selectedImages}
      />
    </>
  );
};

export default NewIdeaModal;
