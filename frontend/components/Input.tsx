import React, { ReactNode } from "react";
import clsx from "clsx";
import { debounce } from "lodash";

interface IInputProps {
  icon?: ReactNode;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
}

export default function Input({
  icon,
  type,
  placeholder,
  className,
  onChange,
}: IInputProps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedOnChange = React.useCallback(
    debounce((value) => {
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
        "flex flex-row items-center relative w-full input input-bordered px-5 py-4",
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
        placeholder={placeholder}
        className={clsx(icon ? "pl-4" : "", "outline-none")}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
