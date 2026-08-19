"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { Clock, Image as ImageIcon, CloseCircle } from "iconsax-reactjs";
import React, { useState } from "react";
import Image from "next/image";
import ImageUploadModal, {
  type SelectedImageItem,
} from "./image-upload-modal";
import { useCreateCollaborationRequest } from "@/api/collaboration/collaboration.mutation";
import { toast } from "sonner";
import { useGetErrorMessage } from "@/lib/utils";

const MAX_INTEREST_IMAGES = 4;

const ShowInterestModal = () => {
  const {
    showInterestModal,
    interestProjectId,
    setShowShowInterestModal,
    resetShowInterestModal,
  } = useGeneralStateStore();
  const { mutate: createRequest, isPending: isSubmitting } =
    useCreateCollaborationRequest();
  const getErrorMessage = useGetErrorMessage();

  const [proposal, setProposal] = useState("");
  const [selectedImages, setSelectedImages] = useState<SelectedImageItem[]>([]);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);

  const clearSelectedImages = () => {
    setSelectedImages((prev) => {
      prev.forEach((image) => {
        if (image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
      return [];
    });
  };

  const resetForm = () => {
    setProposal("");
    clearSelectedImages();
  };

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
    setShowShowInterestModal(false);
    setShowImageUploadModal(true);
  };

  const handleImagesFromModal = (images: SelectedImageItem[]) => {
    setSelectedImages((prev) => {
      prev.forEach((image) => {
        if (image.url.startsWith("blob:")) {
          URL.revokeObjectURL(image.url);
        }
      });
      return images.slice(0, MAX_INTEREST_IMAGES);
    });
  };

  const handleSubmit = () => {
    if (!interestProjectId) {
      toast.error("No project selected.");
      return;
    }

    if (!proposal.trim()) {
      toast.error("Please write a short proposal.");
      return;
    }

    createRequest(
      {
        projectId: interestProjectId,
        proposal: proposal.trim(),
        media:
          selectedImages.length > 0
            ? selectedImages.map((image) => image.file)
            : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Interest submitted successfully!");
          resetForm();
          resetShowInterestModal();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
          console.error("Submission error:", error);
        },
      },
    );
  };

  const handleModalClose = (open: boolean) => {
    if (!isSubmitting && !showImageUploadModal) {
      if (open) {
        setShowShowInterestModal(true);
      } else {
        resetForm();
        resetShowInterestModal();
      }
    }
  };

  return (
    <>
      <Modal
        open={showInterestModal}
        onOpenChange={handleModalClose}
        title="Show Interest"
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Convince project owner..."
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            disabled={isSubmitting}
            className="resize-none h-55 outline-none border-none ring-0  
            dark:bg-[#211E1E]
            shadow-none text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9]"
          />

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
                    disabled={isSubmitting}
                    className="absolute top-1.5 right-1.5 rounded-full bg-white p-1 shadow-md transition-colors hover:bg-gray-100 disabled:opacity-50"
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

          <div className="w-full items-center flex justify-between">
            <div className="flex items-center gap-4">
              <ButtonV2
                className="h-[2.5rem] 
                min-h-[2.5rem]
                max-h-[2.5rem]!"
                onClick={handleSubmit}
                disabled={isSubmitting || !proposal.trim() || !interestProjectId}
              >
                <p className="text-[0.875rem]">
                  {isSubmitting ? "Submitting..." : "Express interest"}
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
                aria-label="Add images to your proposal"
              >
                <ImageIcon
                  size={16}
                  className="dark:text-white text-brand-black"
                  fontWeight={"bold"}
                />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <Clock size={13} className="text-brand-grey" />
              <p className="text-[0.875rem] text-brand-grey">
                <span className="text-brand-black dark:text-white">3</span>{" "}
                requests left this month
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <ImageUploadModal
        open={showImageUploadModal}
        onOpenChange={(open) => {
          setShowImageUploadModal(open);
          if (!open) {
            setShowShowInterestModal(true);
          }
        }}
        onImagesSelect={handleImagesFromModal}
        maxImages={MAX_INTEREST_IMAGES}
        initialImages={selectedImages}
        uploadHint="Add images to support your proposal"
      />
    </>
  );
};

export default ShowInterestModal;
