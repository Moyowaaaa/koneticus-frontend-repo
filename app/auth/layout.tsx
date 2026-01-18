"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const step = searchParams.get("step") || 0;

  return (
    <div className="flex min-h-screen flex-col  lg:flex-row relative justify-between">
      <div
        className={` h-screen relative p-4 ${
          Number(step) < 1 ? "w-2/6" : "w-full"
        }`}
      >
        <div className="relative w-full h-full flex flex-col ">
          <div className="w-full  absolute top-24 flex items-center justify-center">
            <div className="relative h-[2.5rem] w-[2.5rem]">
              <Image
                src={"/images/purple_logo.png"}
                alt=""
                fill
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {children}

          <div
            className="w-full left-0 mx-auto absolute bottom-0 flex items-center justify-center text-[#211E1E]
          dark:text-white
          font-semibold text-[0.875rem] font-sora"
          >
            &copy; KoLabs {new Date().getFullYear()}
          </div>
        </div>
      </div>

      {Number(step) < 1 && (
        <div className="relative hidden  w-7/12 flex-1 flex-col justify-between overflow-hidden bg-primary px-12 py-14 text-brand-white lg:flex">
          <Image
            src={
              pathname === "/auth/sign-up"
                ? "/images/auth-bg-signup.webp"
                : pathname === "/auth/forgot-password"
                ? "/images/auth-bg-forgot.webp"
                : "/images/auth-bg-login.webp"
            }
            fill
            alt="auth-bg-1"
            className="h-full w-full object-cover absolute right-0 "
          />

          <div className="flex flex-col gap-4 absolute bottom-32 w-max pl-4">
            <h1 className="text-[3rem] leading-[3rem] text-white max-w-[45rem] font-normal">
              {pathname === "/auth/sign-up"
                ? "Collaborate With Top-Tier Creative Talent"
                : pathname === "/auth/forgot-password"
                ? "Let's help you get back in."
                : "Join a Community of High-Performing Creatives"}
            </h1>
            <p
              className={`text-white ${
                pathname === "/auth/sign-up" ? "max-w-[38rem]" : "max-w-[40rem]"
              } leading-[1.75rem]`}
            >
              {pathname === "/auth/sign-up"
                ? "Find collaborators who share your passion, vision, and commitment to creating meaningful, high-quality work."
                : pathname === "/auth/forgot-password"
                ? "Type in your email address and we'll send you a secure reset link in a moment."
                : "Meet experienced collaborators who are passionate about working together to build original, impactful projects."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthLayoutFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row relative justify-between">
      <div className="h-screen relative p-4 w-2/6">
        <div className="relative w-full h-full flex flex-col">
          <div className="w-full absolute top-24 flex items-center justify-center">
            <div className="relative h-[2.5rem] w-[2.5rem]">
              <Image
                src={"/images/purple_logo.png"}
                alt=""
                fill
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {children}
          <div
            className="w-full left-0 mx-auto
          dark:text-white
          absolute bottom-0 flex items-center justify-center text-[#211E1E] dark:text-white font-semibold text-[0.875rem] font-sora"
          >
            &copy; KoLabs {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<AuthLayoutFallback>{children}</AuthLayoutFallback>}>
      <AuthLayoutContent>{children}</AuthLayoutContent>
    </Suspense>
  );
}
