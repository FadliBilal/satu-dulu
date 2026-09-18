import React from "react";

export interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  className = "w-7 h-7",
  size,
  showText = false,
  textSize = "md",
}) => {
  const textClasses = {
    sm: "text-xs",
    md: "text-sm sm:text-base",
    lg: "text-lg sm:text-xl",
  };

  return (
    <div className="inline-flex items-center gap-2.5 select-none group">
      {/* The Minimalist Logo Icon */}
      <div className={`relative shrink-0 flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
          width={size}
          height={size}
        >
          <defs>
            {/* Deep Slate-Navy Background Gradient */}
            <linearGradient id="satulogo-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Vibrant Cobalt & Sky Accent Gradient */}
            <linearGradient id="satulogo-blue" x1="11" y1="8" x2="20" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            {/* Subtle Focus Ring Gradient */}
            <linearGradient id="satulogo-ring" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Squircle Base */}
          <rect width="32" height="32" rx="8.5" fill="url(#satulogo-bg)" />
          {/* Subtle 1px inner border */}
          <rect
            x="0.75"
            y="0.75"
            width="30.5"
            height="30.5"
            rx="7.75"
            stroke="#38BDF8"
            strokeOpacity="0.2"
            strokeWidth="0.75"
          />

          {/* Minimalist Focus Ring (Single-Thread Boundary) */}
          <circle
            cx="16"
            cy="16"
            r="10.5"
            stroke="url(#satulogo-ring)"
            strokeWidth="1"
            strokeDasharray="2.5 2.5"
          />

          {/* The Iconic Monolith '1' — Geometric, modern, confident */}
          <path
            d="M12 12.2L16 9.2V22.5M12.5 22.5H19.5"
            stroke="url(#satulogo-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Pure Luminous Focus Point at the top-right apex */}
          <circle cx="21" cy="9.5" r="1.2" fill="#38BDF8" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-slate-900 ${textClasses[textSize]}`}>
            SATUDULU
          </span>
        </div>
      )}
    </div>
  );
};
