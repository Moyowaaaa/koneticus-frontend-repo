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
import { ScrollArea } from "../ui/scroll-area";
import { X } from "lucide-react";

interface CustomModalProps {
  children: ReactNode;
  title: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  titleClassname?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
  containerClassname?: string;
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
}: CustomModalProps) => {
  const isMobile = useIsMobile();

  const content = (
    <div className="flex flex-col text-[#1E1E1E]">
      <div className="">
        {/* Title Section */}
        <div className="px-6 pb-4 ">
          {title && (
            <h2
              className={cn(
                "text-lg font-semibold text-center pb-2 border-b border-b-[#E9E9E9E9]",
                titleClassname
              )}
            >
              {title}
            </h2>
          )}
        </div>

        {/* Content */}
        <div className="px-6 py-2">{children}</div>

        {/* Actions */}
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
          <div className="px-4 pb-8">{content}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "gap-0 p-0 sm:max-w-[570px] bg-[none] shadow-[none] md:w-[39.1875rem] ",
          className
        )}
        // Hide the default close button
        showCloseButton={false}
      >
        {/* Custom Close Button - positioned in top-right corner */}
        <DialogClose className="glass-icon-button absolute -top-2 -right-12 z-50 h-10 w-10 max-h-10 max-w-10 rounded-[0.625rem] border-none bg-[#666666] hover:bg-[#555555] p-2 transition-colors flex items-center justify-center">
          <X className="h-[1rem] w-[1rem] text-white" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <ScrollArea className="max-h-[80vh] mt-10 shadow-[none] ">
          <div
            className={cn(
              "flex flex-col gap-2 h-full w-full bg-[white] pb-4 pt-2 rounded-[1.875rem]",
              containerClassname
            )}
          >
            {title && (
              <DialogHeader>
                <DialogTitle className="sr-only">{title}</DialogTitle>
              </DialogHeader>
            )}
            {content}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
