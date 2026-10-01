"use client";

import OnBoardingFlow from "@/components/onboarding";

const OnboardingPage = () => {
  return (
    <div className="flex min-h-screen lg:h-screen w-full min-w-0 flex-col items-center justify-between lg:justify-center">
      <OnBoardingFlow />

      <div
        className="w-full 
      dark:text-white
      max-w-full mx-auto lg:absolute bottom-2 flex items-center justify-center text-[#211E1E] font-semibold text-[0.875rem] font-sora"
      >
        &copy; Koneticus {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default OnboardingPage;
