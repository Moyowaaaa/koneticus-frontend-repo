"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Icons as inline SVG components
const PencilIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.333 2.00004C11.5081 1.82494 11.716 1.68605 11.9447 1.59129C12.1735 1.49653 12.4187 1.44775 12.6663 1.44775C12.914 1.44775 13.1592 1.49653 13.388 1.59129C13.6167 1.68605 13.8246 1.82494 13.9997 2.00004C14.1748 2.17513 14.3137 2.383 14.4084 2.61178C14.5032 2.84055 14.552 3.08575 14.552 3.33337C14.552 3.58099 14.5032 3.82619 14.4084 4.05497C14.3137 4.28374 14.1748 4.49161 13.9997 4.66671L4.99967 13.6667L1.33301 14.6667L2.33301 11L11.333 2.00004Z"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.3 1.875H18.175L11.95 9.025L19.275 18.125H13.45L8.9 12.275L3.7 18.125H0.825L7.5 10.475L0.5 1.875H6.475L10.575 7.2L15.3 1.875ZM14.3 16.475H15.9L5.5 3.525H3.775L14.3 16.475Z"
      fill="currentColor"
    />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 1.80078C12.6703 1.80078 12.9867 1.81172 14.0414 1.86016C15.0164 1.90469 15.5453 2.06719 15.8977 2.20391C16.3648 2.38516 16.6984 2.60234 17.0477 2.95156C17.4008 3.30469 17.6141 3.63437 17.7953 4.10156C17.932 4.45391 18.0945 4.98281 18.1391 5.95781C18.1875 7.01641 18.1984 7.33281 18.1984 10.0031C18.1984 12.6773 18.1875 12.9937 18.1391 14.0484C18.0945 15.0234 17.932 15.5523 17.7953 15.9047C17.6141 16.3719 17.3969 16.7055 17.0477 17.0547C16.6945 17.4078 16.3648 17.6211 15.8977 17.8023C15.5453 17.9391 15.0164 18.1016 14.0414 18.1461C12.9828 18.1945 12.6664 18.2055 10 18.2055C7.32969 18.2055 7.01328 18.1945 5.95859 18.1461C4.98359 18.1016 4.45469 17.9391 4.10234 17.8023C3.63516 17.6211 3.30156 17.4039 2.95234 17.0547C2.59922 16.7016 2.38594 16.3719 2.20469 15.9047C2.06797 15.5523 1.90547 15.0234 1.86094 14.0484C1.8125 12.9898 1.80156 12.6734 1.80156 10.0031C1.80156 7.32891 1.8125 7.01250 1.86094 5.95781C1.90547 4.98281 2.06797 4.45391 2.20469 4.10156C2.38594 3.63437 2.60312 3.30078 2.95234 2.95156C3.30547 2.59844 3.63516 2.38516 4.10234 2.20391C4.45469 2.06719 4.98359 1.90469 5.95859 1.86016C7.01328 1.81172 7.32969 1.80078 10 1.80078ZM10 0C7.28437 0 6.94453 0.0117188 5.87734 0.0601563C4.81406 0.108594 4.08594 0.277344 3.45 0.523438C2.78828 0.780469 2.23047 1.12266 1.67266 1.67656C1.11875 2.23438 0.776563 2.79219 0.519531 3.44609C0.273437 4.08594 0.104687 4.81016 0.05625 5.87344C0.0078125 6.94453 -0.00390625 7.28437 -0.00390625 10C-0.00390625 12.7156 0.0078125 13.0555 0.05625 14.1227C0.104687 15.1859 0.273437 15.9141 0.519531 16.55C0.776563 17.2117 1.11875 17.7695 1.67266 18.3273C2.23047 18.8852 2.78828 19.2234 3.44609 19.4805C4.08594 19.7266 4.81016 19.8953 5.87344 19.9437C6.94063 19.9922 7.28047 20.0039 9.99609 20.0039C12.7117 20.0039 13.0516 19.9922 14.1188 19.9437C15.182 19.8953 15.9102 19.7266 16.5461 19.4805C17.2039 19.2234 17.7617 18.8852 18.3195 18.3273C18.8773 17.7695 19.2156 17.2117 19.4727 16.5539C19.7188 15.9141 19.8875 15.1898 19.9359 14.1266C19.9844 13.0594 19.9961 12.7195 19.9961 10.0039C19.9961 7.28828 19.9844 6.94844 19.9359 5.88125C19.8875 4.81797 19.7188 4.08984 19.4727 3.45391C19.2234 2.79219 18.8813 2.23438 18.3273 1.67656C17.7695 1.11875 17.2117 0.780469 16.5578 0.523438C15.918 0.277344 15.1937 0.108594 14.1305 0.0601563C13.0555 0.0117188 12.7156 0 10 0Z"
      fill="currentColor"
    />
    <path
      d="M10 4.86328C7.16406 4.86328 4.86328 7.16406 4.86328 10C4.86328 12.8359 7.16406 15.1367 10 15.1367C12.8359 15.1367 15.1367 12.8359 15.1367 10C15.1367 7.16406 12.8359 4.86328 10 4.86328ZM10 13.332C8.15937 13.332 6.66797 11.8406 6.66797 10C6.66797 8.15937 8.15937 6.66797 10 6.66797C11.8406 6.66797 13.332 8.15937 13.332 10C13.332 11.8406 11.8406 13.332 10 13.332Z"
      fill="currentColor"
    />
    <path
      d="M16.5383 4.66211C16.5383 5.32383 16.0016 5.85664 15.3437 5.85664C14.682 5.85664 14.1492 5.32383 14.1492 4.66211C14.1492 4.00039 14.682 3.46758 15.3437 3.46758C16.0016 3.46758 16.5383 4.00039 16.5383 4.66211Z"
      fill="currentColor"
    />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 10C20 4.47656 15.5234 0 10 0C4.47656 0 0 4.47656 0 10C0 14.9922 3.65625 19.1289 8.4375 19.8789V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29102 9.93047 3.90625 12.2148 3.90625C13.3086 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1914C11.9492 6.5625 11.5625 7.33398 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8789C16.3437 19.1289 20 14.9922 20 10Z"
      fill="currentColor"
    />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.4333 3.46875C13.7166 2.64792 13.3166 1.60729 13.3166 0.541667H13.2749V0H10.2V13.0417C10.1877 13.7158 9.91403 14.3573 9.43899 14.8261C8.96395 15.2948 8.32398 15.5522 7.65833 15.5417C6.25833 15.5417 5.1 14.3875 5.1 12.9625C5.1 11.2625 6.69167 10.0167 8.35 10.5292V7.42708C5.03333 7.0125 2.06667 9.64583 2.06667 12.9625C2.06667 16.1875 4.66667 18.5833 7.64167 18.5833C10.825 18.5833 13.225 16.1667 13.225 12.9625V6.3125C14.4708 7.21875 15.9667 7.71458 17.5083 7.72917H17.5333V4.6875C17.5333 4.6875 15.7333 4.7625 14.4333 3.46875Z"
      fill="currentColor"
    />
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.5813 5.19141C19.3519 4.31641 18.6672 3.625 17.7969 3.39453C16.2141 2.96875 10 2.96875 10 2.96875C10 2.96875 3.78594 2.96875 2.20312 3.39453C1.33281 3.625 0.648125 4.31641 0.41875 5.19141C0 6.78125 0 10.0977 0 10.0977C0 10.0977 0 13.4141 0.41875 15.0039C0.648125 15.8789 1.33281 16.5703 2.20312 16.8008C3.78594 17.2266 10 17.2266 10 17.2266C10 17.2266 16.2141 17.2266 17.7969 16.8008C18.6672 16.5703 19.3519 15.8789 19.5813 15.0039C20 13.4141 20 10.0977 20 10.0977C20 10.0977 20 6.78125 19.5813 5.19141ZM7.96875 13.1836V7.01172L13.1641 10.0977L7.96875 13.1836Z"
      fill="currentColor"
    />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 3.33337V12.6667"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33301 8H12.6663"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className,
}: FormInputProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <label className="text-sm font-medium text-foreground">{label}</label>
    <div className="relative flex items-center w-full rounded-xl border border-border/50 bg-card/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-none focus:ring-0 focus:outline-none h-12 px-4 text-foreground placeholder:text-muted-foreground"
      />
    </div>
  </div>
);

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const TextAreaInput = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  rows = 4,
}: TextAreaInputProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <label className="text-sm font-medium text-foreground">{label}</label>
    <div className="relative flex items-center w-full rounded-xl border border-border/50 bg-card/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="bg-transparent border-none focus:ring-0 focus:outline-none w-full px-4 py-3 text-foreground placeholder:text-muted-foreground resize-none text-sm"
      />
    </div>
  </div>
);

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

const SelectInput = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
}: SelectInputProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <label className="text-sm font-medium text-foreground">{label}</label>
    <div className="relative flex items-center w-full rounded-xl border border-border/50 bg-card/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none focus:ring-0 focus:outline-none h-12 px-4 w-full text-foreground appearance-none cursor-pointer text-sm"
      >
        {placeholder && (
          <option value="" className="bg-card text-muted-foreground">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-card text-foreground"
          >
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute right-4 pointer-events-none">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
);

interface SocialLinkButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const SocialLinkButton = ({ icon, label, onClick }: SocialLinkButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
  >
    <div className="text-muted-foreground group-hover:text-primary transition-colors">
      {icon}
    </div>
    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
      {label}
    </span>
    <PlusIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
  </button>
);

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    fullName: "Alex Johnson",
    username: "alexjohnson",
    email: "alex.johnson@gmail.com",
    bio: "",
    dateOfBirth: "",
    phone: "",
    gender: "",
    city: "",
    country: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  const handleSave = () => {
    console.log("Saving profile data:", formData);
    // Handle save logic here
  };

  const handleCancel = () => {
    console.log("Cancelled");
    // Handle cancel logic here
  };

  const handleAddSocialLink = (platform: string) => {
    console.log(`Adding ${platform} link`);
    // Handle social link addition here
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-10 w-full pt-4 px-6 border-2 border-[red]"></div>
      {/* Profile Avatar Section */}
      {/* <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border-2 border-primary/20">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
              AJ
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg">
            <PencilIcon className="w-4 h-4 text-white" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">
            {formData.fullName}
          </h2>
          <p className="text-sm text-muted-foreground">{formData.email}</p>
        </div>
      </div> */}
    </div>
  );
};

export default ProfileSettings;
