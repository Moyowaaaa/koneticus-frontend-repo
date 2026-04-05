"use client";

import ForgotPasswordFlow from "@/components/auth/forgot-password";
import { useParams } from "next/navigation";

const ResetPasswordPage = () => {
  const params = useParams<{ token: string }>();
  const token = params.token;

  return (
    <div className="flex w-full  flex-col gap-6 text-center pt-40 w-9/12 mx-auto ">
      <ForgotPasswordFlow token={token} />
    </div>
  );
};

export default ResetPasswordPage;
