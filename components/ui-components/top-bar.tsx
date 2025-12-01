import { cn } from "@/lib/utils";
import React from "react";

const TopBar = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <div className={cn(`wfull pb-4 border-b ${className}`)}>{children}</div>
    </>
  );
};

export default TopBar;
