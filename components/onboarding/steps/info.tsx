import ButtonV2 from "@/components/ui-components/button";
import CustomFormInput from "@/components/ui-components/custom-form-input";
import { ArrowRight } from "lucide-react";
import React from "react";
import { SignUpFormData } from "@/types";
import { TOTAL_STEPS } from "@/types/data";

const LAST_STEP_INDEX = TOTAL_STEPS - 1;

export const InformationStep = ({
  formData,
  setFormData,
  handlePrimaryAction,
  currentStep,
}: {
  formData: SignUpFormData;
  setFormData: React.Dispatch<React.SetStateAction<SignUpFormData>>;
  handlePrimaryAction: () => void;
  currentStep: number;
}) => {
  const isLastStep = currentStep === LAST_STEP_INDEX;

  const updateField = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <div className="space-y-4 w-[18.75rem] mx-auto">
        <div className="grid gap-4">
          <h1 className="font-semibold text-[1.125rem] text-center ">
            Fill in your information
          </h1>

          <CustomFormInput
            label="First name *"
            value={formData.firstName}
            onChange={(event) => updateField("firstName", event.target.value)}
          />
          <CustomFormInput
            label="Last name *"
            value={formData.lastName}
            onChange={(event) => updateField("lastName", event.target.value)}
          />
          <CustomFormInput
            label="Password *"
            type="password"
            showPasswordToggle
            value={formData.password}
            onChange={(event) => updateField("password", event.target.value)}
          />

          <ButtonV2
            IconPlacement="right"
            Icon={<ArrowRight size={24} color="white" />}
            onClick={handlePrimaryAction}
            className={`mx-auto w-75`}
          >
            {isLastStep ? "Submit" : "Next"}
          </ButtonV2>
        </div>
      </div>
    </>
  );
};
