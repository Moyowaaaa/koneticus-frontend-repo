"use client";

import { useResendVerificationEmail } from "@/api/auth/auth.mutations";
import ButtonV2 from "@/components/ui-components/button";
import { useGetErrorMessage } from "@/lib/utils";
import { useOnboardingStore } from "@/store/useOnBoardingStore";
import { showToast } from "@/utils/toasts";
import { useRouter } from "next/navigation";

const VerifyEmailPage = () => {
  const router = useRouter();
  const getErrorMessage = useGetErrorMessage();

  const { user } = useOnboardingStore();
  const onNavigateToLogin = () => {
    router.push("/auth/log-in");
  };

  const { mutateAsync: resendVerificationEmail, isPending } =
    useResendVerificationEmail();

  const onResendVerificationEmail = async () => {
    try {
      await resendVerificationEmail({ email: user.email });
      showToast.success("Verification email sent successfully");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showToast.error(errorMessage);
    }
  };

  return (
    <>
      <div className="relative flex flex-col gap-4 items-center justify-center top-0 h-full  py-10 h-full relative">
        <div className="space-y-2">
          <p className="text-brand-grey text-[1.125rem]  font-normal max-w-[21rem]">
            We&apos;ve sent a verification link to your email. Please check your
            inbox and follow the instructions provided.
          </p>
        </div>

        <ButtonV2
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
        </ButtonV2>
      </div>
    </>
  );
};

export default VerifyEmailPage;
