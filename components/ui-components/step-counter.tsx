import { Check } from "lucide-react";
import React from "react";

type stepCounterProps = {
  steps: string[];
  stepCount: number;
  setStep: (nextStep: number) => void;
};

type variants = "done" | "current" | "inactive";

const StepCounter = ({ stepCount, steps, setStep }: stepCounterProps) => {
  const textVariants: Record<variants, string> = {
    done: "text-[#1884F6]",
    current: "text-[#FFFFFF] font-medium",
    inactive: "text-[#98A2B3]",
  };

  const getVariant = (index: number): variants => {
    if (index < stepCount) return "done";
    if (index === stepCount) return "current";
    return "inactive";
  };

  return (
    <div className="flex items-center justify-center w-full max-w-[800px] relative">
      {steps?.map((_, index) => {
        const variant = getVariant(index);
        return (
          <div
            key={index}
            onClick={() => setStep(index)}
            className="flex items-center"
          >
            <div
              className={`flex h-[1.25rem] w-[1.25rem] mx-2 items-center justify-center rounded-full 
                ${variant === "done" ? "bg-[#6155F5]" : ""}
                ${variant === "inactive" ? "bg-[#E9E9E9E9]" : ""}
                ${variant === "current" ? "bg-[#827AE1]" : ""}

                `}
            >
              <Check color={"white"} size={12} />
            </div>
            {index !== steps.length - 1 && (
              <div className="w-[4rem] h-[1px] bg-[#D0D5DD]"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepCounter;
