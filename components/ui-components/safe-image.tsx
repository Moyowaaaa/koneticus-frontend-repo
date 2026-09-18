"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export const GENERIC_AVATAR_SRC = "/images/generic-avatar.svg";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src?: ImageProps["src"] | null;
  fallbackSrc?: ImageProps["src"];
};

const SafeImage = ({
  src,
  fallbackSrc = GENERIC_AVATAR_SRC,
  alt,
  onError,
  ...props
}: SafeImageProps) => {
  const resolvedSrc = src || fallbackSrc;
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const currentSrc = failedSrc === resolvedSrc ? fallbackSrc : resolvedSrc;

  return (
    <Image
      {...props}
      src={currentSrc}
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
