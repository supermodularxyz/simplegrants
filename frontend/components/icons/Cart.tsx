import React from "react";

interface ICartProps {
  className?: string;
}

export default function Cart({ className }: ICartProps) {
  return (
    <svg
      width="37"
      height="32"
      viewBox="0 0 37 32"
      fill="current"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6 0C6.6875 0 7.3125 0.5625 7.4375 1.25L7.5625 2H33.8125C35.125 2 36.125 3.3125 35.75 4.5625L32.375 16.5625C32.125 17.4375 31.375 18 30.4375 18H10.625L11.1875 21H30.5C31.3125 21 32 21.6875 32 22.5C32 23.375 31.3125 24 30.5 24H9.9375C9.25 24 8.625 23.5 8.5 22.8125L4.75 3H1.5C0.625 3 0 2.375 0 1.5C0 0.6875 0.625 0 1.5 0H6ZM8 29C8 27.375 9.3125 26 11 26C12.625 26 14 27.375 14 29C14 30.6875 12.625 32 11 32C9.3125 32 8 30.6875 8 29ZM32 29C32 30.6875 30.625 32 29 32C27.3125 32 26 30.6875 26 29C26 27.375 27.3125 26 29 26C30.625 26 32 27.375 32 29Z"
        fill="current"
      />
    </svg>
  );
}
