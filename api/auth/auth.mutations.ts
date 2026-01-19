import { useMutation } from "@tanstack/react-query";
import {
  CheckEmailPayload,
  CheckEmailResponse,
  IAuthResponse,
  ISignupPayload,
  LoginPayload,
  ResendVerificationEmailPayload,
} from "./auth.model";
import apiHttp from "../appConfig";

//loginn

const loginUser = async (data: LoginPayload): Promise<IAuthResponse> => {
  const response = await apiHttp.post<IAuthResponse>("/auth/sign-in", data);
  return response.data;
};

export const useLoginUser = () =>
  useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log("Login successful:", data);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

// Logout
const logoutUser = async (): Promise<{ message: string }> => {
  const response = await apiHttp.post<{ message: string }>("/auth/logout");
  return response.data;
};

export const useLogoutUser = () =>
  useMutation({
    mutationFn: logoutUser,
  });

// Check email availability
const checkEmail = async (
  data: CheckEmailPayload,
): Promise<CheckEmailResponse> => {
  const response = await apiHttp.post<CheckEmailResponse>(
    "/auth/check-email",
    data,
  );
  return response.data;
};

export const useCheckEmail = () =>
  useMutation({
    mutationFn: checkEmail,
  });

//sign up
const registerUser = async (data: ISignupPayload): Promise<IAuthResponse> => {
  // Build FormData for multipart/form-data (required for file uploads)
  const formData = new FormData();

  // Required fields
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("firstname", data.firstname);
  formData.append("lastname", data.lastname);
  formData.append("roles", JSON.stringify(data.roles));

  // Optional fields
  if (data.bio) {
    formData.append("bio", data.bio);
  }

  if (data.links) {
    formData.append("links", JSON.stringify(data.links));
  }

  if (data.cvLinkedUrl) {
    formData.append("cvLinkedUrl", data.cvLinkedUrl);
  }

  // File uploads
  if (data.image) {
    formData.append("image", data.image);
  }

  if (data.cv) {
    formData.append("cv", data.cv);
  }

  const response = await apiHttp.post<IAuthResponse>(
    "/auth/sign-up",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const useRegisterUser = () =>
  useMutation({
    mutationFn: registerUser,
  });

//resend verification email
const resendVerificationEmail = async (
  data: ResendVerificationEmailPayload,
): Promise<{ message: string }> => {
  const response = await apiHttp.post<{ message: string }>(
    "/auth/resend-verification",
    data,
  );
  return response.data;
};

export const useResendVerificationEmail = () =>
  useMutation({
    mutationFn: resendVerificationEmail,
  });

//verify email
const verifyEmail = async (data: {
  token: string;
}): Promise<{ message: string }> => {
  const response = await apiHttp.get<{ message: string }>(
    `/auth/verify-email/${data.token}`,
  );
  return response.data;
};

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: verifyEmail,
  });
