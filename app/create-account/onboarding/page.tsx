"use client";

import OnBoardingFlow from "@/components/onboarding";

const OnboardingPage = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center flex-col">
      <OnBoardingFlow />

      <div
        className="w-full 
      dark:text-white
      max-w-full mx-auto absolute bottom-2 flex items-center justify-center text-[#211E1E] font-semibold text-[0.875rem] font-sora"
      >
        &copy; KoLabs {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default OnboardingPage;
