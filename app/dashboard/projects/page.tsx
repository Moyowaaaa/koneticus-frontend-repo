"use client";

import RecentActivities from "@/components/dashboard/projects/recent-activities";
import ProjectFilter from "@/components/dashboard/projects/project-filter";
import TopBar from "@/components/ui-components/top-bar";
import { Project, ProjectStatus } from "@/types";
import { useRouter } from "next/navigation";
import React from "react";

const ProjectsdPage = () => {
  const router = useRouter();

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
      image: "/images/project-placeholder-3.jpg",
      collaborators: ["John", "Sarah", "Mike", "Anna"],
      createdAt: "2024-09-20",
      updatedAt: "2024-09-26",
    },
  ];

  const pendingProjects = mockProjects.filter((p) => p.status === "pending");
  const ongoingProjects = mockProjects.filter((p) => p.status === "ongoing");

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
          <h1 className="text-[2rem] font-semibold text-brand-black">
            Projects
          </h1>
        </TopBar>

        <ProjectFilter
          activeFilter="all"
          onFilterChange={handleFilterChange}
          pendingCount={pendingProjects.length}
          ongoingCount={ongoingProjects.length}
        />
        <RecentActivities />
      </div>
    </>
  );
};

export default ProjectsdPage;
