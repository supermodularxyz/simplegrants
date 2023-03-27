import React from "react";
import clsx from "clsx";

interface IErrorMessageTextProps {
  className?: string;
  children: React.ReactNode;
}

const ErrorMessageText = ({ children, className }: IErrorMessageTextProps) => (
  <p className={clsx(className, "text-sg-error mt-1")}>{children}</p>
);

export default ErrorMessageText;
