"use client";

import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import { Folder, Home, Message, ShoppingCart, Task } from "iconsax-reactjs";
import SidebarLinks from "./sidebar-links";
import { sideBarRoute } from "@/types";
import { Lightbulb } from "lucide-react";

export const mainDashBoardRoutes: sideBarRoute[] = [
    {
      title: "Home",
      icon: Home,
      route: "/dashboard",
    },
    {
      title: "Ideas",
      icon: Lightbulb,
      route: "/dashboard/ideas",
    },
    {
      title: "Projects",
      icon: Folder,
      route: "/dashboard/projects",
    },
    {
      title: "Requests",
      icon: Task,
      route: "/dashboard/requests",
    },
    {
      title: "Messages",
      icon: Message,
      route: "/dashboard/messages",
    },
    {
      title: "Workspace",
      icon: Task,
      route: "/",
      comingSoon: true,
    },
    {
      title: "Showcase",
      icon: ShoppingCart,
      route: "/",
      comingSoon: true,
    },
  ];

const Sidebar = () => {
  const { toggleNewIdeaModal } = useGeneralStateStore();

  return (
    <div
      // className="flex h-[calc(100vh-9rem)] flex-col gap-4 border-r border-[#E9E9E9] pr-4"
      className="flex h-[calc(100vh-96px)] w-[234px] flex-col overflow-y-auto border-r border-[rgba(233,233,233,0.91)] bg-white pt-[13px] pl-4 dark:border-[#80808026] dark:bg-transparent"
    >
      <button
        type="button"
        onClick={toggleNewIdeaModal}
        className="flex h-[42px] w-[205px] cursor-pointer items-center justify-center gap-2 rounded-[100px] bg-[#211E1E] text-sm font-normal leading-5 text-white dark:bg-[#6155F5]"
      >
        <img src="/images/sidebar/new-idea.svg" alt="" />
        New idea
      </button>

      <div className="mt-6 flex flex-col gap-2">
        {mainDashBoardRoutes.map((route) => (
          <SidebarLinks key={route.title} route={route} />
        ))}
      </div>

      {/* {mainDashBoardRoutes.map((route) => (
        <Link key={route.title} href={route.route}>
          <div className="flex items-center gap-2">
            {route.icon}
            <p>{route.title}</p>
          </div>
        </Link>
      ))} */}
    </div>
  );
};

export default Sidebar;
