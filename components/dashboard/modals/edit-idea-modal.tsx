"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useUpdateProject,
  useUpdateProjectStatus,
} from "@/api/projects/project.mutations";
import { useGetProjectById } from "@/api/projects/projects.queries";
import { useEditIdeaModalStore } from "@/store/useEditIdeaModalStore";
import {
  isDraftStatus,
  normalizeProjectStatus,
} from "@/lib/project-status";
import { showToast } from "@/utils/toasts";
import React from "react";

const EditIdeaModal = () => {
  const { isOpen, ideaId, closeModal } = useEditIdeaModalStore();
  const { mutateAsync: updateProject } = useUpdateProject();
  const { mutateAsync: updateProjectStatus } = useUpdateProjectStatus();
  const {
    data: project,
    isLoading,
    isError,
  } = useGetProjectById(ideaId ?? "", { enabled: isOpen && !!ideaId });

  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  /** Draft: publish as seeking. Published: mark ongoing. */
  const [toggleOn, setToggleOn] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const projectIsDraft = project ? isDraftStatus(project.status) : true;
  const projectIsOngoing =
    !!project && normalizeProjectStatus(project.status) === "ongoing";
  /** Ongoing projects lock status — toggle only for draft / seeking. */
  const canChangeVisibility = !projectIsOngoing;

  React.useEffect(() => {
    if (isOpen && project) {
      setTitle(project.title);
      setDescription(project.description);
      const normalized = normalizeProjectStatus(project.status);
      if (normalized === "draft") {
        setToggleOn(false);
      } else {
        setToggleOn(normalized === "ongoing");
      }
      titleInputRef.current?.focus();
    } else if (!isOpen) {
      setTitle("");
      setDescription("");
      setToggleOn(false);
      setIsSaving(false);
    }
  }, [isOpen, project]);

  const handleClose = (open: boolean) => {
    if (!open || !isSaving) {
      closeModal();
    }
  };

  const resolveNextStatus = ():
    | "draft"
    | "seeking_collaborators"
    | "ongoing"
    | "completed"
    | null => {
    if (!project) return null;
    const current = normalizeProjectStatus(project.status);

    // Ongoing stays ongoing — visibility cannot be changed from the edit modal
    if (current === "ongoing") {
      return "ongoing";
    }

    if (current === "draft") {
      return toggleOn ? "seeking_collaborators" : "draft";
    }

    if (current === "completed") {
      return toggleOn ? "ongoing" : "completed";
    }

    return toggleOn ? "ongoing" : "seeking_collaborators";
  };

  const handleSave = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!ideaId || !title.trim() || !description.trim() || !project) return;

    const nextStatus = resolveNextStatus();
    if (!nextStatus) return;

    const current = normalizeProjectStatus(project.status);
    const shouldUpdateStatus = nextStatus !== current;

    setIsSaving(true);
    try {
      const titleOrDescriptionChanged =
        title.trim() !== project.title ||
        description.trim() !== project.description;

      if (titleOrDescriptionChanged) {
        await updateProject({
          id: ideaId,
          data: {
            title: title.trim(),
            description: description.trim(),
          },
        });
      }

      if (shouldUpdateStatus && nextStatus !== "draft" && canChangeVisibility) {
        await updateProjectStatus({
          id: ideaId,
          data: { status: nextStatus },
        });
      }

      showToast.success(
        shouldUpdateStatus && canChangeVisibility
          ? nextStatus === "seeking_collaborators"
            ? "Idea is now seeking collaborators"
            : nextStatus === "ongoing"
              ? "Idea marked as ongoing"
              : "Idea updated successfully"
          : "Idea updated successfully",
      );
      closeModal();
    } catch {
      showToast.error("Failed to update idea");
    } finally {
      setIsSaving(false);
    }
  };

  const nextStatus = resolveNextStatus();
  const current = project ? normalizeProjectStatus(project.status) : null;
  const statusChanged = Boolean(
    canChangeVisibility && nextStatus && current && nextStatus !== current,
  );
  const contentUnchanged =
    title === project?.title && description === project?.description;

  const isDisabled =
    isSaving ||
    !title.trim() ||
    !description.trim() ||
    (contentUnchanged && !statusChanged);

  const toggleTitle = projectIsDraft
    ? toggleOn
      ? "Seeking collaborators"
      : "Draft"
    : toggleOn
      ? "Ongoing"
      : "Seeking collaborators";

  const toggleHint = projectIsDraft
    ? toggleOn
      ? "Publish so people can show interest"
      : "Keep as draft — not open for interest yet"
    : toggleOn
      ? "Project is actively in progress"
      : "Open for people to show interest";

  return (
    <>
      <Modal
        open={isOpen}
        onOpenChange={handleClose}
        title="Edit idea"
        className="flex flex-col gap-4"
        titleClassname="pt-4"
      >
        {isLoading ? (
          <div className="text-sm text-brand-grey py-6 text-center">
            Loading idea...
          </div>
        ) : project ? (
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <label className="flex flex-col gap-1">
              <span className="sr-only">Idea title</span>
              <Input
                ref={titleInputRef}
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSaving}
                className="h-12 outline-none text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9]
                dark:border-b-[#80808026]
                dark:text-white
                "
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="sr-only">Idea description</span>
              <Textarea
                placeholder="Write description here...."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSaving}
                className="resize-none h-40 outline-none border-none
                dark:text-[#808080]
                dark:border-b-[#80808026]

                ring-0 shadow-none text-[1.125rem] pb-4 border-b border-b-[#E9E9E9E9]"
              />
            </label>

            {canChangeVisibility ? (
              <div className="flex items-center justify-between gap-4 py-1">
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm text-brand-black dark:text-white">
                    {toggleTitle}
                  </p>
                  <p className="text-xs text-brand-grey dark:text-[#808080]">
                    {toggleHint}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={toggleOn}
                  aria-label={toggleTitle}
                  disabled={isSaving}
                  onClick={() => setToggleOn((prev) => !prev)}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50 ${
                    toggleOn
                      ? "bg-primary dark:bg-[#6155F5]"
                      : "bg-[#E8E8E8] dark:bg-[#333]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200 ${
                      toggleOn ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-0.5 py-1">
                <p className="text-sm text-brand-black dark:text-white">
                  Ongoing
                </p>
                <p className="text-xs text-brand-grey dark:text-[#808080]">
                  Status is locked while the project is ongoing
                </p>
              </div>
            )}

            <div className="w-full items-center flex justify-start">
              <ButtonV2
                className="min-h-max"
                type="submit"
                disabled={isDisabled}
              >
                <p className="text-[0.875rem] px-2">
                  {isSaving ? "Saving..." : "Save"}
                </p>
              </ButtonV2>
            </div>
          </form>
        ) : (
          <div className="text-sm text-brand-grey py-6 text-center">
            {isError
              ? "Something went wrong while loading this idea."
              : "We couldn't find this idea anymore."}
          </div>
        )}
      </Modal>
    </>
  );
};

export default EditIdeaModal;
