import React, { useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{ bio?: string; portfolio?: string }>(
    {},
  );

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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Store both the file (for upload) and preview URL (for display)
        setFormData((prev) => ({
          ...prev,
          profileImageFile: file,
          profileImagePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateAndSubmit = () => {
    const newErrors: { bio?: string; portfolio?: string } = {};

    // Bio validation - max 150 words
    const wordCount = formData.bio
      ? formData.bio
          .trim()
          .split(/\s+/)
          .filter((w) => w).length
      : 0;
    if (wordCount > 150) {
      newErrors.bio = "Bio must be 150 words or less";
    }

    // URL validation for portfolio links
    const urlRegex =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const portfolioValues = Object.values(formData.portfolio).filter(
      (v) => v.trim() !== "",
    );

    for (const url of portfolioValues) {
      if (url && !urlRegex.test(url)) {
        newErrors.portfolio = "Please enter valid URLs for portfolio links";
        break;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    handlePrimaryAction();
  };

  const isLastStep = currentStep === LAST_STEP_INDEX;
  const wordCount = formData.bio
    ? formData.bio
        .trim()
        .split(/\s+/)
        .filter((w) => w).length
    : 0;

  return (
    <>
      <div className="space-y-6 w-[30rem] mx-auto">
        <h1 className="font-semibold text-[1.125rem] text-center ">
          Tell us about yourself
        </h1>
        <div className="w-full flex items-start gap-4">
          <div
            onClick={handleImageClick}
            className="min-h-28 min-w-28 h-28 w-28 border border-[#e9e9e9] rounded-full flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#827AE1] transition-colors"
          >
            {formData.profileImagePreview ? (
              <Image
                src={formData.profileImagePreview}
                alt="Profile"
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <GalleryEdit size={24} color="#827AE1" />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex flex-col gap-6 w-full ">
            <div className="flex flex-col gap-1">
              <div className="relative h-[12.5rem] w-full border rounded-[1.875rem] border-[#E9E9E9E9] min-h-[12.5rem]">
                <textarea
                  placeholder="Type here..."
                  value={formData.bio}
                  onChange={(event) => updateField("bio", event.target.value)}
                  className="p-4 w-full h-full text-[#808080] placeholder:text-[#808080] text-base font-[sora-light] resize-none outline-none border-none focus:ring-0  focus:border-none focus:outline-none"
                />

                <p
                  className={`text-xs absolute bottom-4 right-4 ${wordCount > 150 ? "text-[#D32F2F]" : "text-[#808080]"}`}
                >
                  {wordCount}/150 words
                </p>
              </div>
              {errors.bio && (
                <p className="text-[#D32F2F] text-sm">{errors.bio}</p>
              )}
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
              {errors.portfolio && (
                <p className="text-[#D32F2F] text-sm text-center">
                  {errors.portfolio}
                </p>
              )}
            </div>

            <ButtonV2
              IconPlacement="right"
              Icon={<ArrowRight size={24} color="white" />}
              onClick={validateAndSubmit}
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
