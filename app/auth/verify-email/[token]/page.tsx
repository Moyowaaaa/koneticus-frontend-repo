"use client";

import {
  useLoginUser,
  useResendVerificationEmail,
  useVerifyEmail,
} from "@/api/auth/auth.mutations";
import ButtonV2 from "@/components/ui-components/button";
import { useGetErrorMessage } from "@/lib/utils";
import { useOnboardingStore } from "@/store/useOnBoardingStore";
import { showToast } from "@/utils/toasts";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect } from "react";

const TokenVerificationPage = () => {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token; // This is your verification token from the URL
  const getErrorMessage = useGetErrorMessage();

  const { user } = useOnboardingStore();

  const { mutateAsync: verifyEmail, isPending } = useVerifyEmail();
  const { mutateAsync: loginUser } = useLoginUser();

  const onNavigateToLogin = () => {
    router.push("/auth/log-in");
  };

  const onVerifyEmail = async () => {
    try {
      await verifyEmail({ token });
      showToast.success("Email verified successfully");
      localStorage.setItem("didVerify", "true");
      if (user) {
        await loginUser({ email: user.email, password: user.password });
        router.push("/dashboard");
      } else {
        onNavigateToLogin();
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast.error(errorMessage);
      localStorage.setItem("didVerify", "false");
      onNavigateToLogin();
    }
    // await verifyEmail({ token });
  };

  useEffect(() => {
    if (token) {
      onVerifyEmail();
    }
  }, [token]);

  console.log("Verification token:", token);

  return (
    <>
      <div className="relative flex flex-col gap-4 items-center justify-center top-0 h-full  py-10 h-full relative">
        <div className="space-y-2">
          <p className="text-brand-grey text-[1.125rem]  font-normal max-w-[21rem]">
            Verifying your email address...
          </p>
        </div>

        {/* <ButtonV2
          variant="dark"
          className="w-[20rem] border-none outline-none"
          onClick={onResendVerificationEmail}
        >
          {isPending
            ? "Loading..."
            : "Didn't get the verification email? Resend"}
        </ButtonV2>

        <ButtonV2 className="w-[20rem]" onClick={onNavigateToLogin}>
          Already verified ? log in
        </ButtonV2> */}
      </div>
    </>
  );
};

export default TokenVerificationPage;
