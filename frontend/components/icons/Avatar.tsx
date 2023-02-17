import React from "react";

interface IAvatarProps {
  className?: string;
}

export default function Avatar({ className }: IAvatarProps) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="current"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 0C7.125 0 0 7.1875 0 16C0 24.875 7.125 32 16 32C24.8125 32 32 24.875 32 16C32 7.1875 24.8125 0 16 0ZM16 8C18.4375 8 20.5 10.0625 20.5 12.5C20.5 15 18.4375 17 16 17C13.5 17 11.5 15 11.5 12.5C11.5 10.0625 13.5 8 16 8ZM16 28C12.6875 28 9.6875 26.6875 7.5 24.5C8.5 21.875 11 20 14 20H18C20.9375 20 23.4375 21.875 24.4375 24.5C22.25 26.6875 19.25 28 16 28Z"
        fill="current"
      />
    </svg>
  );
}
