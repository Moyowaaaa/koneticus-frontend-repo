"use client";

import Link from "next/link";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomFormInput from "@/components/ui-components/custom-form-input";
import ButtonV2 from "@/components/ui-components/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// export const metadata: Metadata = {
//   title: "Sign up | Vision Forge",
// };

export default function SignUpPage() {
  const router = useRouter();
  return (
    <div className="relative flex flex-col gap-4 items-center justify-center top-0 h-full  py-10 h-full relative">
      <div className="w-8/12  flex flex-col gap-4">
        <h1 className="text-[1.875rem] text-center  font-bold">
          Create account
        </h1>

        <CustomFormInput label="Email address" />

        <ButtonV2
          IconPlacement="right"
          Icon={<ArrowRight size="32" color="white" />}
          onClick={() => router.push("/create-account/onboarding")}
        >
          Continue
        </ButtonV2>

        <div className="flex items-center gap-6 w-full">
          <div className="w-full border border-[#E9E9E9]"></div>
          <p>Or</p>
          <div className="w-full border border-[#E9E9E9]"></div>
        </div>

        <div className="flex flex-col gap-2">
          <ButtonV2
            Icon={
              <Image
                src="/images/google.svg"
                width={24}
                height={24}
                alt="google"
              />
            }
            variant="outline"
          >
            Continue with Google
          </ButtonV2>
          <ButtonV2
            Icon={
              <Image
                src="/images/github.svg"
                width={24}
                height={24}
                alt="github"
              />
            }
            variant="outline"
          >
            Continue with Github
          </ButtonV2>
          <ButtonV2
            Icon={
              <Image
                src="/images/microsoft.svg"
                width={24}
                height={24}
                alt="microsoft"
              />
            }
            variant="outline"
          >
            Continue with Microsoft
          </ButtonV2>
        </div>

        <p className="text-center">
          Already have an account?{" "}
          <Link href="/auth/log-in" className="text-primary">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
