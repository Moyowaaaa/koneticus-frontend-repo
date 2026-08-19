"use client";

import React, { useEffect, useRef, useState } from "react";
import CustomFormInput from "@/components/ui-components/custom-form-input";
import ButtonV2 from "@/components/ui-components/button";
import { PORTFOLIO_FIELDS, ROLE_SUGGESTIONS } from "@/types/data";
import Image from "next/image";
import { Plus, X } from "lucide-react";
import { useGetMe } from "@/api/user/user.queries";
import { useUpdateProfile } from "@/api/user/user.mutations";
import { mapMeUserToAuthUser } from "@/api/user/user.model";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useGetErrorMessage } from "@/lib/utils";

const ProfileSettings = () => {
  const { data: meUser, isLoading } = useGetMe();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();
  const setUser = useAuthStore((state) => state.setUser);
  const getErrorMessage = useGetErrorMessage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = meUser?.userProfile;

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [bio, setBio] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [links, setLinks] = useState<Record<string, string>>({
    github: "",
    behance: "",
    linkedin: "",
    website: "",
  });
  const [roleInput, setRoleInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setFirstname(profile.firstname ?? "");
    setLastname(profile.lastname ?? "");
    setBio(profile.bio ?? "");
    setRoles(profile.roles ?? []);
    setLinks({
      github: profile.links?.github ?? "",
      behance: profile.links?.behance ?? "",
      linkedin: profile.links?.linkedin ?? "",
      website: profile.links?.website ?? "",
    });
    setImagePreview(profile.profilePicture?.url ?? null);
    setImageFile(null);
  }, [profile]);

  const handleRoleAdd = (role?: string) => {
    const newRole = (role || roleInput).trim();
    if (newRole && !roles.includes(newRole)) {
      setRoles((prev) => [...prev, newRole]);
      setRoleInput("");
    }
  };

  const handleRoleRemove = (roleToRemove: string) => {
    setRoles((prev) => prev.filter((role) => role !== roleToRemove));
  };

  const handleImagePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!firstname.trim() || !lastname.trim()) {
      toast.error("First and last name are required.");
      return;
    }

    updateProfile(
      {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        bio,
        roles,
        links: {
          github: links.github || undefined,
          behance: links.behance || undefined,
          linkedin: links.linkedin || undefined,
          website: links.website || undefined,
        },
        image: imageFile,
      },
      {
        onSuccess: (updated) => {
          if (meUser) {
            setUser(
              mapMeUserToAuthUser({
                ...meUser,
                userProfile: updated,
              }),
            );
          }
          toast.success("Profile updated successfully");
          setImageFile(null);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  const handleCancel = () => {
    if (!profile) return;
    setFirstname(profile.firstname ?? "");
    setLastname(profile.lastname ?? "");
    setBio(profile.bio ?? "");
    setRoles(profile.roles ?? []);
    setLinks({
      github: profile.links?.github ?? "",
      behance: profile.links?.behance ?? "",
      linkedin: profile.links?.linkedin ?? "",
      website: profile.links?.website ?? "",
    });
    setImagePreview(profile.profilePicture?.url ?? null);
    setImageFile(null);
  };

  if (isLoading) {
    return <p className="text-brand-grey text-sm pt-4">Loading profile...</p>;
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-10 w-full pt-4">
        <div className="flex flex-col">
          <h1 className="text-brand-black text-[1.125rem] font-normal dark:text-white">
            Personal Information
          </h1>
          <p className="text-brand-grey text-[0.875rem] font-normal">
            Update your name, bio, links, and roles.
          </p>
        </div>

        <div className="flex items-start justify-between pr-16 gap-8">
          <div className="flex flex-col gap-2">
            <div className="relative h-[7.75rem] w-[7.75rem] overflow-hidden rounded-full">
              <Image
                src={imagePreview || "/images/dummy-avatar.svg"}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-brand-black text-[0.875rem] underline font-[sora-light] text-left dark:text-white"
            >
              Change profile picture
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
            />
          </div>

          <div className="flex flex-col gap-4 w-[39.5rem]">
            <div className="grid grid-cols-2 gap-4">
              <CustomFormInput
                label="First name *"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                disabled={isSaving}
              />
              <CustomFormInput
                label="Last name *"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <div className="relative h-[12.5rem] w-full border rounded-[1.875rem] border-[#E9E9E9E9] min-h-[12.5rem] dark:border-[#80808026]">
              <textarea
                placeholder="Type here..."
                value={bio}
                maxLength={150}
                disabled={isSaving}
                onChange={(event) => setBio(event.target.value)}
                className="p-4 w-full h-full text-[#808080] placeholder:text-[#808080] text-base font-[sora-light] resize-none outline-none border-none focus:ring-0 bg-transparent"
              />
              <p className="text-brand-black text-xs absolute bottom-4 right-4 dark:text-white">
                {150 - bio.length}
              </p>
            </div>

            <div className="flex flex-col gap-6 w-full">
              {PORTFOLIO_FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="flex min-h-[3.5rem] items-center gap-3 rounded-[1.875rem] border border-[#E9E9E9] bg-white px-5 py-3 dark:bg-[#80808026] dark:border-[#80808026]"
                >
                  <div className="relative h-6 w-6">
                    <Image src={field.logo} alt={field.key} fill />
                  </div>
                  <div className="h-5 border border-[#808080]" />
                  <input
                    className="flex-1 bg-transparent text-sm outline-none dark:text-white"
                    placeholder="Add link.."
                    value={links[field.key] ?? ""}
                    disabled={isSaving}
                    onChange={(event) =>
                      setLinks((prev) => ({
                        ...prev,
                        [field.key]: event.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex border-t border-[#E9E9E9E9] pt-[2.5rem] items-start justify-between pr-16 dark:border-[#80808026]">
          <div className="flex flex-col gap-4">
            <h1 className="text-brand-black text-[1.125rem] font-normal dark:text-white">
              Roles
            </h1>
            <p className="text-brand-grey text-[0.875rem] font-normal">
              Manage the role you perform
            </p>
          </div>

          <div className="flex flex-col gap-4 w-[39.5rem]">
            <div className="flex items-center gap-2 rounded-[1.875rem] border border-[#E9E9E9] px-4 py-3 dark:border-[#80808026]">
              <input
                className="flex-1 bg-transparent text-sm outline-none dark:text-white"
                placeholder="Select roles"
                value={roleInput}
                disabled={isSaving}
                onChange={(e) => setRoleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRoleAdd();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleRoleAdd()}
                disabled={isSaving}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                <Plus size={16} />
                Add
              </button>
            </div>

            {!!roles.length && (
              <div className="flex flex-wrap gap-2 cursor-pointer justify-center w-[25rem]">
                {roles.map((role) => (
                  <span
                    key={role}
                    className="inline-flex items-center gap-1 rounded-full min-h-[2.125rem] bg-purple-light px-3 py-1 text-sm text-brand-black"
                  >
                    {role}
                    <button
                      type="button"
                      onClick={() => handleRoleRemove(role)}
                      className="text-primary/70"
                    >
                      <X size={14} className="text-[#211E1E]" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 text-xs text-grey justify-center">
              {ROLE_SUGGESTIONS.filter(
                (suggestion) => !roles.includes(suggestion),
              ).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleRoleAdd(suggestion)}
                  className="rounded-full border border-[#E9E9E9] px-3 py-1 text-sm transition hover:border-primary hover:text-primary dark:border-[#80808026]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pr-16 pb-8">
          <ButtonV2
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
            className="min-h-10"
          >
            Cancel
          </ButtonV2>
          <ButtonV2
            onClick={handleSave}
            disabled={isSaving}
            className="min-h-10"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </ButtonV2>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
