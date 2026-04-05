"use client";

import Link from "next/link";
import CustomFormInput from "@/components/ui-components/custom-form-input";
import ButtonV2 from "@/components/ui-components/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnBoardingStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupEmailSchema, signupEmailSchemaType } from "@/schemas/auth";
import { useCheckEmail } from "@/api/auth/auth.mutations";
import { useGetErrorMessage } from "@/lib/utils";
import { showToast } from "@/utils/toasts";

export default function SignUpPage() {
  const router = useRouter();
  const { setEmail } = useOnboardingStore();

  const { mutateAsync: checkEmail, isPending } = useCheckEmail();
  const getErrorMessage = useGetErrorMessage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupEmailSchemaType>({
    resolver: zodResolver(signupEmailSchema),
  });

  const onSubmit = async (data: signupEmailSchemaType) => {
    const email = data.email;
    try {
      const response = await checkEmail({ email });
      console.log(response);
      setEmail(email);
      router.push("/create-account/onboarding");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast.error(errorMessage);
    }
  };

  return (
    <div className="relative flex flex-col gap-4 items-center justify-center top-0 h-full  py-10 h-full relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-8/12 flex flex-col gap-4"
      >
        <h1 className="text-[1.875rem] text-center font-bold">
          Create account
        </h1>

        <div className="flex flex-col gap-1">
          <CustomFormInput label="Email address" {...register("email")} />
          {errors.email && (
            <p className="text-[#D32F2F] text-sm">{errors.email.message}</p>
          )}
        </div>

        <ButtonV2
          IconPlacement="right"
          Icon={!isPending && <ArrowRight size="32" color="white" />}
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Loading..." : "Continue"}
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
            className="dark:bg-[#151515] dark:text-white 
            dark:hover:bg-[#6155F5]
            dark:border-[none]! dark:outline-[none]!"
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
            className="dark:bg-[#151515]
            dark:hover:bg-[#6155F5]
            
            dark:text-white dark:border-[none]! dark:outline-[none]!"
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
            className="dark:bg-[#151515]
            
            dark:hover:bg-[#6155F5]
            dark:text-white dark:border-[none]! dark:outline-[none]!"
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
      </form>
    </div>
  );
}
