import React from "react";
import * as Separator from "@radix-ui/react-separator";

interface IDividerProps {
  orientation: "vertical" | "horizontal";
}

const Divider = ({ orientation }: IDividerProps) => (
  <Separator.Root
    className="bg-sg-900 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-10 data-[orientation=vertical]:w-px"
    decorative
    orientation={orientation}
  />
);

export default Divider;
