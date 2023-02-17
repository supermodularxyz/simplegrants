import React from "react";
import clsx from "clsx";
import { debounce } from "lodash";

interface IInputProps {
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
}

export default function Input({
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
    <input
      type={type}
      placeholder={placeholder}
      className={clsx("input input-bordered w-full max-w-xs", className)}
      onChange={handleChange}
    />
  );
}
