"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

import CustomFormInput from "@/components/ui-components/custom-form-input";
import ButtonV2 from "@/components/ui-components/button";

type NewPasswordStepProps = {
  email: string;
  newPassword: string;
  confirmPassword: string;
  onPasswordChange: (
    field: "newPassword" | "confirmPassword",
    value: string
  ) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
};

const NewPasswordStep = ({
  newPassword,
  confirmPassword,
  onPasswordChange,
  onSubmit,
  isLoading,
  error,
}: NewPasswordStepProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    onSubmit();
  };

  return (
    <form className="flex flex-col gap-6 text-left" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <CustomFormInput
          label="Enter New Password"
          type="password"
          showPasswordToggle
          value={newPassword}
          onChange={(event) =>
            onPasswordChange("newPassword", event.target.value)
          }
          required
        />

        <CustomFormInput
          label="Confirm New Password"
          type="password"
          showPasswordToggle
          value={confirmPassword}
          onChange={(event) =>
            onPasswordChange("confirmPassword", event.target.value)
          }
          required
        />

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="flex flex-col gap-3">
        <ButtonV2
          type="submit"
          className="w-full"
          IconPlacement="right"
          Icon={<ArrowRight size={20} color="white" />}
          disabled={isLoading}
        >
          Continue
        </ButtonV2>
      </div>
    </form>
  );
};

export default NewPasswordStep;
