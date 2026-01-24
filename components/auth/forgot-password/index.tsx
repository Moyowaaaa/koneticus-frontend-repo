"use client";

import { useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import EmailStep from "./steps/email";
import NewPasswordStep from "./steps/new-password";
import ConfirmedStep from "./steps/confirmed";
import { useResetPassword } from "@/api/auth/auth.mutations";
import { showToast } from "@/utils/toasts";

// String-based step values
type StepName = "email" | "newPassword" | "confirmed";

const VALID_STEPS: StepName[] = ["email", "newPassword", "confirmed"];

const simulateRequest = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 800));

// Helper to validate step value
const getValidStep = (step: string | null, defaultStep: StepName): StepName => {
  if (step && VALID_STEPS.includes(step as StepName)) {
    return step as StepName;
  }
  return defaultStep;
};

interface ForgotPasswordFlowContentProps {
  token?: string;
}

function ForgotPasswordFlowContent({ token }: ForgotPasswordFlowContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  // Initialize step from URL or default based on whether token exists
  const [currentStep, setCurrentStep] = useState<StepName>(() => {
    const stepParam = searchParams.get("step");
    // If token exists, default to newPassword step; otherwise default to email
    const defaultStep: StepName = token ? "newPassword" : "email";
    return getValidStep(stepParam, defaultStep);
  });

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update both state and URL when step changes
  const setStepWithUrl = (nextStep: StepName) => {
    setCurrentStep(nextStep);

    const params = new URLSearchParams(searchParams.toString());
    if (nextStep === "email") {
      params.delete("step");
    } else {
      params.set("step", nextStep);
    }

    const queryString = params.toString();
    const target = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(target, { scroll: false });
  };

  const headingCopy = useMemo(() => {
    switch (currentStep) {
      case "email":
        return {
          title: "Reset your password",
          description: "Enter the email tied to your KoLabs account.",
        };
      case "newPassword":
        return {
          title: "Create a new password",
          description: "Make sure it's strong and unique.",
        };
      case "confirmed":
        return {
          title: "Password reset complete",
          description: "You can now sign in with your new password.",
        };
    }
  }, [currentStep]);

  const handleStepSelection = (nextStep: StepName) => {
    // Only allow going back, not forward
    const currentIndex = VALID_STEPS.indexOf(currentStep);
    const nextIndex = VALID_STEPS.indexOf(nextStep);
    if (nextIndex > currentIndex) return;

    setStepWithUrl(nextStep);
    setError(null);
  };

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      setError("Enter the email linked to your account to continue.");
      return;
    }

    localStorage.setItem("email", email);

    setIsSubmitting(true);
    setError(null);

    try {
      await simulateRequest();
      setStepWithUrl("confirmed");
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
      setError("Your passwords don't match. Double-check and try again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await simulateRequest();
      // TODO: Call API with token and new password
      console.log("Reset password with token:", token);
      await resetPassword({
        token: token!,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });
      showToast.success(
        "Password reset successfully, please login with your new password",
      );
      router.push("/auth/log-in");
    } catch (error) {
      console.error("Failed to reset password:", error);
      setError("Failed to reset password. Please try again.");
      showToast.error("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePasswordField = (
    field: "newPassword" | "confirmPassword",
    value: string,
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
      <div className="flex w-full  flex-col gap-6 text-center pt-16">
        <div className="space-y-2">
          <h1 className="text-[1.875rem] font-bold">Reset Your Password</h1>
        </div>

        {currentStep === "email" && (
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

        {currentStep === "newPassword" && (
          <NewPasswordStep
            email={email}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            onPasswordChange={updatePasswordField}
            onSubmit={handlePasswordSubmit}
            onBack={() => handleStepSelection("email")}
            isLoading={isSubmitting}
            error={error}
          />
        )}

        {currentStep === "confirmed" && (
          <ConfirmedStep
            email={email}
            onNavigateToLogin={handleNavigateToLogin}
          />
        )}
      </div>
    </section>
  );
}

function ForgotPasswordFlowFallback() {
  return (
    <section className="flex w-9/12 mx-auto flex-col items-center gap-10">
      <div className="flex w-full flex-col gap-6 text-center pt-16">
        <div className="space-y-2">
          <h1 className="text-[1.875rem] font-bold">Reset Your Password</h1>
        </div>
        <div className="animate-pulse bg-muted h-32 rounded-lg" />
      </div>
    </section>
  );
}

interface ForgotPasswordFlowProps {
  token?: string;
}

const ForgotPasswordFlow = ({ token }: ForgotPasswordFlowProps) => {
  return (
    <Suspense fallback={<ForgotPasswordFlowFallback />}>
      <ForgotPasswordFlowContent token={token} />
    </Suspense>
  );
};

export default ForgotPasswordFlow;
