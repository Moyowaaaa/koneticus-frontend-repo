import FeedClient from "@/components/dashboard/feed/feed-client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Feed", undefined, { index: false });

const Dashboard = () => {
  return <FeedClient />;
};

export default Dashboard;
