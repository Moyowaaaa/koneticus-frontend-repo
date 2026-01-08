"use client";

import Modal from "@/components/ui-components/modal";
import ButtonV2 from "@/components/ui-components/button";
import {
  Clock,
  Edit2,
  Trash,
  Crop,
  RotateLeft,
  RotateRight,
} from "iconsax-reactjs";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

type ModalView = "upload" | "preview" | "edit";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageSelect: (imageUrl: string, file: File) => void;
  initialImage?: string | null;
}

const ImageUploadModal = ({
  open,
  onOpenChange,
  onImageSelect,
  initialImage,
}: ImageUploadModalProps) => {
  const [view, setView] = useState<ModalView>(
    initialImage ? "preview" : "upload"
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    initialImage || null
  );
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      setOriginalImageUrl(previewUrl);
      setView("preview");
      setRotation(0);
      setCropArea({ x: 10, y: 10, width: 80, height: 80 });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDelete = () => {
    if (imagePreviewUrl && !initialImage) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    if (originalImageUrl && originalImageUrl !== imagePreviewUrl) {
      URL.revokeObjectURL(originalImageUrl);
    }
    setSelectedImage(null);
    setImagePreviewUrl(null);
    setOriginalImageUrl(null);
    setView("upload");
    setRotation(0);
    setCropArea({ x: 10, y: 10, width: 80, height: 80 });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    if (view === "edit") {
      setView("preview");
    } else {
      onOpenChange(false);
    }
  };

  const handleContinue = () => {
    if (imagePreviewUrl && selectedImage) {
      onImageSelect(imagePreviewUrl, selectedImage);
      onOpenChange(false);
    }
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const applyCrop = useCallback(async () => {
    if (!originalImageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = document.createElement("img");
    img.crossOrigin = "anonymous";

    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.src = originalImageUrl;
    });

    // Calculate actual crop dimensions
    const cropX = (cropArea.x / 100) * img.width;
    const cropY = (cropArea.y / 100) * img.height;
    const cropWidth = (cropArea.width / 100) * img.width;
    const cropHeight = (cropArea.height / 100) * img.height;

    // Handle rotation
    let outputWidth = cropWidth;
    let outputHeight = cropHeight;

    if (Math.abs(rotation) === 90 || Math.abs(rotation) === 270) {
      outputWidth = cropHeight;
      outputHeight = cropWidth;
    }

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    if (Math.abs(rotation) === 90 || Math.abs(rotation) === 270) {
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        -cropHeight / 2,
        -cropWidth / 2,
        cropHeight,
        cropWidth
      );
    } else {
      ctx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        -cropWidth / 2,
        -cropHeight / 2,
        cropWidth,
        cropHeight
      );
    }
    ctx.restore();

    // Convert canvas to blob and create new preview URL
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const newUrl = URL.createObjectURL(blob);
          if (imagePreviewUrl && imagePreviewUrl !== originalImageUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
          }
          setImagePreviewUrl(newUrl);

          // Create new file from blob
          const newFile = new File(
            [blob],
            selectedImage?.name || "cropped-image.jpg",
            {
              type: "image/jpeg",
            }
          );
          setSelectedImage(newFile);
        }
      },
      "image/jpeg",
      0.9
    );
  }, [
    originalImageUrl,
    cropArea,
    rotation,
    imagePreviewUrl,
    selectedImage?.name,
  ]);

  const handleSaveEdit = async () => {
    await applyCrop();
    setView("preview");
    setRotation(0);
    setCropArea({ x: 10, y: 10, width: 80, height: 80 });
  };

  const handleMouseDown = (e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (action === "move") {
      setIsDragging(true);
    } else {
      setIsResizing(action);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!imageContainerRef.current) return;

      const rect = imageContainerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
      const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

      if (isDragging) {
        setCropArea((prev) => {
          let newX = prev.x + deltaX;
          let newY = prev.y + deltaY;

          // Constrain to bounds
          newX = Math.max(0, Math.min(100 - prev.width, newX));
          newY = Math.max(0, Math.min(100 - prev.height, newY));

          return { ...prev, x: newX, y: newY };
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      } else if (isResizing) {
        setCropArea((prev) => {
          let { x, y, width, height } = prev;

          switch (isResizing) {
            case "se":
              width = Math.max(20, Math.min(100 - x, width + deltaX));
              height = Math.max(20, Math.min(100 - y, height + deltaY));
              break;
            case "sw":
              const newWidthSw = Math.max(20, width - deltaX);
              const newXSw = x + (width - newWidthSw);
              if (newXSw >= 0) {
                x = newXSw;
                width = newWidthSw;
              }
              height = Math.max(20, Math.min(100 - y, height + deltaY));
              break;
            case "ne":
              width = Math.max(20, Math.min(100 - x, width + deltaX));
              const newHeightNe = Math.max(20, height - deltaY);
              const newYNe = y + (height - newHeightNe);
              if (newYNe >= 0) {
                y = newYNe;
                height = newHeightNe;
              }
              break;
            case "nw":
              const newWidthNw = Math.max(20, width - deltaX);
              const newXNw = x + (width - newWidthNw);
              const newHeightNw = Math.max(20, height - deltaY);
              const newYNw = y + (height - newHeightNw);
              if (newXNw >= 0 && newYNw >= 0) {
                x = newXNw;
                width = newWidthNw;
                y = newYNw;
                height = newHeightNw;
              }
              break;
          }

          return { x, y, width, height };
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, isResizing, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(null);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen) {
      if (!initialImage) {
        setView("upload");
        if (imagePreviewUrl) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
        if (originalImageUrl && originalImageUrl !== imagePreviewUrl) {
          URL.revokeObjectURL(originalImageUrl);
        }
        setSelectedImage(null);
        setImagePreviewUrl(null);
        setOriginalImageUrl(null);
        setRotation(0);
        setCropArea({ x: 10, y: 10, width: 80, height: 80 });
      }
    }
    onOpenChange(isOpen);
  };

  const getTitle = () => {
    return view === "edit" ? "Edit" : "Image upload";
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title={getTitle()}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-4 min-h-[300px]">
        {/* Hidden elements */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Upload View (Empty State) */}
        {view === "upload" && (
          <div className="flex flex-col items-center justify-center flex-1 py-8 gap-4">
            <div className="w-20 h-20 flex items-center justify-center">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M56.6667 53.3333L40 36.6667L23.3334 53.3333"
                  stroke="#8B7BF4"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M40 36.6667V70"
                  stroke="#8B7BF4"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M67.9667 61.3C71.2266 59.5019 73.7823 56.6657 75.2357 53.2371C76.689 49.8085 76.9579 46.0003 76 42.4C75.0421 38.7997 72.9113 35.6292 69.9416 33.4022C66.9719 31.1752 63.3373 29.9257 59.6 29.8333H55.4C54.3405 25.8239 52.388 22.1141 49.6924 18.9756C46.9967 15.8371 43.6277 13.3519 39.8278 11.7051C36.0279 10.0584 31.9002 9.29298 27.7609 9.46689C23.6215 9.6408 19.5726 10.7493 15.9219 12.7102C12.2713 14.671 9.11614 17.4324 6.6919 20.7879C4.2677 24.1434 2.63838 28.0036 1.92442 32.0815C1.21047 36.1594 1.43049 40.3461 2.56804 44.3281C3.70559 48.3101 5.7323 51.9815 8.50002 55.0667"
                  stroke="#8B7BF4"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M56.6667 53.3333L40 36.6667L23.3334 53.3333"
                  stroke="#8B7BF4"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-[0.875rem] text-brand-grey text-center">
              Share a pic that shows off your idea!
            </p>

            <ButtonV2
              onClick={handleUploadClick}
              className="h-10 min-h-10 px-6"
            >
              <p className="text-[0.875rem]">+ Upload</p>
            </ButtonV2>
          </div>
        )}

        {/* Preview View */}
        {view === "preview" && imagePreviewUrl && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative w-full max-w-[400px] aspect-4/3 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imagePreviewUrl}
                alt="Selected image preview"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setOriginalImageUrl(imagePreviewUrl);
                  setView("edit");
                }}
                className="w-10 h-10 rounded-full bg-[#F0EEFF] flex items-center justify-center
                  hover:bg-[#E0DDFF] transition-colors"
                aria-label="Edit image"
              >
                <Edit2 size={18} className="text-brand-purple" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-10 h-10 rounded-full bg-[#F0EEFF] flex items-center justify-center
                  hover:bg-[#E0DDFF] transition-colors"
                aria-label="Delete image"
              >
                <Trash size={18} className="text-brand-purple" />
              </button>
            </div>
          </div>
        )}

        {/* Edit View with Crop */}
        {view === "edit" && (originalImageUrl || imagePreviewUrl) && (
          <div className="flex flex-col items-center gap-4 py-4">
            {/* Image with Crop Overlay */}
            <div
              ref={imageContainerRef}
              className="relative w-full max-w-[400px] aspect-4/3 rounded-lg overflow-hidden bg-gray-100 select-none"
            >
              <Image
                src={originalImageUrl || imagePreviewUrl || ""}
                alt="Image to edit"
                fill
                className="object-cover pointer-events-none"
                style={{ transform: `rotate(${rotation}deg)` }}
                draggable={false}
              />

              {/* Dark overlay outside crop area */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top */}
                <div
                  className="absolute bg-black/50 left-0 right-0 top-0"
                  style={{ height: `${cropArea.y}%` }}
                />
                {/* Bottom */}
                <div
                  className="absolute bg-black/50 left-0 right-0 bottom-0"
                  style={{ height: `${100 - cropArea.y - cropArea.height}%` }}
                />
                {/* Left */}
                <div
                  className="absolute bg-black/50 left-0"
                  style={{
                    top: `${cropArea.y}%`,
                    height: `${cropArea.height}%`,
                    width: `${cropArea.x}%`,
                  }}
                />
                {/* Right */}
                <div
                  className="absolute bg-black/50 right-0"
                  style={{
                    top: `${cropArea.y}%`,
                    height: `${cropArea.height}%`,
                    width: `${100 - cropArea.x - cropArea.width}%`,
                  }}
                />
              </div>

              {/* Crop selection box */}
              <div
                className="absolute border-2 border-white cursor-move"
                style={{
                  left: `${cropArea.x}%`,
                  top: `${cropArea.y}%`,
                  width: `${cropArea.width}%`,
                  height: `${cropArea.height}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, "move")}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50" />
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50" />
                </div>

                {/* Corner resize handles */}
                <div
                  className="absolute -top-2 -left-2 w-4 h-4 bg-white rounded-full cursor-nw-resize shadow-md"
                  onMouseDown={(e) => handleMouseDown(e, "nw")}
                />
                <div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full cursor-ne-resize shadow-md"
                  onMouseDown={(e) => handleMouseDown(e, "ne")}
                />
                <div
                  className="absolute -bottom-2 -left-2 w-4 h-4 bg-white rounded-full cursor-sw-resize shadow-md"
                  onMouseDown={(e) => handleMouseDown(e, "sw")}
                />
                <div
                  className="absolute -bottom-2 -right-2 w-4 h-4 bg-white rounded-full cursor-se-resize shadow-md"
                  onMouseDown={(e) => handleMouseDown(e, "se")}
                />
              </div>
            </div>

            {/* Edit Tools */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRotateLeft}
                className="w-10 h-10 rounded-full bg-[#F0EEFF] flex items-center justify-center
                  hover:bg-[#E0DDFF] transition-colors"
                aria-label="Rotate left"
              >
                <RotateLeft size={18} className="text-brand-purple" />
              </button>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center"
                aria-label="Crop (active)"
              >
                <Crop size={18} className="text-white" />
              </button>
              <button
                type="button"
                onClick={handleRotateRight}
                className="w-10 h-10 rounded-full bg-[#F0EEFF] flex items-center justify-center
                  hover:bg-[#E0DDFF] transition-colors"
                aria-label="Rotate right"
              >
                <RotateRight size={18} className="text-brand-purple" />
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#E9E9E9]">
          <button
            type="button"
            onClick={handleBack}
            className="h-10 px-4 rounded-full border border-[#E9E9E9]
              flex items-center gap-2 hover:bg-gray-50 transition-colors
              text-[0.875rem] text-brand-black"
          >
            <span>←</span> Back
          </button>

          {view === "upload" && (
            <div className="flex items-center gap-1">
              <Clock size={13} className="text-brand-grey" />
              <p className="text-[0.875rem] text-brand-grey">
                <span className="text-brand-black">3</span> monthly shares left
              </p>
            </div>
          )}

          {view === "preview" && (
            <ButtonV2
              onClick={handleContinue}
              className="h-10 min-h-10 px-6"
              disabled={!imagePreviewUrl}
            >
              <p className="text-[0.875rem]">Continue</p>
            </ButtonV2>
          )}

          {view === "edit" && (
            <ButtonV2 onClick={handleSaveEdit} className="h-10 min-h-10 px-6">
              <p className="text-[0.875rem]">Save</p>
            </ButtonV2>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ImageUploadModal;
