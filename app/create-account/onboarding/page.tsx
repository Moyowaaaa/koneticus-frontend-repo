"use client";

import { useMemo, useState, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Plus, X } from "lucide-react";

import CustomFormInput from "@/components/ui-components/custom-form-input";
import ButtonV2 from "@/components/ui-components/button";
import StepCounter from "@/components/ui-components/step-counter";
import SignUpFlow from "@/components/auth/sign-up-flow";
import OnBoardingFlow from "@/components/onboarding";

const STEP_TITLES = ["Information", "Roles", "Profile"];
const TOTAL_STEPS = STEP_TITLES.length + 1; // include initial email capture step
const LAST_STEP_INDEX = TOTAL_STEPS - 1;

const clampStepValue = (value: number) =>
  Math.min(Math.max(Number.isNaN(value) ? 0 : value, 0), LAST_STEP_INDEX);

const SOCIAL_PROVIDERS = [
  { label: "Continue with Google", icon: "/images/google.svg" },
  { label: "Continue with Github", icon: "/images/github.svg" },
  { label: "Continue with Microsoft", icon: "/images/microsoft.svg" },
];

const ROLE_SUGGESTIONS = [
  "UI/UX Designer",
  "Writer",
  "Print Designer",
  "3D Artist",
  "Illustrator",
];

const PORTFOLIO_FIELDS = [
  { key: "website", label: "Website" },
  { key: "behance", label: "Behance" },
  { key: "dribbble", label: "Dribbble" },
] as const;

type PortfolioLinks = Record<(typeof PORTFOLIO_FIELDS)[number]["key"], string>;

type SignUpFormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: string[];
  bio: string;
  portfolio: PortfolioLinks;
};

const INITIAL_STATE: SignUpFormData = {
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  roles: [],
  bio: "",
  portfolio: {
    website: "",
    behance: "",
    dribbble: "",
  },
};

const OnboardingPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(() => {
    const stepParam = searchParams.get("step");
    return clampStepValue(stepParam ? Number(stepParam) : 0);
  });
  const [formData, setFormData] = useState<SignUpFormData>(INITIAL_STATE);
  const [roleInput, setRoleInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setStepWithUrl = (nextStep: number) => {
    const clamped = clampStepValue(nextStep);
    setCurrentStep(clamped);

    const params = new URLSearchParams(searchParams.toString());
    if (clamped === 0) {
      params.delete("step");
    } else {
      params.set("step", clamped.toString());
    }

    const queryString = params.toString();
    const target = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(target, { scroll: false });
  };

  const isLastStep = currentStep === LAST_STEP_INDEX;

  const updateField = (field: keyof SignUpFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePortfolio = (key: keyof PortfolioLinks, value: string) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [key]: value,
      },
    }));
  };

  const handleRoleAdd = (role?: string) => {
    const formattedRole = (role ?? roleInput).trim();
    if (!formattedRole) return;

    setFormData((prev) => ({
      ...prev,
      roles: Array.from(new Set([...prev.roles, formattedRole])),
    }));
    setRoleInput("");
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

  const handleStepSelection = (index: number) => {
    // StepCounter indexes start at 0, but our flow includes the email step at index 0.
    setStepWithUrl(index + 1);
  };

  const stepHeading = useMemo(() => {
    switch (currentStep) {
      case 0:
        return {
          headline: "Create account",
          description: "Access the platform with your work email.",
        };
      case 1:
        return {
          headline: "Fill in your information",
          description: "Well personalize the workspace for you.",
        };
      case 2:
        return {
          headline: "What is your role?",
          description: "Add multiple roles so teams know your strengths.",
        };
      default:
        return {
          headline: "Tell us about yourself",
          description:
            "Share a quick bio and portfolio links (min. 150 characters).",
        };
    }
  }, [currentStep]);

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col">
      <div className="w-full max-w-full mx-auto absolute top-2 flex items-center justify-center text-[#211E1E] font-semibold text-[0.875rem] font-sora">
        Logo
      </div>

      {/* <SignUpFlow /> */}

      <OnBoardingFlow />

      <div className="w-full max-w-full mx-auto absolute bottom-2 flex items-center justify-center text-[#211E1E] font-semibold text-[0.875rem] font-sora">
        &copy; KoLabs {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default OnboardingPage;
