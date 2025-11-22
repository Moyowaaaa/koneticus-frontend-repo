"use client";

import { useMemo, useState, KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Plus, X } from "lucide-react";

import CustomFormInput from "@/components/ui-components/custom-form-input";
import ButtonV2 from "@/components/ui-components/button";
import StepCounter from "@/components/ui-components/step-counter";

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

const SignUpFlow = () => {
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

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.email) {
          setError("Please add your email to continue");
          return false;
        }
        break;
      case 1:
        if (!formData.firstName || !formData.lastName || !formData.password) {
          setError("Fill in every field before continuing");
          return false;
        }
        break;
      case 2:
        if (!formData.roles.length) {
          setError("Add at least one role to showcase your expertise");
          return false;
        }
        break;
      case 3:
        if (formData.bio.trim().length < 150) {
          setError("Tell us a bit more (min. 150 characters)");
          return false;
        }
        break;
      default:
        break;
    }
    setError(null);
    return true;
  };

  const handlePrimaryAction = () => {
    // if (!validateStep()) return;

    if (isLastStep) {
      console.log("Submit payload", formData);
      return;
    }

    setStepWithUrl(currentStep + 1);
  };

  const handleBack = () => {
    setError(null);
    setStepWithUrl(currentStep - 1);
  };

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
    <div className="relative flex w-full flex-col items-center justify-center gap-8 py-10  h-full">
      <div
        className={`  space-y-6 flex flex-col gap-2 ${
          currentStep > 0 ? "w-[25rem]" : "w-8/12"
        }`}
      >
        {currentStep > 0 && (
          <div className="flex justify-center">
            <StepCounter
              steps={STEP_TITLES}
              stepCount={currentStep - 1}
              setStep={handleStepSelection}
            />
          </div>
        )}

        {currentStep === 0 && (
          <div className="w-full  flex flex-col gap-4">
            <h1 className="text-[1.875rem] text-center  font-bold">
              Create account
            </h1>

            <CustomFormInput
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              label="Email address"
            />

            <ButtonV2
              IconPlacement="right"
              onClick={handlePrimaryAction}
              Icon={<ArrowRight size="32" color="white" />}
            >
              Continue
            </ButtonV2>

            <div className="flex items-center gap-6 w-full">
              <div className="w-full border border-[#E9E9E9]"></div>
              <p>Or</p>
              <div className="w-full border border-[#E9E9E9]"></div>
            </div>

            <div className="flex flex-col gap-2">
              <ButtonV2
                Icon={
                  <Image
                    src="/images/google.svg"
                    width={24}
                    height={24}
                    alt="google"
                  />
                }
                variant="outline"
              >
                Continue with Google
              </ButtonV2>
              <ButtonV2
                Icon={
                  <Image
                    src="/images/github.svg"
                    width={24}
                    height={24}
                    alt="github"
                  />
                }
                variant="outline"
              >
                Continue with Github
              </ButtonV2>
              <ButtonV2
                Icon={
                  <Image
                    src="/images/microsoft.svg"
                    width={24}
                    height={24}
                    alt="microsoft"
                  />
                }
                variant="outline"
              >
                Continue with Microsoft
              </ButtonV2>
            </div>

            <p className="text-center">
              Already have an account?{" "}
              <Link href="/auth/log-in" className="text-primary">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* <div className="space-y-2 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-grey">
            Step {currentStep + 1}
          </p>
          <h1 className="text-[1.875rem] font-bold text-brand-black">
            {stepHeading.headline}
          </h1>
          <p className="text-sm text-grey">{stepHeading.description}</p>
        </div>

        {currentStep === 0 && (
          <>
            <CustomFormInput
              label="Email address"
              placeholder="you@visionforge.studio"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
            />

            <ButtonV2
              IconPlacement="right"
              Icon={<ArrowRight size={24} color="white" />}
              onClick={handlePrimaryAction}
            >
              Continue
            </ButtonV2>

            <div className="flex items-center gap-6 text-sm text-grey">
              <div className="h-px flex-1 bg-[#E9E9E9]" />
              Or
              <div className="h-px flex-1 bg-[#E9E9E9]" />
            </div>

            <div className="flex flex-col gap-2">
              {SOCIAL_PROVIDERS.map((provider) => (
                <ButtonV2
                  key={provider.label}
                  variant="outline"
                  Icon={
                    <Image
                      src={provider.icon}
                      width={24}
                      height={24}
                      alt={provider.label}
                    />
                  }
                >
                  {provider.label}
                </ButtonV2>
              ))}
            </div>

            <p className="text-center text-sm text-grey">
              Already have an account?{" "}
              <Link href="/auth/log-in" className="text-primary">
                Sign in
              </Link>
            </p>
          </>
        )} */}

        {currentStep > 0 && (
          <h1 className="font-semibold text-[1.125rem] text-center ">
            {stepHeading.headline}
          </h1>
        )}

        {currentStep === 1 && (
          <div className="space-y-4 w-[18.75rem] mx-auto">
            <div className="grid gap-4">
              <CustomFormInput
                label="First name"
                placeholder="Ava"
                value={formData.firstName}
                onChange={(event) =>
                  updateField("firstName", event.target.value)
                }
              />
              <CustomFormInput
                label="Last name"
                placeholder="Collins"
                value={formData.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
              />
              <CustomFormInput
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                showPasswordToggle
                value={formData.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2 w-[18.75rem] mx-auto">
              <h1 className="font-[sora-light] text-[0.875rem] text-center text-[#808080] ">
                You can add multiple roles
              </h1>

              <div className="flex items-center gap-2 rounded-[1.875rem] border border-[#E9E9E9] px-4 py-3">
                <input
                  className="flex-1 bg-transparent text-sm outline-none"
                  placeholder="Add a role and press enter"
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
            </div>

            {!!formData.roles.length && (
              <div className="flex flex-wrap gap-2 cursor-pointer justify-center">
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

            <div className="flex flex-wrap gap-2 text-xs text-grey">
              {ROLE_SUGGESTIONS?.filter(
                (suggestion) => !formData.roles.includes(suggestion)
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
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-primary text-sm text-primary">
                Add photo
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-primary"
              >
                Upload profile picture
              </button>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-brand-black"
                htmlFor="bio"
              >
                Tell us about yourself
              </label>
              <textarea
                id="bio"
                className="min-h-32 w-full rounded-[1.875rem] border border-[#E9E9E9] bg-white px-5 py-4 text-sm text-brand-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Share your experience, background, and the type of collaborations youre looking for."
                value={formData.bio}
                onChange={(event) => updateField("bio", event.target.value)}
              />
              <p className="text-right text-xs text-grey">
                {formData.bio.length}/150
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-brand-black">
                Provide portfolio links
              </p>
              {PORTFOLIO_FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center gap-3 rounded-[1.875rem] border border-[#E9E9E9] bg-white px-5 py-3"
                >
                  <span className="text-sm font-semibold text-grey">
                    {field.label}
                  </span>
                  <input
                    className="flex-1 bg-transparent text-sm outline-none"
                    placeholder={`Add ${field.label} link`}
                    value={formData.portfolio[field.key]}
                    onChange={(event) =>
                      updatePortfolio(field.key, event.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

        {currentStep > 0 && (
          <div className="flex items-center justify-between pt-2">
            {/* <button
              type="button"
              onClick={handleBack}
              className="text-sm font-semibold text-grey transition hover:text-brand-black"
            >
              Back
            </button> */}
            <ButtonV2
              IconPlacement="right"
              Icon={<ArrowRight size={24} color="white" />}
              onClick={handlePrimaryAction}
              className="w-[18.75rem] mx-auto"
            >
              {isLastStep ? "Submit" : "Next"}
            </ButtonV2>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpFlow;
