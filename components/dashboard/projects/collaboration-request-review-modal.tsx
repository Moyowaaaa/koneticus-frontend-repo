"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import Modal from "@/components/ui-components/modal";
import ButtonV2 from "@/components/ui-components/button";
import { CollaborationRequest } from "@/api/collaboration/collaboration.model";
import { PORTFOLIO_FIELDS } from "@/types/data";

type CollaborationRequestReviewModalProps = {
  open: boolean;
  request: CollaborationRequest | null;
  isAccepting?: boolean;
  isRejecting?: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onReject: () => void;
};

const getRequesterInfo = (request: CollaborationRequest | null) => {
  if (!request || typeof request.requesterId === "string") {
    return {
      firstName: "Unknown",
      lastName: "user",
      avatar: "/images/dummy-avatar.svg",
      bio: "",
      links: undefined as
        | {
            github?: string;
            behance?: string;
            website?: string;
            linkedin?: string;
          }
        | undefined,
    };
  }

  const profile = request.requesterId.userProfile;

  return {
    firstName: profile?.firstname ?? "Unknown",
    lastName: profile?.lastname ?? "user",
    avatar: profile?.profilePicture?.url || "/images/dummy-avatar.svg",
    bio: profile?.bio ?? "",
    links: profile?.links,
  };
};

const CollaborationRequestReviewModal = ({
  open,
  request,
  isAccepting = false,
  isRejecting = false,
  onOpenChange,
  onAccept,
  onReject,
}: CollaborationRequestReviewModalProps) => {
  const requester = getRequesterInfo(request);
  const isPending = request?.status === "pending";
  const isBusy = isAccepting || isRejecting;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-[627px]"
      childrenClassName="px-4 py-2 sm:px-6"
    >
      {!request ? (
        <p className="py-6 text-center text-sm text-brand-grey">
          Request not found.
        </p>
      ) : (
        <div className="flex w-full min-w-0 flex-col items-center gap-6 pb-4">
          <div className="relative">
            <div className="relative h-24 w-24 overflow-hidden rounded-full">
              <Image
                src={requester.avatar}
                alt={`${requester.firstName} ${requester.lastName}`}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-xl font-semibold break-words text-brand-black dark:text-white">
              {requester.firstName} {requester.lastName}
            </h3>
          </div>

          <div className="min-h-32 w-full min-w-0 overflow-hidden rounded-[1.875rem] border p-4 text-base break-words font-[sora-light] sm:p-6 dark:text-white">
            {requester.bio || "No bio yet."}
          </div>

          {request.proposal && (
            <div className="w-full min-w-0 overflow-hidden rounded-[1.875rem] border border-[#E9E9E9] p-4 sm:p-6 dark:border-[#80808026]">
              <p className="mb-2 text-xs text-brand-grey dark:text-[#808080]">
                Proposal
              </p>
              <p className="whitespace-pre-wrap break-words text-sm font-[sora-light] text-brand-black dark:text-white">
                {request.proposal}
              </p>
            </div>
          )}

          {request.media?.length > 0 && (
            <div className="grid w-full min-w-0 grid-cols-2 gap-2">
              {request.media.map((item) => (
                <div
                  key={item._id || item.id}
                  className="relative h-28 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={item.url}
                    alt="Proposal media"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="w-full min-w-0 space-y-3">
            {PORTFOLIO_FIELDS.map((field) => (
              <div
                key={field.key}
                className="flex min-h-14 min-w-0 items-center gap-3 rounded-[1.875rem] border border-[#E9E9E9] bg-white px-4 py-3 sm:px-5 dark:bg-[#80808026]"
              >
                <div className="relative h-6 w-6 shrink-0">
                  <Image src={field.logo} alt={field.key} fill />
                </div>
                <div className="h-5 shrink-0 border border-[#808080]" />
                <input
                  className="min-w-0 flex-1 truncate bg-transparent text-sm outline-none dark:text-white"
                  placeholder="Add link.."
                  readOnly
                  value={requester.links?.[field.key] ?? ""}
                />
              </div>
            ))}
          </div>

          {isPending && (
            <div className="flex w-full min-w-0 items-center gap-3 pt-2">
              <ButtonV2
                type="button"
                className="min-h-max flex-1 border-none text-white bg-[#CF4F4F]"
                disabled={isBusy}
                onClick={onReject}
              >
                {isRejecting ? (
                  <span className="flex items-center justify-center gap-2 text-[0.875rem]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Rejecting...
                  </span>
                ) : (
                  <span className="text-[0.875rem]">Reject</span>
                )}
              </ButtonV2>
              <ButtonV2
                type="button"
                className="min-h-max flex-1"
                disabled={isBusy}
                onClick={onAccept}
              >
                {isAccepting ? (
                  <span className="flex items-center justify-center gap-2 text-[0.875rem]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Accepting...
                  </span>
                ) : (
                  <span className="text-[0.875rem]">Accept</span>
                )}
              </ButtonV2>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default CollaborationRequestReviewModal;
