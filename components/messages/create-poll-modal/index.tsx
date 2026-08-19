"use client";

import { useState } from "react";
import { Add, Trash } from "iconsax-reactjs";
import Modal from "@/components/ui-components/modal";
import ButtonV2 from "@/components/ui-components/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type CreatePollPayload = {
  question: string;
  options: string[];
  allowMultiple: boolean;
  isAnonymous: boolean;
};

type CreatePollModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (poll: CreatePollPayload) => void;
  isSubmitting?: boolean;
};

const MIN_OPTIONS = 2;
const MAX_OPTIONS = 4;

const CreatePollModal = (props: CreatePollModalProps) => (
  <CreatePollModalContent key={props.open ? "open" : "closed"} {...props} />
);

const CreatePollModalContent = ({
  open,
  onOpenChange,
  onCreate,
  isSubmitting = false,
}: CreatePollModalProps) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const resetForm = () => {
    setQuestion("");
    setOptions(["", ""]);
    setAllowMultiple(false);
    setIsAnonymous(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm();
    onOpenChange(nextOpen);
  };

  const trimmedOptions = options.map((option) => option.trim()).filter(Boolean);
  const canSubmit =
    question.trim().length > 0 &&
    trimmedOptions.length >= MIN_OPTIONS &&
    !isSubmitting;

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((option, i) => (i === index ? value : option)));
  };

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    setOptions((prev) => [...prev, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= MIN_OPTIONS) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!canSubmit) return;

    onCreate({
      question: question.trim(),
      options: trimmedOptions,
      allowMultiple,
      isAnonymous,
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Create poll"
      className="sm:max-w-[32rem]"
    >
      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-brand-black dark:text-white">
            Question
          </span>
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            disabled={isSubmitting}
            className="h-11 rounded-xl border-[#E9E9E9] bg-white dark:border-[#80808026] dark:bg-[#151515]"
          />
        </label>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-brand-black dark:text-white">
              Options
            </span>
            <span className="text-xs text-brand-grey">
              {options.length}/{MAX_OPTIONS}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  disabled={isSubmitting}
                  className="h-11 rounded-xl border-[#E9E9E9] bg-white dark:border-[#80808026] dark:bg-[#151515]"
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  disabled={options.length <= MIN_OPTIONS || isSubmitting}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E6E4FF] text-[#6155F5] transition-colors hover:bg-[#E0DDFF] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Remove option ${index + 1}`}
                >
                  <Trash size={16} variant="Bold" />
                </button>
              </div>
            ))}
          </div>

          {options.length < MAX_OPTIONS && (
            <button
              type="button"
              onClick={addOption}
              disabled={isSubmitting}
              className="mt-1 flex w-max items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-[#6155F5] transition-colors hover:bg-lavender disabled:opacity-50"
            >
              <Add size={16} />
              Add option
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-[#E9E9E9] p-3 dark:border-[#80808026]">
          <ToggleRow
            label="Allow multiple answers"
            description="People can select more than one option"
            checked={allowMultiple}
            onChange={setAllowMultiple}
            disabled={isSubmitting}
          />
          <div className="h-px w-full bg-[#E9E9E9] dark:bg-[#80808026]" />
          <ToggleRow
            label="Anonymous voting"
            description="Hide who voted for each option"
            checked={isAnonymous}
            onChange={setIsAnonymous}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#E9E9E9] pt-4 dark:border-[#80808026]">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
            className="h-10 rounded-full border border-[#E9E9E9] px-4 text-sm text-brand-black transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-[#80808026] dark:text-white dark:hover:bg-[#2a2727]"
          >
            Cancel
          </button>
          <ButtonV2
            type="button"
            onClick={handleCreate}
            disabled={!canSubmit}
            className="h-10 min-h-10 px-6"
          >
            <p className="text-sm">
              {isSubmitting ? "Creating..." : "Create poll"}
            </p>
          </ButtonV2>
        </div>
      </div>
    </Modal>
  );
};

const ToggleRow = ({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) => (
  <div className="flex items-center justify-between gap-4">
    <div className="min-w-0">
      <p className="text-sm font-medium text-brand-black dark:text-white">
        {label}
      </p>
      <p className="text-xs text-brand-grey">{description}</p>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-[#6155F5]" : "bg-[#E9E9E9] dark:bg-[#80808026]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  </div>
);

export default CreatePollModal;
