// Feed item types (used with PaginatedResponse<FeedItem> from appConfig)
export interface FeedItem {
  _id: string;
  title: string;
  description: string;
  collaborators: FeedCollaborator[];
  media: FeedMedia[];
  status: string;
  teamSize: number;
  conversationId: string | null;
  author: FeedAuthor; // Populated from backend
  requiredRoles?: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Author is populated with user data from backend
export interface FeedAuthor {
  _id: string;
  email: string;
  userProfile: FeedAuthorProfile;
}

export interface FeedAuthorProfile {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture?: FeedMedia;
  roles?: string[];
  bio?: string;
}

export interface FeedCollaborator {
  _id: string;
  email: string;
  userProfile: FeedUserProfile;
}

export interface FeedUserProfile {
  _id: string;
  firstname: string;
  lastname: string;
  profilePicture: FeedMedia;
}

export interface FeedMedia {
  url: string;
  id: string;
  _id: string;
}
