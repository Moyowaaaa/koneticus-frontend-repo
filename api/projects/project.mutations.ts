import { useMutation } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import { ICreateProjectPayload, Project } from "./projects.model";
import { useAuthStore } from "@/store/useAuthStore";

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

  // Get token from auth store
  const { token } = useAuthStore.getState();

  const response = await apiHttp.post<{ data: Project }>(
    "/projects",
    formData,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    },
  );
  return response.data.data;
};

export const useCreateProject = () =>
  useMutation({
    mutationFn: createProject,
    onSuccess: (data) => {
      console.log("Project created successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to create project:", error);
    },
  });
