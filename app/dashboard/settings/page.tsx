import SettingsComponent from "@/components/settings";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Settings", undefined, { index: false });

const SettingsPage = () => {
  return <SettingsComponent />;
};

export default SettingsPage;
