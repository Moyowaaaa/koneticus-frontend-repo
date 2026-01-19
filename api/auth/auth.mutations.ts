import { useMutation } from "@tanstack/react-query";
import {
  CheckEmailPayload,
  CheckEmailResponse,
  IAuthResponse,
  ISignupPayload,
  LoginPayload,
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
  const response = await apiHttp.post<IAuthResponse>("/auth/sign-up", data);
  return response.data;
};

export const useRegisterUser = () =>
  useMutation({
    mutationFn: registerUser,
  });
