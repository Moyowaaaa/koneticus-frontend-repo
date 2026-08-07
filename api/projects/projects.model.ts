// Projects API response types

export interface ProjectsResponse {
  projects: Project[];
  pagination: ProjectsPagination;
}

export interface ProjectsPagination {
  totalProjects: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface ProjectCollaboratorProfile {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: {
    url: string;
    id?: string;
    _id?: string;
  };
  roles?: string[];
}

export interface ProjectCollaborator {
  _id: string;
  email: string;
  userProfile?: ProjectCollaboratorProfile;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  requiredRoles: string[];
  collaborators: (string | ProjectCollaborator)[];
  media: ProjectMedia[];
  status:
    | "draft"
    | "pending"
    | "ongoing"
    | "completed"
    | "deleted"
    | "archived";
  teamSize: number;
  conversationId: string | null;
  author: string | ProjectCollaborator;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProjectMedia {
  url: string;
  id: string;
  _id: string;
}

export interface ICreateProjectPayload {
  title: string;
  description: string;
  requiredRoles: string[];
  teamSize: number;
  media?: File[];
}

export interface IUpdateProjectPayload {
  title?: string;
  description?: string;
  requiredRoles?: string[];
  teamSize?: number;
}

export type ProjectStatus =
  | "draft"
  | "pending"
  | "ongoing"
  | "completed"
  | "deleted"
  | "archived";

export interface IUpdateProjectStatusPayload {
  status: Exclude<ProjectStatus, "deleted" | "archived">;
}
