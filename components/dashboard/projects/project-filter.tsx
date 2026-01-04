"use client";

import { ProjectStatus } from "@/types";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

interface ProjectFilterProps {
  activeFilter: ProjectStatus | "all";
  onFilterChange: (filter: ProjectStatus | "all") => void;
  pendingCount?: number;
  ongoingCount?: number;
}

const ProjectFilter = ({
  activeFilter,
  onFilterChange,
  pendingCount = 0,
  ongoingCount = 0,
}: ProjectFilterProps) => {
  const filters = [
    {
      id: "pending" as const,
      label: "Pending",
      icon: "/images/pending-folder.svg",
      count: pendingCount,
    },
    {
      id: "ongoing" as const,
      label: "Ongoing",
      icon: "/images/ongoing-folder.svg",
      count: ongoingCount,
    },
  ];

  return (
    <div className="flex items-center gap-8">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "min-w-30 h-27.25 items-center justify-center rounded-[1.25rem] border flex flex-col gap-2 transition-all duration-200 hover:shadow-sm",
            activeFilter === filter.id || activeFilter === "all"
              ? " bg-white dark:bg-[#80808026]"
              : "border-[#e9e9e9] bg-white dark:bg-[#80808026] hover:border-primary/30 "
          )}
        >
          <div className="h-12 relative w-17.5">
            <Image src={filter.icon} alt={filter.label} fill />
          </div>

          <div className="flex flex-col items-center gap-1">
            <p
              className={cn(
                "text-sm font-medium",
                activeFilter === filter.id
                  ? "text-primary dark:text-[#FFFFFF]"
                  : "text-brand-black dark:text-[#FFFFFF]"
              )}
            >
              {filter.label}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;
