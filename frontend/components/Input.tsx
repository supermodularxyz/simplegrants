import React, { ReactNode } from "react";
import clsx from "clsx";
import { debounce as debouncer } from "lodash";

interface IInputProps {
  icon?: ReactNode;
  type?: React.HTMLInputTypeAttribute;
  value?: any;
  debounce?: boolean;
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
}

export default function Input({
  icon,
  type,
  placeholder,
  debounce,
  className,
  value,
  onChange,
}: IInputProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = React.useCallback(
    debouncer((value) => {
      onChange(value);
    }, 300),
    [onChange]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedOnChange(event.target.value);
  };

  return (
    <div
      className={clsx(
        "flex flex-row items-center relative w-full input input-bordered px-5 py-4 overflow-hidden",
        className
      )}
    >
      {icon && (
        <label className="" htmlFor={placeholder}>
          {icon}
        </label>
      )}
      <input
        id={placeholder}
        type={type}
        value={value}
        placeholder={placeholder}
        className={clsx(icon ? "pl-4" : "", "outline-none w-full")}
        onChange={debounce ? handleChange : (e) => onChange(e.target.value)}
      />
    </div>
  );
}
