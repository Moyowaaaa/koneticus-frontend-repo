import OngoingProjectsClient from "@/components/dashboard/ongoing-projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Ongoing projects", undefined, {
  index: false,
});

const OngoingProjectsPage = () => {
  return <OngoingProjectsClient />;
};

export default OngoingProjectsPage;
