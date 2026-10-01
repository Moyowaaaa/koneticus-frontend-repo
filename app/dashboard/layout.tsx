import { pageMetadata } from "@/lib/seo";
import TopNavBar from "@/components/navigation/topbar";
import MobileBottomNav from "@/components/navigation/mobile-bottom-nav";
import Sidebar from "@/components/navigation/sidebar";
import DashboardRightSidebar from "@/components/dashboard/dashboard-right-sidebar";
import SearchModal from "@/components/dashboard/modals/search-modal";
import ChatSocketProvider from "@/components/layer/ChatSocketProvider";
import NotificationSocketProvider from "@/components/layer/NotificationSocketProvider";

export const metadata = pageMetadata("Dashboard", undefined, {
  index: false,
});

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background">
      <TopNavBar />
      <MobileBottomNav />
      <SearchModal />
      <ChatSocketProvider />
      <NotificationSocketProvider />
      <div className="mx-auto flex min-h-dvh w-full max-w-[80rem] md:gap-5">
        <aside className="sticky top-[96px] hidden w-[234px] shrink-0 self-start lg:block">
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1 pt-[77px] pb-[calc(72px+env(safe-area-inset-bottom))] md:pt-[96px] lg:pb-0">
          {children}
        </main>

        <DashboardRightSidebar />
      </div>
    </div>
  );
};

export default DashboardLayout;
