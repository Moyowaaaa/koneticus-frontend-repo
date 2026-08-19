"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import ButtonV2 from "@/components/ui-components/button";
import { useRouter } from "next/navigation";
import { useEditIdeaModalStore } from "@/store/useEditIdeaModalStore";
import { Project } from "@/api/projects/projects.model";
import { useDeleteProject } from "@/api/projects/project.mutations";

import { showToast } from "@/utils/toasts";
import { useState } from "react";
import BrokenMedia from "@/components/ui-components/BrokenMedia";
import { useAuthStore } from "@/store/useAuthStore";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onOpen?: (project: Project) => void;
}

const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const openEditModal = useEditIdeaModalStore((state) => state.openModal);
  const { mutateAsync: deleteProject } = useDeleteProject(project._id);
  const [imageError, setImageError] = useState<boolean>(false);
  const authorId =
    typeof project.author === "string" ? project.author : project.author?._id;
  const isOwner = authorId === user?._id;

  const handleAction = () => {
    if (project.status === "draft") {
      openEditModal(project._id);
      onEdit?.(project);
      return;
    } else {
      router.push(`/dashboard/projects/ongoing/${project._id}`);
    }

    // onOpen?.(project);
  };

  const onDeleteProject = async () => {
    try {
      await deleteProject(project._id);
      showToast.success("Project deleted successfully");
    } catch (error) {
      console.error("Failed to delete project:", error);
      showToast.error("Failed to delete project");
    }
  };

  return (
    <div className="flex flex-col     ">
      {/* Project Image */}
      <div className="relative w-full h-[140px] md:h-[140px]  rounded-t-[1.25rem] overflow-hidden">
        {imageError ? (
          <BrokenMedia />
        ) : (
          <Image
            src={project?.media[0]?.url}
            alt={project?.title}
            onError={() => setImageError(true)}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div
        className="
        border border-[#E9E9E9E9] dark:border-[#80808026]
      hover:shadow-sm transition-shadow
      bg-white dark:bg-[#80808026]
      min-h-[11rem]  p-4 rounded-b-[1.25rem] w-full flex flex-col justify-between"
      >
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-brand-black dark:text-[#FFFFFF] text-[0.875rem] line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-brand-grey dark:text-[#808080] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <ButtonV2
            onClick={handleAction}
            className="h-max! px-6 text-sm min-h-max"
            variant={project.status === "pending" ? "default" : "default"}
          >
            {project.status === "draft" ? "Edit" : "Open"}
          </ButtonV2>

          {/* {onDelete && ( */}
          {isOwner && (
            <Button
              // onClick={() => onDelete(project.id)}
              onClick={() => onDeleteProject()}
              variant="ghost"
              size="icon-sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Image
                src="/images/trash-icon.svg"
                alt="trash"
                width={16}
                height={16}
              />
            </Button>
          )}

          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
