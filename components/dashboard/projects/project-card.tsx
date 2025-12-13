"use client";

import { Project } from "@/types";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import ButtonV2 from "@/components/ui-components/button";
import { useRouter } from "next/navigation";
import { useIdeaStore } from "@/store/useIdeaStore";
import { useEditIdeaModalStore } from "@/store/useEditIdeaModalStore";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  onOpen?: (project: Project) => void;
}

const ProjectCard = ({
  project,
  onEdit,
  onDelete,
  onOpen,
}: ProjectCardProps) => {
  const router = useRouter();
  const { deleteIdea } = useIdeaStore();
  const openEditModal = useEditIdeaModalStore((state) => state.openModal);

  const handleAction = () => {
    if (project.status === "pending") {
      openEditModal(project.id);
      onEdit?.(project);
      return;
    }

    onOpen?.(project);
    router.push(`/dashboard/projects/ongoing/${project.id}`);
  };

  return (
    <div className="flex flex-col     bg-white ">
      {/* Project Image */}
      <div className="relative w-full h-[15rem]  rounded-t-[1.25rem] overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        />
      </div>

      <div
        className="
        border border-[#E9E9E9E9]
      hover:shadow-sm transition-shadow
      min-h-[11rem]  p-4 rounded-b-[1.25rem] w-full flex flex-col justify-between"
      >
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-brand-black text-[0.875rem] line-clamp-1">
            {project.title}
          </h3>
          <p className="text-sm text-brand-grey line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <ButtonV2
            onClick={handleAction}
            className="h-max! px-6 text-sm min-h-max"
            variant={project.status === "pending" ? "default" : "default"}
          >
            {project.status === "pending" ? "Edit" : "Open"}
          </ButtonV2>

          {/* {onDelete && ( */}
          <Button
            // onClick={() => onDelete(project.id)}
            onClick={() => deleteIdea(project?.id as string)}
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
