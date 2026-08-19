import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import apiHttp from "../appConfig";
import {
  ICreateProjectPayload,
  IUpdateProjectPayload,
  IUpdateProjectStatusPayload,
  Project,
} from "./projects.model";
import { projectsKeys } from "./projects.queries";
import { feedKeys } from "../feed/feed.queries";
import {
  buildOptimisticFeedItem,
  findFeedItem,
  mapProjectToFeedItem,
  patchFeedItem,
  prependFeedItem,
  removeFeedItem,
  replaceFeedItem,
  revokeOptimisticMediaUrls,
  type FeedInfiniteData,
} from "../feed/feed.cache";
import { useAuthStore } from "@/store/useAuthStore";

const DEFAULT_FEED_LIMIT = 20;

type FeedKey = ReturnType<typeof feedKeys.infinite>;

type FeedMutationContext = {
  previousFeed: FeedInfiniteData | undefined;
  feedKey: FeedKey;
};

type CreateProjectContext = FeedMutationContext & {
  optimisticId: string;
};

type UpdateProjectVariables = {
  id: string;
  data: IUpdateProjectPayload;
};

type UpdateProjectStatusVariables = {
  id: string;
  data: IUpdateProjectStatusPayload;
};

const createProject = async (data: ICreateProjectPayload): Promise<Project> => {
  const formData = new FormData();

  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("teamSize", data.teamSize.toString());

  data.requiredRoles.forEach((role) => {
    formData.append("requiredRoles", role);
  });

  if (data.media && data.media.length > 0) {
    data.media.forEach((file) => {
      formData.append("media", file);
    });
  }

  const response = await apiHttp.post<{
    message: string;
    project?: Project;
    data?: Project;
  }>("/projects", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });

  const project = response.data.project ?? response.data.data;
  if (!project) {
    throw new Error("Create project response did not include a project");
  }
  return project;
};

const invalidateProjectLists = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: projectsKeys.all });
};

const softRefreshTrending = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: feedKeys.trending() });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Project,
    Error,
    ICreateProjectPayload,
    CreateProjectContext
  >({
    mutationFn: createProject,
    onMutate: async (variables) => {
      const feedKey = feedKeys.infinite(DEFAULT_FEED_LIMIT);
      await queryClient.cancelQueries({ queryKey: feedKey });

      const previousFeed =
        queryClient.getQueryData<FeedInfiniteData>(feedKey);
      const optimisticId = `optimistic-${Date.now()}`;
      const user = useAuthStore.getState().user;
      const optimisticItem = buildOptimisticFeedItem(
        variables,
        user,
        optimisticId,
      );

      queryClient.setQueryData<FeedInfiniteData>(feedKey, (current) =>
        prependFeedItem(current, optimisticItem),
      );

      return { previousFeed, optimisticId, feedKey };
    },
    onSuccess: (project, _variables, context) => {
      if (!context) return;

      const user = useAuthStore.getState().user;
      const feedItem = mapProjectToFeedItem(project, user);
      const optimistic = findFeedItem(
        queryClient.getQueryData<FeedInfiniteData>(context.feedKey),
        context.optimisticId,
      );

      queryClient.setQueryData<FeedInfiniteData>(context.feedKey, (current) =>
        replaceFeedItem(current, context.optimisticId, feedItem),
      );
      revokeOptimisticMediaUrls(optimistic);

      invalidateProjectLists(queryClient);
      softRefreshTrending(queryClient);
    },
    onError: (_error, _variables, context) => {
      if (!context) return;

      const optimistic = findFeedItem(
        queryClient.getQueryData<FeedInfiniteData>(context.feedKey),
        context.optimisticId,
      );
      revokeOptimisticMediaUrls(optimistic);

      if (context.previousFeed) {
        queryClient.setQueryData(context.feedKey, context.previousFeed);
      } else {
        queryClient.setQueryData<FeedInfiniteData>(context.feedKey, (current) =>
          removeFeedItem(current, context.optimisticId),
        );
      }
    },
  });
};

const updateProject = async ({
  id,
  data,
}: UpdateProjectVariables): Promise<Project> => {
  const response = await apiHttp.patch<{ project: Project }>(
    `/projects/${id}`,
    data,
  );
  return response.data.project;
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<Project, Error, UpdateProjectVariables>({
    mutationFn: updateProject,
    onSuccess: (project, variables) => {
      const feedKey = feedKeys.infinite(DEFAULT_FEED_LIMIT);
      const user = useAuthStore.getState().user;
      const feedItem = mapProjectToFeedItem(project, user);

      queryClient.setQueryData<FeedInfiniteData>(feedKey, (current) =>
        patchFeedItem(current, variables.id, feedItem),
      );

      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
      queryClient.invalidateQueries({
        queryKey: projectsKeys.singleProject(variables.id),
      });
      softRefreshTrending(queryClient);
    },
    onError: (error) => {
      console.error("Failed to update project:", error);
    },
  });
};

const updateProjectStatus = async ({
  id,
  data,
}: UpdateProjectStatusVariables): Promise<Project> => {
  const response = await apiHttp.patch<{ project: Project }>(
    `/projects/${id}/status`,
    data,
  );
  return response.data.project;
};

export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Project,
    Error,
    UpdateProjectStatusVariables,
    FeedMutationContext
  >({
    mutationFn: updateProjectStatus,
    onMutate: async ({ id, data }) => {
      const feedKey = feedKeys.infinite(DEFAULT_FEED_LIMIT);
      await queryClient.cancelQueries({ queryKey: feedKey });
      const previousFeed =
        queryClient.getQueryData<FeedInfiniteData>(feedKey);

      queryClient.setQueryData<FeedInfiniteData>(feedKey, (current) =>
        patchFeedItem(current, id, { status: data.status }),
      );

      return { previousFeed, feedKey };
    },
    onSuccess: (project, variables) => {
      const feedKey = feedKeys.infinite(DEFAULT_FEED_LIMIT);
      const user = useAuthStore.getState().user;

      queryClient.setQueryData<FeedInfiniteData>(feedKey, (current) =>
        patchFeedItem(
          current,
          variables.id,
          mapProjectToFeedItem(project, user),
        ),
      );

      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
      queryClient.invalidateQueries({
        queryKey: projectsKeys.singleProject(variables.id),
      });
      softRefreshTrending(queryClient);
    },
    onError: (_error, _variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(context.feedKey, context.previousFeed);
      }
    },
  });
};

const deleteProject = async (id: string): Promise<{ message: string }> => {
  await apiHttp.delete(`/projects/${id}`);
  return { message: "Project deleted successfully" };
};

export const useDeleteProject = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    { message: string },
    Error,
    string,
    FeedMutationContext & { projectId: string }
  >({
    mutationFn: (projectId: string) => deleteProject(projectId),
    onMutate: async (projectId) => {
      const feedKey = feedKeys.infinite(DEFAULT_FEED_LIMIT);
      await queryClient.cancelQueries({ queryKey: feedKey });

      const previousFeed =
        queryClient.getQueryData<FeedInfiniteData>(feedKey);

      queryClient.setQueryData<FeedInfiniteData>(feedKey, (current) =>
        removeFeedItem(current, projectId),
      );

      return { previousFeed, feedKey, projectId };
    },
    onSuccess: (_data, projectId) => {
      invalidateProjectLists(queryClient);
      queryClient.invalidateQueries({
        queryKey: projectsKeys.singleProject(id || projectId),
      });
      softRefreshTrending(queryClient);
    },
    onError: (_error, _projectId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(context.feedKey, context.previousFeed);
      }
    },
  });
};
