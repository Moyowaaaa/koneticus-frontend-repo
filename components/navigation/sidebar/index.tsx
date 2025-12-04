"use client";

import ButtonV2 from "@/components/ui-components/button";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";
import {
  AddCircle,
  Folder,
  FormatSquare,
  Home,
  Message,
  ShoppingCart,
} from "iconsax-reactjs";
import SidebarLinks from "./sidebar-links";
import { sideBarRoute } from "@/types";

const Sidebar = () => {
  const { toggleNewIdeaModal } = useGeneralStateStore();

  const mainDashBoardRoutes: sideBarRoute[] = [
    {
      title: "Home",
      icon: Home,
      route: "/dashboard",
    },
    {
      title: "Projects",
      icon: Folder,
      route: "/dashboard/projects",
    },
    {
      title: "Messages",
      icon: Message,
      route: "/dashboard/messages",
    },
    {
      title: "Workspace",
      icon: FormatSquare,
      route: "/dashboard/messages",
      comingSoon: true,
    },
    {
      title: "Showcase",
      icon: ShoppingCart,
      route: "/dashboard/messages",
      comingSoon: true,
    },
  ];

  return (
    <div
      // className="flex h-[calc(100vh-9rem)] flex-col gap-4 border-r border-[#E9E9E9] pr-4"
      className="flex h-[83vh] flex-col gap-4 border-r border-[#E9E9E9] pr-2 pt-8"
    >
      <div className="rounded-2xl bg-white/80   ">
        <ButtonV2
          IconPlacement="left"
          className="h-[2.625rem] w-full min-w-[12rem] rounded-[6.25rem] border-none bg-brand-black outline-none"
          Icon={<AddCircle size="13" color="white" variant="Bold" />}
          onClick={toggleNewIdeaModal}
        >
          New idea
        </ButtonV2>
      </div>

      <div className="flex flex-col gap-2">
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
