import IdeasClient from "@/components/dashboard/ideas";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Ideas", undefined, { index: false });

const IdeasPage = () => {
  return <IdeasClient />;
};

export default IdeasPage;
