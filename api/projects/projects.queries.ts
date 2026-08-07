import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Project, ProjectsResponse } from "./projects.model";
import apiHttp, { PaginatedResponse } from "../appConfig";

export const projectsKeys = {
  all: ["projects"] as const,
  userProjects: () => [...projectsKeys.all, "user"] as const,
  collaboratingProjects: () =>
    [...projectsKeys.all, "collaborating"] as const,
  singleProject: (id: string) => [...projectsKeys.all, id] as const,
};

// User projects (authored + collaborating by default)
const getUserProjects = async (
  page: number = 1,
  limit: number = 10,
  scope: "all" | "authored" | "collaborating" = "all",
): Promise<ProjectsResponse> => {
  const response = await apiHttp.get<ProjectsResponse>(
    `/projects?page=${page}&limit=${limit}&scope=${scope}`,
  );
  return response.data;
};

const getProjectById = async (projectId: string): Promise<Project> => {
  const response = await apiHttp.get<{ project: Project }>(
    `/projects/${projectId}`,
  );
  return response.data.project;
};

export const useGetUserProjects = (
  page: number = 1,
  limit: number = 10,
  scope: "all" | "authored" | "collaborating" = "all",
) =>
  useQuery({
    queryKey: [...projectsKeys.userProjects(), page, limit, scope],
    queryFn: () => getUserProjects(page, limit, scope),
  });

export const useGetInfiniteUserProjects = (
  limit: number = 10,
  scope: "all" | "authored" | "collaborating" = "all",
) =>
  useInfiniteQuery({
    queryKey: [...projectsKeys.userProjects(), "infinite", limit, scope],
    queryFn: ({ pageParam = 1 }) => getUserProjects(pageParam, limit, scope),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

/** Projects where the current user is a collaborator (not author) */
export const useGetInfiniteCollaboratingProjects = (limit: number = 10) =>
  useGetInfiniteUserProjects(limit, "collaborating");

export const useGetProjectById = (
  projectId: string,
  options?: { enabled?: boolean },
) =>
  useQuery({
    queryKey: projectsKeys.singleProject(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId && (options?.enabled ?? true),
  });
