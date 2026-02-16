import { cn } from "@/lib/utils";
import { Gallery } from "iconsax-reactjs";
import React, { useEffect, useState } from "react";

const colors = ["#6155F5", "#AEA8F7", "purple", "#2196F3", "lavender"];

const BrokenMedia = ({
  className,
  hasColor,
}: {
  className?: string;
  hasColor?: boolean;
}) => {
  const [color, setColor] = useState(colors[0]);

  // useEffect(() => {
  //   setColor(colors[Math.floor(Math.random() * colors.length)]);
  // }, []);

  return (
    <>
      <div
        className={cn(
          "w-full h-full flex items-center justify-center",
          className,
        )}
        style={
          !hasColor
            ? { backgroundColor: color }
            : { backgroundColor: "transparent" }
        }
      >
        <Gallery size={80} color="white" />
      </div>
    </>
  );
};

export default BrokenMedia;
