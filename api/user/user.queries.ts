import { useQuery } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import { GetMeResponse, MeUser } from "./user.model";

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
};

const getMe = async (): Promise<MeUser> => {
  const response = await apiHttp.get<GetMeResponse>("/user/me");
  return response.data.user;
};

export const useGetMe = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: userKeys.me(),
    queryFn: getMe,
    enabled: options?.enabled ?? true,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
