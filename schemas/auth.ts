import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2),
});

// Define password validation rules
const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

// Email schema for signup page (step 0)
export const signupEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Information step schema (step 1)
export const informationStepSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: passwordRules,
});

// Role step schema (step 2)
export const roleStepSchema = z.object({
  roles: z.array(z.string()).min(1, "Please select at least one role"),
});

// Bio step schema (step 3)
export const bioStepSchema = z.object({
  bio: z
    .string()
    .optional()
    .refine((val) => !val || val.trim().split(/\s+/).length <= 150, {
      message: "Bio must be 150 words or less",
    }),
  profileImage: z.string().optional(),
  portfolio: z.object({
    linkedin: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    github: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    behance: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
    website: z
      .string()
      .url("Please enter a valid URL")
      .optional()
      .or(z.literal("")),
  }),
});

// Full onboarding schema (all steps combined)
export const fullOnboardingSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: passwordRules,
  roles: z.array(z.string()).min(1, "Please select at least one role"),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
  portfolio: z.object({
    linkedin: z.string().optional(),
    github: z.string().optional(),
    behance: z.string().optional(),
    website: z.string().optional(),
  }),
});

export const newPasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordRules,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type exports
export type loginSchemaType = z.infer<typeof loginSchema>;
export type signupEmailSchemaType = z.infer<typeof signupEmailSchema>;
export type informationStepSchemaType = z.infer<typeof informationStepSchema>;
export type roleStepSchemaType = z.infer<typeof roleStepSchema>;
export type bioStepSchemaType = z.infer<typeof bioStepSchema>;
export type fullOnboardingSchemaType = z.infer<typeof fullOnboardingSchema>;
