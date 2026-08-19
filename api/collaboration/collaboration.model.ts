export interface CollaborationReqestsResponse {
  requests: CollaborationRequest[];
  pagination: Pagination;
}

interface Pagination {
  totalRequests: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface CollaborationRequestMedia {
  url: string;
  id: string;
  _id: string;
}

export interface CollaborationRequesterProfile {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: {
    url: string;
    id?: string;
  };
  roles?: string[];
  bio?: string;
  links?: {
    github?: string;
    behance?: string;
    website?: string;
    linkedin?: string;
  };
}

export interface CollaborationRequester {
  _id: string;
  email: string;
  userProfile?: CollaborationRequesterProfile;
}

export interface CollaborationRequest {
  _id: string;
  projectId: ProjectId | string;
  requesterId: CollaborationRequester | string;
  proposal: string;
  media: CollaborationRequestMedia[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProjectId {
  _id: string;
  title: string;
  description: string;
  status: string;
}

/** Payload for POST /collaboration-requests/projects/:projectId/requests */
export interface ICreateCollaborationRequestPayload {
  projectId: string;
  proposal: string;
  media?: File[];
}

export interface ICreateCollaborationRequestResponse {
  message: string;
  request: CollaborationRequest;
}

export interface IProjectCollaborationRequestsResponse {
  requests: CollaborationRequest[];
}
