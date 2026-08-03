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

export interface Project {
  _id: string;
  title: string;
  description: string;
  requiredRoles: string[];
  collaborators: string[];
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
  author: string;
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
