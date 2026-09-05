"use client";

import { useCallback, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import TopBar from "@/components/ui-components/top-bar";
import { useGetInfiniteMyCollaborationRequests } from "@/api/collaboration/collaboration.queries";
import type { CollaborationRequest } from "@/api/collaboration/collaboration.model";
import {
  getRequestProject,
  getRequestStatusLabel,
  getRequestStatusTagClass,
  REQUEST_STATUSES,
  type CollaborationRequestStatus,
} from "@/lib/collaboration-request-status";
import {
  getProjectStatusLabel,
  getProjectStatusTagClass,
} from "@/lib/project-status";
import { formatTimeAgo } from "@/utils";
import RequestDetailModal from "./request-detail-modal";

type StatusFilter = "all" | CollaborationRequestStatus;

const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
];

const RequestsClient = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedRequest, setSelectedRequest] =
    useState<CollaborationRequest | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetInfiniteMyCollaborationRequests(20);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(node);
      return () => observer.disconnect();
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const requests = useMemo(
    () => data?.pages.flatMap((page) => page.requests) ?? [],
    [data],
  );

  const filteredRequests = useMemo(() => {
    if (statusFilter === "all") return requests;
    return requests.filter((request) => request.status === statusFilter);
  }, [requests, statusFilter]);

  const counts = useMemo(() => {
    return REQUEST_STATUSES.reduce(
      (acc, status) => {
        acc[status] = requests.filter(
          (request) => request.status === status,
        ).length;
        return acc;
      },
      { pending: 0, accepted: 0, rejected: 0 } as Record<
        CollaborationRequestStatus,
        number
      >,
    );
  }, [requests]);

  const emptyCopy =
    statusFilter === "all"
      ? "You haven’t sent any collaboration requests yet."
      : `No ${getRequestStatusLabel(statusFilter).toLowerCase()} requests.`;

  return (
    <div className="flex w-full flex-col gap-8 pt-6 px-6">
      <TopBar>
        <div className="flex flex-col gap-1">
          <h1 className="text-[2rem] font-semibold text-brand-black dark:text-white">
            Requests
          </h1>
          <p className="text-sm text-brand-grey">
            Interest you’ve sent, with status and proposal details
          </p>
        </div>
      </TopBar>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const isActive = statusFilter === filter.id;
          const count =
            filter.id === "all" ? requests.length : counts[filter.id];

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setStatusFilter(filter.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-brand-black text-white dark:bg-[#6155F5]"
                  : "bg-[#F5F4FF] text-brand-grey hover:text-brand-black dark:bg-[#80808026] dark:text-[#B0B0B0] dark:hover:text-white"
              }`}
            >
              {filter.label}
              {requests.length > 0 ? ` · ${count}` : ""}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-brand-grey">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading your requests...
        </div>
      ) : isError ? (
        <p className="py-12 text-center text-sm text-red-500">
          Couldn’t load your requests. Try again.
        </p>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-sm text-brand-grey dark:text-[#B0B0B0]">
            {emptyCopy}
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {filteredRequests.map((request) => {
              const project = getRequestProject(request);

              return (
                <button
                  key={request._id}
                  type="button"
                  onClick={() => setSelectedRequest(request)}
                  className="flex w-full flex-col gap-3 rounded-[1.25rem] border border-[#E9E9E9] p-4 text-left transition-colors hover:bg-lavender dark:border-[#80808026] dark:hover:bg-[#211E1E]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-brand-black dark:text-white">
                        {project.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-brand-grey dark:text-[#808080]">
                        {request.proposal}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.625rem] font-medium ${getRequestStatusTagClass(request.status)}`}
                    >
                      {getRequestStatusLabel(request.status)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {project.status ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.625rem] font-medium ${getProjectStatusTagClass(project.status)}`}
                        >
                          {getProjectStatusLabel(project.status)}
                        </span>
                      ) : null}
                      <span className="text-xs text-brand-grey">
                        {formatTimeAgo(request.createdAt)}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-[#6155F5] dark:text-[#A8A1FF]">
                      View details
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <div ref={loadMoreRef} className="h-1 w-full" />
          {isFetchingNextPage ? (
            <div className="flex items-center justify-center gap-2 pb-4 text-sm text-brand-grey">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more...
            </div>
          ) : null}
        </>
      )}

      <RequestDetailModal
        open={!!selectedRequest}
        request={selectedRequest}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null);
        }}
      />
    </div>
  );
};

export default RequestsClient;
