import React from "react";

interface ICopyProps {
  className?: string;
}

export default function Copy({ className }: ICopyProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M6.48181 9.72278L3.83016 12.3744C1.71482 14.4898 1.58291 17.7875 3.53553 19.7401C5.48816 21.6927 8.78589 21.5608 10.9012 19.4455L13.5529 16.7938"
        stroke="current"
        stroke-width="2"
        stroke-linecap="round"
        fill="current"
      />
      <path
        d="M16.7941 13.5531L19.4457 10.9015C21.5611 8.78611 21.693 5.48838 19.7403 3.53576C17.7877 1.58313 14.49 1.71504 12.3747 3.83038L9.723 6.48203"
        stroke="current"
        stroke-width="2"
        stroke-linecap="round"
        fill="current"
      />
      <path
        d="M8.83887 14.437L14.7314 8.54446"
        stroke="current"
        stroke-width="2"
        stroke-linecap="round"
        fill="current"
      />
    </svg>
  );
}
