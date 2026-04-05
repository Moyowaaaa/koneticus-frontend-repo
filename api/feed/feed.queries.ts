import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import apiHttp, { PaginatedResponse } from "../appConfig";
import { FeedItem } from "./feed.model";

// Query keys
export const feedKeys = {
  all: ["feed"] as const,
  list: () => [...feedKeys.all, "list"] as const,
  trending: () => [...feedKeys.all, "trending"] as const,
};

// Get feed
const getFeed = async (
  cursor?: string,
  limit: number = 20,
): Promise<PaginatedResponse<FeedItem>> => {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  params.append("limit", limit.toString());

  const response = await apiHttp.get<PaginatedResponse<FeedItem>>(
    `/feed?${params.toString()}`,
  );
  return response.data;
};

export const useGetFeed = (limit: number = 20) =>
  useQuery({
    queryKey: feedKeys.list(),
    queryFn: () => getFeed(undefined, limit),
  });

export const useGetInfiniteFeed = (limit: number = 20) =>
  useInfiniteQuery({
    queryKey: feedKeys.list(),
    queryFn: ({ pageParam }) => getFeed(pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.nextCursor : undefined,
  });

// Trending
const getTrendingFeed = async (): Promise<PaginatedResponse<FeedItem>> => {
  const response =
    await apiHttp.get<PaginatedResponse<FeedItem>>("/feed/trending");
  return response.data;
};

export const useGetTrendingFeed = () =>
  useQuery({
    queryKey: feedKeys.trending(),
    queryFn: getTrendingFeed,
  });
