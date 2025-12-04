"use client";

import { Project } from "@/types";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

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
  const handleAction = () => {
    if (project.status === "pending" && onEdit) {
      onEdit(project);
    } else if (project.status === "ongoing" && onOpen) {
      onOpen(project);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border border-[#e9e9e9] rounded-[1.25rem] bg-white hover:shadow-sm transition-shadow">
      {/* Project Image */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden">
        {/* <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
        /> */}
      </div>

      {/* Project Info */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-brand-black text-[1.125rem] line-clamp-1">
          {project.title}
        </h3>
        <p className="text-sm text-grey line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Collaborators (for ongoing projects) */}
      {project.status === "ongoing" && project.collaborators && (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {project.collaborators.slice(0, 3).map((collaborator, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center border-2 border-white"
              >
                {collaborator.charAt(0).toUpperCase()}
              </div>
            ))}
            {project.collaborators.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-grey text-white text-xs flex items-center justify-center border-2 border-white">
                +{project.collaborators.length - 3}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          onClick={handleAction}
          className="h-8 px-4 text-sm"
          variant={project.status === "pending" ? "outline" : "default"}
        >
          {project.status === "pending" ? "Edit" : "Open"}
        </Button>

        {onDelete && (
          <Button
            onClick={() => onDelete(project.id)}
            variant="ghost"
            size="icon-sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
