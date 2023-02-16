import React, { ReactNode } from "react";
import * as Selection from "@radix-ui/react-select";
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

interface SelectOptions {
  label: string;
  value: string;
}

interface ISelectProps {
  label: string;
  options: SelectOptions[];
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
  ({ children, className, position, ...props }, forwardedRef) => {
    return (
      <Selection.Item
        className={clsx(
          "leading-none text-sg-900 flex items-center px-5 py-2 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-sg-primary",
          "data-[state='checked']:bg-sg-primary",
          position === "first"
            ? "data-[state='checked']:border-b data-[state='checked']:border-sg-900"
            : position === "last"
            ? "data-[state='checked']:border-t data-[state='checked']:border-sg-900"
            : "data-[state='checked']:border-y data-[state='checked']:border-sg-900",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Selection.ItemText>{children}</Selection.ItemText>
      </Selection.Item>
    );
  }
);

const Select = ({ label, options, className }: ISelectProps) => (
  <Selection.Root>
    <Selection.Trigger
      className={clsx(
        "inline-flex items-center justify-between rounded-lg p-2 pl-5 leading-none gap-x-4 text-sg-900 hover:bg-sg-200 focus:shadow-[0_0_0_2px] border border-sg-900 outline-none max-w-sm data-[placeholder]:text-sg-900 w-36 data-[state='open']:rounded-b-none",
        className
      )}
      aria-label={label}
    >
      <Selection.Value placeholder={label} />
      <Selection.Icon className="text-sg-900">
        <TriangleDownIcon />
      </Selection.Icon>
    </Selection.Trigger>
    <Selection.Portal>
      <Selection.Content
        className="overflow-hidden border border-sg-900 rounded-lg data-[state='open']:rounded-t-none"
        position="popper"
        sideOffset={-1}
      >
        <Selection.ScrollUpButton className="flex items-center justify-center h-6 text-sg-900 cursor-default">
          <TriangleUpIcon />
        </Selection.ScrollUpButton>
        <Selection.Viewport className="">
          <Selection.Group className="w-36">
            {/* <Selection.Label className="text-sm font-bold text-sg-900 px-5 py-1">
              {label}
            </Selection.Label> */}
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
              >
                {option.label}
              </SelectItem>
            ))}
          </Selection.Group>
        </Selection.Viewport>
        <Selection.ScrollDownButton className="flex items-center justify-center h-6 text-sg-900 cursor-default">
          <TriangleDownIcon />
        </Selection.ScrollDownButton>
      </Selection.Content>
    </Selection.Portal>
  </Selection.Root>
);

export default Select;
