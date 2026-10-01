"use client";

import { isRouteActive } from "@/components/navigation/sidebar/sidebar-links";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type MobileTab = {
  title: string;
  href?: string;
  icon: "home" | "projects" | "messages" | "workspace" | "showcase";
};

const tabs: MobileTab[] = [
  { title: "Home", href: "/dashboard", icon: "home" },
  { title: "Projects", href: "/dashboard/projects", icon: "projects" },
  { title: "Messages", href: "/dashboard/messages", icon: "messages" },
  // { title: "Workspace", icon: "workspace" },
  // { title: "Showcase", icon: "showcase" },
];

const iconSrc: Record<Exclude<MobileTab["icon"], "workspace">, string> = {
  home: "/images/mobile-nav/home.svg",
  projects: "/images/mobile-nav/projects.svg",
  messages: "/images/mobile-nav/messages.svg",
  showcase: "/images/mobile-nav/showcase.svg",
};

const Glyph = ({
  icon,
  active,
}: {
  icon: MobileTab["icon"];
  active: boolean;
}) => {
  const color = active ? "bg-[#6155F5]" : "bg-[#808080]";

  if (icon === "workspace") {
    return (
      <span className="relative h-[22px] w-6 shrink-0" aria-hidden>
        <span
          className={cn(
            "absolute top-0 left-0 size-[10px] rounded-[1px]",
            color,
          )}
        />
        <span
          className={cn(
            "absolute top-0 left-3 h-[10px] w-3 rounded-[1px]",
            color,
          )}
        />
        <span
          className={cn(
            "absolute top-3 left-0 h-[10px] w-3 rounded-[1px]",
            color,
          )}
        />
        <span
          className={cn(
            "absolute top-3 left-[14px] size-[10px] rounded-[1px]",
            color,
          )}
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn("inline-block size-6 shrink-0", color)}
      style={{
        WebkitMaskImage: `url(${iconSrc[icon]})`,
        maskImage: `url(${iconSrc[icon]})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    />
  );
};

const MobileBottomNav = () => {
  const pathname = usePathname();
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (!hint) return;
    const timeout = window.setTimeout(() => setHint(null), 1400);
    return () => window.clearTimeout(timeout);
  }, [hint]);

  return (
    <nav
      aria-label="Dashboard"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[rgba(233,233,233,0.91)] bg-white pb-[env(safe-area-inset-bottom)] lg:hidden dark:border-[#80808026] dark:bg-background"
    >
      <div className="mx-auto flex h-[72px] w-full max-w-[402px] items-center justify-between px-[29px]">
        {tabs.map((tab) => {
          const active = tab.href ? isRouteActive(pathname, tab.href) : false;
          const showHint = hint === tab.title;
          const className =
            "relative flex size-6 shrink-0 items-center justify-center";

          const label = showHint ? (
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 rounded-[20px] bg-[#211E1E] px-3 py-1 font-sora text-[12px] leading-[1.62] font-normal whitespace-nowrap text-white"
            >
              {tab.title}
            </span>
          ) : null;

          if (!tab.href) {
            return (
              <button
                key={tab.title}
                type="button"
                aria-label={tab.title}
                className={className}
                onClick={() => setHint(tab.title)}
              >
                {label}
                <Glyph icon={tab.icon} active={active} />
              </button>
            );
          }

          return (
            <Link
              key={tab.title}
              href={tab.href}
              aria-label={tab.title}
              aria-current={active ? "page" : undefined}
              className={className}
              onClick={() => setHint(tab.title)}
            >
              {label}
              <Glyph icon={tab.icon} active={active} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
