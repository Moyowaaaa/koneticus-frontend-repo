import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Project, ProjectsResponse } from "./projects.model";
import apiHttp, { PaginatedResponse } from "../appConfig";

export const projectsKeys = {
  all: ["projects"] as const,
  userProjects: () => [...projectsKeys.all, "user"] as const,
  singleProject: (id: string) => [...projectsKeys.all, id] as const,
};

// User projects
const getUserProjects = async (
  page: number = 1,
  limit: number = 10,
): Promise<ProjectsResponse> => {
  const response = await apiHttp.get<ProjectsResponse>(
    `/projects?page=${page}&limit=${limit}`,
  );
  return response.data;
};

const getProjectById = async (projectId: string): Promise<Project> => {
  const response = await apiHttp.get<{ project: Project }>(
    `/projects/${projectId}`,
  );
  return response.data.project;
};

export const useGetUserProjects = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: [...projectsKeys.userProjects(), page, limit],
    queryFn: () => getUserProjects(page, limit),
  });

export const useGetInfiniteUserProjects = (limit: number = 10) =>
  useInfiniteQuery({
    queryKey: [...projectsKeys.userProjects(), "infinite", limit],
    queryFn: ({ pageParam = 1 }) => getUserProjects(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

export const useGetProjectById = (projectId: string) =>
  useQuery({
    queryKey: projectsKeys.singleProject(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });
