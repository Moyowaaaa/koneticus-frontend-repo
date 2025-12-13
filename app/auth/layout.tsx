"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const step = searchParams.get("step") || 0;
  console.log(pathname);
  return (
    <div className="flex min-h-screen flex-col  lg:flex-row relative justify-between">
      {/* <main className="flex flex-1 items-center justify-center px-4 py-12 lg:px-16">
        <div className="w-full max-w-md border-2 border-[red] rounded-4xl bg-brand-white px-6 py-10 shadow-[0px_40px_80px_rgba(97,85,245,0.08)]">
          {children}
        </div>
      </main> */}
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

          <div className="w-full left-0 mx-auto absolute bottom-0 flex items-center justify-center text-[#211E1E] font-semibold text-[0.875rem] font-sora">
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
                ? "Let’s help you get back in."
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
                ? "Type in your email address and we’ll send you a secure reset link in a moment."
                : "Meet experienced collaborators who are passionate about working together to build original, impactful projects."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
