type ConfirmedStepProps = {
  email: string;
  onNavigateToLogin: () => void;
};

const ConfirmedStep = ({ email, onNavigateToLogin }: ConfirmedStepProps) => {
  return (
    <div className="flex flex-col gap-6 ">
      <div className="space-y-2">
        <p className="text-brand-grey text-[1.125rem]  font-normal max-w-[21rem]">
          We&apos;ve sent a reset link to your email. Please check your inbox
          and follow the instructions provided.
        </p>
      </div>

      {/* <ButtonV2 className="w-full" onClick={onNavigateToLogin}>
        Go to log in
      </ButtonV2> */}
    </div>
  );
};

export default ConfirmedStep;
