export interface SearchProjectAuthorProfile {
  firstname?: string;
  lastname?: string;
  profilePicture?: { url?: string } | null;
  roles?: string[];
}

export interface SearchProjectAuthor {
  _id: string;
  email?: string;
  userProfile?: SearchProjectAuthorProfile | null;
}

export interface SearchProject {
  _id: string;
  title: string;
  description?: string;
  status:
    | "draft"
    | "pending"
    | "ongoing"
    | "completed"
    | "deleted"
    | "archived";
  requiredRoles?: string[];
  author?: string | SearchProjectAuthor;
  createdAt?: string;
  score?: number;
}

export interface SearchUser {
  _id: string;
  authUserId: string;
  firstname: string;
  lastname: string;
  roles: string[];
  profilePicture?: { url?: string; id?: string } | null;
  bio?: string | null;
}

export interface GlobalSearchResponse {
  query: string;
  projects: SearchProject[];
  users: SearchUser[];
}
