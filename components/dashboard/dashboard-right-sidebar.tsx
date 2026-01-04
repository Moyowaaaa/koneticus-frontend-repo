"use client";

import { usePathname } from "next/navigation";
import SpotlightFeed from "@/components/dashboard/feed/spotlight-feed";
import MessagesFeed from "@/components/dashboard/feed/messages-feed";

const DashboardRightSidebar = () => {
  const pathname = usePathname();

  // Only show the right sidebar on the main dashboard page
  if (pathname !== "/dashboard") {
    return null;
  }

  return (
    <aside className="hidden w-[28.25rem] fixed top-30 shrink-0 md:block right-10 md:flex flex-col gap-4">
      <SpotlightFeed />
      <MessagesFeed />
    </aside>
  );
};

export default DashboardRightSidebar;
