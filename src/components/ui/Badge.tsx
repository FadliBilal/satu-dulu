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
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700",
    blue: "bg-satublue-50 dark:bg-satublue-950/60 text-satublue-700 dark:text-satublue-300 border border-satublue-200 dark:border-satublue-800",
    success: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800",
    warning: "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800",
    danger: "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800",
    accent: "bg-satublue-900 dark:bg-satublue-600 text-white border border-satublue-900 dark:border-satublue-600",
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
