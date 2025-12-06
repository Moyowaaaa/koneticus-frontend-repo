"use client";

import ButtonV2 from "@/components/ui-components/button";
import TopBar from "@/components/ui-components/top-bar";
import { Button } from "@/components/ui/button";
import { useIdeaStore } from "@/store/useIdeaStore";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const ProjectDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const project = useIdeaStore().getIdeaById(id);
  return (
    <>
      <div className="flex flex-col gap-10 w-full pt-4 px-6">
        <TopBar className="flex items-center gap-6">
          <ButtonV2
            onClick={router.back}
            type="submit"
            className="w-max h-max  !px-6 border-none"
            IconPlacement="left"
            Icon={
              <Image src="/images/back.svg" alt="back" width={13} height={13} />
            }
            variant="dark"
          >
            Back
          </ButtonV2>

          <h1 className="font-semibold text-[1.25rem] ">{project?.title}</h1>
        </TopBar>

        <div className="flex items items-start w-full  justify-between ">
          <div className=" w-6/12  flex flex-col gap-4">
            <h1 className="font-semibold text-[1.125rem]  text-brand-black">
              Project Description
            </h1>

            <div className="p-4 bg-lavender rounded-[1.875rem] w-max">
              <p className="text-sm  font-[sora-light] text-brand-black max-w-[35rem]">
                {project?.description}
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <h1 className="font-semibold text-brand-black text-[1.125rem]">
                Team Members
              </h1>

              {project?.collaborators?.map((c, index) => (
                <div
                  className="relative py-2 flex items-center gap-2 w-[25rem]  "
                  key={index}
                >
                  <div className="relative h-[1.5rem] w-[1.5rem]">
                    <Image
                      src={"/images/dummy-avatar.svg"}
                      alt="avatar"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <p className="text-brand-black">
                    {c?.firstName} {c?.lastName}
                  </p>
                  <p className="text-[#808080] text-sm">( {c?.role} )</p>

                  <Button
                    // onClick={() => onDelete(project.id)}
                    // onClick={() => deleteIdea(project?.id as string)}
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Image
                      src="/images/trash-icon.svg"
                      alt="trash"
                      width={16}
                      height={16}
                    />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className=" w-5/12 "></div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsPage;
