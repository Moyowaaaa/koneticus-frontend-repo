import { ILoginUserData } from "@/api/auth/auth.model";

export interface UserProfileMedia {
  url: string;
  id: string;
}

export interface UserProfileLinks {
  github?: string;
  behance?: string;
  website?: string;
  linkedin?: string;
}

export interface UserProfileCV {
  fileUrl?: string;
  fileId?: string;
  linkedUrl?: string;
  fileName?: string;
}

export interface UserProfile {
  _id: string;
  authUser: string;
  firstname: string;
  lastname: string;
  roles: string[];
  bio?: string;
  profilePicture?: UserProfileMedia;
  cv?: UserProfileCV;
  links?: UserProfileLinks;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** Raw shape from GET /user/me */
export interface MeUser {
  _id: string;
  email: string;
  userProfile?: UserProfile | null;
  isEmailVerified?: boolean;
}

export interface GetMeResponse {
  user: MeUser;
}

/** Normalize nested /me user into the flat auth store shape */
export const mapMeUserToAuthUser = (user: MeUser): ILoginUserData => {
  const profile = user.userProfile ?? undefined;

  return {
    _id: String(user._id),
    email: user.email,
    firstname: profile?.firstname,
    lastname: profile?.lastname,
    roles: profile?.roles,
    profilePicture: profile?.profilePicture?.url,
    isVerified: profile?.isVerified,
    isEmailVerified: user.isEmailVerified,
  };
};
