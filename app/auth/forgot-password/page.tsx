import ForgotPasswordFlow from "@/components/auth/forgot-password";

const ForgotPasswordPage = () => {
  return (
    <div
      className="relative
    flex flex-col gap-4 items-center 
    
    justify-start top-0 h-full  pt-32 h-full relative"
    >
      <div className="w-full   flex flex-col gap-4">
        <ForgotPasswordFlow />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
