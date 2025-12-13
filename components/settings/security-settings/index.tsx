"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Eye icons for password visibility toggle
const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.66699 10C1.66699 10 4.16699 4.16667 10.0003 4.16667C15.8337 4.16667 18.3337 10 18.3337 10C18.3337 10 15.8337 15.8333 10.0003 15.8333C4.16699 15.8333 1.66699 10 1.66699 10Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.7678 11.7678C11.5378 12.0124 11.2617 12.2093 10.9549 12.3466C10.6481 12.4839 10.3171 12.559 9.98127 12.5673C9.64545 12.5756 9.31123 12.5171 8.99823 12.3953C8.68523 12.2736 8.39986 12.0912 8.15882 11.8588C7.91778 11.6264 7.72595 11.3483 7.59445 11.0405C7.46295 10.7327 7.39421 10.4012 7.39205 10.0653C7.38989 9.72946 7.45434 9.39631 7.58173 9.08651C7.70912 8.77671 7.89709 8.495 8.13463 8.25893"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.95898 4.34375C9.29908 4.28295 9.64417 4.25185 9.99023 4.25098C15.8327 4.25098 18.3327 10.0010 18.3327 10.0010C17.9936 10.7575 17.5769 11.4764 17.0886 12.1452"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.75968 5.75977C3.68551 7.09643 2.30218 9.04143 1.66634 10.001C2.38551 11.501 4.88551 15.7510 9.99967 15.7510C11.9288 15.7635 13.8038 15.1101 15.2355 13.9352"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66699 1.66602L18.3337 18.3327"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
  className,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative flex items-center w-full rounded-xl border border-border/50 bg-card/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent border-none focus:ring-0 focus:outline-none h-12 px-4 text-foreground placeholder:text-muted-foreground pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? (
            <EyeIcon className="w-5 h-5" />
          ) : (
            <EyeOffIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

interface TwoFactorOptionProps {
  title: string;
  description: string;
  isRecommended?: boolean;
  enabled: boolean;
  onToggle: () => void;
}

const TwoFactorOption = ({
  title,
  description,
  isRecommended,
  enabled,
  onToggle,
}: TwoFactorOptionProps) => (
  <div className="flex items-start justify-between py-4">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{title}</span>
        {isRecommended && (
          <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
            Recommended
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <button
      onClick={onToggle}
      className={cn(
        "relative w-12 h-6 rounded-full transition-colors",
        enabled ? "bg-primary" : "bg-muted-foreground/30"
      )}
    >
      <div
        className={cn(
          "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
          enabled ? "translate-x-7" : "translate-x-1"
        )}
      />
    </button>
  </div>
);

const SecuritySettings = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
  });

  const [twoFactorSettings, setTwoFactorSettings] = useState({
    email: false,
    app: false,
  });

  const handleSavePassword = () => {
    console.log("Saving new password");
    // Handle password save logic
  };

  return (
    <div className="w-full space-y-8">
      {/* Security Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Security</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account security settings
        </p>
      </div>

      {/* Password Section */}
      <div className="space-y-6 pb-8 border-b border-dashed border-border/50">
        <h3 className="text-lg font-semibold text-foreground">Password</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1" />
          <div className="space-y-4">
            <PasswordInput
              label="Current password"
              value={passwords.current}
              onChange={(v) =>
                setPasswords((prev) => ({ ...prev, current: v }))
              }
              placeholder="Enter current password"
            />

            <div className="flex items-end gap-4">
              <PasswordInput
                label="New password"
                value={passwords.new}
                onChange={(v) => setPasswords((prev) => ({ ...prev, new: v }))}
                placeholder="Enter new password"
                className="flex-1"
              />
              <Button
                onClick={handleSavePassword}
                className="px-6 py-2 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
              >
                Save new password
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Two Factor Authentication Section */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Two factor authentication
            </h3>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Select your preferred option for receiving one time passwords
              (OTPs)
            </p>

            <div className="divide-y divide-border/30">
              <TwoFactorOption
                title="Email address"
                description="Use email to receive verification codes for added protection"
                isRecommended
                enabled={twoFactorSettings.email}
                onToggle={() =>
                  setTwoFactorSettings((prev) => ({
                    ...prev,
                    email: !prev.email,
                  }))
                }
              />
              <TwoFactorOption
                title="Authentication App"
                description="Download Google authenticator to secure your account"
                enabled={twoFactorSettings.app}
                onToggle={() =>
                  setTwoFactorSettings((prev) => ({ ...prev, app: !prev.app }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
