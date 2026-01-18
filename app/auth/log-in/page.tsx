"use client";

import ButtonV2 from "@/components/ui-components/button";
import CustomFormInput from "@/components/ui-components/custom-form-input";
import { loginSchemaType } from "@/schemas/auth";
import { ArrowRight } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/auth";
import { useGetErrorMessage } from "@/lib/utils";
import { useLoginUser } from "@/api/auth/auth.mutations";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/toasts";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const LogInPage = () => {
  const getErrorMessage = useGetErrorMessage();
  const { mutateAsync: loginUser, isPending } = useLoginUser();
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<loginSchemaType> = async (data) => {
    try {
      const response = await loginUser(data);
      setAuth(response.data.user);
      // showToast.success(`Welcome back ${response.data.user.firstname || ""}!`);
      toast.success(`Welcome back ${response.data.user.firstname || ""}!`);
      router.push("/dashboard");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast.error(errorMessage);
      setError("root", {
        message: "An error occurred",
      });
    }
  };

  return (
    <div className="relative flex flex-col gap-4 items-center justify-center top-0 h-full  py-10 h-full relative">
      <form
        className="flex flex-col gap-[1.5rem] w-8/12  mx-auto"
        onSubmit={handleSubmit(onSubmit)}
        id="login-form"
      >
        <div className=" flex flex-col gap-4 w-full">
          <h1 className="text-[1.875rem] text-center  font-bold">Login</h1>

          <CustomFormInput label="Email address" {...register("email")} />
          {errors.email?.message && (
            <div className="text-[#D32F2F] text-[0.875rem]">
              {errors.email?.message}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <CustomFormInput
              label="Password"
              type="password"
              showPasswordToggle={true}
              {...register("password")}
            />
            {errors.password?.message && (
              <div className="text-[#D32F2F] text-[0.875rem]">
                {errors.password?.message}
              </div>
            )}

            <Link href="/auth/forgot-password" className="text-primary">
              <div className="w-full text-right ">
                <p
                  className="text-sm 
          text-brand-black
          dark:text-white
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
            className="w-full"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Continue"}
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
              className="dark:bg-[#151515]
            dark:hover:bg-[#6155F5]
              
              dark:text-white dark:border-[none]! dark:outline-[none]!"
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
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LogInPage;
