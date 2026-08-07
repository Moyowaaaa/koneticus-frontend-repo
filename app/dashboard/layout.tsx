import TopNavBar from "@/components/navigation/topbar";
import Sidebar from "@/components/navigation/sidebar";
import DashboardRightSidebar from "@/components/dashboard/dashboard-right-sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background">
      <TopNavBar />
      <div className="mx-auto flex w-full max-w-[112rem] gap-10 px-4 pt-24 pb-10 md:px-12">
        <aside className="hidden w-[16rem] shrink-0 md:block">
          <div className="fixed top-20">
            <Sidebar />
          </div>
        </aside>

        <main className="min-w-0 w-full flex-1 pr-12 pl-4">{children}</main>

        <DashboardRightSidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
