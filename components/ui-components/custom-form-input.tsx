"use client";

import * as React from "react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Eye, EyeSlash } from "iconsax-reactjs";

type CustomFormInputProps = {
  label?: string;
  description?: string;
  error?: string;
  showPasswordToggle?: boolean;
  placeholder?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const CustomFormInput = React.forwardRef<
  HTMLInputElement,
  CustomFormInputProps
>(
  (
    {
      label,
      description,
      error,
      className,
      showPasswordToggle = false,
      placeholder,
      type = "text",
      id,
      name,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    const inputId = id || name;

    return (
      <div className="space-y-2">
        {label && (
          <Label
            htmlFor={inputId}
            className="text-sm font-normal text-brand-black dark:text-white"
          >
            {label}
          </Label>
        )}

        <div
          className={cn(
            "group relative flex items-center rounded-[1.875rem] border border-[#E9E9E9] bg-white   dark:bg-[#80808026] px-5 py-4 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            error && "border-destructive focus-within:border-destructive",
            className
          )}
        >
          <Input
            id={inputId}
            name={name}
            type={inputType}
            value={value}
            onChange={onChange}
            ref={ref}
            className="w-full bg-transparent 
            dark:bg-transparent
            text-base text-brand-black dark:text-white placeholder:text-grey outline-none border-none "
            placeholder={placeholder}
            {...props}
          />

          {showPasswordToggle && type === "password" && (
            <>
              {!showPassword ? (
                <Eye
                  size="24"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer  text-brand-black dark:text-white"
                />
              ) : (
                <EyeSlash
                  size="24"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="cursor-pointer  text-brand-black dark:text-white"
                />
              )}
            </>

            // <ButtonV2
            //   type="button"
            //   onClick={() => setShowPassword((prev) => !prev)}
            //   className="text-xs font-semibold uppercase tracking-wide text-primary"
            // >
            //   {showPassword ? "Hide" : "Show"}
            // </ButtonV2>
          )}
        </div>

        {description && <p className="text-xs text-grey">{description}</p>}

        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

CustomFormInput.displayName = "CustomFormInput";

export default CustomFormInput;
