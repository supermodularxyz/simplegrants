import React from "react";
import clsx from "clsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import ErrorMessageText from "./ErrorMessageText";

interface IInputProps extends React.HTMLProps<HTMLInputElement> {
  rows?: number;
  className?: string;
  register?: UseFormRegister<any>;
  errors?: FieldErrors<any>;
}

export default function TextAreaInput({
  rows = 8,
  className,
  required,
  register,
  errors,
  ...props
}: IInputProps) {
  const { id, type } = props;

  return (
    <>
      <textarea
        rows={rows}
        className={clsx(
          "border border-sg-200 w-full h-full focus:border-sg-primary rounded-lg px-5 py-4 outline-none",
          errors && !!errors[id || ""] ? "border-sg-error" : "border-sg-500"
        )}
        id={id}
        {...(register && register(id || "", { required }))}
      />
      <ErrorMessage
        name={id || ""}
        errors={errors}
        render={({ message }) => <ErrorMessageText>{message}</ErrorMessageText>}
      />
    </>
  );
}
