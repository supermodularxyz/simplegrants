import React, { ReactNode } from "react";
import clsx from "clsx";

const ButtonStyles = {
  primary: "btn-primary text-sg-900 disabled:bg-sg-50 disabled:text-sg-500",
  secondary: "btn-secondary text-white",
  outline: "btn-outline btn-secondary",
};

const ButtonWidth = {
  full: "w-full",
  max: "w-max",
};

interface IButtonProps {
  children: ReactNode;
  onClick?: (e?: any) => any;
  className?: string;
  disabled?: boolean;
  style?: keyof typeof ButtonStyles;
  width?: "full" | "max";
}

export default function Button({
  children,
  onClick,
  className,
  disabled = false,
  style = "primary",
  width = "max",
}: IButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "btn font-bold lg:text-lg px-4 md:px-12 py-3 h-max rounded-full normal-case",
        className,
        ButtonStyles[style],
        ButtonWidth[width]
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
