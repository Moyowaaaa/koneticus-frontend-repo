"use client";

import Modal from "@/components/ui-components/modal";
import ButtonV2 from "@/components/ui-components/button";
import {
  Clock,
  Edit2,
  Trash,
  RotateLeft,
  RotateRight,
  Refresh,
  Add,
} from "iconsax-reactjs";
import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ModalView = "upload" | "preview" | "edit";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type SelectedImageItem = {
  url: string;
  file: File;
};

type EditableImage = {
  id: string;
  file: File;
  previewUrl: string;
  originalUrl: string;
};

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Prefer this for multi-image flows (ideas + chat). */
  onImagesSelect: (images: SelectedImageItem[]) => void;
  maxImages?: number;
  initialImages?: SelectedImageItem[];
  title?: string;
  uploadHint?: string;
  showShareQuota?: boolean;
}

const DEFAULT_CROP: CropArea = { x: 10, y: 10, width: 80, height: 80 };
const MAX_IMAGES_DEFAULT = 4;

let editableImageSeq = 0;

const createEditableImage = (file: File): EditableImage => {
  editableImageSeq += 1;
  const previewUrl = URL.createObjectURL(file);
  return {
    id: `upload-${editableImageSeq}-${file.name}-${file.size}`,
    file,
    previewUrl,
    originalUrl: previewUrl,
  };
};

const getInitialImages = (
  open: boolean,
  maxImages: number,
  initialImages?: SelectedImageItem[],
) => {
  if (!open || !initialImages?.length) return [];
  return initialImages.slice(0, maxImages).map((item) =>
    createEditableImage(item.file),
  );
};

const ImageUploadModal = (props: ImageUploadModalProps) => (
  <ImageUploadModalContent key={props.open ? "open" : "closed"} {...props} />
);

const ImageUploadModalContent = ({
  open,
  onOpenChange,
  onImagesSelect,
  maxImages = MAX_IMAGES_DEFAULT,
  initialImages,
  title = "Image upload",
  uploadHint = "Share a pic that shows off your idea!",
  showShareQuota = true,
}: ImageUploadModalProps) => {
  const [images, setImages] = useState<EditableImage[]>(() =>
    getInitialImages(open, maxImages, initialImages),
  );
  const [view, setView] = useState<ModalView>(
    images.length > 0 ? "preview" : "upload",
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [cropArea, setCropArea] = useState<CropArea>(DEFAULT_CROP);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<EditableImage[]>([]);
  const handedOffRef = useRef(false);

  const activeImage = images[activeIndex] ?? null;
  const canAddMore = images.length < maxImages;

  const revokeImageUrls = useCallback((items: EditableImage[]) => {
    for (const item of items) {
      if (item.previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(item.previewUrl);
      }
      if (
        item.originalUrl !== item.previewUrl &&
        item.originalUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(item.originalUrl);
      }
    }
  }, []);

  const resetCropControls = useCallback(() => {
    setRotation(0);
    setCropArea(DEFAULT_CROP);
  }, []);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      if (!handedOffRef.current) {
        revokeImageUrls(imagesRef.current);
      }
    };
  }, [revokeImageUrls]);

  const appendFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (incoming.length === 0) return;

    setImages((prev) => {
      const remaining = maxImages - prev.length;
      if (remaining <= 0) return prev;

      const nextItems = incoming.slice(0, remaining).map(createEditableImage);
      const next = [...prev, ...nextItems];
      setActiveIndex(prev.length);
      setView("preview");
      resetCropControls();
      return next;
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      appendFiles(event.target.files);
    }
    event.target.value = "";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteActive = () => {
    setImages((prev) => {
      const target = prev[activeIndex];
      if (!target) return prev;

      revokeImageUrls([target]);
      const next = prev.filter((_, index) => index !== activeIndex);

      if (next.length === 0) {
        setView("upload");
        setActiveIndex(0);
      } else {
        setActiveIndex((current) =>
          Math.min(current, Math.max(next.length - 1, 0)),
        );
        setView("preview");
      }

      resetCropControls();
      return next;
    });
  };

  const handleBack = () => {
    if (view === "edit") {
      resetCropControls();
      setView("preview");
      return;
    }
    onOpenChange(false);
  };

  const handleContinue = () => {
    if (images.length === 0) return;
    handedOffRef.current = true;
    onImagesSelect(
      images.map((image) => ({
        url: image.previewUrl,
        file: image.file,
      })),
    );
    setImages([]);
    setActiveIndex(0);
    setView("upload");
    resetCropControls();
    onOpenChange(false);
  };

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const applyCrop = useCallback(async () => {
    if (!activeImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sourceUrl = activeImage.originalUrl;
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image for crop"));
      img.src = sourceUrl;
    });

    const cropX = (cropArea.x / 100) * img.width;
    const cropY = (cropArea.y / 100) * img.height;
    const cropWidth = (cropArea.width / 100) * img.width;
    const cropHeight = (cropArea.height / 100) * img.height;

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
        cropWidth,
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
        cropHeight,
      );
    }
    ctx.restore();

    await new Promise<void>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve();
            return;
          }

          const newUrl = URL.createObjectURL(blob);
          const newFile = new File(
            [blob],
            activeImage.file.name || "cropped-image.jpg",
            { type: "image/jpeg" },
          );

          setImages((prev) =>
            prev.map((image, index) => {
              if (index !== activeIndex) return image;
              if (
                image.previewUrl !== image.originalUrl &&
                image.previewUrl.startsWith("blob:")
              ) {
                URL.revokeObjectURL(image.previewUrl);
              }
              return {
                ...image,
                previewUrl: newUrl,
                file: newFile,
              };
            }),
          );
          resolve();
        },
        "image/jpeg",
        0.9,
      );
    });
  }, [activeImage, activeIndex, cropArea, rotation]);

  const handleSaveEdit = async () => {
    await applyCrop();
    resetCropControls();
    setView("preview");
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
            case "sw": {
              const newWidthSw = Math.max(20, width - deltaX);
              const newXSw = x + (width - newWidthSw);
              if (newXSw >= 0) {
                x = newXSw;
                width = newWidthSw;
              }
              height = Math.max(20, Math.min(100 - y, height + deltaY));
              break;
            }
            case "ne": {
              width = Math.max(20, Math.min(100 - x, width + deltaX));
              const newHeightNe = Math.max(20, height - deltaY);
              const newYNe = y + (height - newHeightNe);
              if (newYNe >= 0) {
                y = newYNe;
                height = newHeightNe;
              }
              break;
            }
            case "nw": {
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
          }

          return { x, y, width, height };
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    },
    [isDragging, isResizing, dragStart],
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
      if (!handedOffRef.current) {
        revokeImageUrls(images);
      }
      handedOffRef.current = false;
      setImages([]);
      setActiveIndex(0);
      setView("upload");
      resetCropControls();
    }
    onOpenChange(isOpen);
  };

  const modalTitle = view === "edit" ? "Edit" : title;

  return (
    <Modal
      open={open}
      onOpenChange={handleModalClose}
      title={modalTitle}
      className="flex flex-col gap-4"
    >
      <div className="flex min-h-[300px] flex-col gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="hidden" />

        {view === "upload" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
            <div className="flex h-20 w-20 items-center justify-center">
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
              </svg>
            </div>

            <p className="text-center text-[0.875rem] text-brand-grey">
              {uploadHint}
            </p>
            <p className="text-center text-xs text-brand-grey">
              Up to {maxImages} images
            </p>

            <ButtonV2 onClick={handleUploadClick} className="h-10 min-h-10 px-6">
              <p className="text-[0.875rem]">+ Upload</p>
            </ButtonV2>
          </div>
        )}

        {view === "preview" && activeImage && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="relative aspect-4/3 w-full max-w-[400px] overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={activeImage.previewUrl}
                alt={`Selected image ${activeIndex + 1}`}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex w-full max-w-[400px] items-center gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    resetCropControls();
                  }}
                  className={cn(
                    "relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                    index === activeIndex
                      ? "border-[#6155F5]"
                      : "border-transparent opacity-80 hover:opacity-100",
                  )}
                  aria-label={`Select image ${index + 1}`}
                >
                  <Image
                    src={image.previewUrl}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}

              {canAddMore && (
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#C7C2FF] bg-lavender text-[#6155F5] transition-colors hover:bg-[#E6E4FF]"
                  aria-label="Add more images"
                >
                  <Add size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setView("edit");
                  resetCropControls();
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E4FF] transition-colors hover:bg-[#E0DDFF]"
                aria-label="Edit image"
              >
                <Edit2 size={18} variant="Bold" className="text-[#6155F5]" />
              </button>
              <button
                type="button"
                onClick={handleDeleteActive}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E4FF] transition-colors hover:bg-[#E0DDFF]"
                aria-label="Delete image"
              >
                <Trash size={18} variant="Bold" className="text-[#6155F5]" />
              </button>
            </div>

            <p className="text-xs text-brand-grey">
              {images.length}/{maxImages} selected
            </p>
          </div>
        )}

        {view === "edit" && activeImage && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              ref={imageContainerRef}
              className="relative aspect-4/3 w-full max-w-[400px] select-none overflow-hidden rounded-lg bg-gray-100"
            >
              <Image
                src={activeImage.originalUrl}
                alt="Image to edit"
                fill
                className="pointer-events-none object-cover"
                style={{ transform: `rotate(${rotation}deg)` }}
                draggable={false}
              />

              <div className="pointer-events-none absolute inset-0">
                <div
                  className="absolute top-0 right-0 left-0 bg-black/50"
                  style={{ height: `${cropArea.y}%` }}
                />
                <div
                  className="absolute right-0 bottom-0 left-0 bg-black/50"
                  style={{ height: `${100 - cropArea.y - cropArea.height}%` }}
                />
                <div
                  className="absolute left-0 bg-black/50"
                  style={{
                    top: `${cropArea.y}%`,
                    height: `${cropArea.height}%`,
                    width: `${cropArea.x}%`,
                  }}
                />
                <div
                  className="absolute right-0 bg-black/50"
                  style={{
                    top: `${cropArea.y}%`,
                    height: `${cropArea.height}%`,
                    width: `${100 - cropArea.x - cropArea.width}%`,
                  }}
                />
              </div>

              <div
                className="absolute cursor-move border-2 border-white"
                style={{
                  left: `${cropArea.x}%`,
                  top: `${cropArea.y}%`,
                  width: `${cropArea.width}%`,
                  height: `${cropArea.height}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, "move")}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute top-0 bottom-0 left-1/3 w-px bg-white/50" />
                  <div className="absolute top-0 bottom-0 left-2/3 w-px bg-white/50" />
                  <div className="absolute top-1/3 right-0 left-0 h-px bg-white/50" />
                  <div className="absolute top-2/3 right-0 left-0 h-px bg-white/50" />
                </div>

                <div
                  className="absolute -top-2 -left-2 h-4 w-4 cursor-nw-resize rounded-full bg-white shadow-md"
                  onMouseDown={(e) => handleMouseDown(e, "nw")}
                />
                <div
                  className="absolute -top-2 -right-2 h-4 w-4 cursor-ne-resize rounded-full bg-white shadow-md"
                  onMouseDown={(e) => handleMouseDown(e, "ne")}
                />
                <div
                  className="absolute -bottom-2 -left-2 h-4 w-4 cursor-sw-resize rounded-full bg-white shadow-md"
                  onMouseDown={(e) => handleMouseDown(e, "sw")}
                />
                <div
                  className="absolute -right-2 -bottom-2 h-4 w-4 cursor-se-resize rounded-full bg-white shadow-md"
                  onMouseDown={(e) => handleMouseDown(e, "se")}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleRotateLeft}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E4FF] transition-colors hover:bg-[#E0DDFF]"
                aria-label="Rotate left"
              >
                <RotateLeft size={18} className="text-[#6155F5]" />
              </button>
              <button
                type="button"
                onClick={resetCropControls}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E4FF] transition-colors hover:bg-[#E0DDFF]"
                aria-label="Reset crop controls"
                title="Reset"
              >
                <Refresh size={18} className="text-[#6155F5]" />
              </button>
              <button
                type="button"
                onClick={handleRotateRight}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6E4FF] transition-colors hover:bg-[#E0DDFF]"
                aria-label="Rotate right"
              >
                <RotateRight size={18} className="text-[#6155F5]" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-[#E9E9E9] pt-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 items-center gap-2 rounded-full border border-[#E9E9E9] px-4 text-[0.875rem] text-brand-black transition-colors hover:bg-gray-50"
          >
            <span>←</span> Back
          </button>

          {view === "upload" && showShareQuota && (
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
              disabled={images.length === 0}
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
