import RequestsClient from "@/components/dashboard/requests";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Requests", undefined, { index: false });

const RequestsPage = () => {
  return <RequestsClient />;
};

export default RequestsPage;
