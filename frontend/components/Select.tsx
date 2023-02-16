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
  className?: string;
  value: string;
  disabled?: boolean;
}

const SelectItem = React.forwardRef<HTMLDivElement, ISelectItemProps>(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Selection.Item
        className={clsx(
          "text-[13px] leading-none text-sg-900 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1",
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
        "inline-flex items-center justify-center rounded-lg px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-sg-900 hover:bg-mauve3 focus:shadow-[0_0_0_2px] border border-sg-900  data-[placeholder]:text-violet9 outline-none",
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
      <Selection.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
        <Selection.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-sg-900 cursor-default">
          <TriangleUpIcon />
        </Selection.ScrollUpButton>
        <Selection.Viewport className="p-[5px]">
          <Selection.Group>
            {/* <Selection.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
              {label}
            </Selection.Label> */}
            <SelectItem value="">{label}</SelectItem>
            {options.map((option) => (
              <SelectItem value={option.value}>{option.label}</SelectItem>
            ))}
          </Selection.Group>
        </Selection.Viewport>
        <Selection.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-sg-900 cursor-default">
          <TriangleDownIcon />
        </Selection.ScrollDownButton>
      </Selection.Content>
    </Selection.Portal>
  </Selection.Root>
);

export default Select;
