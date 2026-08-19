import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { X } from "lucide-react";

interface CustomModalProps {
  children: ReactNode;
  title?: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  titleClassname?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
  containerClassname?: string;
  childrenClassName?: string;
}

const Modal = ({
  children,
  title,
  onOpenChange,
  open,
  trigger,
  titleClassname,
  primaryAction,
  secondaryAction,
  className,
  containerClassname,
  childrenClassName,
}: CustomModalProps) => {
  const isMobile = useIsMobile();

  const content = (
    <div className="flex min-w-0 flex-col text-[#1E1E1E]">
      <div className="min-w-0">
        {title && (
          <div className="px-6 pb-4">
            <h2
              className={cn(
                "border-b border-b-[#E9E9E9E9] pb-2 text-center text-lg font-semibold dark:border-b-[#80808026] dark:text-white",
                titleClassname,
              )}
            >
              {title}
            </h2>
          </div>
        )}

        <div className={cn("min-w-0 px-6 py-2", childrenClassName)}>
          {children}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-row gap-2 px-6 pt-4">
            {primaryAction}
            {secondaryAction}
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent>
          <DrawerHeader className="relative"></DrawerHeader>
          <div className="max-h-[85vh] overflow-y-auto px-4 pb-8">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "max-h-[85vh] gap-0 overflow-hidden bg-transparent p-0 shadow-none sm:max-w-[570px] md:w-[39.1875rem]",
          className,
        )}
        showCloseButton={false}
      >
        <DialogClose className="glass-icon-button absolute -top-2 -right-12 z-50 flex h-10 w-10 max-h-10 max-w-10 items-center justify-center rounded-[0.625rem] border-none bg-[#666666] p-2 transition-colors hover:bg-[#555555]">
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div
          className={cn(
            "max-h-[85vh] w-full min-w-0 overflow-y-auto rounded-[1.875rem] bg-white pt-2 pb-4 dark:bg-[#211E1E]",
            containerClassname,
          )}
        >
          {title && (
            <DialogHeader>
              <DialogTitle className="sr-only dark:text-white!">
                {title}
              </DialogTitle>
            </DialogHeader>
          )}
          {content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
