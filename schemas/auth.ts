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
    "Password must contain at least one special character"
  );

export const userSignUpSchema = z.object({
  country: z.string().min(1, "Country is required"),
  password: passwordRules,
  role: z.enum(["user", "merchant"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

export const merchantSignUpSchema = z.object({
  role: z.literal("merchant"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid business email address"),
  password: passwordRules,
  country: z.string().min(1, "Country is required"),
});

export const newPasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordRules,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // This targets the error at the confirmPassword field
  });

export type userSignUpSchemaType = z.infer<typeof userSignUpSchema>;
export type loginSchemaType = z.infer<typeof loginSchema>;

// Base schema with common fields for both user and merchant
// const baseSchema = z.object({
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   country: z.string().min(1, "Country is required"),
//   password: passwordRules,
//   role: z.enum(["user", "merchant"]),
// });

// // User-specific schema
// const userSchema = baseSchema.extend({
//   role: z.literal("user"),
//   email: z.string().email("Invalid email address"),
//   // Fields specific to users only can be added here
// });

// // Merchant-specific schema
// const merchantSignUpSchema = baseSchema.extend({
//   role: z.literal("merchant"),
//   businessName: z.string().min(1, "Business name is required"),
//   businessEmailAddress: z.string().email("Invalid business email address"),
//   // Fields specific to merchants only can be added here
// });

// // Combined schema using discriminated union based on role
// export const signUpSchema = z.discriminatedUnion("role", [
//   userSchema,
//   merchantSchema,
// ]);

// export type signUpSchemaType = z.infer<typeof signUpSchema>;

// Type inference for TypeScript

// Example type for the form data

// schema for singup
