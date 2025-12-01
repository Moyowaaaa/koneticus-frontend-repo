"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import EmailStep from "./steps/email";
import NewPasswordStep from "./steps/new-password";
import ConfirmedStep from "./steps/confirmed";
import StepCounter from "@/components/ui-components/step-counter";

const STEP_TITLES = ["Email", "Security", "Done"] as const;
const LAST_STEP_INDEX = STEP_TITLES.length - 1;

const simulateRequest = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 800));

const ForgotPasswordFlow = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headingCopy = useMemo(() => {
    switch (currentStep) {
      case 0:
        return {
          title: "Reset your password",
          description: "Enter the email tied to your KoLabs account.",
        };
      case 1:
        return {
          title: "Create a new password",
          description: "Make sure it's strong and unique.",
        };
      default:
        return {
          title: "Password reset complete",
          description: "You can now sign in with your new password.",
        };
    }
  }, [currentStep]);

  const handleStepSelection = (nextStep: number) => {
    if (nextStep > currentStep) return;
    setCurrentStep(nextStep);
    setError(null);
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setError("Enter the email linked to your account to continue.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await simulateRequest();
      setCurrentStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (newPassword.trim().length < 8) {
      setError("Passwords must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Your passwords don’t match. Double-check and try again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await simulateRequest();
      setCurrentStep(LAST_STEP_INDEX);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePasswordField = (
    field: "newPassword" | "confirmPassword",
    value: string
  ) => {
    if (field === "newPassword") {
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
    }

    if (error) setError(null);
  };

  const handleNavigateToLogin = () => router.push("/auth/log-in");

  return (
    <section className="flex w-9/12 mx-auto  flex-col items-center gap-10 ">
      <div className="flex w-full  flex-col gap-6 text-center">
        <div className="space-y-2">
          <h1 className="text-[1.875rem] font-bold">Reset Your Password</h1>
        </div>

        {currentStep === 0 && (
          <EmailStep
            email={email}
            onEmailChange={(value) => {
              setEmail(value);
              if (error) setError(null);
            }}
            onSubmit={handleEmailSubmit}
            isLoading={isSubmitting}
            error={error}
          />
        )}

        {currentStep === 2 && (
          <NewPasswordStep
            email={email}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onPasswordChange={updatePasswordField}
            onSubmit={handlePasswordSubmit}
            onBack={() => handleStepSelection(0)}
            isLoading={isSubmitting}
            error={error}
          />
        )}

        {currentStep === 1 && (
          <ConfirmedStep
            email={email}
            onNavigateToLogin={handleNavigateToLogin}
          />
        )}
      </div>
    </section>
  );
};

export default ForgotPasswordFlow;
