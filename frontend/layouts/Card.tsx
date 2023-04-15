import clsx from "clsx";
import React, { ReactNode } from "react";

interface ICardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, onClick, className }: ICardProps) {
  return (
    <div
      className={clsx(
        "flex flex-col w-full min-w-[240px] lg:min-w-[350px] max-w-[350px] rounded-lg overflow-hidden",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
