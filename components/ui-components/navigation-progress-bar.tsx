"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// Simple navigation event emitter for Next.js App Router
// This version doesn't use useSearchParams to avoid the Suspense requirement
export function useNavigationListener() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store previous pathname to detect changes
  const prevPathnameRef = useRef(pathname);

  // Function to start navigation indicator
  const startNavigation = useCallback(() => {
    setIsNavigating(true);
  }, []);

  // Function to complete navigation
  const completeNavigation = useCallback(() => {
    // Add a small delay to make the loading state visible
    navigationTimeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  }, []);

  // Add click event listener to detect navigation before it happens
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Check if the click is on an anchor tag
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.target &&
        !anchor.hasAttribute("download") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        // This is likely a navigation link - show loading state
        startNavigation();
      }
    };

    // Add click handler to detect navigation start
    document.addEventListener("click", handleLinkClick);

    // Add form submit handler
    const handleFormSubmit = () => {
      startNavigation();
    };

    document.addEventListener("submit", handleFormSubmit);

    return () => {
      document.removeEventListener("click", handleLinkClick);
      document.removeEventListener("submit", handleFormSubmit);

      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [startNavigation]);

  // Detect pathname changes to know when navigation completes
  useEffect(() => {
    const currentPathname = pathname;

    // If pathname changed and we're in a navigating state, complete the navigation
    if (currentPathname !== prevPathnameRef.current && isNavigating) {
      completeNavigation();
    }

    // Update the previous pathname
    prevPathnameRef.current = currentPathname;

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [pathname, isNavigating, completeNavigation]);

  return { isNavigating };
}

// Example loading bar component using the navigation listener
export default function NavigationProgressBar() {
  const { isNavigating } = useNavigationListener();
  const [progress, setProgress] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressResetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wasNavigatingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const scheduleProgressValue = (value: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(() => {
      setProgress(value);
      animationFrameRef.current = null;
    });
  };

  useEffect(() => {
    if (isNavigating) {
      wasNavigatingRef.current = true;
      if (progressResetTimeoutRef.current) {
        clearTimeout(progressResetTimeoutRef.current);
        progressResetTimeoutRef.current = null;
      }

      scheduleProgressValue(0);

      // Simulate progress with an interval
      if (!progressIntervalRef.current) {
        progressIntervalRef.current = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 90) {
              return prevProgress + 0.2;
            } else if (prevProgress >= 60) {
              return prevProgress + 1;
            } else {
              return prevProgress + 3;
            }
          });
        }, 100);
      }
    } else if (wasNavigatingRef.current) {
      wasNavigatingRef.current = false;

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      scheduleProgressValue(100);

      progressResetTimeoutRef.current = setTimeout(() => {
        scheduleProgressValue(0);
        progressResetTimeoutRef.current = null;
      }, 300);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (progressResetTimeoutRef.current) {
        clearTimeout(progressResetTimeoutRef.current);
        progressResetTimeoutRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isNavigating]);

  if (!isNavigating && progress === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1">
      <div
        className="h-full bg-black transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress < 100 ? 1 : 0,
        }}
      />
    </div>
  );
}
