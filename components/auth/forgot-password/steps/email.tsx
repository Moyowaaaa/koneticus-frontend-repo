import React from "react";
import { ArrowRight } from "lucide-react";

import ButtonV2 from "@/components/ui-components/button";
import CustomFormInput from "@/components/ui-components/custom-form-input";

type EmailStepProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string | null;
};

const EmailStep = ({
  email,
  onEmailChange,
  onSubmit,
  isLoading,
  error,
}: EmailStepProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    onSubmit();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="space-y-2 text-left">
        <CustomFormInput
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
        />
        {/* {error && <p className="text-sm text-destructive">{error}</p>} */}
      </div>

      <ButtonV2
        type="submit"
        className="w-full"
        IconPlacement="right"
        Icon={<ArrowRight size={20} color="white" />}
        disabled={isLoading}
      >
        Continue
      </ButtonV2>
    </form>
  );
};

export default EmailStep;
