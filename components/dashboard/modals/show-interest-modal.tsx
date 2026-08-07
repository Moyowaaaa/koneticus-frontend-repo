"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import { Textarea } from "@/components/ui/textarea";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { Clock, Image as ImageIcon, CloseCircle } from "iconsax-reactjs";
import React, { useRef, useState } from "react";
import Image from "next/image";
import ImageUploadModal from "./image-upload-modal";
import { useCreateCollaborationRequest } from "@/api/collaboration/collaboration.mutation";
import { toast } from "sonner";
import { useGetErrorMessage } from "@/lib/utils";

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
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setProposal("");
    setSelectedFile(null);
    setImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

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
    // Briefly hide interest modal while picking/cropping an image
    setShowShowInterestModal(false);
    setShowImageUploadModal(true);
  };

  const handleImageFromModal = (imageUrl: string, file: File) => {
    setSelectedFile(file);
    setImagePreviewUrl(imageUrl);
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
        media: selectedFile ? [selectedFile] : undefined,
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
                disabled={isSubmitting}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors disabled:opacity-50"
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

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            aria-hidden="true"
          />

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
                aria-label="Add image to your proposal"
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
        onImageSelect={handleImageFromModal}
        initialImage={imagePreviewUrl}
      />
    </>
  );
};

export default ShowInterestModal;
