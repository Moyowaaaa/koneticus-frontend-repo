"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

interface MessageAnimationProps {
  children: React.ReactNode;
  index: number;
}

export function MessageAnimation({ children, index }: MessageAnimationProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const delay = index > 3 ? (index - 3) * 0.005 : 0;

  useLayoutEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          delay,
          duration: 0.1,
          ease: "power1.out",
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, [delay]);

  return <div ref={wrapperRef}>{children}</div>;
}
