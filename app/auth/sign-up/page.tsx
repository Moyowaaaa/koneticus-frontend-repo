import Link from "next/link";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomFormInput from "@/components/ui-components/custom-form-input";
import ButtonV2 from "@/components/ui-components/button";
import { ArrowRight } from "lucide-react";
import SignUpFlow from "@/components/auth/sign-up-flow";

export const metadata: Metadata = {
  title: "Sign up | Vision Forge",
};

export default function SignUpPage() {
  return <SignUpFlow />;
}
