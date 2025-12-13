"use client";

import React, { useState, Suspense } from "react";
import StepCounter from "../ui-components/step-counter";
import { clampStepValue } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InformationStep } from "./steps/info";
import { INITIAL_STATE, SignUpFormData } from "@/types";
import RoleStep from "./steps/role";
import BioStep from "./steps/bio";
import Image from "next/image";

const STEP_TITLES = ["Information", "Roles", "Profile"];
const TOTAL_STEPS = STEP_TITLES.length + 1; // include initial email capture step
const LAST_STEP_INDEX = TOTAL_STEPS - 1;

function OnBoardingFlowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [currentStep, setCurrentStep] = useState(() => {
    const stepParam = searchParams.get("step");
    return clampStepValue(stepParam ? Number(stepParam) : 0, LAST_STEP_INDEX);
  });
  const [formData, setFormData] = useState<SignUpFormData>(INITIAL_STATE);

  const setStepWithUrl = (nextStep: number) => {
    const clamped = clampStepValue(nextStep, LAST_STEP_INDEX);
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

  const handlePrimaryAction = () => {
    if (currentStep === 2) {
      router.push("/dashboard");
    } else {
      setStepWithUrl(currentStep + 1);
    }
  };

  return (
    <>
      <div className="relative flex w-full flex-col items-center gap-8 py-10  h-full ">
        <div className="  space-y-6 flex flex-col gap-4   w-max">
          <div className="relative h-[2.5rem] w-[2.5rem] mx-auto">
            <Image
              src={"/images/purple_logo.png"}
              alt=""
              fill
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-[18.75rem] mx-auto pt-4">
            <StepCounter
              steps={STEP_TITLES}
              stepCount={currentStep}
              setStep={(number) => setStepWithUrl(number)}
            />
          </div>

          {currentStep === 0 && (
            <InformationStep
              formData={formData}
              setFormData={setFormData}
              handlePrimaryAction={handlePrimaryAction}
              currentStep={currentStep}
            />
          )}

          {currentStep === 1 && (
            <RoleStep
              formData={formData}
              setFormData={setFormData}
              handlePrimaryAction={handlePrimaryAction}
              currentStep={currentStep}
            />
          )}

          {currentStep === 2 && (
            <BioStep
              formData={formData}
              setFormData={setFormData}
              handlePrimaryAction={handlePrimaryAction}
              currentStep={currentStep}
            />
          )}
        </div>
      </div>
    </>
  );
}

function OnBoardingFlowFallback() {
  return (
    <div className="relative flex w-full flex-col items-center gap-8 py-10 h-full">
      <div className="space-y-6 flex flex-col gap-4 w-max">
        <div className="relative h-[2.5rem] w-[2.5rem] mx-auto">
          <Image
            src={"/images/purple_logo.png"}
            alt=""
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-[18.75rem] mx-auto pt-4">
          <div className="animate-pulse bg-muted h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

const OnBoardingFlow = () => {
  return (
    <Suspense fallback={<OnBoardingFlowFallback />}>
      <OnBoardingFlowContent />
    </Suspense>
  );
};

export default OnBoardingFlow;
