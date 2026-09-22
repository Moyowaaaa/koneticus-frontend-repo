import MessagesClient from "@/components/messages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Messages", undefined, { index: false });

const MessagesPage = () => {
  return (
    <>
      <MessagesClient />
    </>
  );
};

export default MessagesPage;
