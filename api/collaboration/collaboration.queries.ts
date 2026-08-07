import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import {
  CollaborationReqestsResponse,
  CollaborationRequest,
  IProjectCollaborationRequestsResponse,
} from "./collaboration.model";

export const collaborationRequestKeys = {
  all: ["collaboration-requests"] as const,
  /** GET /collaboration-requests/projects/:projectId/requests (author inbox) */
  projectRequests: (projectId: string) =>
    [...collaborationRequestKeys.all, "project", projectId] as const,
  /** GET /collaboration-requests/my-requests (requests I sent) */
  myRequests: () => [...collaborationRequestKeys.all, "my-requests"] as const,
  myRequestsPage: (page: number, limit: number) =>
    [...collaborationRequestKeys.myRequests(), page, limit] as const,
  singleRequest: (id: string) => [...collaborationRequestKeys.all, id] as const,
};

const getMyCollaborationRequests = async (
  page: number = 1,
  limit: number = 10,
): Promise<CollaborationReqestsResponse> => {
  const response = await apiHttp.get<CollaborationReqestsResponse>(
    `/collaboration-requests/my-requests?page=${page}&limit=${limit}`,
  );
  return response.data;
};

export const useGetInfiniteUserProjects = (limit: number = 15) =>
  useInfiniteQuery({
    queryKey: [...collaborationRequestKeys.myRequests(), "infinite", limit],
    queryFn: ({ pageParam = 1 }) =>
      getMyCollaborationRequests(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

const getCollaborationRequestsByProjectId = async (
  projectId: string,
): Promise<CollaborationRequest[]> => {
  const response = await apiHttp.get<IProjectCollaborationRequestsResponse>(
    `/collaboration-requests/projects/${projectId}/requests`,
  );
  return response.data.requests;
};

export const useGetCollaborationRequestsByProjectId = (
  projectId: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: collaborationRequestKeys.projectRequests(projectId),
    queryFn: () => getCollaborationRequestsByProjectId(projectId),
    enabled: !!projectId && (options?.enabled ?? true),
  });

const getCollaborationRequestByRequestId = async (
  requestId: string,
): Promise<CollaborationRequest> => {
  const response = await apiHttp.get<{ request: CollaborationRequest }>(
    `/collaboration-requests/${requestId}`,
  );
  return response.data.request;
};

export const useGetCollaborationRequestByRequestId = (
  requestId: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: collaborationRequestKeys.singleRequest(requestId),
    queryFn: () => getCollaborationRequestByRequestId(requestId),
    enabled: !!requestId && (options?.enabled ?? true),
  });
