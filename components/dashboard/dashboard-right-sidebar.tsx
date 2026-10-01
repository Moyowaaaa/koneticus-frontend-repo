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
    <aside className="sticky top-0 hidden w-[388px] shrink-0 self-start md:block">
      <div className="flex h-[calc(100vh)] w-[388px] flex-col gap-5 overflow-y-auto pb-20 pt-24">
        <SpotlightFeed />
        <MessagesFeed />
      </div>
    </aside>
  );
};

export default DashboardRightSidebar;
