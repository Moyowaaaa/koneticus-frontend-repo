"use client";

import Image from "next/image";
import { FeedMedia } from "@/api/feed/feed.model";
import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/ui-components/modal";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaGridProps {
  media: FeedMedia[];
  alt?: string;
}

const MediaGrid = ({ media, alt = "Media" }: MediaGridProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const count = media?.length ?? 0;

  const openImage = (index: number) => setSelectedIndex(index);
  const closeImage = useCallback(() => setSelectedIndex(null), []);

  const goToPrevious = useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const goToNext = useCallback(() => {
    if (selectedIndex !== null && selectedIndex < count - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, count]);

  // Keyboard navigation: Arrow keys + Escape
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
        case "Escape":
          e.preventDefault();
          closeImage();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, goToPrevious, goToNext, closeImage]);

  if (!media || media.length === 0) return null;

  const hasMultiple = count > 1;
  const hasPrevious = selectedIndex !== null && selectedIndex > 0;
  const hasNext = selectedIndex !== null && selectedIndex < count - 1;

  const imageModalContent = selectedIndex !== null && media[selectedIndex] && (
    <div className="relative w-full h-[60vh] flex items-center justify-center">
      {/* Current Image */}
      <div className="relative w-full h-full">
        <Image
          src={media[selectedIndex].url}
          alt={`Image ${selectedIndex + 1}`}
          fill
          className="object-contain"
        />
      </div>

      {hasMultiple && (
        <>
          {hasPrevious && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
        </>
      )}

      {hasMultiple && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
          {selectedIndex + 1} / {count}
        </div>
      )}
    </div>
  );

  if (count === 1) {
    return (
      <>
        <div className="w-full aspect-video mt-2 rounded-xl overflow-hidden relative">
          <Image
            src={media[0].url}
            alt={alt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => openImage(0)}
          />
        </div>
        <Modal
          open={selectedIndex !== null}
          onOpenChange={(open) => !open && closeImage()}
          className="sm:max-w-4xl"
          containerClassname="bg-black dark:bg-black"
          childrenClassName="p-0"
        >
          {imageModalContent}
        </Modal>
      </>
    );
  }

  if (count === 2) {
    return (
      <>
        <div className="w-full mt-2 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
          {media.map((item, index) => (
            <div
              key={item._id}
              className="relative aspect-square overflow-hidden"
            >
              <Image
                src={item.url}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => openImage(index)}
              />
            </div>
          ))}
        </div>
        <Modal
          open={selectedIndex !== null}
          onOpenChange={(open) => !open && closeImage()}
          className="sm:max-w-4xl"
          containerClassname="bg-black dark:bg-black"
          childrenClassName="p-0"
        >
          {imageModalContent}
        </Modal>
      </>
    );
  }

  if (count === 3) {
    return (
      <>
        <div className="w-full mt-2 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
          <div className="relative row-span-2 aspect-3/4 overflow-hidden">
            <Image
              src={media[0].url}
              alt={`${alt} 1`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => openImage(0)}
            />
          </div>
          {/* Two images stacked on right */}
          <div className="relative aspect-3/2 overflow-hidden">
            <Image
              src={media[1].url}
              alt={`${alt} 2`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => openImage(1)}
            />
          </div>
          <div className="relative aspect-3/2 overflow-hidden">
            <Image
              src={media[2].url}
              alt={`${alt} 3`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => openImage(2)}
            />
          </div>
        </div>
        <Modal
          open={selectedIndex !== null}
          onOpenChange={(open) => !open && closeImage()}
          className="sm:max-w-4xl"
          containerClassname="bg-black dark:bg-black"
          childrenClassName="p-0"
        >
          {imageModalContent}
        </Modal>
      </>
    );
  }

  const displayMedia = media.slice(0, 4);
  const remainingCount = count - 4;

  return (
    <>
      <div className="w-full mt-2 grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
        {displayMedia.map((item, index) => (
          <div
            key={item._id}
            className="relative aspect-square overflow-hidden"
          >
            <Image
              src={item.url}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => openImage(index)}
            />
            {index === 3 && remainingCount > 0 && (
              <div
                className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
                onClick={() => openImage(3)}
              >
                <span className="text-white text-2xl font-bold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && closeImage()}
        className="sm:max-w-4xl"
        containerClassname="bg-black dark:bg-black"
        childrenClassName="p-0"
      >
        {imageModalContent}
      </Modal>
    </>
  );
};

export default MediaGrid;
