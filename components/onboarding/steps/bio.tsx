import React from "react";
import { PortfolioLinks, SignUpFormData } from "@/types";
import { ArrowRight, GalleryEdit } from "iconsax-reactjs";
import { LAST_STEP_INDEX, PORTFOLIO_FIELDS } from "@/types/data";
import ButtonV2 from "@/components/ui-components/button";
import Image from "next/image";

const BioStep = ({
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

  const isLastStep = currentStep === LAST_STEP_INDEX;

  return (
    <>
      <div className="space-y-6 w-[30rem] mx-auto">
        <h1 className="font-semibold text-[1.125rem] text-center ">
          Tell us about yourself
        </h1>
        <div className="w-full flex items-start gap-4">
          <div className=" min-h-28 min-w-28 h-28 w-28 border border-[#e9e9e9] rounded-full flex items-center justify-center">
            <GalleryEdit size={24} color="#827AE1" />
          </div>

          <div className="flex flex-col gap-6 w-full ">
            <div className="relative h-[12.5rem] w-full border rounded-[1.875rem] border-[#E9E9E9E9] min-h-[12.5rem]">
              <textarea
                placeholder="Type here..."
                value={formData.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                className="p-4 w-full h-full text-[#808080] placeholder:text-[#808080] text-base font-[sora-light] resize-none outline-none border-none focus:ring-0  focus:border-none focus:outline-none"
              />

              <p className="text-brand-black text-xs absolute bottom-4 right-4">
                {formData.bio.length === 0 && `Min`} {150 - formData.bio.length}
              </p>
            </div>

            <div className="space-y-3">
              <h1 className="font-semibold text-[1.125rem] text-center ">
                Provide us a link to your portfolio
              </h1>
              {PORTFOLIO_FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="flex
                  min-h-[3.5rem]
                  items-center gap-3 rounded-[1.875rem] border border-[#E9E9E9] bg-white px-5 py-3
                  dark:bg-[#151515]
            
            dark:hover:bg-[#6155F5]
            dark:text-white dark:border-[none]! dark:outline-[none]!
                  "
                >
                  <div className="relative h-6 w-6 ">
                    <Image src={field.logo} alt={field.key} fill />
                  </div>
                  <div className="h-5 border border-[#808080]" />
                  <input
                    className="flex-1 bg-transparent text-sm outline-none"
                    placeholder={`Add link..`}
                    value={formData.portfolio[field.key]}
                    onChange={(event) =>
                      updatePortfolio(field.key, event.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <ButtonV2
              IconPlacement="right"
              Icon={<ArrowRight size={24} color="white" />}
              onClick={handlePrimaryAction}
              className={`w-full`}
            >
              {isLastStep ? "Submit" : "Next"}
            </ButtonV2>
          </div>
        </div>
      </div>
    </>
  );
};

export default BioStep;
