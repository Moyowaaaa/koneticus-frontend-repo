import { PortfolioLinks } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

// Login response types
export interface ILoginUserData {
  _id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  roles?: string[];
  profilePicture?: string;
  isVerified?: boolean;
  isEmailVerified?: boolean;
}

export interface IAuthResponse {
  message: string;
  data: {
    user: ILoginUserData;
  };
  token: string;
}

export interface ISignupPayload {
  // Auth data
  email: string;
  password: string;
  // Profile data
  firstname: string;
  lastname: string;
  roles: string[];
  bio?: string;
  links?: PortfolioLinks;
  image?: File | null; // Profile image file for multer upload
  cv?: File | null; // CV file for multer upload (optional)
  // CV data (optional)
  cvLinkedUrl?: string; // External CV link (LinkedIn, portfolio, etc.)
}

export interface CheckEmailResponse {
  message: string;
}

export interface CheckEmailPayload {
  email: string;
}

export interface ResendVerificationEmailPayload {
  email: string;
}
