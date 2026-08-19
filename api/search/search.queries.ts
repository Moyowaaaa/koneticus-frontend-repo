import { useQuery } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import type { GlobalSearchResponse } from "./search.model";

export const searchKeys = {
  all: ["search"] as const,
  global: (q: string, limit: number) =>
    [...searchKeys.all, "global", q, limit] as const,
};

const getGlobalSearch = async (
  q: string,
  limit: number = 6,
): Promise<GlobalSearchResponse> => {
  const response = await apiHttp.get<GlobalSearchResponse>("/search", {
    params: { q, limit },
  });
  return response.data;
};

export const useGlobalSearch = (
  q: string,
  options?: { enabled?: boolean; limit?: number },
) => {
  const trimmed = q.trim();
  const limit = options?.limit ?? 6;

  return useQuery({
    queryKey: searchKeys.global(trimmed, limit),
    queryFn: () => getGlobalSearch(trimmed, limit),
    enabled: (options?.enabled ?? true) && trimmed.length >= 2,
    placeholderData: (previous) => previous,
  });
};
