import React from "react";
import clsx from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "blue" | "success" | "warning" | "danger" | "accent";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "neutral",
  size = "sm",
  ...props
}) => {
  const variantStyles = {
    neutral: "bg-slate-100 text-slate-700 border border-slate-200/80",
    blue: "bg-satublue-50 text-satublue-700 border border-satublue-200",
    success: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
    warning: "bg-amber-50 text-amber-800 border border-amber-200/80",
    danger: "bg-rose-50 text-rose-800 border border-rose-200/80",
    accent: "bg-satublue-900 text-white border border-satublue-900",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 rounded font-medium",
    md: "text-xs font-medium px-2.5 py-1 rounded-md",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
