import { ArrowRight, Plus, X } from "lucide-react";
import React, { KeyboardEvent, useState } from "react";
import { SignUpFormData } from "@/types";
import { LAST_STEP_INDEX, ROLE_SUGGESTIONS } from "@/types/data";
import ButtonV2 from "@/components/ui-components/button";

const RoleStep = ({
  formData,
  setFormData,
  currentStep,
  handlePrimaryAction,
}: {
  formData: SignUpFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>>;
  currentStep: number;
  handlePrimaryAction: () => void;
}) => {
  const [roleInput, setRoleInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isLastStep = currentStep === LAST_STEP_INDEX;

  const handleRoleAdd = (role?: string) => {
    const formattedRole = (role ?? roleInput).trim();
    if (!formattedRole) return;

    setFormData((prev) => ({
      ...prev,
      roles: Array.from(new Set([...prev.roles, formattedRole])),
    }));
    setRoleInput("");
    setError(null);
  };

  const handleRoleRemove = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.filter((item) => item !== role),
    }));
  };

  const handleRoleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleRoleAdd();
    }
  };

  const handleNext = () => {
    if (formData.roles.length === 0) {
      setError("Please select at least one role");
      return;
    }
    setError(null);
    handlePrimaryAction();
  };

  return (
    <>
      <div className="space-y-4  mx-auto  flex flex-col w-max items-center ">
        <div className="space-y-2 w-[18.75rem] mx-auto ">
          <h1 className="font-semibold text-[1.125rem] text-center ">
            What is your role?
          </h1>
          <h1 className="font-[sora-light] text-[0.875rem] text-center text-[#808080] ">
            You can add multiple roles
          </h1>

          <div className="flex items-center gap-2 rounded-[1.875rem] border border-[#E9E9E9] px-4 py-3">
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Select roles"
              value={roleInput}
              onChange={(event) => setRoleInput(event.target.value)}
              onKeyDown={handleRoleKeyDown}
            />
            <button
              type="button"
              onClick={() => handleRoleAdd()}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
            >
              <Plus size={16} />
              Add
            </button>
          </div>

          {error && (
            <p className="text-[#D32F2F] text-sm text-center">{error}</p>
          )}
        </div>

        {!!formData.roles.length && (
          <div className="flex flex-wrap gap-2 cursor-pointer justify-center w-[25rem]">
            {formData.roles.map((role) => (
              <span
                key={role}
                className="inline-flex items-center gap-1 rounded-full min-h-[2.125rem]  bg-purple-light px-3 py-1 text-sm text-brand-black"
              >
                {role}
                <button
                  type="button"
                  onClick={() => handleRoleRemove(role)}
                  className="text-primary/70"
                >
                  <X size={14} className="text-[#211E1E]" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-grey justify-center">
          {ROLE_SUGGESTIONS?.filter(
            (suggestion) => !formData.roles.includes(suggestion),
          ).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleRoleAdd(suggestion)}
              className="rounded-full border border-[#E9E9E9] px-3 py-1 text-sm transition hover:border-primary hover:text-primary"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <ButtonV2
          IconPlacement="right"
          Icon={<ArrowRight size={24} color="white" />}
          onClick={handleNext}
          className={`mx-auto w-75`}
        >
          {isLastStep ? "Submit" : "Next"}
        </ButtonV2>
      </div>
    </>
  );
};

export default RoleStep;
