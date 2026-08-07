import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import {
  ICreateCollaborationRequestPayload,
  ICreateCollaborationRequestResponse,
  CollaborationRequest,
} from "./collaboration.model";
import { collaborationRequestKeys } from "./collaboration.queries";
import { notificationKeys } from "../notifications/notifications.queries";
import { projectsKeys } from "../projects/projects.queries";

//Create a collaboration request
const createCollaborationRequest = async (
  data: ICreateCollaborationRequestPayload,
): Promise<CollaborationRequest> => {
  const formData = new FormData();
  formData.append("proposal", data.proposal);

  if (data.media && data.media.length > 0) {
    data.media.forEach((file) => {
      formData.append("media", file);
    });
  }

  const response = await apiHttp.post<ICreateCollaborationRequestResponse>(
    `/collaboration-requests/projects/${data.projectId}/requests`,
    formData,
    {
      headers: {
        // Let the browser set multipart/form-data with boundary
        "Content-Type": undefined,
      },
    },
  );

  return response.data.request;
};

export const useCreateCollaborationRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCollaborationRequest,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: collaborationRequestKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: collaborationRequestKeys.myRequests(),
      });
      void queryClient.invalidateQueries({
        queryKey: collaborationRequestKeys.projectRequests(variables.projectId),
      });
      void queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
    onError: (error) => {
      console.error("Failed to create collaboration request:", error);
    },
  });
};

//Accept a collaboration request
const acceptCollaborationRequest = async ({
  requestId,
}: {
  requestId: string;
}): Promise<CollaborationRequest> => {
  const response = await apiHttp.patch(
    `collaboration-requests/${requestId}/accept`,
  );
  return response.data;
};

export const useAcceptCollaborationRequest = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptCollaborationRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: collaborationRequestKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: collaborationRequestKeys.myRequests(),
      });
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: collaborationRequestKeys.projectRequests(projectId),
        });
        void queryClient.invalidateQueries({
          queryKey: projectsKeys.singleProject(projectId),
        });
      }
      void queryClient.invalidateQueries({
        queryKey: projectsKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
    onError: (error) => {
      console.error("Failed to accept collaboration request:", error);
    },
  });
};

const rejectCollaborationRequest = async ({
  requestId,
}: {
  requestId: string;
}): Promise<CollaborationRequest> => {
  const response = await apiHttp.patch(
    `collaboration-requests/${requestId}/reject`,
  );
  return response.data;
};

export const useRejectCollaborationRequest = (projectId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectCollaborationRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: collaborationRequestKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: collaborationRequestKeys.myRequests(),
      });
      if (projectId) {
        void queryClient.invalidateQueries({
          queryKey: collaborationRequestKeys.projectRequests(projectId),
        });
      }
      void queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
    onError: (error) => {
      console.error("Failed to reject collaboration request:", error);
    },
  });
};
