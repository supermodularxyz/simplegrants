import React from "react";

interface ILocationProps {
  className?: string;
}

export default function Location({ className }: ILocationProps) {
  return (
    <svg
      width="16"
      height="21"
      viewBox="0 0 16 21"
      fill="current"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.0625 19.5312C5.03125 16.9922 0.5 10.9375 0.5 7.5C0.5 3.35938 3.82031 0 8 0C12.1406 0 15.5 3.35938 15.5 7.5C15.5 10.9375 10.9297 16.9922 8.89844 19.5312C8.42969 20.1172 7.53125 20.1172 7.0625 19.5312ZM8 10C9.36719 10 10.5 8.90625 10.5 7.5C10.5 6.13281 9.36719 5 8 5C6.59375 5 5.5 6.13281 5.5 7.5C5.5 8.90625 6.59375 10 8 10Z"
        fill="current"
      />
    </svg>
  );
}
