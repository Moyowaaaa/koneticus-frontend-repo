"use client";

import ButtonV2 from "@/components/ui-components/button";
import Modal from "@/components/ui-components/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEditIdeaModalStore } from "@/store/useEditIdeaModalStore";
import { useIdeaStore } from "@/store/useIdeaStore";
import React from "react";

const EditIdeaModal = () => {
  const { isOpen, ideaId, closeModal } = useEditIdeaModalStore();
  const ideas = useIdeaStore((state) => state.ideas);
  const updateIdea = useIdeaStore((state) => state.updateIdea);

  const currentIdea = React.useMemo(
    () => ideas.find((idea) => idea.id === ideaId),
    [ideas, ideaId]
  );

  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && currentIdea) {
      setTitle(currentIdea.title);
      setDescription(currentIdea.description);
      titleInputRef.current?.focus();
    } else if (!isOpen) {
      setTitle("");
      setDescription("");
      setIsSaving(false);
    }
  }, [isOpen, currentIdea]);

  const handleClose = (open: boolean) => {
    if (!open || !isSaving) {
      closeModal();
    }
  };

  const handleSave = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!ideaId || !title.trim() || !description.trim() || !currentIdea) return;
    setIsSaving(true);
    updateIdea(ideaId, {
      title: title.trim(),
      description: description.trim(),
    });
    setIsSaving(false);
    closeModal();
  };

  const isDisabled =
    isSaving ||
    !title.trim() ||
    !description.trim() ||
    (title === currentIdea?.title && description === currentIdea?.description);

  return (
    <>
      <Modal
        open={isOpen}
        onOpenChange={handleClose}
        title="Edit idea"
        className="flex flex-col gap-4"
        titleClassname="pt-4"
      >
        {currentIdea ? (
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
            We couldn&apos;t find this idea anymore.
          </div>
        )}
      </Modal>
    </>
  );
};

export default EditIdeaModal;
