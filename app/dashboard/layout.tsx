import React from "react";
import TopNavBar from "@/components/navigation/topbar";
import Sidebar from "@/components/navigation/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <div className="flex flex-col">
    //   <TopNavBar />
    //   <div className="absolute top-0 w-full ">
    //     <div className="w-full max-w-[95rem] mx-auto px-4 relative flex items-start border-2 border-[red]">
    //       <Sidebar />
    //     </div>
    //   </div>
    //   {/* <h1>Dashboard Layout</h1> */}
    // </div>

    <div className="min-h-screen w-full bg-background">
      <TopNavBar />
      <div className="mx-auto flex  w-full max-w-[112rem] gap-10 px-4 pt-24 pb-10 md:px-12">
        <aside className="hidden w-[16rem] shrink-0 md:block">
          <div className="fixed top-20 ">
            <Sidebar />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {children}
          {/* {modal} */}
          {/* <SharePost /> */}
        </main>

        {/* Placeholder for future right rail */}
        {/* <div className="hidden w-[20rem] shrink-0 xl:block" aria-hidden /> */}
      </div>
    </div>
  );
};

export default DashboardLayout;
