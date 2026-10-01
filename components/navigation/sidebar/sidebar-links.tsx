"use client";

import { sideBarRoute } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const iconSrc: Record<string, { src: string; width: number; height: number }> = {
  Home: { src: "/images/sidebar/home.svg", width: 13.3333, height: 13.3333 },
  Ideas: { src: "/images/sidebar/ideas.svg", width: 13, height: 16.1009 },
  Projects: { src: "/images/sidebar/projects.svg", width: 13, height: 13 },
  Messages: { src: "/images/sidebar/messages.svg", width: 13, height: 13 },
  Showcase: { src: "/images/sidebar/showcase.svg", width: 13, height: 13 },
};

export const isRouteActive = (pathname: string, route: string) => {
  if (route === "/dashboard") return pathname === "/dashboard";
  if (route === "/") return false;
  return pathname === route || pathname.startsWith(`${route}/`);
};

const iconColorClass = (active: boolean) =>
  cn(
    "bg-[#808080] transition-colors group-hover:bg-[#6155F5]",
    active && "bg-[#6155F5]",
  );

export const NavIcon = ({
  title,
  active,
}: {
  title: string;
  active: boolean;
}) => {
  if (title === "Workspace") {
    return (
      <span className="relative h-[11.92px] w-[13px] shrink-0" aria-hidden>
        <span className={cn("absolute left-0 top-0 size-[5.42px] rounded-[1px]", iconColorClass(active))} />
        <span className={cn("absolute left-[6.5px] top-0 h-[5.42px] w-[6.5px] rounded-[1px]", iconColorClass(active))} />
        <span className={cn("absolute left-0 top-[6.5px] h-[5.42px] w-[6.5px] rounded-[1px]", iconColorClass(active))} />
        <span className={cn("absolute left-[7.58px] top-[6.5px] size-[5.42px] rounded-[1px]", iconColorClass(active))} />
      </span>
    );
  }

  const icon = iconSrc[title];
  if (!icon) return null;

  return (
    <span
      aria-hidden
      className={cn("inline-block shrink-0", iconColorClass(active))}
      style={{
        width: icon.width,
        height: icon.height,
        WebkitMaskImage: `url(${icon.src})`,
        maskImage: `url(${icon.src})`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
      }}
    />
  );
};

const SidebarLinks = ({ route }: { route: sideBarRoute }) => {
  const pathname = usePathname();
  const active = isRouteActive(pathname, route.route);
  const FallbackIcon = route.icon;

  const row = (
    <div
      className={cn(
        "group relative flex h-[42px] w-[205px] items-center rounded-[10px] px-4 transition-colors hover:bg-lavender",
        active && "rounded-[50px] bg-white",
        !route.comingSoon && "cursor-pointer",
      )}
    >
      <div className="flex items-center gap-2">
        {iconSrc[route.title] || route.title === "Workspace" ? (
          <NavIcon title={route.title} active={active} />
        ) : (
          <FallbackIcon
            size="13"
            variant="Bold"
            color="currentColor"
            className={cn(
              "text-[#808080] transition-colors group-hover:text-[#6155F5]",
              active && "text-[#6155F5]",
            )}
          />
        )}
        <p
          className={cn(
            "text-sm font-normal leading-5 text-[#808080] transition-colors group-hover:text-[#6155F5]",
            active && "text-[#6155F5]",
          )}
        >
          {route.title}
        </p>
      </div>

      {route.comingSoon && (
        <div className="absolute left-[122px] top-1/2 flex h-[21px] w-[77px] -translate-y-1/2 items-center justify-center rounded-[20px] bg-[#6155F5] text-[10px] font-normal leading-[1.62] text-white shadow-[inset_0px_0px_15px_0px_rgba(0,0,0,0.4)]">
          Coming soon
        </div>
      )}
    </div>
  );

  if (route.comingSoon) return row;

  return <Link href={route.route}>{row}</Link>;
};

export default SidebarLinks;
