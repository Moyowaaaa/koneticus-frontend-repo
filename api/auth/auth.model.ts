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
}

export interface IAuthResponse {
  message: string;
  data: {
    user: ILoginUserData;
  };
}
