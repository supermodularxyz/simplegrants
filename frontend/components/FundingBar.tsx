import React from "react";
import * as Progress from "@radix-ui/react-progress";
import clsx from "clsx";

interface IFundingBarProps {
  value: number;
  max: number;
  className?: string;
}

const FundingBar = ({ value, max, className }: IFundingBarProps) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Progress.Root
      className={clsx(
        "relative overflow-hidden w-full h-3 border border-sg-900 rounded-full",
        className
      )}
      style={{
        // Fix overflow clipping in Safari
        // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
        transform: "translateZ(0)",
      }}
      value={value > max ? max : value}
      max={max}
    >
      <Progress.Indicator
        className="bg-sg-success w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)] rounded-full border-r border-sg-900"
        style={{
          transform: `translateX(-${
            100 - (Math.min(progress, max) / max) * 100
          }%)`,
        }}
      />
    </Progress.Root>
  );
};

export default FundingBar;
