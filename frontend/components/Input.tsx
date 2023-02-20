import React, { ReactNode } from "react";
import clsx from "clsx";

interface IInputProps extends React.HTMLProps<HTMLInputElement> {
  icon?: ReactNode;
  className?: string;
}

export default function Input({ icon, className, ...props }: IInputProps) {
  return (
    <div
      className={clsx("flex flex-row items-center relative w-full", className)}
    >
      {icon && (
        <label className="absolute inset-y-0 left-0 flex items-center pl-4">
          {icon}
        </label>
      )}
      <input
        className={clsx(
          icon ? "pl-10" : "",
          "block w-full px-7 py-3 border border-sg-500 focus:border-sg-primary focus:ring-0 focus:ring-offset-0 outline-none rounded-lg"
        )}
        {...props}
      />
    </div>
  );
}
