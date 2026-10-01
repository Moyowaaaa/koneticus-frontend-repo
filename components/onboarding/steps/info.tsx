import ButtonV2 from "@/components/ui-components/button";
import CustomFormInput from "@/components/ui-components/custom-form-input";
import { ArrowRight } from "lucide-react";
import React from "react";
import { SignUpFormData } from "@/types";
import { TOTAL_STEPS } from "@/types/data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  informationStepSchema,
  informationStepSchemaType,
} from "@/schemas/auth";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<informationStepSchemaType>({
    resolver: zodResolver(informationStepSchema),
    defaultValues: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
    },
  });

  const onSubmit = (data: informationStepSchemaType) => {
    setFormData((prev) => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
    }));
    handlePrimaryAction();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-10/12 min-w-0 space-y-4 lg:w-[18.75rem]"
      >
        <div className="grid min-w-0 gap-4">
          <h1 className="font-semibold text-[1.125rem] text-center ">
            Fill in your information
          </h1>

          <div className="flex min-w-0 flex-col gap-1">
            <CustomFormInput
              label="First name *"
              {...register("firstName")}
              defaultValue={formData.firstName}
            />
            {errors.firstName && (
              <p className="text-[#D32F2F] text-sm">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <CustomFormInput
              label="Last name *"
              {...register("lastName")}
              defaultValue={formData.lastName}
            />
            {errors.lastName && (
              <p className="text-[#D32F2F] text-sm">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <CustomFormInput
              label="Password *"
              type="password"
              showPasswordToggle
              {...register("password")}
              defaultValue={formData.password}
            />
            {errors.password && (
              <p className="text-[#D32F2F] text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          <ButtonV2
            IconPlacement="right"
            Icon={<ArrowRight size={24} color="white" />}
            type="submit"
            className="mx-auto w-full max-w-full"
          >
            {isLastStep ? "Submit" : "Next"}
          </ButtonV2>
        </div>
      </form>
    </>
  );
};
