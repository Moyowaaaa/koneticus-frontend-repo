"use client";

import { Project, ProjectStatus } from "@/types";
import React from "react";
import ProjectCard from "./project-card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import TopBar from "@/components/ui-components/top-bar";

interface ProjectsListProps {
  projects: Project[];
  currentFilter: ProjectStatus | "all";
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
  onOpenProject?: (project: Project) => void;
}

const ProjectsEmptyState = ({ status }: { status: ProjectStatus }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <h3 className="text-lg font-semibold text-brand-black mb-2">
          No {status} projects yet
        </h3>
        <p className="text-grey text-sm leading-relaxed">
          {status === "pending"
            ? "You don't have any pending projects. Create a new idea to get started!"
            : "You don't have any ongoing projects. Accept collaboration requests to see them here."}
        </p>
      </div>
    </div>
  );
};

const ProjectsList = ({
  projects,
  currentFilter,
  onEditProject,
  onDeleteProject,
  onOpenProject,
}: ProjectsListProps) => {
  const router = useRouter();
  const filteredProjects = projects.filter(
    (project) => currentFilter === "all" || project.status === currentFilter
  );

  const getTitle = () => {
    switch (currentFilter) {
      case "pending":
        return "Pending Projects";
      case "ongoing":
        return "Ongoing Projects";
      default:
        return "All Projects";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header with back button */}
      <TopBar className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon-sm"
          className="text-brand-black hover:bg-lavender"
        >
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold text-brand-black">{getTitle()}</h2>
      </TopBar>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        currentFilter !== "all" ? (
          <ProjectsEmptyState status={currentFilter} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center max-w-md">
              <h3 className="text-lg font-semibold text-brand-black mb-2">
                No projects yet
              </h3>
              <p className="text-grey text-sm leading-relaxed">
                Start by creating your first idea or joining a collaboration!
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
              onOpen={onOpenProject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
