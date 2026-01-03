import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const buttonVariants = cva(
  "h-10 rounded-[1.875rem] cursor-pointer min-h-[3.5rem] border border-brand-normal font-medium bg-primary px-4 hover:transition-all text-sm text-brand-normal text-white  hover:text-white hover:shadow-none",
  {
    variants: {
      variant: {
        default:
          "hover:bg-brand-normal/80 bg-primary text-white dark:bg-[#6155F5]",
        outline:
          "hover:bg-brand-normal/80 bg-white border border-[#E9E9E9E9] text-brand-black",
        dark: "hover:bg-brand-normal/80 bg-brand-black  text-white",
      },
    },
  }
);

// Define the variant type for ButtonV2
export type ButtonV2Variant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;

interface ButtonV2Props extends Omit<ButtonProps, "variant"> {
  variant?: ButtonV2Variant;
  Icon?: React.ReactNode;
  IconPlacement?: "left" | "right";
}

const ButtonV2 = ({
  variant = "default",
  className,
  Icon,
  children,
  IconPlacement = "left",
  ...props
}: ButtonV2Props) => {
  return (
    <Button className={cn(buttonVariants({ variant }), className)} {...props}>
      {Icon && IconPlacement === "left" && Icon}
      {children}
      {Icon && IconPlacement === "right" && Icon}
    </Button>
  );
};

export default ButtonV2;
