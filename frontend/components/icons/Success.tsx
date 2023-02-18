import React from "react";

interface ISuccessProps {
  className?: string;
}

export default function Success({ className }: ISuccessProps) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="current"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M0 40C0 17.9688 17.8125 0 40 0C62.0312 0 80 17.9688 80 40C80 62.1875 62.0312 80 40 80C17.8125 80 0 62.1875 0 40ZM57.9688 33.125C59.6875 31.4062 59.6875 28.75 57.9688 27.0312C56.25 25.3125 53.5938 25.3125 51.875 27.0312L35 43.9062L27.9688 37.0312C26.25 35.3125 23.5938 35.3125 21.875 37.0312C20.1562 38.75 20.1562 41.4062 21.875 43.125L31.875 53.125C33.5938 54.8438 36.25 54.8438 37.9688 53.125L57.9688 33.125Z"
        fill="current"
      />
    </svg>
  );
}
