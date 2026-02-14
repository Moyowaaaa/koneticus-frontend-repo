"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import ButtonV2 from "@/components/ui-components/button";
import { useRouter } from "next/navigation";
import { useIdeaStore } from "@/store/useIdeaStore";
import { useEditIdeaModalStore } from "@/store/useEditIdeaModalStore";
import { Project } from "@/api/projects/projects.model";
import { useDeleteProject } from "@/api/projects/project.mutations";

import { showToast } from "@/utils/toasts";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onOpen?: (project: Project) => void;
}

const ProjectCard = ({ project, onEdit }: ProjectCardProps) => {
  const router = useRouter();
  const { deleteIdea } = useIdeaStore();
  const openEditModal = useEditIdeaModalStore((state) => state.openModal);
  const { mutateAsync: deleteProject } = useDeleteProject(project._id);

  const handleAction = () => {
    // if (project.status === "pending") {
    openEditModal(project._id);
    onEdit?.(project);
    return;
    // }

    // onOpen?.(project);
    // router.push(`/dashboard/projects/ongoing/${project._id}`);
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
      <div className="relative w-full h-[15rem]  rounded-t-[1.25rem] overflow-hidden">
        <Image
          src={project?.media[0]?.url}
          alt={project?.title}
          fill
          className="object-cover"
        />
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
            Edit
          </ButtonV2>

          {/* {onDelete && ( */}
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
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
