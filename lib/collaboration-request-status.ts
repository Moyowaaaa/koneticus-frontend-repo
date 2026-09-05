import type { CollaborationRequest } from "@/api/collaboration/collaboration.model";

export type CollaborationRequestStatus = "pending" | "accepted" | "rejected";

export const REQUEST_STATUSES: CollaborationRequestStatus[] = [
  "pending",
  "accepted",
  "rejected",
];

export const getRequestStatusLabel = (status: string): string => {
  switch (status) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    default:
      return status;
  }
};

export const getRequestStatusTagClass = (status: string): string => {
  switch (status) {
    case "pending":
      return "bg-[#F5F4FF] text-[#6155F5] dark:bg-[#6155F5]/15 dark:text-[#A8A1FF]";
    case "accepted":
      return "bg-[#EEF8F1] text-[#1B7A3D] dark:bg-[#1B7A3D]/20 dark:text-[#7DDB9E]";
    case "rejected":
      return "bg-[#FDECEC] text-[#CF4F4F] dark:bg-[#CF4F4F]/15 dark:text-[#F0A0A0]";
    default:
      return "bg-[#F3F4F6] text-[#4B5563] dark:bg-[#80808026] dark:text-[#B0B0B0]";
  }
};

export const getRequestProject = (request: CollaborationRequest) => {
  if (!request.projectId || typeof request.projectId === "string") {
    return {
      _id: typeof request.projectId === "string" ? request.projectId : "",
      title: "Project unavailable",
      description: "",
      status: "",
    };
  }

  return request.projectId;
};
