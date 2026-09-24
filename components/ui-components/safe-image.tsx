"use client";

import { useThemeStore } from "@/store/useThemeStore";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export const GENERIC_AVATAR_SRC = "/images/generic-avatar.svg";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: ImageProps["src"] | null;
  fallbackSrc?: ImageProps["src"];
  isKollaboration?: boolean;
};

const SafeImage = ({
  src,
  fallbackSrc = GENERIC_AVATAR_SRC,
  alt,
  onError,
  isKollaboration,
  ...props
}: SafeImageProps) => {
  const resolvedSrc = src || fallbackSrc;
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const currentSrc = failedSrc === resolvedSrc ? fallbackSrc : resolvedSrc;
    const { theme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <Image
      {...props}
      src={isKollaboration ? `/images/document-svgrepo-${!isDark ? "dark" : "light"}.svg` : currentSrc}
      alt={alt}
      onError={(event) => {
        if (resolvedSrc !== fallbackSrc) {
          setFailedSrc(resolvedSrc);
        }
        onError?.(event);
      }}
    />
  );
};

export default SafeImage;
