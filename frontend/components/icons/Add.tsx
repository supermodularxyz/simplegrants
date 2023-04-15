import React from "react";

interface IAddProps {
  className?: string;
}

export default function Add({ className }: IAddProps) {
  return (
    <svg
      width="112"
      height="113"
      viewBox="0 0 112 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g filter="url(#filter0_d_608_74)">
        <rect
          x="16"
          y="13"
          width="80"
          height="80"
          rx="40"
          fill="url(#paint0_linear_608_74)"
        />
        <rect
          x="16.5"
          y="13.5"
          width="79"
          height="79"
          rx="39.5"
          stroke="black"
        />
      </g>
      <path
        d="M55.8725 69.032V54.056H41.2805V52.84H55.8725V37.864H57.2165V52.84H71.8085V54.056H57.2165V69.032H55.8725Z"
        fill="black"
      />
      <defs>
        <filter
          id="filter0_d_608_74"
          x="0"
          y="1"
          width="112"
          height="112"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="8" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.752941 0 0 0 0 0.72549 0 0 0 0 0.701961 0 0 0 0.5 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_608_74"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_608_74"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_608_74"
          x1="16"
          y1="53"
          x2="96"
          y2="53"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.262511" stopColor="#FFE0DB" />
          <stop offset="1" stopColor="#FFE1A7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
