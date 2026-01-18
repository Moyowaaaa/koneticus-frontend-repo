import { useMutation } from "@tanstack/react-query";
import { IAuthResponse, LoginPayload } from "./auth.model";
import apiHttp from "../appConfig";

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
