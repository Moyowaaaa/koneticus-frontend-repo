"use client";

import ButtonV2 from "@/components/ui-components/button";
import TopBar from "@/components/ui-components/top-bar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import ProjectCard from "../projects/project-card";
import EditIdeaModal from "../modals/edit-idea-modal";
import { useIdeaStore } from "@/store/useIdeaStore";

const PendingProjectsClient = () => {
  const router = useRouter();
  const { ideas } = useIdeaStore();
  const pendingProjects = ideas.filter((p) => p.status === "pending");

  return (
    <>
      <EditIdeaModal />
      <div className="flex flex-col gap-10 w-full pt-4 px-6">
        <TopBar className="flex items-center gap-6">
          <ButtonV2
            onClick={router.back}
            type="submit"
            className="w-max h-max min-h-max! py-3 !px-4 border-none"
            IconPlacement="left"
            Icon={
              <Image src="/images/back.svg" alt="back" width={13} height={13} />
            }
            variant="dark"
          >
            Back
          </ButtonV2>

          <h1 className="font-semibold text-[1.25rem] ">Pending</h1>
        </TopBar>

        {pendingProjects.length ? (
          <div className="grid grid-cols-4 gap-4">
            {pendingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-brand-grey">
            No pending projects yet.
          </div>
        )}

        {/* <div className="flex gap-4">
          {pendingProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div> */}
      </div>
    </>
  );
};

export default PendingProjectsClient;
