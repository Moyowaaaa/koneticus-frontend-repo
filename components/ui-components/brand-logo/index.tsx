import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  size?: "sm" | "md";
};

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
} as const;

const BrandLogo = ({ className, size = "md" }: BrandLogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative shrink-0", sizeMap[size])}>
        <Image
          src="/images/purple_logo.png"
          alt="Koneticus"
          fill
          className="object-cover"
        />
      </div>
      <span className="font-sora text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-brand-grey dark:text-white/60">
        Beta
      </span>
    </div>
  );
};

export default BrandLogo;
