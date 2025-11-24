import ButtonV2 from "@/components/ui-components/button";
import CustomFormInput from "@/components/ui-components/custom-form-input";
import { ArrowRight } from "iconsax-reactjs";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Log in | Vision Forge",
};

const LogInPage = () => {
  return (
    <div className="relative flex flex-col gap-4 items-center justify-center top-0 h-full  py-10 h-full relative">
      <div className="w-8/12  flex flex-col gap-4">
        <h1 className="text-[1.875rem] text-center  font-bold">Login</h1>

        <CustomFormInput label="Email address" />
        <div className="flex flex-col gap-2">
          <CustomFormInput
            label="Password"
            type="password"
            showPasswordToggle={true}
          />

          <Link href="/auth/forgot-password" className="text-primary">
            <div className="w-full text-right ">
              <p
                className="text-sm 
          text-brand-black
          "
              >
                Forgot password?
              </p>
            </div>
          </Link>
        </div>

        <ButtonV2
          IconPlacement="right"
          Icon={<ArrowRight size="32" color="white" />}
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
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogInPage;
