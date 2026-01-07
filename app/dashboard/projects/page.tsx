"use client";

import RecentActivities from "@/components/dashboard/projects/recent-activities";
import ProjectFilter from "@/components/dashboard/projects/project-filter";
import TopBar from "@/components/ui-components/top-bar";
import { Project, ProjectStatus } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";
import { useDummyStore } from "@/store/useDummyStore";
import ProjectCard from "@/components/dashboard/projects/project-card";
import ButtonV2 from "@/components/ui-components/button";
import { ArrowRight } from "iconsax-reactjs";
import { useGeneralStateStore } from "@/store/useGeneralStateStore";

const ProjectsPage = () => {
  const router = useRouter();
  const { useDummyData } = useDummyStore();
  const { toggleNewIdeaModal } = useGeneralStateStore();

  // Mock data for counts - replace with actual data fetching
  const mockProjects: Project[] = [
    {
      id: "1",
      title: "Idea title would be in this place",
      description:
        "Here, the description would be well appreciated about the...",
      status: "pending",
      image: "/images/project-placeholder-1.jpg",
      createdAt: "2024-09-26",
      updatedAt: "2024-09-26",
    },
    {
      id: "2",
      title: "Creative Design System",
      description:
        "Building a comprehensive design system for modern web applications...",
      status: "pending",
      image: "/images/project-placeholder-2.jpg",
      createdAt: "2024-09-25",
      updatedAt: "2024-09-26",
    },
    {
      id: "3",
      title: "Mobile App Collaboration",
      description:
        "Developing a mobile application for creative collaboration...",
      status: "ongoing",
      image: "/images/project-placeholder-1.jpg",
      collaborators: ["John", "Sarah", "Mike", "Anna"],
      createdAt: "2024-09-20",
      updatedAt: "2024-09-26",
    },
  ];

  const projects = !useDummyData ? [] : mockProjects;

  const pendingProjects = projects.filter((p) => p.status === "pending");
  const ongoingProjects = projects.filter((p) => p.status === "ongoing");

  const handleFilterChange = (filter: ProjectStatus | "all") => {
    if (filter !== "all") {
      // Navigate to the dynamic route
      router.push(`/dashboard/projects/${filter}`);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-10 w-full pt-6 px-6">
        <TopBar>
          <h1 className="text-[2rem] font-semibold text-brand-black dark:text-[#FFFFFF]">
            Projects
          </h1>
        </TopBar>
        {ongoingProjects.length ? (
          <div className="grid grid-cols-4 gap-4">
            {ongoingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-brand-black flex flex-col items-center gap-[1.5rem]">
            <p className="text-sm">There are no ideas yet. Share your idea</p>
            <ButtonV2
              type="submit"
              className="w-max h-max !px-6 border-none dark:bg-[#6155F5]"
              IconPlacement="right"
              Icon={<ArrowRight size="13" />}
              onClick={() => {
                toggleNewIdeaModal();
                router.push("/dashboard");
              }}
              variant="dark"
            >
              Go Home
            </ButtonV2>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsPage;
