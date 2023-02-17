import React from "react";
import * as Separator from "@radix-ui/react-separator";
import clsx from "clsx";

interface IDividerProps {
  orientation: "vertical" | "horizontal";
  className?: string;
}

const Divider = ({ orientation, className }: IDividerProps) => (
  <Separator.Root
    className={clsx(
      "bg-sg-900 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-10 data-[orientation=vertical]:w-px",
      className
    )}
    decorative
    orientation={orientation}
  />
);

export default Divider;
