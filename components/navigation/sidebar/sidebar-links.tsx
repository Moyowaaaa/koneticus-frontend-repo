import { sideBarRoute } from "@/types";
import Link from "next/link";
import React from "react";

const SidebarLinks = ({ route }: { route: sideBarRoute }) => {
  const Icon = route.icon;

  return (
    
    <>
    {route.comingSoon ? (
   <div className="group flex cursor-pointer gap-6 items-center justify-between rounded-[6.25rem] px-3 py-4 transition-colors duration-200 hover:bg-lavender">
   <div className="flex items-center gap-2 text-grey transition-colors duration-200 group-hover:text-primary">
     <Icon
       size="16"
       variant="Bold"
       className="text-grey transition-colors duration-200 group-hover:text-primary"
     />
     <p className="text-sm font-medium">{route.title}</p>
   </div>

   {route.comingSoon && (
     <div
       className="rounded-[1.25rem] bg-primary px-2 py-1 text-xs 
     dark:bg-[#6155F5]
     text-white"
     >
       Coming soon
     </div>
   )}
 </div>
    ) : (
      <Link href={route.route} >
      <div className="group flex cursor-pointer gap-6 items-center justify-between rounded-[6.25rem] px-3 py-4 transition-colors duration-200 hover:bg-lavender">
        <div className="flex items-center gap-2 text-grey transition-colors duration-200 group-hover:text-primary">
          <Icon
            size="16"
            variant="Bold"
            className="text-grey transition-colors duration-200 group-hover:text-primary"
          />
          <p className="text-sm font-medium">{route.title}</p>
        </div>

        {route.comingSoon && (
          <div
            className="rounded-[1.25rem] bg-primary px-2 py-1 text-xs 
          dark:bg-[#6155F5]
          text-white"
          >
            Coming soon
          </div>
        )}
      </div>
    </Link>
    )}
   
    
    </>
  
  );
};

export default SidebarLinks;
