import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiHttp from "../appConfig";
import { UserProfile, UserProfileLinks } from "./user.model";
import { userKeys } from "./user.queries";

export interface IUpdateProfilePayload {
  firstname?: string;
  lastname?: string;
  roles?: string[];
  bio?: string;
  links?: UserProfileLinks;
  cvLinkedUrl?: string;
  image?: File | null;
  cv?: File | null;
}

export interface IUpdateProfileResponse {
  message: string;
  profile: UserProfile;
}

const updateProfile = async (
  data: IUpdateProfilePayload,
): Promise<UserProfile> => {
  const formData = new FormData();

  if (data.firstname !== undefined) formData.append("firstname", data.firstname);
  if (data.lastname !== undefined) formData.append("lastname", data.lastname);
  if (data.bio !== undefined) formData.append("bio", data.bio);
  if (data.roles) formData.append("roles", JSON.stringify(data.roles));
  if (data.links) formData.append("links", JSON.stringify(data.links));
  if (data.cvLinkedUrl !== undefined) {
    formData.append("cvLinkedUrl", data.cvLinkedUrl);
  }
  if (data.image) formData.append("image", data.image);
  if (data.cv) formData.append("cv", data.cv);

  const response = await apiHttp.patch<IUpdateProfileResponse>(
    "/user/me",
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    },
  );

  return response.data.profile;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });
};
