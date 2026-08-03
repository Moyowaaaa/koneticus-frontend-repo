import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import { notificationKeys } from "./notifications.queries";

const markNotificationAsRead = async (
  notificationId: string,
): Promise<{ message: string }> => {
  const response = await apiHttp.patch<{ message: string }>(
    `/notifications/${notificationId}`,
  );
  return response.data;
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};
