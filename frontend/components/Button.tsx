import React, { ReactNode } from "react";
import clsx from "clsx";

interface IButtonProps {
  children: ReactNode;
  onClick?: () => any;
  className?: string;
}

export default function Button({ children, onClick, className }: IButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "border border-black font-bold text-lg px-8 py-2 w-full",
        className
      )}
    >
      {children}
    </button>
  );
}
