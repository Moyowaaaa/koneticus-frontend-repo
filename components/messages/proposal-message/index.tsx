import Image from "next/image";
import ButtonV2 from "@/components/ui-components/button";

interface ProposalMessageProps {
  senderName: string;
  senderAvatar?: string;
  title: string;
  content: string;
  type: "proposal" | "request";
  onViewProfile?: () => void;
  onCollaborate?: () => void;
  onReject?: () => void;
  className?: string;
}

const ProposalMessage = ({
  senderName,
  senderAvatar,
  title,
  content,
  type,
  onViewProfile,
  onCollaborate,
  onReject,
  className,
}: ProposalMessageProps) => {
  return (
    <div
      //   className={cn(
      //     "w-full rounded-2xl border border-gray-200 bg-lavender p-4 shadow-sm",
      //     className
      //   )}
      className="flex flex-col gap-2"
    >
      {/* Header with sender info */}
      <div className="mb-3 flex items-center gap-3">
        <div className="relative h-8 w-8 shrink-0">
          <Image
            src={senderAvatar || "/images/dummy-avatar.svg"}
            alt={senderName}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-brand-black dark:text-white text-sm">
              {senderName}
            </span>
            <span
              className="rounded-full bg-gray-100 
            dark:bg-[transparent] dark:text-[#808080]
            px-2 py-0.5 text-xs font-medium text-gray-600 capitalize"
            >
              ({type})
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="mb-4 flex flex-col gap-4 space-y-2 w-full rounded-r-2xl rounded-bl-2xl 
        border border-gray-200 bg-lavender 
      dark:border-[#80808026]
      dark:bg-[#80808026]
      p-4 shadow-sm"
      >
        <h4 className="font-medium text-brand-black dark:text-white">
          {title}
        </h4>
        <div className="text-sm leading-relaxed text-gray-700 dark:text-white">
          {content.split("\n").map((line, index) => (
            <p key={index} className="mb-1">
              {line}
            </p>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ButtonV2
            variant="outline"
            onClick={onViewProfile}
            className="min-h-8 h-8 px-3 text-xs
            dark:bg-[#808080] dark:border-[#808080]
            "
          >
            View profile
          </ButtonV2>
          <ButtonV2
            variant="default"
            onClick={onCollaborate}
            className="min-h-8 h-8 px-3 text-xs"
          >
            Collaborate
          </ButtonV2>
          <ButtonV2
            variant="dark"
            onClick={onReject}
            className="ml-auto min-h-8 h-8 px-3 text-xs bg-red-500 hover:bg-red-600"
          >
            Reject
          </ButtonV2>
        </div>
      </div>

      {/* Action buttons */}
    </div>
  );
};

export default ProposalMessage;
