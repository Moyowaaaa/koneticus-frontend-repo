import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import { ICreateProjectPayload, Project } from "./projects.model";
import { projectsKeys } from "./projects.queries";
import { feedKeys } from "../feed/feed.queries";

// Create a new project
const createProject = async (data: ICreateProjectPayload): Promise<Project> => {
  const formData = new FormData();

  // Text fields
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("teamSize", data.teamSize.toString());

  // Array fields - append each item individually or stringify based on backend expectation
  // usually array fields in FormData are appended with the same key
  data.requiredRoles.forEach((role) => {
    formData.append("requiredRoles", role);
  });

  // Media files
  if (data.media && data.media.length > 0) {
    data.media.forEach((file) => {
      formData.append("media", file);
    });
  }

  const response = await apiHttp.post<{ data: Project }>(
    "/projects",
    formData,
    {
      headers: {
        // Remove Content-Type to let browser set multipart/form-data with boundary
        "Content-Type": undefined,
      },
    },
  );
  return response.data.data;
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
      queryClient.invalidateQueries({ queryKey: feedKeys.list() });
      queryClient.invalidateQueries({ queryKey: feedKeys.trending() });

      console.log("Project created successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to create project:", error);
    },
  });
};

//delete project
const deleteProject = async (id: string): Promise<{ message: string }> => {
  await apiHttp.delete(`/projects/${id}`);
  return { message: "Project deleted successfully" };
};

export const useDeleteProject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      // Just invalidate queries to ensure server sync
      queryClient.invalidateQueries({ queryKey: projectsKeys.all });
      queryClient.invalidateQueries({
        queryKey: projectsKeys.singleProject(id),
      });
      queryClient.invalidateQueries({ queryKey: projectsKeys.userProjects() });
      queryClient.invalidateQueries({ queryKey: feedKeys.all });
      queryClient.invalidateQueries({ queryKey: feedKeys.list() });
      queryClient.invalidateQueries({ queryKey: feedKeys.trending() });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      // Component will handle rollback through query invalidation
    },
  });
};
