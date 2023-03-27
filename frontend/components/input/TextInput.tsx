import React, { ReactNode } from "react";
import clsx from "clsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import ErrorMessageText from "./ErrorMessageText";

interface IInputProps extends React.HTMLProps<HTMLInputElement> {
  icon?: ReactNode;
  className?: string;
  register?: UseFormRegister<any>;
  errors?: FieldErrors<any>;
}

export default function TextInput({
  icon,
  className,
  required,
  register,
  errors,
  ...props
}: IInputProps) {
  const { id, type } = props;

  return (
    <>
      <div
        className={clsx(
          "flex flex-row items-center relative w-full",
          className
        )}
      >
        {icon && (
          <label className="absolute inset-y-0 left-0 flex items-center pl-4">
            {icon}
          </label>
        )}
        <input
          className={clsx(
            icon ? "pl-10" : "",
            "block w-full px-7 py-3 border focus:border-sg-primary focus:ring-0 focus:ring-offset-0 outline-none rounded-lg",
            errors && !!errors[id || ""] ? "border-sg-error" : "border-sg-500"
          )}
          {...props}
          {...(register &&
            register(id || "", { required, valueAsNumber: type === "number" }))}
        />
      </div>
      <ErrorMessage
        name={id || ""}
        errors={errors}
        render={({ message }) => <ErrorMessageText>{message}</ErrorMessageText>}
      />
    </>
  );
}
