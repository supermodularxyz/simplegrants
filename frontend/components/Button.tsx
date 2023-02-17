import React, { ReactNode } from "react";
import clsx from "clsx";

interface IButtonProps {
  children: ReactNode;
  onClick?: (e?: any) => any;
  className?: string;
}

export default function Button({ children, onClick, className }: IButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "btn-primary font-bold text-lg px-12 py-3 w-full rounded-full text-sg-900",
        className
      )}
    >
      {children}
    </button>
  );
}
