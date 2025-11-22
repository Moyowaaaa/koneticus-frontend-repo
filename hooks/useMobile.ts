import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom React hook that determines if the current window width is below
 * a specified mobile breakpoint, indicating a mobile device view.
 *
 * **Example**
 * ```tsx
 * const isMobile = useIsMobile();
 * ```
 *
 * @returns {boolean} - Returns true if the window width is less than the
 * MOBILE_BREAKPOINT, otherwise false.
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
        undefined,
    );

    React.useEffect(() => {
        const mql = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
        );
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return () => mql.removeEventListener("change", onChange);
    }, []);

    return !!isMobile;
}
