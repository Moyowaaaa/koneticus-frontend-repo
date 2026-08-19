"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useGetCollaborationRequestsByProjectId } from "@/api/collaboration/collaboration.queries";
import {
  useAcceptCollaborationRequest,
  useRejectCollaborationRequest,
} from "@/api/collaboration/collaboration.mutation";
import { CollaborationRequest } from "@/api/collaboration/collaboration.model";
import { showToast } from "@/utils/toasts";
import { useGetErrorMessage } from "@/lib/utils";
import ButtonV2 from "@/components/ui-components/button";
import CollaborationRequestReviewModal from "./collaboration-request-review-modal";

type CollaborationRequestsSectionProps = {
  projectId: string;
};

const getRequesterDisplay = (request: CollaborationRequest) => {
  if (typeof request.requesterId === "string") {
    return {
      name: "Unknown user",
      avatar: "/images/dummy-avatar.svg",
    };
  }

  const profile = request.requesterId.userProfile;
  return {
    name: profile
      ? `${profile.firstname} ${profile.lastname}`
      : "Unknown user",
    avatar: profile?.profilePicture?.url || "/images/dummy-avatar.svg",
  };
};

const CollaborationRequestsSection = ({
  projectId,
}: CollaborationRequestsSectionProps) => {
  const getErrorMessage = useGetErrorMessage();
  const [selectedRequest, setSelectedRequest] =
    useState<CollaborationRequest | null>(null);

  const { data: requests = [], isLoading, isError } =
    useGetCollaborationRequestsByProjectId(projectId);

  const { mutateAsync: acceptRequest, isPending: isAccepting } =
    useAcceptCollaborationRequest(projectId);
  const { mutateAsync: rejectRequest, isPending: isRejecting } =
    useRejectCollaborationRequest(projectId);

  const pendingRequests = requests.filter(
    (request) => request.status === "pending",
  );

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest({ requestId });
      showToast.success("Collaboration request accepted");
      setSelectedRequest(null);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest({ requestId });
      showToast.success("Collaboration request rejected");
      setSelectedRequest(null);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-[1.125rem] font-semibold text-brand-black dark:text-white">
          Collaboration Requests
        </h1>
        {pendingRequests.length > 0 && (
          <span className="rounded-full bg-[#F5F4FF] px-2.5 py-0.5 text-xs font-medium text-[#6155F5] dark:bg-[#6155F5]/15">
            {pendingRequests.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex min-h-24 items-center justify-center gap-2 text-sm text-brand-grey">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading requests...
        </div>
      ) : isError ? (
        <p className="py-4 text-sm text-red-500">
          Failed to load collaboration requests.
        </p>
      ) : pendingRequests.length === 0 ? (
        <p className="py-4 text-sm text-brand-grey dark:text-[#808080]">
          No pending collaboration requests.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {pendingRequests.map((request) => {
            const requester = getRequesterDisplay(request);

            return (
              <div
                key={request._id}
                className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-[#E9E9E9] p-3 dark:border-[#80808026]"
              >
                <button
                  type="button"
                  onClick={() => setSelectedRequest(request)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <Image
                      src={requester.avatar}
                      alt={requester.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <p className="truncate text-sm font-medium text-brand-black dark:text-white">
                      {requester.name}
                    </p>
                    <p className="line-clamp-1 text-xs text-brand-grey dark:text-[#808080]">
                      {request.proposal}
                    </p>
                  </div>
                </button>

                <div className="flex shrink-0 items-center gap-2">
                  <ButtonV2
                    type="button"
                    variant="outline"
                    className="min-h-max px-3 py-2 text-brand-black"
                    disabled={isAccepting || isRejecting}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <span className="text-xs">View profile</span>
                  </ButtonV2>
                  <ButtonV2
                    type="button"
                    variant="outline"
                    className="min-h-max px-3 py-2 text-white bg-[#CF4F4F]"
                    disabled={isAccepting || isRejecting}
                    onClick={() => handleReject(request._id)}
                  >
                    <span className="text-xs">Reject</span>
                  </ButtonV2>
                  <ButtonV2
                    type="button"
                    className="min-h-max px-3 py-2"
                    disabled={isAccepting || isRejecting}
                    onClick={() => handleAccept(request._id)}
                  >
                    <span className="text-xs">Accept</span>
                  </ButtonV2>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CollaborationRequestReviewModal
        open={!!selectedRequest}
        request={selectedRequest}
        isAccepting={isAccepting}
        isRejecting={isRejecting}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null);
        }}
        onAccept={() => {
          if (selectedRequest) void handleAccept(selectedRequest._id);
        }}
        onReject={() => {
          if (selectedRequest) void handleReject(selectedRequest._id);
        }}
      />
    </div>
  );
};

export default CollaborationRequestsSection;
