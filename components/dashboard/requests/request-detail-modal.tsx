"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui-components/modal";
import ButtonV2 from "@/components/ui-components/button";
import type { CollaborationRequest } from "@/api/collaboration/collaboration.model";
import {
  getRequestProject,
  getRequestStatusLabel,
  getRequestStatusTagClass,
} from "@/lib/collaboration-request-status";
import {
  getProjectStatusLabel,
  getProjectStatusTagClass,
} from "@/lib/project-status";
import { formatTimeAgo } from "@/utils";

type RequestDetailModalProps = {
  open: boolean;
  request: CollaborationRequest | null;
  onOpenChange: (open: boolean) => void;
};

const RequestDetailModal = ({
  open,
  request,
  onOpenChange,
}: RequestDetailModalProps) => {
  const router = useRouter();
  const project = request ? getRequestProject(request) : null;

  const openProject = () => {
    if (!project?._id) return;
    onOpenChange(false);
    router.push(`/dashboard/projects/ongoing/${project._id}`);
  };

  const canOpenProject = Boolean(project?._id);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      className="sm:max-w-[627px]"
      childrenClassName="px-4 py-2 sm:px-6"
    >
      {!request || !project ? (
        <p className="py-6 text-center text-sm text-brand-grey">
          Request not found.
        </p>
      ) : (
        <div className="flex w-full min-w-0 flex-col gap-5 pb-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getRequestStatusTagClass(request.status)}`}
              >
                {getRequestStatusLabel(request.status)}
              </span>
              {project.status ? (
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getProjectStatusTagClass(project.status)}`}
                >
                  {getProjectStatusLabel(project.status)}
                </span>
              ) : null}
            </div>
            <h3 className="text-xl font-semibold break-words text-brand-black dark:text-white">
              {project.title}
            </h3>
            <p className="text-xs text-brand-grey">
              Sent {formatTimeAgo(request.createdAt)}
            </p>
          </div>

          {project.description ? (
            <p className="text-sm font-[sora-light] text-brand-grey dark:text-[#B0B0B0]">
              {project.description}
            </p>
          ) : null}

          <div className="w-full min-w-0 overflow-hidden rounded-[1.875rem] border border-[#E9E9E9] p-4 sm:p-6 dark:border-[#80808026]">
            <p className="mb-2 text-xs text-brand-grey dark:text-[#808080]">
              Your proposal
            </p>
            <p className="whitespace-pre-wrap break-words text-sm font-[sora-light] text-brand-black dark:text-white">
              {request.proposal || "No proposal text."}
            </p>
          </div>

          {request.media?.length > 0 && (
            <div className="grid w-full min-w-0 grid-cols-2 gap-2">
              {request.media.map((item) => (
                <div
                  key={item._id || item.id}
                  className="relative h-28 overflow-hidden rounded-2xl"
                >
                  <Image
                    src={item.url}
                    alt="Proposal attachment"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {canOpenProject ? (
            <ButtonV2
              type="button"
              className="min-h-max w-full"
              onClick={openProject}
            >
              <span className="text-[0.875rem]">Open project</span>
            </ButtonV2>
          ) : null}
        </div>
      )}
    </Modal>
  );
};

export default RequestDetailModal;
