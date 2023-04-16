import React, { ReactNode } from "react";
import clsx from "clsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import ErrorMessageText from "./ErrorMessageText";
import DatePicker from "react-datepicker";

interface IInputProps {
  disabled?: boolean;
  onChange: any;
  onBlur: any;
  value: Date;
  name: string;
  className?: string;
  errors?: FieldErrors<any>;
  minDate?: Date;
}

export default function DateInput({
  disabled,
  onChange,
  onBlur,
  value,
  name,
  errors,
  minDate,
}: IInputProps) {
  return (
    <>
      <DatePicker
        onBlur={onBlur} // notify when input is touched
        minDate={minDate}
        className={clsx(
          "block w-full px-2 md:px-4 py-3 border focus:border-sg-primary focus:ring-0 focus:ring-offset-0 outline-none rounded-lg border-sg-500",
          disabled ? "opacity-50" : "opacity-100",
          errors && !!errors[name || ""] ? "border-sg-error" : "border-sg-500"
        )}
        disabled={disabled}
        dateFormat="MM.dd.yyyy"
        selected={value}
        name={name}
        onChange={onChange} // send value to hook form
      />
      {errors && (
        <ErrorMessage
          name={name || ""}
          errors={errors}
          render={({ message }) => (
            <ErrorMessageText>{message}</ErrorMessageText>
          )}
        />
      )}
    </>
  );
}
