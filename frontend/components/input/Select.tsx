import React, { Fragment, ReactNode } from "react";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { Listbox, Transition } from "@headlessui/react";

interface SelectOption {
  label: string;
  value: string;
}

interface ISelectProps {
  label: string;
  options: SelectOption[];
  onValueChange: (value: string) => any;
  className?: string;
}

interface ISelectItemProps {
  children: ReactNode;
  value: string;
  position?: "first" | "last";
  className?: string;
  disabled?: boolean;
}

const SelectItem = React.forwardRef<HTMLDivElement, ISelectItemProps>(
  ({ children, className, position, value }, forwardedRef) => {
    return (
      <Listbox.Option
        className={({ active }) =>
          clsx(
            "leading-none text-sg-900 flex items-center relative select-none",
            active ? "outline-none bg-sg-primary" : "",
            className
          )
        }
        value={value}
        ref={forwardedRef}
      >
        {({ selected }) => (
          <div
            className={clsx(
              selected ? "bg-sg-primary" : "",
              position === "first"
                ? selected
                  ? "border-b border-sg-900"
                  : ""
                : position === "last"
                ? selected
                  ? "border-t border-sg-900"
                  : ""
                : selected
                ? "border-y border-sg-900"
                : "",
              "h-full w-full px-5 py-2"
            )}
          >
            {children}
          </div>
        )}
      </Listbox.Option>
    );
  }
);

SelectItem.displayName = "SelectItem";

const Select = ({ label, options, className, onValueChange }: ISelectProps) => {
  const [selected, setSelected] = React.useState<string>();

  return (
    <div>
      <Listbox
        value={selected}
        onChange={(value) => {
          setSelected(value);
          onValueChange(value);
        }}
      >
        <div>
          <Listbox.Button
            className={clsx(
              "whitespace-nowrap inline-flex items-center justify-between rounded-lg p-2 pl-5 leading-none text-sg-900 hover:bg-sg-200 focus:shadow-[0_0_0_2px] border border-sg-900 outline-none data-[placeholder]:text-sg-900 max-h-[34px] w-36 data-[headlessui-state=open]:rounded-b-none",
              className
            )}
            aria-label={label}
          >
            <p className="truncate">
              {options.find((option) => option.value === selected)?.label ||
                label}
            </p>
            <span className="text-sg-900">
              <TriangleDownIcon />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition-all ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 max-h-60 w-36 overflow-auto border bg-sg-50 border-sg-900 rounded-lg data-[headlessui-state=open]:rounded-t-none focus:outline-none">
              {options.map((option, index) => (
                <SelectItem
                  value={option.value}
                  position={
                    index === 0
                      ? "first"
                      : index === options.length - 1
                      ? "last"
                      : undefined
                  }
                  key={index}
                >
                  {option.label}
                </SelectItem>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
